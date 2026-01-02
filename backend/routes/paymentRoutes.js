// Payment Routes
import express from 'express';
import {
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
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// STRIPE ROUTES
// ============================================

// Create Stripe checkout session
router.post('/stripe/create-session', createStripeSession);

// Stripe webhook (needs raw body - handled in server.js)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Verify Stripe payment
router.get('/stripe/verify/:sessionId', verifyStripePayment);

// ============================================
// SSLCOMMERZ ROUTES
// ============================================

// Initialize SSLCommerz payment
router.post('/sslcommerz/init', initSSLCommerzPayment);

// SSLCommerz callbacks (POST from SSLCommerz)
router.post('/sslcommerz/success', sslcommerzSuccess);
router.post('/sslcommerz/fail', sslcommerzFail);
router.post('/sslcommerz/cancel', sslcommerzCancel);
router.post('/sslcommerz/ipn', sslcommerzIPN);

// Verify SSLCommerz payment
router.get('/sslcommerz/verify/:transactionId', verifySSLCommerzPayment);

// ============================================
// DONATION ROUTES
// ============================================

// Get recent donations (public)
router.get('/donations/recent', getRecentDonationsController);

// Get donation statistics (public)
router.get('/donations/stats', getDonationStatsController);

// Get all donations (admin only)
router.get('/donations', protect, authorize('admin', 'superAdmin'), getAllDonations);

export default router;
