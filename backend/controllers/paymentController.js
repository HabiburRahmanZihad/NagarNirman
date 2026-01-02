// Payment Controller
import Stripe from 'stripe';
import SSLCommerzPayment from 'sslcommerz-lts';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
    createDonation,
    getDonationById,
    getDonationBySessionId,
    getDonationByTransactionId,
    updateDonationStatus,
    updateDonationBySessionId,
    updateDonationByTransactionId,
    getRecentDonations,
    getDonationStats,
    getDonations
} from '../models/Donation.js';
import { v4 as uuidv4 } from 'uuid';
import { sendDonationSuccessEmail } from '../services/emailService.js';

// Lazy initialization for Stripe and SSLCommerz
let stripe = null;
let sslcommerz = null;

// Get Stripe instance (lazy initialization)
const getStripe = () => {
    if (!stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
        }
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripe;
};

// Get SSLCommerz instance (lazy initialization)
const getSSLCommerz = () => {
    if (!sslcommerz) {
        if (!process.env.SSLCOMMERZ_STORE_ID || !process.env.SSLCOMMERZ_STORE_PASSWORD) {
            throw new Error('SSLCommerz credentials are not configured in environment variables');
        }
        sslcommerz = new SSLCommerzPayment(
            process.env.SSLCOMMERZ_STORE_ID,
            process.env.SSLCOMMERZ_STORE_PASSWORD,
            process.env.NODE_ENV === 'production'
        );
    }
    return sslcommerz;
};

// @desc    Initialize Stripe payment
// @route   POST /api/payments/stripe/create-session
// @access  Public
export const createStripeSession = asyncHandler(async (req, res) => {
    const {
        amount,
        donorName,
        donorEmail,
        donorPhone,
        isMonthly,
        isAnonymous,
        message,
        paymentProvider
    } = req.body;

    // Validate amount
    if (!amount || amount < 10) {
        return res.status(400).json({
            success: false,
            message: 'Minimum donation amount is ৳10'
        });
    }

    try {
        // Create donation record first
        const donation = await createDonation({
            amount,
            donorName: isAnonymous ? 'Anonymous' : donorName,
            donorEmail,
            donorPhone,
            paymentMethod: 'stripe',
            paymentProvider: paymentProvider || 'card',
            isMonthly,
            isAnonymous,
            message,
            status: 'pending'
        });

        // Create Stripe checkout session
        const sessionConfig = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: isMonthly ? 'Monthly Donation to NagarNirman' : 'Donation to NagarNirman',
                            description: `${isMonthly ? 'Monthly ' : ''}Support for civic improvement initiatives`,
                            images: [`${process.env.FRONTEND_URL}/logo/logo.png`]
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects amount in paisa
                        ...(isMonthly && { recurring: { interval: 'month' } })
                    },
                    quantity: 1
                }
            ],
            mode: isMonthly ? 'subscription' : 'payment',
            success_url: `${process.env.FRONTEND_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/donate/cancel?session_id={CHECKOUT_SESSION_ID}`,
            customer_email: donorEmail || undefined,
            metadata: {
                donationId: donation._id.toString(),
                donorName: isAnonymous ? 'Anonymous' : donorName,
                isMonthly: isMonthly.toString(),
                isAnonymous: isAnonymous.toString()
            }
        };

        const session = await getStripe().checkout.sessions.create(sessionConfig);

        // Update donation with session ID
        await updateDonationStatus(donation._id, 'processing', {
            sessionId: session.id
        });

        res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url,
            donationId: donation._id
        });
    } catch (error) {
        console.error('Stripe session creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment session',
            error: error.message
        });
    }
});

