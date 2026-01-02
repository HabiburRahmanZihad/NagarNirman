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
    Calendar,
    Eye,
    X
} from 'lucide-react';

interface Donation {
    _id: string;
    donorName?: string;
    donorEmail?: string;
    donorPhone?: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
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

    // Selected donation for details modal
    const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

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
            donation.donorEmail?.toLowerCase().includes(search) ||
            donation.transactionId?.toLowerCase().includes(search) ||
            donation.donorPhone?.includes(search)
        );
    });

    const exportToCSV = () => {
        const headers = ['Date', 'Donor Name', 'Email', 'Phone', 'Amount', 'Currency', 'Payment Method', 'Status', 'Transaction ID'];
        const rows = donations.map(d => [
            formatDate(d.createdAt),
            d.isAnonymous ? 'Anonymous' : (d.donorName || 'N/A'),
            d.donorEmail || 'N/A',
            d.donorPhone || 'N/A',
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
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredDonations.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-500">
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
                                                <div className="text-sm text-gray-600">{donation.donorEmail || '-'}</div>
                                                <div className="text-xs text-gray-400">{donation.donorPhone || '-'}</div>
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
                                            <td className="py-4 px-4">
                                                <button
                                                    onClick={() => setSelectedDonation(donation)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Details
                                                </button>
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

            {/* Donation Details Modal */}
            {selectedDonation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedDonation(null)}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary/10 to-green-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Donation Details</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Transaction: {selectedDonation.transactionId || selectedDonation.sessionId || 'N/A'}
                                </p>
                            </div>
                            <button
                                title='close'
                                onClick={() => setSelectedDonation(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-green-600 flex items-center justify-center text-white text-lg font-bold">
                                        {selectedDonation.isAnonymous ? 'A' : (selectedDonation.donorName?.charAt(0) || '?')}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {selectedDonation.isAnonymous ? 'Anonymous Donor' : (selectedDonation.donorName || 'Unknown Donor')}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedDonation.isMonthly ? 'Monthly Supporter' : 'One-time Donation'}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(selectedDonation.status)}
                            </div>

                            {/* Amount */}
                            <div className="bg-gradient-to-r from-primary/10 to-green-50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-gray-600 mb-1">Donation Amount</p>
                                <p className="text-3xl font-bold text-primary">
                                    {formatAmount(selectedDonation.amount, selectedDonation.currency)}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedDonation.donorEmail || 'Not provided'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedDonation.donorPhone || 'Not provided'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
                                    <div className="mt-1">{getPaymentMethodBadge(selectedDonation.paymentMethod)}</div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Currency</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedDonation.currency}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Created At</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedDonation.createdAt)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Completed At</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedDonation.completedAt ? formatDate(selectedDonation.completedAt) : 'Not completed'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedDonation.category || 'General Fund'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Anonymous</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedDonation.isAnonymous ? 'Yes' : 'No'}</p>
                                </div>
                            </div>

                            {/* Transaction IDs */}
                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Transaction ID</p>
                                <code className="text-sm bg-white px-3 py-2 rounded border border-gray-200 block font-mono text-gray-700 break-all">
                                    {selectedDonation.transactionId || 'N/A'}
                                </code>
                            </div>

                            {selectedDonation.sessionId && (
                                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Session ID</p>
                                    <code className="text-sm bg-white px-3 py-2 rounded border border-gray-200 block font-mono text-gray-700 break-all">
                                        {selectedDonation.sessionId}
                                    </code>
                                </div>
                            )}

                            {/* Message */}
                            {selectedDonation.message && (
                                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                                    <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Donor Message</p>
                                    <p className="text-sm text-gray-700 italic">&ldquo;{selectedDonation.message}&rdquo;</p>
                                </div>
                            )}

                            {/* Metadata */}
                            {selectedDonation.metadata && Object.keys(selectedDonation.metadata).length > 0 && (
                                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Additional Metadata</p>
                                    <pre className="text-xs bg-white px-3 py-2 rounded border border-gray-200 overflow-x-auto font-mono text-gray-600">
                                        {JSON.stringify(selectedDonation.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setSelectedDonation(null)}
                                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
