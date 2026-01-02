// Email Service using Nodemailer
import nodemailer from 'nodemailer';



// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};



// Email template wrapper
const emailTemplate = (title, content) => {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f5f5f5;
        }
        .email-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background: #004540;
          padding: 40px 30px;
          text-align: center;
          border-radius: 12px 12px 0 0;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.1)"/></svg>') repeat-x;
          background-size: 600px 120px;
          animation: wave 15s linear infinite;
        }
        @keyframes wave {
          0% { background-position: 0 0; }
          100% { background-position: 600px 0; }
        }
        .header-content {
          position: relative;
          z-index: 1;
        }
        .logo {
          width: 80px;
          height: auto;
          margin: 0 auto 15px;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        .header h1 {
          color: white;
          font-size: 28px;
          margin: 0;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header p {
          color: white;
          font-size: 14px;
          margin-top: 8px;
          opacity: 0.95;
          letter-spacing: 0.5px;
        }
        .content {
          background: #fafafa;
          padding: 40px 30px;
          border-radius: 0 0 12px 12px;
          border-top: 4px solid #f2a921;
        }
        .content h2 {
          color: #2a7d2f;
          font-size: 22px;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .content p {
          margin: 15px 0;
          font-size: 14px;
          line-height: 1.8;
          color: #555;
        }
        .content h3 {
          color: #2a7d2f;
          font-size: 16px;
          margin: 25px 0 12px 0;
          font-weight: 600;
        }
        .content ul {
          margin: 15px 0 15px 20px;
          padding: 0;
        }
        .content li {
          margin: 8px 0;
          color: #555;
          font-size: 14px;
        }
        .content strong {
          color: #2a7d2f;
          font-weight: 600;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          background: #004540;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 25px 0;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(129, 213, 134, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
          text-align: center;
          display: inline-block;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(129, 213, 134, 0.4);
        }
        .accent-text {
          color: #f2a921;
          font-weight: 600;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #ddd, transparent);
          margin: 25px 0;
        }
        .footer {
          text-align: center;
          margin-top: 0;
          padding: 30px;
          color: #999;
          font-size: 12px;
          background: #F6FFF9;
          border-radius: 0 0 12px 12px;
          border-top: 1px solid #eee;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
        }
        .footer-logo {
          width: 120px;
          height: auto;
          margin: 0 auto 10px;
          display: block;
          opacity: 0.6;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-content">
            <img src="https://res.cloudinary.com/dc3ul4egd/image/upload/v1765435970/logo_yz2ev1.jpg" alt="NagarNirman" class="logo" style="width: 120px; height: auto;">
            <h1>NagarNirman</h1>
            <p>Report • Resolve • Rebuild</p>
          </div>
        </div>
        <div class="content">
          <h2>${title}</h2>
          ${content}
        </div>
        <div class="footer">
          <img src="https://res.cloudinary.com/dc3ul4egd/image/upload/logo_vircrs.png" alt="NagarNirman" class="footer-logo">
          <p>© ${currentYear} NagarNirman. All rights reserved.</p>
          <p>Building better communities together.</p>
          <p style="margin-top: 15px; color: #bbb; font-size: 11px;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};



// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();

  const content = `
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Welcome to <span class="accent-text">NagarNirman</span>! 🎉 We're excited to have you join our community of citizens working together to improve infrastructure in Bangladesh.</p>
    <h3>What you can do:</h3>
    <ul>
      <li>📍 Report infrastructure problems in your area</li>
      <li>📊 Track the status of your reports in real-time</li>
      <li>🤝 Contribute to solving community issues</li>
      <li>⭐ Earn rewards for your contributions</li>
    </ul>
    <p>Get started now and make a difference in your community!</p>
    <a href="${process.env.FRONTEND_URL}/dashboard/user" class="button">Access Your Dashboard</a>
    <div class="divider"></div>
    <p style="font-size: 13px; color: #777;">If you have any questions or need assistance, feel free to contact our support team.</p>
    <p style="margin-top: 15px;">Thank you for being part of the <span class="accent-text">solution</span>!</p>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: '🎉 Welcome to NagarNirman - Let\'s Build Together!',
    html: emailTemplate('Welcome to NagarNirman!', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('✅ Welcome email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
  }
};



// Send task assignment email
export const sendTaskAssignmentEmail = async (user, task, report) => {
  const transporter = createTransporter();

  const deadlineText = task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified';
  const priorityEmoji = { low: '🟢', medium: '🟡', high: '🔴', urgent: '🚨' };
  const priorityColor = { low: '#4CAF50', medium: '#FFC107', high: '#FF5722', urgent: '#F44336' };

  const content = `
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Great news! 🎯 A new task has been assigned to you!</p>
    <h3>Task Details:</h3>
    <ul>
      <li><strong>Title:</strong> ${task.title}</li>
      <li><strong>Description:</strong> ${task.description || 'No description provided'}</li>
      <li><strong>Priority:</strong> ${priorityEmoji[task.priority] || '🟡'} <span style="color: ${priorityColor[task.priority] || '#FFC107'};"><strong>${task.priority || 'medium'}</strong></span></li>
      <li><strong>Deadline:</strong> 📅 ${deadlineText}</li>
    </ul>
    <h3>Related Report:</h3>
    <ul>
      <li><strong>Problem Type:</strong> ${report.problemType || 'Infrastructure Issue'}</li>
      <li><strong>Category:</strong> ${report.category || 'General'}</li>
      <li><strong>Location:</strong> 📍 ${report.location?.address || 'Not specified'}</li>
      <li><strong>District:</strong> ${report.location?.district || 'Not specified'}</li>
    </ul>
    <a href="${process.env.FRONTEND_URL}/dashboard/solver/tasks" class="button">View Task Details</a>
    <div class="divider"></div>
    <p>Your dedication to solving community issues is <span class="accent-text">invaluable</span>. Good luck!</p>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: '🎯 New Task Assigned - NagarNirman',
    html: emailTemplate('New Task Assigned', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('✅ Task assignment email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending task assignment email:', error);
  }
};



// Send report status update email
export const sendReportStatusEmail = async (user, report, newStatus) => {
  const transporter = createTransporter();

  const statusMessages = {
    pending: 'Your report is being reviewed',
    approved: 'Your report has been approved! ✅',
    'in-progress': 'Work has started on your report! 🔧',
    resolved: 'Your report has been resolved! 🎉',
    rejected: 'Your report could not be approved',
  };

  const statusEmoji = {
    pending: '⏳',
    approved: '✅',
    'in-progress': '🔧',
    resolved: '🎉',
    rejected: '❌',
  };

  const content = `
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>${statusEmoji[newStatus]} ${statusMessages[newStatus]}</p>
    <h3>Report Information:</h3>
    <ul>
      <li><strong>Problem Type:</strong> ${report.problemType}</li>
      <li><strong>Location:</strong> 📍 ${report.location.address}</li>
      <li><strong>Status:</strong> <span style="color: #2a7d2f; font-weight: 600;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span></li>
      <li><strong>Submitted:</strong> 📅 ${new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
    </ul>
    ${report.comments && report.comments.length > 0 ? `
      <h3>Latest Update:</h3>
      <div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #81d586; border-radius: 4px; margin: 15px 0;">
        <p>${report.comments[report.comments.length - 1].text}</p>
      </div>
    ` : ''}
    <a href="${process.env.FRONTEND_URL}/reports/${report._id}" class="button">View Report Details</a>
    <div class="divider"></div>
    <p>Thank you for helping improve our community! Keep reporting issues and making a difference.</p>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `${statusEmoji[newStatus]} Report Status Update - NagarNirman`,
    html: emailTemplate('Report Status Update', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('✅ Report status email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending report status email:', error);
  }
};



// Send approval notification email
export const sendApprovalEmail = async (user, approved) => {
  const transporter = createTransporter();

  const content = approved
    ? `
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Congratulations! 🎉 Your application to become a <span class="accent-text">Problem Solver</span> has been approved!</p>
      <h3>You can now:</h3>
      <ul>
        <li>✅ View and accept assigned tasks</li>
        <li>📸 Submit proof of completed work</li>
        <li>⭐ Earn reward points</li>
        <li>📈 Build your reputation in the community</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/dashboard/solver" class="button">Access Solver Dashboard</a>
      <div class="divider"></div>
      <p>Thank you for your commitment to improving our community. We're excited to have you on board!</p>
    `
    : `
      <p>Hello <strong>${user.name}</strong>,</p>
      <p>Thank you for applying to become a <span class="accent-text">Problem Solver</span>.</p>
      <p>We regret to inform you that your application could not be approved at this time. This doesn't mean you can't contribute! You can still:</p>
      <ul>
        <li>📍 Report infrastructure problems</li>
        <li>💬 Engage with the community</li>
        <li>📊 Track issue resolutions</li>
      </ul>
      <p>Feel free to reapply after reviewing our requirements or <strong>contact our support team</strong> for more information.</p>
      <a href="${process.env.FRONTEND_URL}/help" class="button">Get Help & Support</a>
    `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: approved
      ? '✅ Congratulations! Problem Solver Application Approved - NagarNirman'
      : '📋 Problem Solver Application Status - NagarNirman',
    html: emailTemplate(
      approved ? 'Application Approved! 🎉' : 'Application Status Update',
      content
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`✅ Approval email (${approved ? 'approved' : 'rejected'}) sent to:`, user.email);
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
  }
};



// Send reward notification email
export const sendRewardEmail = async (user, task, points) => {
  const transporter = createTransporter();

  const content = `
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>🎉 Congratulations! You've earned <span class="accent-text"><strong>${points} reward points</strong></span> for completing a task!</p>
    <h3>Completed Task Details:</h3>
    <ul>
      <li><strong>Task Title:</strong> ${task.title}</li>
      <li><strong>Points Earned:</strong> 🌟 ${points} points</li>
      <li><strong>Total Points:</strong> 📊 ${user.rewardPoints} points</li>
    </ul>
    <div style="background: linear-gradient(135deg, #81d586, #aef452); padding: 20px; border-radius: 8px; color: white; text-align: center; margin: 20px 0;">
      <p style="font-size: 14px; margin: 0; opacity: 0.9;">You're on your way to amazing rewards!</p>
      <p style="font-size: 18px; font-weight: 700; margin: 10px 0;">🏆 Keep up the excellent work!</p>
    </div>
    <a href="${process.env.FRONTEND_URL}/dashboard/solver" class="button">View Your Profile & Rewards</a>
    <div class="divider"></div>
    <p>Thank you for your amazing contribution to making our community better! 🌍</p>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: '🎉 You Earned Reward Points! - NagarNirman',
    html: emailTemplate('Reward Points Earned! 🌟', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log('✅ Reward email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending reward email:', error);
  }
};


// Send Donation Success Email
export const sendDonationSuccessEmail = async (donation) => {
  try {
    const transporter = createTransporter();

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getPaymentMethodName = (donation) => {
      const providers = {
        'bkash': 'bKash',
        'nagad': 'Nagad',
        'rocket': 'Rocket',
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer'
      };
      if (donation.paymentProvider) {
        return providers[donation.paymentProvider] || donation.paymentProvider;
      }
      if (donation.paymentMethod === 'stripe') return 'Credit/Debit Card (Stripe)';
      if (donation.paymentMethod === 'sslcommerz') return 'SSLCommerz';
      return 'Online Payment';
    };

    const content = `
      <p>Dear <strong>${donation.isAnonymous ? 'Generous Donor' : donation.donorName}</strong>,</p>
      
      <p>Thank you for your generous donation to <strong>NagarNirman</strong>! Your contribution helps us build better cities through community action.</p>

      <div class="divider"></div>

      <h3>🧾 Donation Receipt</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Transaction ID</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-family: monospace; font-size: 13px;">${donation.transactionId || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Date</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${formatDate(donation.completedAt || donation.createdAt)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Payment Method</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${getPaymentMethodName(donation)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Donation Type</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${donation.isMonthly ? 'Monthly Recurring' : 'One-Time'}</td>
        </tr>
        <tr>
          <td style="padding: 16px 0; color: #333; font-weight: 600; font-size: 16px;">Total Amount</td>
          <td style="padding: 16px 0; text-align: right; color: #004540; font-weight: 700; font-size: 24px;">৳${donation.amount.toLocaleString()}</td>
        </tr>
      </table>

      ${donation.message ? `
        <div style="background: #fff8e6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f2a921;">
          <p style="margin: 0; font-style: italic; color: #666;">"${donation.message}"</p>
        </div>
      ` : ''}

      <div class="divider"></div>

      <h3>💚 Your Impact</h3>
      <p>Your donation will help us:</p>
      <ul>
        <li>Resolve civic issues faster in communities</li>
        <li>Train and support local problem solvers</li>
        <li>Improve urban infrastructure and safety</li>
        <li>Promote sustainable city development</li>
      </ul>

      <div class="divider"></div>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/donate" class="button" style="color: white; text-decoration: none;">Make Another Donation</a>
      </p>

      <p style="margin-top: 30px; font-size: 13px; color: #888; text-align: center;">
        This receipt is for your records. Please save it for tax purposes.<br>
        If you have any questions, contact us at <a href="mailto:donate@nagarnirman.org" style="color: #004540;">donate@nagarnirman.org</a>
      </p>
    `;

    const mailOptions = {
      from: `"NagarNirman" <${process.env.SMTP_USER}>`,
      to: donation.donorEmail,
      subject: `🎉 Thank You for Your Donation of ৳${donation.amount.toLocaleString()} - NagarNirman`,
      html: emailTemplate('Donation Successful! 🎉', content),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Donation success email sent to ${donation.donorEmail}`);
  } catch (error) {
    console.error('❌ Error sending donation success email:', error);
  }
};


// Send Donation Admin Notification Email
export const sendDonationAdminNotificationEmail = async (adminEmail, donation) => {
  try {
    const transporter = createTransporter();

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getPaymentMethodName = (donation) => {
      const providers = {
        'bkash': 'bKash',
        'nagad': 'Nagad',
        'rocket': 'Rocket',
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer'
      };
      if (donation.paymentProvider) {
        return providers[donation.paymentProvider] || donation.paymentProvider;
      }
      if (donation.paymentMethod === 'stripe') return 'Credit/Debit Card (Stripe)';
      if (donation.paymentMethod === 'sslcommerz') return 'SSLCommerz';
      return 'Online Payment';
    };

    const content = `
      <p>Hello <strong>Admin</strong>,</p>
      
      <p>🎉 Great news! A new donation has been received on <strong>NagarNirman</strong>.</p>

      <div class="divider"></div>

      <h3>💰 Donation Details</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Donor Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}</td>
        </tr>
        ${!donation.isAnonymous ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Donor Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${donation.donorEmail}</td>
        </tr>
        ${donation.donorPhone ? `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Donor Phone</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${donation.donorPhone}</td>
        </tr>
        ` : ''}
        ` : ''}
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Transaction ID</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-family: monospace; font-size: 13px;">${donation.transactionId || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Date & Time</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${formatDate(donation.completedAt || donation.createdAt)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Payment Method</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${getPaymentMethodName(donation)}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666;">Donation Type</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right;">${donation.isMonthly ? '🔄 Monthly Recurring' : '💵 One-Time'}</td>
        </tr>
        <tr style="background: #f0fdf4;">
          <td style="padding: 16px; color: #333; font-weight: 600; font-size: 16px;">Amount Received</td>
          <td style="padding: 16px; text-align: right; color: #16a34a; font-weight: 700; font-size: 24px;">৳${donation.amount.toLocaleString()}</td>
        </tr>
      </table>

      ${donation.message ? `
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0 0 5px 0; font-weight: 600; color: #0369a1;">Donor's Message:</p>
          <p style="margin: 0; font-style: italic; color: #666;">"${donation.message}"</p>
        </div>
      ` : ''}

      <div class="divider"></div>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/superAdmin/donations" class="button" style="color: white; text-decoration: none;">View All Donations</a>
      </p>

      <p style="margin-top: 30px; font-size: 13px; color: #888; text-align: center;">
        This is an automated notification from NagarNirman donation system.
      </p>
    `;

    const mailOptions = {
      from: `"NagarNirman Donations" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `💰 New Donation: ৳${donation.amount.toLocaleString()} from ${donation.isAnonymous ? 'Anonymous' : donation.donorName}`,
      html: emailTemplate('New Donation Received! 💰', content),
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Donation admin notification email sent to ${adminEmail}`);
  } catch (error) {
    console.error('❌ Error sending donation admin notification email:', error);
  }
};


export default {
  sendWelcomeEmail,
  sendTaskAssignmentEmail,
  sendReportStatusEmail,
  sendApprovalEmail,
  sendRewardEmail,
  sendDonationSuccessEmail,
  sendDonationAdminNotificationEmail,
};
