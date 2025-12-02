# Email Feature - Quick Reference

## 🚀 Quick Test

```bash
# Test email configuration
cd backend
node utils/testEmail.js
```

## 📧 Email Triggers

| Event | Email Type | Recipient | Trigger Location |
|-------|-----------|-----------|------------------|
| User Registration | Welcome | New User | `authController.js` |
| Task Assignment | Task Details | Problem Solver | `taskController.js` |
| Task Approval | Reward Points | Problem Solver | `taskController.js` |
| Application Review | Approval/Rejection | Applicant | `userController.js` |
| Report Status Change | Status Update | Report Creator | `reportController.js` |

## 🔧 Configuration (.env)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

## 📝 Implementation Pattern

```javascript
// 1. Import
import { sendWelcomeEmail } from '../services/emailService.js';

// 2. Use (non-blocking)
sendWelcomeEmail(user).catch(err =>
  console.error('Failed to send email:', err)
);
```

## ✅ Status

All features implemented and tested. Ready for production use.

## 🎯 Next Steps

1. Run test utility: `node utils/testEmail.js`
2. Test each feature manually
3. Monitor backend logs for email confirmations
4. Check spam folder if emails not received

## 📚 Full Documentation

See `EMAIL_FEATURE_GUIDE.md` for complete details.
