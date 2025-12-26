<div align="center">

![NagarNirman Logo](frontend/public/logo/logo.png)

**Empowering Citizens to Improve Bangladesh's Infrastructure**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Live Site](https://nagar-nirman.vercel.app) • [Backend Api](https://nagarnirman-backend.onrender.com) • [Documentation](#-documentation) • [Features](#-key-features) • [Installation](#-installation)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles--workflows)
- [Screenshots](#-screenshots)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About

**NagarNirman** is a comprehensive full-stack web platform designed to bridge the gap between citizens and authorities in addressing infrastructure issues across Bangladesh. The platform empowers citizens to report problems, enables authorities to manage and assign tasks efficiently, and allows problem solvers to contribute to community improvement while earning rewards.

### 🎯 Mission

To create a transparent, efficient, and community-driven system for reporting and resolving infrastructure problems, making Bangladesh's cities safer and more livable.

### 🌍 Impact

- **Citizen Engagement**: Easy reporting of infrastructure issues with photo evidence
- **Transparent Tracking**: Real-time status updates and progress monitoring
- **Gamification**: Reward system to encourage active participation
- **Data-Driven Decisions**: Analytics for authorities to prioritize critical issues
- **Community Building**: Collaborative problem-solving ecosystem

---

## ✨ Key Features

### 🔐 **Authentication & Authorization**
- Secure JWT-based authentication
- Role-based access control (4 user roles)
- Password encryption with bcryptjs
- Protected routes and API endpoints
- User profile management

### 📋 **Intelligent Report Management**
- **Create Reports**: Citizens can submit infrastructure problems with:
  - Title, description, and severity levels
  - Multiple image uploads (up to 5 per report)
  - Geolocation with interactive maps
  - Problem categorization (8+ types)
  - Division and district selection
- **Status Tracking**: 5-stage workflow (Pending → Under Review → In Progress → Resolved → Closed)
- **Community Engagement**: Upvoting and commenting system
- **Advanced Filtering**: Search by status, severity, location, and problem type
- **Audit Trail**: Complete history of status changes and updates

### 📝 **Task Assignment System**
- Authorities can assign tasks to verified problem solvers
- Task priority levels (Low, Medium, High, Critical)
- Deadline management with notifications
- Proof submission with photo evidence
- Rating and feedback system
- Automated reward distribution

### 👥 **Comprehensive User System**
- **User Profiles**: Custom avatars, divisions, contact details
- **Problem Solver Applications**: Apply and get verified by authorities
- **Leaderboard**: Top contributors ranked by reward points
- **User Statistics**: Track reports submitted, tasks completed, rewards earned
- **Status Management**: Active/Inactive user control

### 📧 **Email Notification System**
Professional HTML email templates for:
- Welcome emails on registration
- Task assignment notifications
- Report status update alerts
- Problem solver approval/rejection
- Task completion and reward notifications

### 🌍 **Earthquake Monitoring & Alerts**
- Real-time earthquake data integration with USGS API
- Interactive map visualization with Leaflet
- Magnitude-based color coding
- Automatic email alerts for significant events (M4.5+)
- Historical earthquake data access
- Location-based filtering

### 📊 **Analytics & Statistics**
- User activity dashboards
- Report statistics by division/type
- Task completion rates
- Solver performance metrics
- Trend analysis and charts (Recharts)

### 📱 **Modern UI/UX**
- Responsive design for mobile, tablet, and desktop
- Tailwind CSS v4 with DaisyUI components
- Smooth animations with Framer Motion
- AOS (Animate On Scroll) effects
- Interactive Swiper carousels
- React Hot Toast notifications
- Loading states and error handling

### 🗺️ **Interactive Maps**
- Leaflet-based map integration
- Report location visualization
- Earthquake epicenter mapping
- Clickable markers with detailed info

### 📄 **Comprehensive Pages**
- Homepage with hero section and features
- About Us & Team pages
- How It Works guide
- FAQ section
- Contact page
- Privacy Policy & Terms of Service
- Gallery showcase
- Help & Guidelines

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.10 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.0+ | Type safety |
| Tailwind CSS | 4.1.16 | Utility-first styling |
| DaisyUI | 5.4.5 | Component library |
| Framer Motion | 12.23.24 | Animations |
| React Hook Form | 7.66.0 | Form management |
| Leaflet | 1.9.4 | Interactive maps |
| Recharts | 3.4.1 | Data visualization |
| Lucide React | 0.553.0 | Icon library |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.18.2 | Web framework |
| MongoDB | 6.20.0 | NoSQL database |
| JWT | 9.0.2 | Authentication |
| Bcrypt.js | 2.4.3 | Password hashing |
| Nodemailer | 6.9.7 | Email service |
| Node Fetch | 3.3.2 | HTTP requests |

### **Cloud Services**
- **Database**: MongoDB Atlas (Cloud Database)
- **File Storage**: Cloudinary (Image CDN)
- **Email**: Gmail SMTP (Transactional emails)

### **DevOps**
- **Version Control**: Git
- **Package Manager**: npm
- **Development**: Nodemon (Backend), Next.js Dev Server
- **Linting**: ESLint
- **Environment**: dotenv

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account ([Sign up free](https://cloudinary.com/))
- **Gmail** account with App Password ([Setup guide](https://support.google.com/accounts/answer/185833))

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/nagarnirman.git

# Navigate to project directory
cd nagarnirman
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Environment Configuration

Create a `.env` file in the `backend` folder:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials (see [Configuration](#-configuration) section below).

### Step 4: Start Development Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
✅ Backend running at: `http://localhost:5000`

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```
✅ Frontend running at: `http://localhost:3000`

### Step 5: Verify Installation

Test the backend API:
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

Open your browser and visit `http://localhost:3000` to see the application!

---

## ⚙️ Configuration

### Backend Environment Variables

Edit `backend/.env` with the following configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nagarnirman?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:3000

# Cloudinary Configuration (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_app_password

# File Upload Settings
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif,image/webp
```

### Getting Credentials

#### 1️⃣ MongoDB Atlas Setup
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 tier)
3. Create database user with password
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string: **Connect** → **Connect your application**
6. Replace `<username>`, `<password>`, and database name

#### 2️⃣ Cloudinary Setup
1. Visit [Cloudinary](https://cloudinary.com/) and sign up
2. Navigate to **Dashboard**
3. Copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

#### 3️⃣ Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Navigate to **App passwords**
4. Generate password for "Mail"
5. Copy the 16-digit password

#### 4️⃣ JWT Secret Generation
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend Configuration

Update API endpoint in `frontend/src/constants/index.ts`:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
```

For production, create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

---

## 🚀 Usage

### For Citizens (Regular Users)

1. **Register**: Create an account at `/auth/register`
2. **Login**: Sign in at `/auth/login`
3. **Report Issues**: 
   - Navigate to **Dashboard** → **Create Report**
   - Fill in problem details
   - Upload photos (max 5)
   - Select location and severity
   - Submit report
4. **Track Reports**: View all your reports and their status
5. **Engage**: Comment on and upvote reports
6. **View Leaderboard**: See top problem solvers

### For Authorities

1. **Login**: Use authority account credentials
2. **Review Reports**:
   - View all pending reports
   - Update status (Approve/Reject)
   - Add official comments
3. **Assign Tasks**:
   - Select approved reports
   - Assign to verified problem solvers
   - Set deadlines and priorities
4. **Manage Users**:
   - Approve problem solver applications
   - View user statistics
   - Manage user status
5. **Review Completed Tasks**:
   - Verify proof submissions
   - Grant ratings and rewards

### For Problem Solvers

1. **Apply**: Submit problem solver application
2. **Wait for Approval**: Authority reviews and approves
3. **View Tasks**: Check assigned tasks in dashboard
4. **Accept Tasks**: Accept tasks and start working
5. **Submit Proof**: Upload completion photos
6. **Earn Rewards**: Receive reward points and climb leaderboard

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "division": "Dhaka"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

### Report Endpoints

#### Get All Reports
```http
GET /api/reports?status=pending&severity=high&page=1&limit=10
```

#### Create Report
```http
POST /api/reports
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "Broken street light",
  "description": "Not working for 2 weeks",
  "problemType": "street light",
  "severity": "medium",
  "location": {
    "address": "Dhanmondi 27, Dhaka",
    "division": "Dhaka",
    "district": "Dhaka",
    "coordinates": [90.3742, 23.7461]
  }
}
```

#### Update Report Status
```http
PATCH /api/reports/:id/status
Authorization: Bearer <authority_token>
Content-Type: application/json

{
  "status": "in-progress",
  "comment": "Task assigned to solver"
}
```

### Task Endpoints

#### Assign Task
```http
POST /api/tasks/assign
Authorization: Bearer <authority_token>
Content-Type: application/json

{
  "reportId": "report_id_here",
  "assignedTo": "solver_user_id",
  "priority": "high",
  "deadline": "2026-12-31T23:59:59.000Z",
  "description": "Fix the broken street light"
}
```

#### Complete Task
```http
POST /api/tasks/:id/complete
Authorization: Bearer <solver_token>
Content-Type: multipart/form-data

proofURL: [image file]
comments: "Task completed successfully"
```

### User Endpoints

#### Get Leaderboard
```http
GET /api/users/leaderboard?limit=10
```

#### Apply as Problem Solver
```http
POST /api/users/apply-problem-solver
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "message": "I want to help my community"
}
```

> 📚 **Full API Documentation**: See [API_REFERENCE.md](./API_REFERENCE.md) for complete endpoint list with examples.

---

## 📁 Project Structure

```
nagarnirman/
│
├── 📂 frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── layout.tsx          # Root layout with providers
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── globals.css         # Global styles
│   │   │   ├── auth/               # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/          # Role-based dashboards
│   │   │   │   ├── user/
│   │   │   │   ├── authority/
│   │   │   │   └── solver/
│   │   │   ├── reports/            # Report management
│   │   │   ├── earthquakes/        # Earthquake monitoring
│   │   │   ├── about/              # Static pages
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   └── ...
│   │   │
│   │   ├── components/             # Reusable components
│   │   │   ├── common/             # Common UI components
│   │   │   ├── dashboard/          # Dashboard components
│   │   │   └── ...
│   │   │
│   │   ├── context/                # React Context providers
│   │   │   └── AuthContext.tsx     # Authentication state
│   │   │
│   │   ├── types/                  # TypeScript interfaces
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/              # App constants
│   │   │   ├── index.ts
│   │   │   └── routes.ts
│   │   │
│   │   └── utils/                  # Utility functions
│   │       ├── api.ts              # API client
│   │       └── helpers.ts
│   │
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
├── 📂 backend/                     # Express.js Backend API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js                 # User model
│   │   ├── Report.js               # Report model
│   │   └── Task.js                 # Task model
│   │
│   ├── controllers/                # Business logic
│   │   ├── authController.js       # Auth operations
│   │   ├── reportController.js     # Report operations
│   │   ├── taskController.js       # Task operations
│   │   ├── userController.js       # User operations
│   │   └── earthquakeController.js # Earthquake data
│   │
│   ├── routes/                     # API routes
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── earthquakeRoutes.js
│   │
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                 # JWT verification
│   │   ├── errorHandler.js         # Error handling
│   │   └── upload.js               # File upload (Multer + Cloudinary)
│   │
│   ├── services/                   # External services
│   │   ├── emailService.js         # Email notifications
│   │   └── earthquakeService.js    # USGS API integration
│   │
│   ├── .env.example                # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # Express entry point
│
├── 📂 Documentation/
│   ├── COMPLETE_SETUP_GUIDE.md     # Comprehensive setup guide
│   ├── API_REFERENCE.md            # API documentation
│   ├── FRONTEND_STRUCTURE.md       # Frontend architecture
│   ├── ROUTES.md                   # Route mapping
│   ├── PROJECT_COMPLETE.md         # Project summary
│   └── ...
│
├── .gitignore
├── README.md                       # This file
└── package.json
```

---

## 👥 User Roles & Workflows

### 1️⃣ **Regular User** (Citizen)
**Default role upon registration**

**Permissions**:
- ✅ Create and submit infrastructure reports
- ✅ Upload images with reports
- ✅ View all public reports
- ✅ Comment on reports
- ✅ Upvote reports
- ✅ Track own report status
- ✅ View leaderboard

**Workflow**:
```
Register → Login → Create Report → Track Status → Engage with Community
```

### 2️⃣ **Authority** (Government Official)
**Assigned by system administrator**

**Permissions**:
- ✅ All user permissions
- ✅ Review and approve/reject reports
- ✅ Update report status
- ✅ Assign tasks to problem solvers
- ✅ Review task submissions
- ✅ Grant ratings and rewards
- ✅ View analytics and statistics

**Workflow**:
```
Login → Review Pending Reports → Approve Reports → Assign Tasks → 
Verify Completed Work → Grant Rewards
```

### 3️⃣ **Problem Solver** (Verified Contributor)
**Applied by user, approved by authority**

**Permissions**:
- ✅ All user permissions
- ✅ View assigned tasks
- ✅ Accept tasks
- ✅ Submit proof of completion
- ✅ Earn reward points
- ✅ Appear on leaderboard

**Workflow**:
```
Apply as Solver → Wait for Approval → View Assigned Tasks → 
Accept Task → Complete Work → Submit Proof → Earn Rewards
```

### 4️⃣ **Super Admin** (System Manager)
**Highest level unique access**

**Permissions**:
- ✅ **Full System Access**
- ✅ Manage all user roles (User → Authority)
- ✅ Manage system configuration
- ✅ Database backups and restoration
- ✅ View global audit logs
- ✅ Resolve complex disputes
- ✅ Manage platform content (banners, announcements)

**Workflow**:
```
System Config → User Role Management → Platform Oversight → Security Audits
```


---

## 📸 Screenshots

### Homepage
![Homepage Hero Section](https://res.cloudinary.com/dvq3pcykn/image/upload/Screenshot_2025-12-26_145228_ghmqkj.png)
*Clean, modern homepage with call-to-action*

### Dashboard
![User Dashboard](https://res.cloudinary.com/dvq3pcykn/image/upload/Screenshot_2025-12-26_145405_am4bka.png)
*Role-based dashboard with statistics and quick actions*

### Report Creation
![Create Report Form](https://via.placeholder.com/800x400/f2a921/ffffff?text=Report+Creation+Form)
*Easy-to-use form with image upload and location selection*

### Interactive Map
![Map View](https://via.placeholder.com/800x400/81d586/ffffff?text=Interactive+Map+with+Reports)
*Leaflet-powered map showing all reports and earthquakes*

### Leaderboard
![Leaderboard](https://via.placeholder.com/800x400/aef452/333333?text=Top+Problem+Solvers)
*Gamified leaderboard showcasing top contributors*

---

## 📚 Documentation

Comprehensive documentation is available:

| Document | Description | Link |
|----------|-------------|------|
| **Complete Setup Guide** | Detailed installation and configuration | [COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md) |
| **Quick Start Guide** | Email & Notification System Manual | [QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md) |
| **API Reference** | All API endpoints with examples | [API_REFERENCE.md](./API_REFERENCE.md) |
| **API Testing Guide** | Task Workflow Validation Manual | [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) |
| **Frontend Structure** | Component architecture and state management | [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) |
| **Routes Map** | Complete route mapping | [ROUTES.md](./ROUTES.md) |
| **Frontend Documentation** | Components and Design System | [frontend/README.md](./frontend/README.md) |
| **Backend Documentation** | Detailed backend architecture | [backend/README.md](./backend/README.md) |
| **Security Policy** | Legal protocols & copyright | [SECURITY.md](./SECURITY.md) |

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel
```

3. **Environment Variables**:
Add in Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

### Backend Deployment (Railway/Render/Heroku)

#### Using Railway:

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login and Deploy**:
```bash
cd backend
railway login
railway init
railway up
```

3. **Add Environment Variables** in Railway dashboard

#### Using Render:

1. Create new Web Service
2. Connect GitHub repository
3. Build command: `cd backend && npm install`
4. Start command: `cd backend && npm start`
5. Add environment variables

### MongoDB Atlas (Production)

1. Upgrade to M10+ cluster for production
2. Enable IP whitelist for deployment platform
3. Set up automated backups
4. Configure monitoring and alerts

### Post-Deployment Checklist

- [ ] Update `CLIENT_URL` in backend `.env`
- [ ] Update `NEXT_PUBLIC_API_URL` in frontend
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (64+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domains
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (Winston, Morgan)
- [ ] Enable rate limiting
- [ ] Set up monitoring (UptimeRobot)

---

## 🤝 Contributing

We welcome contributions to NagarNirman! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
```bash
git clone https://github.com/yourusername/nagarnirman.git
```

2. **Create Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make Changes**
- Write clean, documented code
- Follow existing code style
- Add tests if applicable

4. **Commit Changes**
```bash
git commit -m "Add amazing feature"
```

5. **Push to Branch**
```bash
git push origin feature/amazing-feature
```

6. **Open Pull Request**
- Provide clear description
- Reference any related issues
- Wait for code review

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Document new features
- Update README if needed

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- 🌐 Internationalization (i18n)
- ♿ Accessibility improvements

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| **Total Files** | 130+ |
| **Lines of Code** | 8,000+ |
| **Frontend Components** | 40+ |
| **Backend Endpoints** | 35+ |
| **User Roles** | 4 |
| **Database Models** | 3 |
| **API Routes** | 5 |
| **Email Templates** | 5 |
| **Documentation Files** | 30+ |

---

## 🔒 Security

### Implemented Security Features

- ✅ **Password Hashing**: bcryptjs with 10 salt rounds
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-Based Access Control**: Granular permissions
- ✅ **Input Validation**: Express-validator middleware
- ✅ **CORS Configuration**: Controlled cross-origin requests
- ✅ **File Upload Validation**: Type and size restrictions
- ✅ **Environment Variables**: Sensitive data protection
- ✅ **SQL Injection Prevention**: Mongoose parameterized queries
- ✅ **XSS Protection**: Input sanitization

### Security Best Practices

- Change default JWT_SECRET in production
- Use HTTPS in production
- Enable rate limiting
- Regularly update dependencies
- Monitor for vulnerabilities
- Implement CSP headers
- Use secure cookies for tokens

### Reporting Vulnerabilities

If you discover a security vulnerability, please email us at security@nagarnirman.com instead of using the issue tracker.

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
npm test
```

### Manual Testing

Use the included test scripts:

```bash
# Test notification system
./test-notification-system.sh

# Test complete API
./test-system.sh
```

### Testing Checklist

- [ ] User registration and login
- [ ] Report creation with images
- [ ] Task assignment workflow
- [ ] Email notifications
- [ ] Role-based access control
- [ ] File uploads to Cloudinary
- [ ] Earthquake data fetching
- [ ] Leaderboard rankings
- [ ] Map functionality

---

## 📈 Roadmap

### Version 2.0 (Planned)

- [ ] Real-time notifications with WebSockets
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Google Maps integration
- [ ] Multi-language support (Bengali, English)
- [ ] SMS notifications
- [ ] QR code scanning for reports
- [ ] Offline mode support
- [ ] Social media integration

### Version 3.0 (Future)

- [ ] AI-powered problem detection
- [ ] Blockchain for transparency
- [ ] IoT sensor integration
- [ ] Predictive maintenance
- [ ] Government API integration
- [ ] Budget tracking
- [ ] Contractor management
- [ ] Public polls and voting

---

## � Meet the Dream Team

<div align="center">

| | | | |
|:---:|:---:|:---:|:---:|
| <img src="https://res.cloudinary.com/dvq3pcykn/image/upload/WhatsApp_Image_2025-12-18_at_16.09.59_fqnwho.jpg" width="160" height="160" style="border-radius: 50%"> <br> **Habibur Rahman Zihad** <br> <sub>Founder & Community Director</sub> <br> *Vision & Strategy Lead* <br> [GitHub](https://github.com/HabiburRahmanZihad) • [LinkedIn](https://linkedin.com/in/habiburrahmanzihad) | <img src="https://avatars.githubusercontent.com/u/102473526?v=4" width="160" height="160" style="border-radius: 50%"> <br> **Md. Shahariar Hafiz** <br> <sub>Co-Founder & Tech Lead</sub> <br> *Full Stack & Architecture* <br> [GitHub](https://github.com/mdshahariarhafizofficial) • [LinkedIn](https://www.linkedin.com/in/devshahariarhafiz) | <img src="https://avatars.githubusercontent.com/u/193724330?v=4" width="160" height="160" style="border-radius: 50%"> <br> **MD Mizanur Malita** <br> <sub>Operations Manager</sub> <br> *Process & Quality Lead* <br> [GitHub](https://github.com/mizanur2734) • [LinkedIn](https://www.linkedin.com/in/md-mizanur-malita) | <img src="https://res.cloudinary.com/dfm0bhtyb/image/upload/v1765699151/qmbjzklvweuy3brrnt3v.png" width="160" height="160" style="border-radius: 50%"> <br> **Mohammad Bin Amin** <br> <sub>Outreach Coordinator</sub> <br> *Community & Growth Lead* <br> [GitHub](https://github.com/Mohammad7558/) • [LinkedIn](https://www.linkedin.com/in/iammohammad) |

</div>

---

## �🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **MongoDB** - Powerful NoSQL database
- **Cloudinary** - Image CDN and optimization
- **USGS** - Earthquake data API
- **Tailwind CSS** - Utility-first styling
- **DaisyUI** - Beautiful components
- **All Contributors** - Thank you for your support!

---

## 📄 License

**© 2026 NagarNirman. All Rights Reserved.**

This project is **PROPRIETARY** and is protected by copyright laws. 
Unauthorized copying, modification, distribution, or use of this software is strictly prohibited. 
See the [SECURITY.md](SECURITY.md) file for more details.

---

## 📞 Contact & Support

### Project Team

- **Email**: support@nagarnirman.com
- **Website**: [www.nagarnirman.com](#)
- **GitHub**: [github.com/nagarnirman/nagarnirman](#)

### Get Help

- 📖 [Documentation](./COMPLETE_SETUP_GUIDE.md)
- 💬 [Discussions](#)
- 🐛 [Report Bug](#)
- 💡 [Request Feature](#)

---

## ⭐ Show Your Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🍴 Forking and contributing
- 📣 Sharing with others
- 💰 Sponsoring development

---

<div align="center">

### 🏗️ Built with ❤️ for Bangladesh

**Report • Resolve • Rebuild**

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/yourusername/nagarnirman)

**[⬆ Back to Top](#-nagarnirman---report-resolve-rebuild)**

</div>

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Complete authentication system
- ✅ Report management with image uploads
- ✅ Task assignment system
- ✅ Email notifications
- ✅ Earthquake monitoring
- ✅ Leaderboard and rewards
- ✅ Responsive UI with Tailwind CSS
- ✅ Comprehensive documentation

---

**Last Updated**: December 2026  
**Status**: Production Ready ✅
