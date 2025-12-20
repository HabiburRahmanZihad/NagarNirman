// Test Report Status Update Email
// Run: node utils/testReportStatusEmail.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import { sendReportStatusEmail } from '../services/emailService.js';

// Test user
const testUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'e241024@ugrad.iiuc.ac.bd',
  role: 'citizen',
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
  comments: [
    {
      _id: '507f1f77bcf86cd799439014',
      userId: '507f1f77bcf86cd799439099',
      text: 'We have started working on this issue. Expected completion in 3 days.',
      createdAt: new Date(),
    },
  ],
};



// Status to update to
const newStatus = 'in-progress';



// console.log('🧪 Testing Report Status Update Email...');
// console.log('📧 SMTP Host:', process.env.SMTP_HOST);
// console.log('📧 SMTP Port:', process.env.SMTP_PORT);
// console.log('📧 SMTP User:', process.env.SMTP_USER);
// console.log('');

// console.log('📤 Sending report status update email to:', testUser.email);
// console.log('📋 Report:', testReport.problemType);
// console.log('🔄 New Status:', newStatus.toUpperCase());
// console.log('📍 Location:', testReport.location.address);
// console.log('');

(async () => {
  try {
    await sendReportStatusEmail(testUser, testReport, newStatus);
    // console.log('✅ Report status update email sent successfully!');
    // console.log('📬 Check your inbox at:', testUser.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send report status update email:');
    console.error(error);
    process.exit(1);
  }
})();
