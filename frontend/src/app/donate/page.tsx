'use client';

import { Button } from '@/components/common';
import {
    Award,
    CheckCircle,
    CreditCard,
    Gift,
    Globe,
    Heart,
    HelpCircle,
    Landmark,
    Leaf,
    Shield,
    Smartphone,
    Star,
    Target,
    TreePine,
    TrendingUp,
    Users,
    Wallet,
    Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

// Donation amount options
const donationAmounts = [
    { value: 100, label: '৳100', description: 'Basic Support' },
    { value: 500, label: '৳500', description: 'Community Helper' },
    { value: 1000, label: '৳1,000', description: 'City Champion' },
    { value: 2500, label: '৳2,500', description: 'Urban Hero' },
    { value: 5000, label: '৳5,000', description: 'Impact Leader' },
    { value: 10000, label: '৳10,000', description: 'Transformation Partner' },
];

// Impact statistics
const impactStats = [
    { value: 15000, label: 'Issues Resolved', suffix: '+', icon: CheckCircle },
    { value: 50000, label: 'Citizens Helped', suffix: '+', icon: Users },
    { value: 100, label: 'Cities Covered', suffix: '+', icon: Globe },
    { value: 98, label: 'Satisfaction Rate', suffix: '%', icon: Star },
];

// What donations support
const donationImpact = [
    {
        icon: Target,
        title: 'Issue Resolution',
        description: 'Fund faster resolution of civic issues in your community',
        color: 'bg-primary',
    },
    {
        icon: Users,
        title: 'Community Outreach',
        description: 'Expand awareness programs to reach more citizens',
        color: 'bg-accent',
    },
    {
        icon: Zap,
        title: 'Platform Enhancement',
        description: 'Improve technology for better reporting experience',
        color: 'bg-primary',
    },
    {
        icon: TreePine,
        title: 'Green Initiatives',
        description: 'Support environmental cleanup and sustainability projects',
        color: 'bg-accent',
    },
    {
        icon: Shield,
        title: 'Safety Programs',
        description: 'Fund public safety awareness and infrastructure improvements',
        color: 'bg-primary',
    },
    {
        icon: Leaf,
        title: 'Sustainable Cities',
        description: 'Promote eco-friendly urban development initiatives',
        color: 'bg-accent',
    },
];

// Payment methods
const paymentMethods = [
    { id: 'bkash', name: 'bKash', icon: Smartphone, color: 'bg-pink-500' },
    { id: 'nagad', name: 'Nagad', icon: Wallet, color: 'bg-orange-500' },
    { id: 'rocket', name: 'Rocket', icon: Zap, color: 'bg-purple-500' },
    { id: 'card', name: 'Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'bank', name: 'Bank Transfer', icon: Landmark, color: 'bg-green-600' },
];

// Donor testimonials
const testimonials = [
    {
        name: 'Rahman Ahmed',
        location: 'Dhaka',
        amount: '৳5,000',
        message: 'NagarNirman helped fix the drainage issue in our neighborhood. Happy to give back!',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        name: 'Fatima Khan',
        location: 'Chittagong',
        amount: '৳2,500',
        message: 'The streetlights in our area were fixed within a week of reporting. Amazing platform!',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        name: 'Karim Hossain',
        location: 'Sylhet',
        amount: '৳10,000',
        message: 'Contributing to a cleaner, safer city feels rewarding. Keep up the great work!',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
];

export default function DonatePage() {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [selectedPayment, setSelectedPayment] = useState<string>('bkash');
    const [isMonthly, setIsMonthly] = useState(false);
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorPhone, setDonorPhone] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [message, setMessage] = useState('');

    // Intersection observer for stats animation
    const { ref: statsRef, inView: statsInView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // Get final donation amount
    const getFinalAmount = () => {
        if (customAmount) return parseInt(customAmount) || 0;
        return selectedAmount || 0;
    };

    // Handle amount selection
    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    // Handle custom amount change
    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        setSelectedAmount(null);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = getFinalAmount();
        if (amount < 10) {
            alert('Minimum donation amount is ৳10');
            return;
        }
        // Handle donation submission
        alert(`Thank you for your ${isMonthly ? 'monthly' : 'one-time'} donation of ৳${amount.toLocaleString()}! Redirecting to payment...`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80"
                        alt="Community helping hands"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-[#004d40]/95 via-[#004d40]/80 to-[#004d40]/60" />
                    <div
                        className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] bg-size-[60px_60px]"
                    />
                </div>

                <div className="container relative mx-auto px-4 py-20 md:py-28">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                                <Heart className="w-5 h-5 text-[#f2a921]" />
                                <span className="text-sm font-medium">Support Our Mission</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Empower Change,{' '}
                                <span className="text-[#f2a921]">One Donation</span> at a Time
                            </h1>
                            <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-95">
                                Your contribution helps us resolve civic issues faster, reach more communities,
                                and build better cities for everyone. Every taka makes a difference.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-[#f2a921]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">100% Secure</p>
                                        <p className="text-sm opacity-80">Encrypted payments</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                        <Award className="w-6 h-6 text-[#f2a921]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Tax Deductible</p>
                                        <p className="text-sm opacity-80">Get tax benefits</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="flex justify-center">
                            <div className="relative w-full max-w-md">
                                <div className="absolute -inset-4 bg-linear-to-b from-white/20 to-transparent rounded-3xl blur-xl opacity-50" />
                                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#f2a921] to-[#e6b82e] rounded-full mb-4 shadow-lg">
                                            <Gift className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            This Month&apos;s Goal
                                        </h3>
                                        <p className="text-white/80">Help us reach our target</p>
                                    </div>
                                    <div className="mb-6">
                                        <div className="flex justify-between text-white mb-2">
                                            <span>৳7,50,000 raised</span>
                                            <span>৳10,00,000</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="bg-linear-to-r from-[#f2a921] to-[#ffc850] h-full rounded-full transition-all duration-1000 w-3/4"
                                            />
                                        </div>
                                        <p className="text-center text-white/80 mt-2 text-sm">
                                            <span className="font-semibold text-[#f2a921]">75%</span> of goal reached
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="bg-white/10 rounded-xl p-4">
                                            <p className="text-2xl font-bold text-white">1,250+</p>
                                            <p className="text-sm text-white/80">Donors</p>
                                        </div>
                                        <div className="bg-white/10 rounded-xl p-4">
                                            <p className="text-2xl font-bold text-white">15</p>
                                            <p className="text-sm text-white/80">Days Left</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Statistics */}
            <section ref={statsRef} className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {impactStats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-6 rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-4">
                                    <stat.icon className="w-7 h-7 text-primary" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {statsInView ? (
                                        <CountUp end={stat.value} duration={2.5} separator="," />
                                    ) : (
                                        0
                                    )}
                                    {stat.suffix}
                                </div>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Donation Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 text-primary mb-4">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-medium tracking-wide">Support Our Civic Mission</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#002E2E] mb-4">
                            Make Your Contribution
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose an amount and payment method to support our mission of building better cities
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Donation Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                                {/* Donation Type Toggle */}
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsMonthly(false)}
                                        className={`px-6 py-3 rounded-full font-semibold transition-all ${!isMonthly
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        One-Time
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsMonthly(true)}
                                        className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${isMonthly
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Heart className="w-4 h-4" />
                                        Monthly
                                    </button>
                                </div>

                                {/* Amount Selection */}
                                <div className="mb-8">
                                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                                        Select Amount
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        {donationAmounts.map((amount) => (
                                            <button
                                                key={amount.value}
                                                type="button"
                                                onClick={() => handleAmountSelect(amount.value)}
                                                className={`p-4 rounded-xl border-2 transition-all ${selectedAmount === amount.value && !customAmount
                                                        ? 'border-primary bg-primary/5 shadow-md'
                                                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <p className="text-xl font-bold text-gray-900">{amount.label}</p>
                                                <p className="text-sm text-gray-500">{amount.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                            ৳
                                        </span>
                                        <input
                                            type="text"
                                            value={customAmount}
                                            onChange={handleCustomAmountChange}
                                            placeholder="Enter custom amount"
                                            className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="mb-8">
                                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setSelectedPayment(method.id)}
                                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedPayment === method.id
                                                        ? 'border-primary bg-primary/5 shadow-md'
                                                        : 'border-gray-200 hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                                                    <method.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{method.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Donor Information */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="text-lg font-semibold text-gray-900">
                                            Your Information
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isAnonymous}
                                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-600">Donate Anonymously</span>
                                        </label>
                                    </div>

                                    {!isAnonymous && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={donorName}
                                                onChange={(e) => setDonorName(e.target.value)}
                                                placeholder="Full Name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                            <input
                                                type="email"
                                                value={donorEmail}
                                                onChange={(e) => setDonorEmail(e.target.value)}
                                                placeholder="Email Address"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                            <input
                                                type="tel"
                                                value={donorPhone}
                                                onChange={(e) => setDonorPhone(e.target.value)}
                                                placeholder="Phone Number"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all md:col-span-2"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="mb-8">
                                    <label className="block text-lg font-semibold text-gray-900 mb-4">
                                        Leave a Message (Optional)
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Share why you're supporting NagarNirman..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="border-t border-gray-100 pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-600">
                                            {isMonthly ? 'Monthly Donation' : 'One-Time Donation'}
                                        </span>
                                        <span className="text-2xl font-bold text-primary">
                                            ৳{getFinalAmount().toLocaleString()}
                                        </span>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full"
                                        iconPosition="right"
                                    >
                                        <Heart className="w-5 h-5 mr-2" />
                                        {isMonthly ? 'Start Monthly Donation' : 'Donate Now'}
                                    </Button>
                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        <Shield className="w-4 h-4 inline mr-1" />
                                        Your payment is secured with 256-bit SSL encryption
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Why Donate Card */}
                            <div className="bg-linear-to-br from-[#004d40] to-[#1e5a22] rounded-2xl p-8 text-white shadow-xl">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-[#f2a921]" />
                                    Why Donate?
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-[#f2a921] shrink-0 mt-0.5" />
                                        <span>Faster resolution of civic issues in your area</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-[#f2a921] shrink-0 mt-0.5" />
                                        <span>Expand platform reach to underserved communities</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-[#f2a921] shrink-0 mt-0.5" />
                                        <span>Support green and sustainability initiatives</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-[#f2a921] shrink-0 mt-0.5" />
                                        <span>Help train local problem solvers</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-[#f2a921] shrink-0 mt-0.5" />
                                        <span>Get recognized as a community champion</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Recent Donors */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-primary" />
                                    Recent Supporters
                                </h3>
                                <div className="space-y-4">
                                    {testimonials.map((donor, index) => (
                                        <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                            <Image
                                                src={donor.avatar}
                                                alt={donor.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-gray-900">{donor.name}</p>
                                                    <span className="text-sm font-bold text-primary">{donor.amount}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">{donor.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link href="#" className="block text-center text-primary font-medium mt-4 hover:text-accent transition-colors">
                                    View All Donors →
                                </Link>
                            </div>

                            {/* Trust Badges */}
                            <div className="bg-gray-100 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                                    Trusted & Secure
                                </h3>
                                <div className="flex justify-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium">SSL Secured</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium">Verified NGO</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Your Donation Supports */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 text-primary mb-4">
                            <Target className="w-5 h-5" />
                            <span className="text-sm font-medium tracking-wide">Transparent Fund Allocation</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#002E2E] mb-4">
                            Where Your Money Goes
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Every donation is carefully allocated to maximize impact on civic improvements
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {donationImpact.map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                            >
                                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Donor Testimonials */}
            <section className="py-20 bg-linear-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 text-primary mb-4">
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium tracking-wide">Community Voices</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#002E2E] mb-4">
                            Stories from Our Donors
                        </h2>
                        <p className="text-lg text-gray-600">
                            Hear from people who have made a difference
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        width={56}
                                        height={56}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4 leading-relaxed">&quot;{testimonial.message}&quot;</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">Donated</span>
                                    <span className="font-bold text-primary">{testimonial.amount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-linear-to-r from-[#004d40] to-[#1e5a22]">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto">
                        <Heart className="w-16 h-16 text-[#f2a921] mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Every Contribution Counts
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of citizens making a real difference in their communities.
                            Your support helps us build cleaner, safer, and more sustainable cities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <Button variant="accent" size="lg" iconPosition="right">
                                    <Heart className="w-5 h-5 mr-2" />
                                    Donate Now
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button variant="outline" size="lg" iconPosition="right">
                                    Learn More About Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 text-primary mb-4">
                            <HelpCircle className="w-5 h-5" />
                            <span className="text-sm font-medium tracking-wide">Got Questions?</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#002E2E] mb-4">
                            Donation FAQs
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {[
                            {
                                q: 'Is my donation tax deductible?',
                                a: 'Yes, all donations to NagarNirman are tax deductible under applicable laws. You will receive a receipt for your records.',
                            },
                            {
                                q: 'Can I cancel my monthly donation?',
                                a: 'Absolutely. You can cancel or modify your monthly donation at any time through your donor dashboard or by contacting our support team.',
                            },
                            {
                                q: 'How is my donation used?',
                                a: 'Your donation directly supports issue resolution, platform improvements, community outreach, and sustainability initiatives. We publish quarterly impact reports for full transparency.',
                            },
                            {
                                q: 'Can I donate on behalf of someone else?',
                                a: 'Yes! You can make a gift donation in honor of someone special. They will receive a notification of your generous gesture.',
                            },
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/faq" className="text-primary font-semibold hover:text-accent transition-colors">
                            View All FAQs →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
