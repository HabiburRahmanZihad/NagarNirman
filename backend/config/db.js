// MongoDB Connection Configuration
import { MongoClient } from 'mongodb';

let db;
let client;

const connectDB = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    db = client.db('nagarNirmanDB'); // Specify database name

    // console.log(`✅ MongoDB Connected: ${client.options.hosts[0]}`);
    // console.log(`📊 Database Name: ${db.databaseName}`);

    // Create indexes
    await createIndexes();

    return db;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Create necessary indexes
const createIndexes = async () => {
  try {
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });

    // Report indexes
    await db.collection('reports').createIndex({ status: 1 });
    await db.collection('reports').createIndex({ severity: 1 });
    await db.collection('reports').createIndex({ createdBy: 1 });
    await db.collection('reports').createIndex({ 'location.coordinates': '2dsphere' });

    // Task indexes
    await db.collection('tasks').createIndex({ assignedTo: 1 });
    await db.collection('tasks').createIndex({ status: 1 });
    await db.collection('tasks').createIndex({ report: 1 });

    // console.log('✅ Database indexes created');
  } catch (error) {
    console.error('⚠️ Warning: Could not create indexes:', error.message);
  }
};

// Get database instance
export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

// Close database connection
export const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
};

export default connectDB;