// @desc    Stripe webhook handler
// @route   POST /api/payments/stripe/webhook
// @access  Public (verified by Stripe signature)
export const stripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = getStripe().webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;

            // Update donation status to completed
            await updateDonationBySessionId(session.id, {
                status: 'completed',
                transactionId: session.payment_intent || session.subscription,
                completedAt: new Date(),
                metadata: {
                    stripeCustomerId: session.customer,
                    paymentStatus: session.payment_status
                }
            });

            console.log('✅ Donation completed via Stripe:', session.id);

            // Send success email
            try {
                const donation = await getDonationBySessionId(session.id);
                if (donation && donation.email) {
                    await sendDonationSuccessEmail(donation.email, {
                        donorName: donation.isAnonymous ? 'Anonymous Donor' : (donation.donorName || 'Valued Donor'),
                        amount: donation.amount,
                        currency: donation.currency || 'USD',
                        transactionId: session.payment_intent || session.id,
                        paymentMethod: 'Stripe - Card Payment',
                        donationDate: new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        category: donation.category || 'General Fund',
                        message: donation.message || null
                    });
                    console.log('📧 Donation success email sent to:', donation.email);
                }
            } catch (emailError) {
                console.error('Failed to send donation success email:', emailError);
                // Don't fail the transaction if email fails
            }
            break;
        }

        case 'checkout.session.expired': {
            const session = event.data.object;
            await updateDonationBySessionId(session.id, {
                status: 'cancelled'
            });
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            // Find and update the donation
            const donation = await getDonationBySessionId(paymentIntent.metadata?.sessionId);
            if (donation) {
                await updateDonationStatus(donation._id, 'failed', {
                    metadata: { failureReason: paymentIntent.last_payment_error?.message }
                });
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
});

// @desc    Verify Stripe payment
// @route   GET /api/payments/stripe/verify/:sessionId
// @access  Public
export const verifyStripePayment = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    try {
        const session = await getStripe().checkout.sessions.retrieve(sessionId);
        const donation = await getDonationBySessionId(sessionId);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Update status if needed
        if (session.payment_status === 'paid' && donation.status !== 'completed') {
            await updateDonationBySessionId(sessionId, {
                status: 'completed',
                transactionId: session.payment_intent || session.subscription,
                completedAt: new Date()
            });
        }

        res.status(200).json({
            success: true,
            status: session.payment_status === 'paid' ? 'completed' : donation.status,
            donation: {
                _id: donation._id,
                amount: donation.amount,
                currency: donation.currency || 'BDT',
                donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName,
                donorEmail: donation.isAnonymous ? null : donation.donorEmail,
                donorPhone: donation.isAnonymous ? null : donation.donorPhone,
                isMonthly: donation.isMonthly,
                isAnonymous: donation.isAnonymous,
                transactionId: session.payment_intent || session.subscription || donation.sessionId,
                paymentMethod: donation.paymentMethod,
                paymentProvider: donation.paymentProvider || 'card',
                message: donation.message,
                completedAt: donation.completedAt,
                createdAt: donation.createdAt
            }
        });
    } catch (error) {
        console.error('Stripe verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment'
        });
    }
});

// @desc    Initialize SSLCommerz payment
// @route   POST /api/payments/sslcommerz/init
// @access  Public
export const initSSLCommerzPayment = asyncHandler(async (req, res) => {
    const {
        amount,
        donorName,
        donorEmail,
        donorPhone,
        isMonthly,
        isAnonymous,
        message,
        paymentProvider
    } = req.body;

    // Validate amount
    if (!amount || amount < 10) {
        return res.status(400).json({
            success: false,
            message: 'Minimum donation amount is ৳10'
        });
    }

    // Validate donor info (required for SSLCommerz)
    if (!donorName || !donorEmail || !donorPhone) {
        return res.status(400).json({
            success: false,
            message: 'Donor name, email, and phone are required for SSLCommerz payment'
        });
    }

    try {
        // Generate unique transaction ID
        const transactionId = `NAGAR_${Date.now()}_${uuidv4().slice(0, 8).toUpperCase()}`;

        // Create donation record
        const donation = await createDonation({
            amount,
            donorName: isAnonymous ? 'Anonymous' : donorName,
            donorEmail,
            donorPhone,
            paymentMethod: 'sslcommerz',
            paymentProvider: paymentProvider || 'bkash',
            transactionId,
            isMonthly,
            isAnonymous,
            message,
            status: 'pending'
        });

        // SSLCommerz payment data
        const paymentData = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: transactionId,
            success_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/sslcommerz/success`,
            fail_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/sslcommerz/fail`,
            cancel_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/sslcommerz/cancel`,
            ipn_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/sslcommerz/ipn`,
            shipping_method: 'NO',
            product_name: isMonthly ? 'Monthly Donation to NagarNirman' : 'Donation to NagarNirman',
            product_category: 'Donation',
            product_profile: 'non-physical-goods',
            cus_name: isAnonymous ? 'Anonymous Donor' : donorName,
            cus_email: donorEmail,
            cus_phone: donorPhone,
            cus_add1: 'Bangladesh',
            cus_city: 'Dhaka',
            cus_country: 'Bangladesh',
            value_a: donation._id.toString(),
            value_b: isMonthly.toString(),
            value_c: isAnonymous.toString(),
            value_d: paymentProvider || 'bkash'
        };

        // Initialize payment
        const response = await getSSLCommerz().init(paymentData);

        if (response?.GatewayPageURL) {
            // Update donation with session ID
            await updateDonationStatus(donation._id, 'processing', {
                sessionId: response.sessionkey
            });

            res.status(200).json({
                success: true,
                url: response.GatewayPageURL,
                sessionKey: response.sessionkey,
                transactionId,
                donationId: donation._id
            });
        } else {
            // Payment initialization failed
            await updateDonationStatus(donation._id, 'failed', {
                metadata: { error: 'SSLCommerz initialization failed', response }
            });

            res.status(400).json({
                success: false,
                message: 'Failed to initialize payment',
                error: response
            });
        }
    } catch (error) {
        console.error('SSLCommerz initialization error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment initialization failed',
            error: error.message
        });
    }
});

