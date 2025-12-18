<div align="center">

![NagarNirman Logo](frontend/public/logo/logo.png)

**Complete Installation & Configuration Manual**

</div>

## 🎯 Project Overview

**NagarNirman** (NN) is a full-stack citizen-powered platform for reporting and resolving infrastructure issues in Bangladesh.

### Tech Stack
- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4, React 19
- **Backend**: Node.js, Express.js, MongoDB, JWT Authentication
- **File Storage**: Cloudinary
- **Email**: Nodemailer

---

## 📦 Installation Guide

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Gmail account (for email service)

### Step 1: Clone and Install

```bash
# Navigate to project
cd nagar-nirman

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Backend Configuration

**Create `.env` file in backend folder:**

```bash
cd backend
cp .env.example .env
```

**Edit `backend/.env` with your credentials:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nagarnirman?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Client URL (Frontend)
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Other Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png
```

### Step 3: Get Required Credentials

#### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Replace `<username>`, `<password>`, and database name
6. Add to `.env` as `MONGODB_URI`

#### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com/)
2. Create free account
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Add to `.env`

#### Gmail App Password Setup
1. Go to [Google Account](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Generate new
4. Copy 16-digit password
5. Add to `.env` as `SMTP_USER` and `SMTP_PASS`

#### JWT Secret Generation
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy output and add to `.env` as `JWT_SECRET`

### Step 4: Frontend Configuration

**Update API endpoint in `src/constants/index.ts`:**

```typescript
export const API_BASE_URL = 'http://localhost:5000/api';
```

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
✅ Backend running on: http://localhost:5000

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```
✅ Frontend running on: http://localhost:3000

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
npm run build
npm start
```

---

## ✅ Verify Installation

### Test Backend
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running"
}
```

### Test Frontend
Visit: http://localhost:3000

You should see the homepage with:
- Hero section
- Features grid
- Statistics
- Route exploration cards

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints Summary

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (Protected)
- `PUT /profile` - Update profile (Protected)
- `PUT /change-password` - Change password (Protected)

#### Reports (`/api/reports`)
- `GET /` - Get all reports (Public)
- `GET /:id` - Get single report (Public)
- `POST /` - Create report (Protected)
- `PUT /:id` - Update report (Protected)
- `DELETE /:id` - Delete report (Protected)
- `PATCH /:id/status` - Update status (Authority)
- `POST /:id/comment` - Add comment (Protected)
- `POST /:id/upvote` - Upvote report (Protected)
- `GET /user/:userId` - Get user's reports (Protected)

#### Tasks (`/api/tasks`)
- `GET /` - Get all tasks (Authority)
- `GET /:id` - Get single task (Protected)
- `POST /assign` - Assign task (Authority)
- `PATCH /:id/status` - Update status (Protected)
- `POST /:id/complete` - Mark complete (Solver)
- `POST /:id/reward` - Grant reward (Authority)
- `GET /my-tasks` - Get my tasks (Protected)

#### Users (`/api/users`)
- `GET /` - Get all users (Authority)
- `GET /:id` - Get single user (Protected)
- `GET /:id/stats` - Get user stats (Protected)
- `GET /leaderboard` - Get leaderboard (Public)
- `POST /apply-problem-solver` - Apply to be solver (Protected)
- `PATCH /:id/approve` - Approve user (Authority)
- `PATCH /:id/status` - Update status (Authority)

---

## 🧪 Testing the Application

### 1. Register a User

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "01712345678",
    "division": "Dhaka"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### 2. Login

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create a Report (with authentication)

**cURL:**
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken street light",
    "description": "Street light not working for 2 weeks",
    "problemType": "street light",
    "severity": "medium",
    "location": {
      "address": "Dhanmondi 27, Dhaka",
      "division": "Dhaka",
      "district": "Dhaka",
      "coordinates": [90.3742, 23.7461]
    }
  }'
```

### 4. Get All Reports

**cURL:**
```bash
curl http://localhost:5000/api/reports
```

**With filters:**
```bash
curl "http://localhost:5000/api/reports?status=pending&severity=high&page=1&limit=10"
```

---

## 🎭 User Roles & Permissions

| Role | Description | Permissions |
|------|-------------|-------------|
| **user** | Regular citizen | Create reports, comment, upvote |
| **problemSolver** | Verified problem solver | All user permissions + Accept tasks, submit proof, earn rewards |
| **authority** | Government official | All user permissions + Approve reports, assign tasks, manage users |
| **superAdmin** | System Administrator | Full system access + Manage roles, system config, audits |

### Role Flow
1. User registers (default role: `user`)
2. User applies to be problem solver (`POST /api/users/apply-problem-solver`)
3. Authority approves application (`PATCH /api/users/:id/approve`)
4. User becomes `problemSolver` with `isApproved: true`

