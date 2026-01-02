'use client';

import { Button } from '@/components/common';
import { ArrowLeft, Heart, Home, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CancelContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const tranId = searchParams.get('tran_id');

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full">
                {/* Cancelled Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
                    {/* Cancelled Icon */}
                    <div className="relative inline-flex mb-6">
                        <div className="relative w-20 h-20 bg-linear-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                            <XCircle className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Donation Cancelled
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Your donation was cancelled. No amount has been charged.
                    </p>

                    {/* Transaction Reference */}
                    {(sessionId || tranId) && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-xs text-gray-500 mb-1">Reference</p>
                            <p className="text-sm font-mono text-gray-700 break-all">
                                {sessionId || tranId}
                            </p>
                        </div>
                    )}

                    {/* Encourage to Donate */}
                    <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10">
                        <p className="text-gray-700">
                            <Heart className="w-5 h-5 inline mr-2 text-primary" />
                            Every contribution helps us improve our cities. Consider completing your donation when you&apos;re ready.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Link href="/donate" className="flex-1">
                            <Button variant="primary" size="lg" className="w-full">
                                <Heart className="w-4 h-4 mr-2" />
                                Complete Donation
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

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Changed your mind? You can donate anytime.
                    <br />
                    Thank you for considering NagarNirman!
                </p>
            </div>
        </div>
    );
}

export default function DonateCancelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
                </div>
            </div>
        }>
            <CancelContent />
        </Suspense>
    );
}
