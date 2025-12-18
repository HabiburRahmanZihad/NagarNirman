# ⚙️ NagarNirman Backend API

<div align="center">

![NagarNirman Logo](../frontend/public/logo/logo.png)

**The Robust Engine Powering Bangladesh's Infrastructure Platform**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-purple?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue?style=flat-square&logo=cloudinary)](https://cloudinary.com/)

</div>

---

## 📖 Overview

The **NagarNirman Backend** is a scalable RESTful API built with **Node.js** and **Express**. It handles the complex logic for user management, report processing, task assignment, and real-time data flow, serving as the backbone of the NagarNirman platform.

### 🌟 Key Features

- **🔐 Secure Authentication**: JWT-based stateless authentication with role-based authorization guards.
- **📋 Report Management**: Complex CRUD operations for reports with geo-tagging and status workflows.
- **💾 Media Handling**: Seamless image uploads using Multer and Cloudinary storage.
- **📧 Notification System**: Automatic email alerts via Nodemailer for critical actions.
- **🌍 Geospatial Data**: Location-based queries and organization of reports.
- **🛡️ Security**: Helmet headers, CORS policies, and input validation to preventing common attacks.
- **📊 Analytics Engine**: Aggregation pipelines for user statistics and leaderboard generation.

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- Cloudinary Account
- Gmail/SMTP Account

### 1. Clone & Install
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `backend` directory based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nagarnirman

# Authentication
JWT_SECRET=your_super_secure_secret_key
JWT_EXPIRE=30d

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Client
CLIENT_URL=http://localhost:3000
```

### 3. Start Server
```bash
# Development (with Nodemon)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `POST` | `/register` | Register new user | Public |
| `POST` | `/login` | Authenticate user & get token | Public |
| `GET` | `/me` | Get current user profile | Private |
| `PUT` | `/profile` | Update profile details | Private |

### 📋 Reports (`/api/reports`)
| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `POST` | `/` | Create new infrastructure report | Private |
| `GET` | `/` | Get all reports (with filters) | Public |
| `GET` | `/:id` | Get single report details | Public |
| `PATCH` | `/:id/status` | Update status (Pending → Resolved) | Authority |
| `POST` | `/:id/upvote` | Upvote a report | Private |

### 🛠️ Tasks (`/api/tasks`)
| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `POST` | `/assign` | Assign report to solver | Authority |
| `GET` | `/my-tasks` | Get assigned tasks | Solver |
| `POST` | `/:id/complete` | Submit proof of completion | Solver |
| `POST` | `/:id/reward` | Approve & grant points | Authority |

### 👥 Users (`/api/users`)
| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/leaderboard` | Get top problem solvers | Public |
| `POST` | `/apply-problem-solver` | Apply for solver role | Private |
| `PATCH` | `/:id/approve` | Approve solver application | Authority |

---

## 📁 Project Structure

```
backend/
├── config/           # Database & external service config
├── controllers/      # Request handlers (Business logic)
├── middleware/       # Auth checks, error handling, uploaders
├── models/           # Mongoose schemas (User, Report, Task)
├── routes/           # API Route definitions
├── services/         # Logic for Email, Earthquake API
├── utils/            # Helper functions
└── server.js         # App entry point
```

---

## 🗃️ Data Models

### User
Extends to 4 roles: `user`, `authority`, `problemSolver`, `ngo`. Tracks reputation points.

### Report
Contains `title`, `description`, `images` (array), `location` (Lat/Lng), and `status` history.

### Task
Links `Report` to `User` (Solver). Tracks `deadlines`, `priority`, and `proof` submissions.

---

## 🧪 Testing

```bash
# Run basic health check
curl http://localhost:5000/api/health
```

Use the provided `test-system.sh` script in the root directory for automated testing of endpoints.

---

<div align="center">

**[⬅ Back to Main Project](../README.md)**

</div>
