'use client';

import { Button } from '@/components/common';
import { AlertTriangle, ArrowLeft, Heart, Home, MessageCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FailedContent() {
    const searchParams = useSearchParams();
    const tranId = searchParams.get('tran_id');
    const status = searchParams.get('status');

    const getErrorMessage = () => {
        switch (status) {
            case 'validation_failed':
                return 'Payment validation failed. Please contact support if amount was deducted.';
            case 'failed':
                return 'The payment could not be processed. Please try again.';
            case 'error':
                return 'An unexpected error occurred. Please try again later.';
            default:
                return 'Your payment was not successful. No amount has been charged.';
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50/50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full">
                {/* Failed Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
                    {/* Failed Icon */}
                    <div className="relative inline-flex mb-6">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
                        <div className="relative w-20 h-20 bg-linear-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                            <AlertTriangle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        {getErrorMessage()}
                    </p>

                    {/* Transaction Details */}
                    {tranId && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
                            <p className="text-sm font-mono text-gray-700 break-all">
                                {tranId}
                            </p>
                        </div>
                    )}

                    {/* Help Message */}
                    <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
                        <p className="text-gray-700 text-sm">
                            <MessageCircle className="w-4 h-4 inline mr-2 text-amber-600" />
                            If you believe this is an error or money was deducted from your account,
                            please contact our support team with the transaction reference.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Link href="/donate" className="flex-1">
                            <Button variant="primary" size="lg" className="w-full">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button variant="outline" size="lg" className="w-full">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </Link>
                    </div>

                    {/* Back Link */}
                    <Link
                        href="/donate"
                        className="inline-flex items-center gap-2 text-gray-600 font-medium mt-6 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Donate
                    </Link>
                </div>

                {/* Support Info */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500 mb-2">
                        Need help? Contact our support team
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors"
                    >
                        <Heart className="w-4 h-4" />
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function DonateFailedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
                </div>
            </div>
        }>
            <FailedContent />
        </Suspense>
    );
}
