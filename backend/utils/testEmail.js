// Test Email Utility
// Run this file to test email configuration: node utils/testEmail.js

import dotenv from 'dotenv';





// Load environment variables (local development only)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}


import { sendWelcomeEmail } from '../services/emailService.js';


// Test user object
const testUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'e241024@ugrad.iiuc.ac.bd', // Replace with your test email
  role: 'user',
};

// console.log('🧪 Testing email configuration...');
// console.log('📧 SMTP Host:', process.env.SMTP_HOST);
// console.log('📧 SMTP Port:', process.env.SMTP_PORT);
// console.log('📧 SMTP User:', process.env.SMTP_USER);
// console.log('📧 Frontend URL:', process.env.FRONTEND_URL);
// console.log('');

// Send test email
// console.log('📤 Sending test welcome email to:', testUser.email);
sendWelcomeEmail(testUser)
  .then(() => {
    // console.log('✅ Test email sent successfully!');
    // console.log('📬 Check your inbox at:', testUser.email);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to send test email:');
    console.error(error);
    process.exit(1);
  });
