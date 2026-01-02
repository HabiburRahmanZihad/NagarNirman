'use client';

import { Button } from '@/components/common';
import { paymentAPI } from '@/utils/api';
import { CheckCircle, Gift, Heart, Home, Printer, Share2, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

interface DonationDetails {
    _id?: string;
    amount: number;
    donorName: string;
    donorEmail?: string;
    donorPhone?: string;
    isMonthly: boolean;
    isAnonymous?: boolean;
    transactionId: string;
    paymentMethod?: string;
    paymentProvider?: string;
    currency?: string;
    message?: string;
    completedAt?: string;
    createdAt?: string;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const tranId = searchParams.get('tran_id');
    const status = searchParams.get('status');

    const [donation, setDonation] = useState<DonationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReceipt, setShowReceipt] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);

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

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return new Date().toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        return new Date(dateString).toLocaleDateString('en-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaymentMethodName = () => {
        if (donation?.paymentProvider) {
            const providers: Record<string, string> = {
                'bkash': 'bKash',
                'nagad': 'Nagad',
                'rocket': 'Rocket',
                'card': 'Credit/Debit Card',
                'bank': 'Bank Transfer'
            };
            return providers[donation.paymentProvider] || donation.paymentProvider;
        }
        if (donation?.paymentMethod === 'stripe') return 'Credit/Debit Card (Stripe)';
        if (donation?.paymentMethod === 'sslcommerz') return 'SSLCommerz';
        return 'Online Payment';
    };

    const receiptNumber = donation?.transactionId || donation?._id || `RCP-${Date.now()}`;

    return (
        <>
            {/* Print Receipt Modal/Overlay */}
            {showReceipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 print:static print:p-0 print:block"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowReceipt(false);
                    }}
                >
                    {/* Backdrop with blur */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm print:hidden" />

                    {/* Modal Container - Single cohesive box */}
                    <div className="relative bg-white rounded-2xl max-w-xl w-full max-h-[85vh] mt-14 overflow-hidden shadow-2xl print:max-w-none print:max-h-none print:mt-0 print:rounded-none print:shadow-none print:overflow-visible">
                        {/* Close button - positioned inside */}
                        <button
                            onClick={() => setShowReceipt(false)}
                            className="absolute top-4 right-4 z-20 p-2 hover:bg-gray-100 rounded-full transition-colors print:hidden"
                            title="Close receipt"
                            aria-label="Close receipt"
                        >
                            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        </button>

                        {/* Scrollable Receipt Content */}
                        <div className="overflow-auto max-h-[85vh] print:max-h-none print:overflow-visible">
                            <div ref={receiptRef} className="p-6 sm:p-8 print:p-8 bg-white" id="donation-receipt">
                                {/* Header */}
                                <div className="text-center pb-5 mb-5 border-b border-gray-200">
                                    <div className="flex items-center justify-center mb-3">
                                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md print:shadow-none">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <h1 className="text-xl sm:text-2xl font-bold text-primary">NagarNirman</h1>
                                    <p className="text-gray-400 text-xs mt-1">Building Better Cities Together</p>
                                </div>

                                {/* Receipt Title with success badge */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                                        <CheckCircle className="w-4 h-4" />
                                        Payment Successful
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">DONATION RECEIPT</h2>
                                    <p className="text-gray-400 text-xs mt-1">Thank you for your generous contribution!</p>
                                </div>

                                {/* Receipt Details Card */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Receipt No.</p>
                                            <p className="font-mono font-medium text-gray-900 text-xs break-all">{receiptNumber}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
                                            <p className="font-medium text-gray-900 text-xs">
                                                {formatDate(donation?.completedAt || donation?.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Two Column Layout for Details */}
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    {/* Donor Information */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-sm">👤</span>
                                            Donor Info
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs text-gray-400">Name</p>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {donation?.isAnonymous ? 'Anonymous' : (donation?.donorName || 'N/A')}
                                                </p>
                                            </div>
                                            {!donation?.isAnonymous && donation?.donorEmail && (
                                                <div>
                                                    <p className="text-xs text-gray-400">Email</p>
                                                    <p className="font-medium text-gray-900 text-xs break-all">{donation.donorEmail}</p>
                                                </div>
                                            )}
                                            {!donation?.isAnonymous && donation?.donorPhone && (
                                                <div>
                                                    <p className="text-xs text-gray-400">Phone</p>
                                                    <p className="font-medium text-gray-900 text-sm">{donation.donorPhone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h3 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <span className="text-sm">💳</span>
                                            Payment
                                        </h3>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs text-gray-400">Method</p>
                                                <p className="font-medium text-gray-900 text-sm">{getPaymentMethodName()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Type</p>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {donation?.isMonthly ? 'Monthly' : 'One-Time'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Status</p>
                                                <span className="inline-flex items-center gap-1 text-green-600 font-medium text-xs">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Completed
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction ID */}
                                <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs text-gray-400">Transaction ID:</span>
                                        <span className="font-mono text-xs text-gray-600 break-all">{donation?.transactionId || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Amount - Highlighted */}
                                <div className="bg-primary/5 rounded-xl p-4 mb-5 border border-primary/10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Total Amount</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-primary">
                                                ৳{donation?.amount?.toLocaleString() || '0'}
                                            </span>
                                            <p className="text-xs text-gray-400">
                                                {donation?.currency || 'BDT'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                {donation?.message && (
                                    <div className="mb-5">
                                        <p className="text-xs text-gray-400 mb-1">Message</p>
                                        <div className="bg-amber-50/50 rounded-lg p-3">
                                            <p className="text-gray-600 italic text-xs">
                                                &ldquo;{donation.message}&rdquo;
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="border-t border-gray-200 pt-5 mt-5">
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900 text-xs mb-1">NagarNirman Foundation</p>
                                        <p className="text-gray-400 text-xs">Building Better Cities Through Community Action</p>
                                        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-400">
                                            <span>www.nagarnirman.org</span>
                                            <span>•</span>
                                            <span>donate@nagarnirman.org</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button - inside the receipt */}
                                <div className="mt-6 print:hidden">
                                    <Button
                                        onClick={handlePrint}
                                        variant="primary"
                                        size="lg"
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Printer className="w-4 h-4 inline-flex items-center mb-1 mr-2" />
                                        Print Receipt
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Success Page */}
            <div className="min-h-screen bg-linear-to-br from-[#004d40]/5 via-white to-[#f2a921]/5 flex items-center justify-center px-4 py-12 print:hidden">
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
                                {donation.donorName && donation.donorName !== 'Anonymous' && !donation.isAnonymous && (
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
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600">Payment</span>
                                    <span className="font-semibold text-gray-900">
                                        {getPaymentMethodName()}
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

                        {/* Print Receipt Button */}
                        {!loading && donation && (
                            <button
                                onClick={() => setShowReceipt(true)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-colors mb-4"
                            >
                                <Printer className="w-5 h-5" />
                                View & Print Receipt
                            </button>
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
                                <Button variant="ghost" size="lg" className="w-full">
                                    <Home className="w-4 h-4 mr-2 inline-flex items-center mb-1" />
                                    Go Home
                                </Button>
                            </Link>
                            <Button
                                onClick={handleShare}
                                className="flex-1 w-full"
                            >
                                <Share2 className="w-4 h-4 inline-flex items-center mb-1 mr-2" />
                                Share
                            </Button>
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

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    /* Hide everything except receipt */
                    html, body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                    }
                    
                    /* Hide navbar, footer, and other elements */
                    header, nav, footer,
                    .print\\:hidden,
                    button {
                        display: none !important;
                    }
                    
                    /* Hide the main success page content */
                    .min-h-screen.bg-linear-to-br {
                        display: none !important;
                    }
                    
                    /* Hide modal backdrop */
                    .fixed.inset-0 > .absolute.inset-0 {
                        display: none !important;
                    }
                    
                    /* Style the modal container for print */
                    .fixed.inset-0 {
                        position: static !important;
                        display: block !important;
                        padding: 0 !important;
                    }
                    
                    /* Make modal content print-friendly */
                    .fixed.inset-0 > .relative.bg-white {
                        position: static !important;
                        max-width: 100% !important;
                        max-height: none !important;
                        margin: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        overflow: visible !important;
                    }
                    
                    /* Scrollable container */
                    .overflow-auto {
                        overflow: visible !important;
                        max-height: none !important;
                    }
                    
                    /* Receipt content */
                    #donation-receipt {
                        padding: 20mm !important;
                        background: white !important;
                    }
                    
                    /* Ensure colors print */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </>
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
