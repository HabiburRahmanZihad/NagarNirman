// Donation Model (Native MongoDB)
import { getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION_NAME = 'donations';

// Get the donations collection
const getDonationsCollection = () => getDB().collection(COLLECTION_NAME);

// Donation schema validation
const donationSchema = {
    donorName: { type: 'string', required: false },
    donorEmail: { type: 'string', required: false },
    donorPhone: { type: 'string', required: false },
    amount: { type: 'number', required: true },
    currency: { type: 'string', default: 'BDT' },
    paymentMethod: {
        type: 'string',
        enum: ['stripe', 'sslcommerz'],
        required: true
    },
    paymentProvider: {
        type: 'string',
        enum: ['bkash', 'nagad', 'rocket', 'card', 'bank'],
        required: false
    },
    transactionId: { type: 'string', required: false },
    sessionId: { type: 'string', required: false },
    status: {
        type: 'string',
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    isMonthly: { type: 'boolean', default: false },
    isAnonymous: { type: 'boolean', default: false },
    message: { type: 'string', required: false },
    metadata: { type: 'object', required: false },
    completedAt: { type: 'date', required: false },
    createdAt: { type: 'date', default: () => new Date() },
    updatedAt: { type: 'date', default: () => new Date() }
};

// Create indexes for better performance
export const createDonationIndexes = async () => {
    try {
        const collection = getDonationsCollection();
        await collection.createIndex({ status: 1 });
        await collection.createIndex({ donorEmail: 1 });
        // Use partial filter to only index documents where transactionId exists and is not null
        await collection.createIndex(
            { transactionId: 1 },
            {
                unique: true,
                partialFilterExpression: { transactionId: { $type: 'string' } }
            }
        );
        await collection.createIndex({ sessionId: 1 }, { sparse: true });
        await collection.createIndex({ createdAt: -1 });
        await collection.createIndex({ paymentMethod: 1 });
        console.log('✅ Donation indexes created successfully');
    } catch (error) {
        console.error('Error creating donation indexes:', error);
    }
};

// Create a new donation
export const createDonation = async (donationData) => {
    const collection = getDonationsCollection();

    const donation = {
        donorName: donationData.donorName || null,
        donorEmail: donationData.donorEmail || null,
        donorPhone: donationData.donorPhone || null,
        amount: donationData.amount,
        currency: donationData.currency || 'BDT',
        paymentMethod: donationData.paymentMethod,
        paymentProvider: donationData.paymentProvider || null,
        transactionId: donationData.transactionId || null,
        sessionId: donationData.sessionId || null,
        status: donationData.status || 'pending',
        isMonthly: donationData.isMonthly || false,
        isAnonymous: donationData.isAnonymous || false,
        message: donationData.message || null,
        metadata: donationData.metadata || {},
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await collection.insertOne(donation);
    return { ...donation, _id: result.insertedId };
};

// Get donation by ID
export const getDonationById = async (id) => {
    const collection = getDonationsCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
};

// Get donation by transaction ID
export const getDonationByTransactionId = async (transactionId) => {
    const collection = getDonationsCollection();
    return await collection.findOne({ transactionId });
};

// Get donation by session ID
export const getDonationBySessionId = async (sessionId) => {
    const collection = getDonationsCollection();
    return await collection.findOne({ sessionId });
};

// Update donation status
export const updateDonationStatus = async (id, status, additionalData = {}) => {
    const collection = getDonationsCollection();

    const updateData = {
        status,
        updatedAt: new Date(),
        ...additionalData
    };

    if (status === 'completed') {
        updateData.completedAt = new Date();
    }

    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
    );

    return result;
};

// Update donation by session ID
export const updateDonationBySessionId = async (sessionId, updateData) => {
    const collection = getDonationsCollection();

    const result = await collection.findOneAndUpdate(
        { sessionId },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
    );

    return result;
};

// Update donation by transaction ID
export const updateDonationByTransactionId = async (transactionId, updateData) => {
    const collection = getDonationsCollection();

    const result = await collection.findOneAndUpdate(
        { transactionId },
        { $set: { ...updateData, updatedAt: new Date() } },
        { returnDocument: 'after' }
    );

    return result;
};

// Get all donations with filters
export const getDonations = async (filters = {}, options = {}) => {
    const collection = getDonationsCollection();

    const query = {};

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.paymentMethod) {
        query.paymentMethod = filters.paymentMethod;
    }

    if (filters.donorEmail) {
        query.donorEmail = filters.donorEmail;
    }

    if (filters.isMonthly !== undefined) {
        query.isMonthly = filters.isMonthly;
    }

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1 } = options;
    const skip = (page - 1) * limit;

    const donations = await collection
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .toArray();

    const total = await collection.countDocuments(query);

    return {
        donations,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Get recent completed donations (for display on frontend)
export const getRecentDonations = async (limit = 5) => {
    const collection = getDonationsCollection();

    return await collection
        .find({ status: 'completed' })
        .sort({ completedAt: -1 })
        .limit(limit)
        .project({
            donorName: 1,
            amount: 1,
            isAnonymous: 1,
            completedAt: 1,
            message: 1
        })
        .toArray();
};

// Get donation statistics
export const getDonationStats = async () => {
    const collection = getDonationsCollection();

    const stats = await collection.aggregate([
        { $match: { status: 'completed' } },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
                totalDonations: { $sum: 1 },
                averageDonation: { $avg: '$amount' },
                monthlyDonors: {
                    $sum: { $cond: [{ $eq: ['$isMonthly', true] }, 1, 0] }
                }
            }
        }
    ]).toArray();

    // Get this month's donations
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyStats = await collection.aggregate([
        {
            $match: {
                status: 'completed',
                completedAt: { $gte: startOfMonth }
            }
        },
        {
            $group: {
                _id: null,
                monthlyAmount: { $sum: '$amount' },
                monthlyCount: { $sum: 1 }
            }
        }
    ]).toArray();

    // Get unique donors this month (by email)
    const thisMonthDonors = await collection.aggregate([
        {
            $match: {
                status: 'completed',
                completedAt: { $gte: startOfMonth },
                email: { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: '$email'
            }
        },
        {
            $count: 'uniqueDonors'
        }
    ]).toArray();

    // Calculate days left in the month
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysLeft = Math.ceil((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Monthly goal (can be configured via environment variable or database)
    const monthlyGoal = parseInt(process.env.MONTHLY_DONATION_GOAL) || 1000000; // Default: 10,00,000 (in paisa/cents)

    return {
        totalAmount: stats[0]?.totalAmount || 0,
        totalDonations: stats[0]?.totalDonations || 0,
        averageDonation: Math.round(stats[0]?.averageDonation || 0),
        monthlyDonors: stats[0]?.monthlyDonors || 0,
        thisMonthAmount: monthlyStats[0]?.monthlyAmount || 0,
        thisMonthCount: monthlyStats[0]?.monthlyCount || 0,
        thisMonthDonors: thisMonthDonors[0]?.uniqueDonors || 0,
        daysLeft: Math.max(0, daysLeft),
        monthlyGoal: monthlyGoal
    };
};

export default {
    createDonation,
    getDonationById,
    getDonationByTransactionId,
    getDonationBySessionId,
    updateDonationStatus,
    updateDonationBySessionId,
    updateDonationByTransactionId,
    getDonations,
    getRecentDonations,
    getDonationStats,
    createDonationIndexes
};
