'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { paymentAPI } from '@/utils/api';
import { FullPageLoading } from '@/components/common';
import toast from 'react-hot-toast';
import {
    CreditCard,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Search,
    DollarSign,
    TrendingUp,
    Users,
    Calendar
} from 'lucide-react';

interface Donation {
    _id: string;
    donorName?: string;
    email?: string;
    phone?: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    transactionId?: string;
    sessionId?: string;
    isAnonymous?: boolean;
    isMonthly?: boolean;
    category?: string;
    message?: string;
    createdAt: string;
    completedAt?: string;
    metadata?: Record<string, unknown>;
}

interface DonationStats {
    totalAmount: number;
    totalDonations: number;
    thisMonthAmount: number;
    thisMonthCount: number;
    thisMonthDonors: number;
    daysLeft: number;
    monthlyGoal: number;
}

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface DonationsResponse {
    success: boolean;
    donations: Donation[];
    pagination: PaginationInfo;
}

interface StatsResponse {
    success: boolean;
    stats: DonationStats;
}

export default function DonationsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [stats, setStats] = useState<DonationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDonations = useCallback(async (page = 1, showToast = false) => {
        if (showToast) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            const response = await paymentAPI.getAllDonations({
                page,
                limit: 10,
                status: statusFilter || undefined,
                paymentMethod: paymentMethodFilter || undefined
            }) as DonationsResponse;

            if (response.success) {
                setDonations(response.donations || []);
                setPagination(response.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
                if (showToast) {
                    toast.success('Donations refreshed!');
                }
            }
        } catch (error) {
            console.error('Failed to fetch donations:', error);
            toast.error('Failed to load donations');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [statusFilter, paymentMethodFilter]);

    const fetchStats = useCallback(async () => {
        try {
            const response = await paymentAPI.getDonationStats() as StatsResponse;
            if (response.success) {
                setStats(response.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'superAdmin') {
            fetchDonations();
            fetchStats();
        }
    }, [user, fetchDonations, fetchStats]);

    useEffect(() => {
        if (user?.role === 'superAdmin') {
            fetchDonations(1);
        }
    }, [statusFilter, paymentMethodFilter, user, fetchDonations]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
            failed: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
            cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getPaymentMethodBadge = (method: string) => {
        const methodColors: Record<string, string> = {
            stripe: 'bg-purple-100 text-purple-800',
            sslcommerz: 'bg-blue-100 text-blue-800',
            bkash: 'bg-pink-100 text-pink-800',
            nagad: 'bg-orange-100 text-orange-800',
            rocket: 'bg-violet-100 text-violet-800',
            bank: 'bg-green-100 text-green-800'
        };
        const color = methodColors[method?.toLowerCase()] || 'bg-gray-100 text-gray-800';

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
                <CreditCard className="w-3 h-3" />
                {method}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount: number, currency: string) => {
        const symbol = currency === 'BDT' ? '৳' : '$';
        return `${symbol}${amount.toLocaleString()}`;
    };

    const filteredDonations = donations.filter(donation => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            donation.donorName?.toLowerCase().includes(search) ||
            donation.email?.toLowerCase().includes(search) ||
            donation.transactionId?.toLowerCase().includes(search) ||
            donation.phone?.includes(search)
        );
    });

    const exportToCSV = () => {
        const headers = ['Date', 'Donor Name', 'Email', 'Phone', 'Amount', 'Currency', 'Payment Method', 'Status', 'Transaction ID'];
        const rows = donations.map(d => [
            formatDate(d.createdAt),
            d.isAnonymous ? 'Anonymous' : (d.donorName || 'N/A'),
            d.email || 'N/A',
            d.phone || 'N/A',
            d.amount.toString(),
            d.currency,
            d.paymentMethod,
            d.status,
            d.transactionId || d.sessionId || 'N/A'
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Donations exported successfully!');
    };

    if (authLoading || isLoading) {
        return <FullPageLoading text="Loading donations..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                                </div>
                                Donation Management
                            </h1>
                            <p className="text-gray-600 mt-1">View and manage all payment transactions</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                            <button
                                onClick={() => fetchDonations(pagination.page, true)}
                                disabled={isRefreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Raised</p>
                                    <p className="text-xl font-bold text-gray-900">৳{stats.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">This Month</p>
                                    <p className="text-xl font-bold text-gray-900">৳{stats.thisMonthAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Donations</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.totalDonations.toLocaleString()}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Calendar className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">This Month Donors</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.thisMonthDonors}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or transaction ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    title="Filter by status"
                                    className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white cursor-pointer"
                                >
                                    <option value="">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={paymentMethodFilter}
                                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                                    title="Filter by payment method"
                                    className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white cursor-pointer"
                                >
                                    <option value="">All Methods</option>
                                    <option value="stripe">Stripe</option>
                                    <option value="sslcommerz">SSLCommerz</option>
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="rocket">Rocket</option>
                                    <option value="bank">Bank</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donations Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Donor</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Contact</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Method</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDonations.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-500">
                                            <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p className="font-medium">No donations found</p>
                                            <p className="text-sm">Try adjusting your filters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDonations.map((donation, index) => (
                                        <motion.tr
                                            key={donation._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="text-sm text-gray-900">{formatDate(donation.createdAt)}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-green-600 flex items-center justify-center text-white text-sm font-medium">
                                                        {donation.isAnonymous ? 'A' : (donation.donorName?.charAt(0) || '?')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {donation.isAnonymous ? 'Anonymous' : (donation.donorName || 'Unknown')}
                                                        </p>
                                                        {donation.isMonthly && (
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Monthly</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-sm text-gray-600">{donation.email || '-'}</div>
                                                <div className="text-xs text-gray-400">{donation.phone || '-'}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatAmount(donation.amount, donation.currency)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                {getPaymentMethodBadge(donation.paymentMethod)}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(donation.status)}
                                            </td>
                                            <td className="py-4 px-4">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">
                                                    {(donation.transactionId || donation.sessionId || '-').slice(0, 20)}...
                                                </code>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="border-t border-gray-100 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                {pagination.total} donations
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchDonations(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    title="Previous page"
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.page >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.page - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => fetchDonations(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${pagination.page === pageNum
                                                        ? 'bg-primary text-white'
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => fetchDonations(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    title="Next page"
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