// @desc    SSLCommerz payment success callback
// @route   POST /api/payments/sslcommerz/success
// @access  Public
export const sslcommerzSuccess = asyncHandler(async (req, res) => {
    const { tran_id, val_id, amount, card_type, store_amount, bank_tran_id } = req.body;

    try {
        // Validate the transaction
        const validationResponse = await getSSLCommerz().validate({ val_id });

        if (validationResponse.status === 'VALID' || validationResponse.status === 'VALIDATED') {
            // Update donation status
            await updateDonationByTransactionId(tran_id, {
                status: 'completed',
                completedAt: new Date(),
                metadata: {
                    validationId: val_id,
                    bankTransactionId: bank_tran_id,
                    cardType: card_type,
                    storeAmount: store_amount,
                    validationResponse
                }
            });

            console.log('✅ Donation completed via SSLCommerz:', tran_id);

            // Send success email
            try {
                const donation = await getDonationByTransactionId(tran_id);
                if (donation && donation.email) {
                    await sendDonationSuccessEmail(donation.email, {
                        donorName: donation.isAnonymous ? 'Anonymous Donor' : (donation.donorName || 'Valued Donor'),
                        amount: donation.amount,
                        currency: donation.currency || 'BDT',
                        transactionId: tran_id,
                        paymentMethod: `SSLCommerz - ${card_type || 'Online Payment'}`,
                        donationDate: new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }),
                        category: donation.category || 'General Fund',
                        message: donation.message || null
                    });
                    console.log('📧 Donation success email sent to:', donation.email);
                }
            } catch (emailError) {
                console.error('Failed to send donation success email:', emailError);
                // Don't fail the transaction if email fails
            }

            // Redirect to success page
            res.redirect(`${process.env.FRONTEND_URL}/donate/success?tran_id=${tran_id}&status=success`);
        } else {
            // Validation failed
            await updateDonationByTransactionId(tran_id, {
                status: 'failed',
                metadata: { validationError: validationResponse }
            });

            res.redirect(`${process.env.FRONTEND_URL}/donate/failed?tran_id=${tran_id}&status=validation_failed`);
        }
    } catch (error) {
        console.error('SSLCommerz success callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/donate/failed?tran_id=${tran_id}&status=error`);
    }
});

// @desc    SSLCommerz payment failure callback
// @route   POST /api/payments/sslcommerz/fail
// @access  Public
export const sslcommerzFail = asyncHandler(async (req, res) => {
    const { tran_id, error } = req.body;

    try {
        await updateDonationByTransactionId(tran_id, {
            status: 'failed',
            metadata: { failureReason: error }
        });

        console.log('❌ Donation failed via SSLCommerz:', tran_id);
        res.redirect(`${process.env.FRONTEND_URL}/donate/failed?tran_id=${tran_id}&status=failed`);
    } catch (err) {
        console.error('SSLCommerz fail callback error:', err);
        res.redirect(`${process.env.FRONTEND_URL}/donate/failed?status=error`);
    }
});

