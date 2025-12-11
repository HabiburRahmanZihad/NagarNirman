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
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #81d586, #aef452);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #81d586;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏗️ NagarNirman</h1>
        <p>Report, Resolve, Rebuild</p>
      </div>
      <div class="content">
        <h2>${title}</h2>
        ${content}
      </div>
      <div class="footer">
        <p>© 2024 NagarNirman. All rights reserved.</p>
        <p>Building better communities together.</p>
      </div>
    </body>
    </html>
  `;
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  const transporter = createTransporter();

  const content = `
    <p>Hello ${user.name},</p>
    <p>Welcome to NagarNirman! We're excited to have you join our community of citizens working together to improve infrastructure in Bangladesh.</p>
    <p>With your account, you can:</p>
    <ul>
      <li>Report infrastructure problems in your area</li>
      <li>Track the status of your reports</li>
      <li>Contribute to solving community issues</li>
      <li>Earn rewards for your contributions</li>
    </ul>
    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
    <p>Thank you for being part of the solution!</p>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Welcome to NagarNirman!',
    html: emailTemplate('Welcome to NagarNirman!', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', user.email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Send task assignment email
export const sendTaskAssignmentEmail = async (user, task, report) => {
  const transporter = createTransporter();

  const deadlineText = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Not specified';
  const priorityEmoji = { low: '🟢', medium: '🟡', high: '🔴', urgent: '🚨' };

  const content = `
    <p>Hello ${user.name},</p>
    <p>🎯 A new task has been assigned to you!</p>
    <h3>Task Details:</h3>
    <ul>
      <li><strong>Title:</strong> ${task.title}</li>
      <li><strong>Description:</strong> ${task.description}</li>
      <li><strong>Priority:</strong> ${priorityEmoji[task.priority] || '🟡'} ${task.priority || 'medium'}</li>
      <li><strong>Deadline:</strong> ${deadlineText}</li>
    </ul>
    <h3>Related Report:</h3>
    <ul>
      <li><strong>Problem Type:</strong> ${report.problemType || 'Infrastructure Issue'}</li>
      <li><strong>Category:</strong> ${report.category || 'General'}</li>
      <li><strong>Location:</strong> ${report.location?.address || 'Not specified'}</li>
      <li><strong>District:</strong> ${report.location?.district || 'Not specified'}</li>
    </ul>
    <a href="${process.env.FRONTEND_URL}/dashboard/problemSolver/tasks" class="button">View Task</a>
    <p>Good luck solving this issue! Your contribution helps build a better community.</p>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: '🎯 New Task Assigned - NagarNirman',
    html: emailTemplate('New Task Assigned', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Task assignment email sent to:', user.email);
  } catch (error) {
    console.error('❌ Error sending task assignment email:', error);
  }
};

// Send report status update email
export const sendReportStatusEmail = async (user, report, newStatus) => {
  const transporter = createTransporter();

  const statusMessages = {
    pending: 'Your report is being reviewed',
    approved: 'Your report has been approved',
    'in-progress': 'Work has started on your report',
    resolved: 'Your report has been resolved!',
    rejected: 'Your report could not be approved',
  };

  const content = `
    <p>Hello ${user.name},</p>
    <p>${statusMessages[newStatus]}</p>
    <h3>Report Details:</h3>
    <ul>
      <li><strong>Problem Type:</strong> ${report.problemType}</li>
      <li><strong>Location:</strong> ${report.location.address}</li>
      <li><strong>Status:</strong> ${newStatus.toUpperCase()}</li>
      <li><strong>Submitted:</strong> ${new Date(report.createdAt).toLocaleDateString()}</li>
    </ul>
    ${report.comments && report.comments.length > 0 ? `
      <h3>Latest Comment:</h3>
      <p>${report.comments[report.comments.length - 1].text}</p>
    ` : ''}
    <a href="${process.env.FRONTEND_URL}/reports/${report._id}" class="button">View Report</a>
    <p>Thank you for helping improve our community!</p>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Report Status Update: ${statusMessages[newStatus]} - NagarNirman`,
    html: emailTemplate('Report Status Update', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Report status email sent to:', user.email);
  } catch (error) {
    console.error('Error sending report status email:', error);
  }
};

// Send approval notification email
export const sendApprovalEmail = async (user, approved) => {
  const transporter = createTransporter();

  const content = approved
    ? `
      <p>Hello ${user.name},</p>
      <p>Congratulations! Your application to become a Problem Solver has been approved.</p>
      <p>You can now:</p>
      <ul>
        <li>View and accept assigned tasks</li>
        <li>Submit proof of completed work</li>
        <li>Earn reward points</li>
        <li>Build your reputation in the community</li>
      </ul>
      <a href="${process.env.FRONTEND_URL}/dashboard/solver" class="button">Go to Solver Dashboard</a>
      <p>Thank you for your dedication to improving our community!</p>
    `
    : `
      <p>Hello ${user.name},</p>
      <p>We regret to inform you that your application to become a Problem Solver could not be approved at this time.</p>
      <p>Please feel free to reapply after reviewing our requirements or contact support for more information.</p>
      <a href="${process.env.FRONTEND_URL}/help" class="button">Get Help</a>
    `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: approved
      ? 'Problem Solver Application Approved - NagarNirman'
      : 'Problem Solver Application Status - NagarNirman',
    html: emailTemplate(
      approved ? 'Application Approved!' : 'Application Status',
      content
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Approval email sent to:', user.email);
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};

// Send reward notification email
export const sendRewardEmail = async (user, task, points) => {
  const transporter = createTransporter();

  const content = `
    <p>Hello ${user.name},</p>
    <p>🎉 Congratulations! You've earned <strong>${points} reward points</strong> for completing a task!</p>
    <h3>Completed Task:</h3>
    <ul>
      <li><strong>Title:</strong> ${task.title}</li>
      <li><strong>Points Earned:</strong> ${points}</li>
      <li><strong>Total Points:</strong> ${user.rewardPoints}</li>
    </ul>
    <p>Keep up the great work!</p>
    <a href="${process.env.FRONTEND_URL}/dashboard/solver" class="button">View Dashboard</a>
  `;

  const mailOptions = {
    from: `"NagarNirman" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: '🎉 You Earned Reward Points! - NagarNirman',
    html: emailTemplate('Reward Points Earned!', content),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reward email sent to:', user.email);
  } catch (error) {
    console.error('Error sending reward email:', error);
  }
};

export default {
  sendWelcomeEmail,
  sendTaskAssignmentEmail,
  sendReportStatusEmail,
  sendApprovalEmail,
  sendRewardEmail,
};
