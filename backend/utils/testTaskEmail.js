// Test Task Assignment Email
// Run: node utils/testTaskEmail.js

import dotenv from 'dotenv';

// Load environment variables (local development only)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


import { sendTaskAssignmentEmail } from '../services/emailService.js';

// Test user
const testUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'e241024@ugrad.iiuc.ac.bd',
  role: 'problemSolver',
};

// Test task
const testTask = {
  _id: '507f1f77bcf86cd799439012',
  title: 'Fix Pothole on Main Street',
  description: 'There is a large pothole on Main Street that needs to be repaired. Please inspect and fix it.',
  priority: 'high',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  status: 'assigned',
};

// Test report
const testReport = {
  _id: '507f1f77bcf86cd799439013',
  problemType: 'Road Damage',
  category: 'Infrastructure',
  location: {
    address: '123 Main Street, Dhaka',
    district: 'Dhaka',
    coordinates: {
      latitude: 23.8103,
      longitude: 90.4125,
    },
  },
  description: 'A deep pothole that could damage vehicles',
  createdAt: new Date(),
};

// console.log('🧪 Testing Task Assignment Email...');
// console.log('📧 SMTP Host:', process.env.SMTP_HOST);
// console.log('📧 SMTP Port:', process.env.SMTP_PORT);
// console.log('📧 SMTP User:', process.env.SMTP_USER);
// console.log('');

// console.log('📤 Sending task assignment email to:', testUser.email);
// console.log('📋 Task:', testTask.title);
// console.log('👤 Assigned to:', testUser.name);
// console.log('');

(async () => {
  try {
    await sendTaskAssignmentEmail(testUser, testTask, testReport);
    // console.log('✅ Task assignment email sent successfully!');
    // console.log('📬 Check your inbox at:', testUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send task assignment email:');
    console.error(error);
    process.exit(1);
  }
})();