// @desc    SSLCommerz payment cancel callback
// @route   POST /api/payments/sslcommerz/cancel
// @access  Public
export const sslcommerzCancel = asyncHandler(async (req, res) => {
    const { tran_id } = req.body;

    try {
        await updateDonationByTransactionId(tran_id, {
            status: 'cancelled'
        });

        console.log('⚠️ Donation cancelled via SSLCommerz:', tran_id);
        res.redirect(`${process.env.FRONTEND_URL}/donate/cancel?tran_id=${tran_id}`);
    } catch (error) {
        console.error('SSLCommerz cancel callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/donate/cancel`);
    }
});

// @desc    SSLCommerz IPN (Instant Payment Notification)
// @route   POST /api/payments/sslcommerz/ipn
// @access  Public
export const sslcommerzIPN = asyncHandler(async (req, res) => {
    const { tran_id, val_id, status } = req.body;

    try {
        if (status === 'VALID') {
            const validationResponse = await getSSLCommerz().validate({ val_id });

            if (validationResponse.status === 'VALID' || validationResponse.status === 'VALIDATED') {
                await updateDonationByTransactionId(tran_id, {
                    status: 'completed',
                    completedAt: new Date(),
                    metadata: { ipnValidation: validationResponse }
                });
            }
        } else if (status === 'FAILED') {
            await updateDonationByTransactionId(tran_id, {
                status: 'failed'
            });
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('SSLCommerz IPN error:', error);
        res.status(500).json({ error: 'IPN processing failed' });
    }
});

// @desc    Verify SSLCommerz transaction
// @route   GET /api/payments/sslcommerz/verify/:transactionId
// @access  Public
export const verifySSLCommerzPayment = asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    try {
        const donation = await getDonationByTransactionId(transactionId);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Verify with SSLCommerz
        const verificationResponse = await getSSLCommerz().transactionQueryByTransactionId(transactionId);

        res.status(200).json({
            success: true,
            status: donation.status,
            donation: {
                _id: donation._id,
                amount: donation.amount,
                currency: donation.currency || 'BDT',
                donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName,
                donorEmail: donation.isAnonymous ? null : donation.donorEmail,
                donorPhone: donation.isAnonymous ? null : donation.donorPhone,
                isMonthly: donation.isMonthly,
                isAnonymous: donation.isAnonymous,
                transactionId: donation.transactionId,
                paymentMethod: donation.paymentMethod,
                paymentProvider: donation.paymentProvider,
                message: donation.message,
                completedAt: donation.completedAt,
                createdAt: donation.createdAt
            },
            verification: verificationResponse
        });
    } catch (error) {
        console.error('SSLCommerz verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment'
        });
    }
});

// @desc    Get recent donations
// @route   GET /api/payments/donations/recent
// @access  Public
export const getRecentDonationsController = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;

    try {
        const donations = await getRecentDonations(limit);

        // Format for display (hide email/phone, show only name and amount)
        const formattedDonations = donations.map(d => ({
            id: d._id,
            name: d.isAnonymous ? 'Anonymous' : d.donorName,
            amount: d.amount,
            message: d.message,
            date: d.completedAt
        }));

        res.status(200).json({
            success: true,
            donations: formattedDonations
        });
    } catch (error) {
        console.error('Get recent donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent donations'
        });
    }
});

// @desc    Get donation statistics
// @route   GET /api/payments/donations/stats
// @access  Public
export const getDonationStatsController = asyncHandler(async (req, res) => {
    try {
        const stats = await getDonationStats();

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Get donation stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch donation statistics'
        });
    }
});

// @desc    Get all donations (admin)
// @route   GET /api/payments/donations
// @access  Private (Admin)
export const getAllDonations = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, paymentMethod } = req.query;

    try {
        const result = await getDonations(
            { status, paymentMethod },
            { page: parseInt(page), limit: parseInt(limit) }
        );

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Get all donations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch donations'
        });
    }
});

export default {
    createStripeSession,
    stripeWebhook,
    verifyStripePayment,
    initSSLCommerzPayment,
    sslcommerzSuccess,
    sslcommerzFail,
    sslcommerzCancel,
    sslcommerzIPN,
    verifySSLCommerzPayment,
    getRecentDonationsController,
    getDonationStatsController,
    getAllDonations
};
