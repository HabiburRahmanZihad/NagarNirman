# 🛠️ NagarNirman Development & Setup Guide

This guide provides comprehensive instructions for setting up the NagarNirman development environment, configuring the application, and contributing to the project.

---

## 💻 Tech Stack Overview

### **Frontend**
- **Next.js 16.0.10** (App Router)
- **React 19.2.0**
- **TypeScript 5.0+**
- **Tailwind CSS 4.1.16** & **DaisyUI 5.4.5**
- **Framer Motion 12.23.24** & **AOS** (Animations)
- **Leaflet 1.9.4** (Maps)
- **Recharts 3.4.1** (Analytics)

### **Backend**
- **Node.js 18+** & **Express.js 4.18.2**
- **MongoDB 6.20.0** (Mongoose)
- **JWT** (Authentication) & **Bcrypt.js** (Hashing)
- **Nodemailer** (Email Service)
- **Cloudinary** (Image CDN)

---

## 📦 Installation

### Prerequisites
- Node.js 18.0+
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Gmail account (with App Password)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/nagarnirman.git
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
Edit `backend/.env` with your credentials (see [Configuration](#-configuration) section).

### Step 4: Start Development Servers

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
Backend running at: `http://localhost:5000`

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```
Frontend running at: `http://localhost:3000`

---

## ⚙️ Configuration

### Backend Environment Variables (`backend/.env`)
- `PORT`: Server port (default 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT (32+ characters)
- `CLIENT_URL`: Frontend URL (e.g., http://localhost:3000)
- `CLOUDINARY_*`: Cloudinary credentials
- `SMTP_*`: Gmail SMTP settings

### Frontend Configuration
Update API endpoint in `frontend/src/constants/index.ts`:
```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
```

---

## 📂 Project Structure

```
nagarnirman/
├── 📂 frontend/        # Next.js Application
│   ├── src/
│   │   ├── app/        # App Router (Pages & Layouts)
│   │   ├── components/ # UI Components
│   │   ├── context/    # State Management (Auth)
│   │   └── utils/      # API Clients & Helpers
├── 📂 backend/         # Express.js API
│   ├── models/         # Mongoose Schemas
│   ├── controllers/    # Business Logic
│   ├── routes/         # API Endpoints
│   ├── middleware/     # Auth & Upload logic
│   └── services/       # Email & USGS integration
└── 📂 Documentation/   # Detailed manuals
```

---

## 🚢 Deployment

### Frontend (Vercel)
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the `frontend` directory.
3. Configure `NEXT_PUBLIC_API_URL` in the Vercel dashboard.

### Backend (Render/Railway)
1. Connect GitHub repository.
2. Build Command: `cd backend && npm install`
3. Start Command: `cd backend && npm start`
4. Add all environment variables from `.env`.

---

## 🧪 Testing

### Automated Tests
```bash
# Backend
cd backend && npm test

# Frontend
npm test
```

### Manual Testing Scripts
- `./test-notification-system.sh`: Validates email notifications.
- `./test-system.sh`: Tests core API workflows.

---

## 🤝 Contributing

1. **Fork** the repo and create a feature branch.
2. Follow **TypeScript** and **ESLint** guidelines.
3. Write **clean, documented code**.
4. Submit a **Pull Request** with a detailed description.

---

## 🔒 Security
- **JWT Auth** & **Password Hashing** (bcryptjs).
- **Role-Based Access Control** (RBAC).
- **Input Validation** & **XSS Protection**.
- **CORS** enabled for specific origins.