---

## 📂 Project Structure

### Frontend Structure
```
src/
├── app/
│   ├── layout.tsx                 # Root layout with AuthProvider
│   ├── page.tsx                   # Homepage with routes
│   ├── globals.css                # Global styles
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── register/page.tsx      # Register page
│   ├── dashboard/
│   │   ├── user/page.tsx          # User dashboard
│   │   ├── authority/page.tsx     # Authority dashboard
│   │   └── solver/page.tsx        # Solver dashboard
│   └── reports/
│       └── page.tsx               # Reports listing
├── components/
│   └── common/
│       ├── Navbar.tsx             # Navigation with role-based links
│       ├── Footer.tsx             # Footer with links
│       ├── Button.tsx             # Reusable button
│       ├── Card.tsx               # Reusable card
│       ├── Input.tsx              # Form input
│       └── Loading.tsx            # Loading spinner
├── context/
│   └── AuthContext.tsx            # Authentication state
├── types/
│   └── index.ts                   # TypeScript interfaces
├── constants/
│   ├── index.ts                   # App constants
│   └── routes.ts                  # Route constants
└── utils/
    ├── api.ts                     # API client
    └── helpers.ts                 # Helper functions
```

### Backend Structure
```
backend/
├── config/
│   └── db.js                      # MongoDB connection
├── models/
│   ├── User.js                    # User schema
│   ├── Report.js                  # Report schema
│   └── Task.js                    # Task schema
├── controllers/
│   ├── authController.js          # Auth logic
│   ├── reportController.js        # Report logic
│   ├── taskController.js          # Task logic
│   └── userController.js          # User logic
├── routes/
│   ├── authRoutes.js              # Auth endpoints
│   ├── reportRoutes.js            # Report endpoints
│   ├── taskRoutes.js              # Task endpoints
│   └── userRoutes.js              # User endpoints
├── middleware/
│   ├── auth.js                    # JWT auth
│   ├── errorHandler.js            # Error handling
│   └── upload.js                  # File upload
├── services/
│   └── emailService.js            # Email notifications
├── .env.example                   # Env template
├── package.json                   # Dependencies
└── server.js                      # Entry point
```

---

## 🎨 Color Scheme

```css
Primary: #81d586
Secondary: #aef452
Accent: #f2a921
```

Used throughout the app for branding consistency.

---

## 🐛 Troubleshooting

### Backend won't start
**Issue**: Server error on startup

**Solutions**:
- Check if MongoDB URI is correct
- Verify port 5000 is not in use
- Ensure all env variables are set
- Check Node.js version (18+)

### Database connection fails
**Issue**: Cannot connect to MongoDB

**Solutions**:
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for dev)
- Verify database user credentials
- Test connection string format
- Check internet connection

### Image upload fails
**Issue**: Cannot upload images

**Solutions**:
- Verify Cloudinary credentials
- Check file size (max 5MB)
- Ensure supported format (JPEG, PNG, GIF, WebP)
- Check Cloudinary quota

### Emails not sending
**Issue**: No email notifications

**Solutions**:
- Verify Gmail App Password (not regular password)
- Check EMAIL_HOST and EMAIL_PORT
- Enable 2FA on Gmail account
- Check spam folder

### Frontend API calls fail
**Issue**: Network errors in frontend

**Solutions**:
- Verify backend is running on port 5000
- Check API_BASE_URL in constants
- Check CORS settings in backend
- Check browser console for errors

---

## 📚 Additional Documentation

- **Backend API**: `backend/README.md`
- **Frontend Structure**: `FRONTEND_STRUCTURE.md`
- **Routes Map**: `ROUTES.md`

---

## 🎯 Next Steps

### For Development
1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Start both servers
4. ✅ Test authentication flow
5. ✅ Create sample reports
6. ✅ Test all features

### For Production
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure production MongoDB cluster
4. Set up proper domain URLs
5. Enable HTTPS
6. Set up monitoring and logging
7. Configure backup strategy

### Feature Enhancements
- Add image preview before upload
- Implement real-time notifications (Socket.io)
- Add map view for reports (Google Maps)
- Implement advanced search and filters
- Add report analytics dashboard
- Create mobile app (React Native)

---

## 📞 Support

If you encounter issues:
1. Check this documentation
2. Review error messages
3. Check environment variables
4. Verify credentials
5. Test API endpoints individually

---

## 🎉 Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected successfully
- [ ] Health check endpoint working
- [ ] User registration successful
- [ ] User login successful
- [ ] Report creation working
- [ ] Image upload working
- [ ] Email notifications working
- [ ] Authentication protected routes working

---

**Built with ❤️ for Bangladesh**

Report, Resolve, Rebuild! 🏗️
