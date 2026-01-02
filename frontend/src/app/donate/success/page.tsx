'use client';

import { Button } from '@/components/common';
import { paymentAPI } from '@/utils/api';
import { CheckCircle, Gift, Heart, Home, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface DonationDetails {
    amount: number;
    donorName: string;
    isMonthly: boolean;
    transactionId: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const tranId = searchParams.get('tran_id');
    const status = searchParams.get('status');

    const [donation, setDonation] = useState<DonationDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                let response;

                if (sessionId) {
                    // Stripe payment
                    response = await paymentAPI.verifyStripePayment(sessionId) as {
                        success: boolean;
                        donation?: DonationDetails;
                    };
                } else if (tranId) {
                    // SSLCommerz payment
                    response = await paymentAPI.verifySSLCommerzPayment(tranId) as {
                        success: boolean;
                        donation?: DonationDetails;
                    };
                }

                if (response?.success && response.donation) {
                    setDonation(response.donation);
                }
            } catch (error) {
                console.error('Failed to verify payment:', error);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId || tranId) {
            verifyPayment();
        } else {
            setLoading(false);
        }
    }, [sessionId, tranId]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'I just donated to NagarNirman!',
                text: `I made a ${donation?.isMonthly ? 'monthly' : ''} donation to support civic improvements in our cities. Join me in making a difference!`,
                url: window.location.origin + '/donate',
            });
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#004d40]/5 via-white to-[#f2a921]/5 flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
                    {/* Success Icon */}
                    <div className="relative inline-flex mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                        <div className="relative w-20 h-20 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Thank You!
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Your donation was successful
                    </p>

                    {/* Donation Details */}
                    {!loading && donation && (
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-600">Amount</span>
                                <span className="text-2xl font-bold text-primary">
                                    ৳{donation.amount.toLocaleString()}
                                </span>
                            </div>
                            {donation.donorName && donation.donorName !== 'Anonymous' && (
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600">Donor</span>
                                    <span className="font-semibold text-gray-900">
                                        {donation.donorName}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-600">Type</span>
                                <span className="font-semibold text-gray-900">
                                    {donation.isMonthly ? 'Monthly Donation' : 'One-Time Donation'}
                                </span>
                            </div>
                            {donation.transactionId && (
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">Transaction ID</p>
                                    <p className="text-sm font-mono text-gray-700 break-all">
                                        {donation.transactionId}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {loading && (
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                            </div>
                        </div>
                    )}

                    {/* Message */}
                    <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
                        <p className="text-gray-700">
                            <Gift className="w-5 h-5 inline mr-2 text-primary" />
                            Your contribution will help resolve civic issues and build better communities!
                        </p>
                    </div>

                    {/* Status Badge */}
                    {status === 'success' && (
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <CheckCircle className="w-4 h-4" />
                            Payment Verified
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Link href="/" className="flex-1">
                            <Button variant="outline" size="lg" className="w-full">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </Link>
                        <button
                            onClick={handleShare}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>

                    {/* Donate Again */}
                    <Link
                        href="/donate"
                        className="inline-flex items-center gap-2 text-primary font-medium mt-6 hover:text-accent transition-colors"
                    >
                        <Heart className="w-4 h-4" />
                        Make Another Donation
                    </Link>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    A confirmation email has been sent to your email address.
                    <br />
                    Thank you for supporting NagarNirman!
                </p>
            </div>
        </div>
    );
}

export default function DonateSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
