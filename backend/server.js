// Backend server entry point
// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file with explicit path
const result = dotenv.config({ path: join(__dirname, '.env') });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('📁 .env path:', join(__dirname, '.env'));
}

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import statisticsRoutes from './routes/statisticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Initialize Express app
const app = express();

// Connect to MongoDB and create indexes
connectDB().then(async () => {
  // Create indexes for better performance
  try {
    const { createTaskIndexes } = await import('./models/Task.js');
    const { createNotificationIndexes } = await import('./models/Notification.js');
    await createTaskIndexes();
    await createNotificationIndexes();
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
// Increase payload limit to handle base64 images (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NagarNirman API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
