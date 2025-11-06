# NagarNirman Backend API

Backend REST API for NagarNirman - A citizen-powered platform for reporting and resolving infrastructure issues in Bangladesh.

## 🚀 Tech Stack

- **Runtime**: Node.js (ES6 Modules)
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 8.0.3
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Other**: CORS, dotenv, express-async-handler

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── reportController.js   # Report management
│   ├── taskController.js     # Task management
│   └── userController.js     # User management
├── middleware/
│   ├── auth.js              # JWT & authorization
│   ├── errorHandler.js      # Error handling
│   └── upload.js            # Image upload (Cloudinary)
├── models/
│   ├── User.js              # User schema
│   ├── Report.js            # Report schema
│   └── Task.js              # Task schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── reportRoutes.js      # Report endpoints
│   ├── taskRoutes.js        # Task endpoints
│   └── userRoutes.js        # User endpoints
├── services/
│   └── emailService.js      # Email notifications
├── .env.example             # Environment variables template
├── package.json             # Dependencies
└── server.js                # Entry point
```

## 🔧 Installation

1. **Clone and navigate to backend**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nagarnirman

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Start the server**:
```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/me` | Private | Get current user |
| PUT | `/profile` | Private | Update profile |
| PUT | `/change-password` | Private | Change password |

### Reports (`/api/reports`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all reports (with pagination) |
| GET | `/:id` | Public | Get single report |
| POST | `/` | Private | Create report |
| PUT | `/:id` | Private (Own) | Update report |
| DELETE | `/:id` | Private (Own) | Delete report |
| PATCH | `/:id/status` | Authority | Update report status |
| POST | `/:id/comment` | Private | Add comment |
| POST | `/:id/upvote` | Private | Upvote report |
| GET | `/user/:userId` | Private | Get user's reports |

### Tasks (`/api/tasks`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Authority | Get all tasks |
| GET | `/:id` | Private | Get single task |
| POST | `/assign` | Authority | Assign task |
| PATCH | `/:id/status` | Private | Update task status |
| POST | `/:id/complete` | Solver (Approved) | Mark task complete |
| POST | `/:id/reward` | Authority | Grant reward |
| GET | `/my-tasks` | Private (Approved) | Get my assigned tasks |

### Users (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Authority | Get all users |
| GET | `/:id` | Private | Get single user |
| GET | `/:id/stats` | Private | Get user statistics |
| GET | `/leaderboard` | Public | Get top problem solvers |
| POST | `/apply-problem-solver` | Private | Apply to be solver |
| PATCH | `/:id/approve` | Authority | Approve user |
| PATCH | `/:id/status` | Authority | Update user status |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Register/Login Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": "https://...",
    "isApproved": true
  }
}
```

### Using Token:
Include in request headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 👤 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `user` | Regular citizen | Report issues, comment, upvote |
| `authority` | Government official | Approve reports, assign tasks, manage users |
| `problemSolver` | Verified solver | Accept & complete tasks, earn rewards |
| `ngo` | NGO member | Similar to problemSolver |

## 📤 File Upload

### Upload Report Images

```bash
POST /api/reports
Content-Type: multipart/form-data

{
  "title": "Broken road",
  "description": "...",
  "images": [file1.jpg, file2.jpg],  # Max 5 images, 5MB each
  "location": {...}
}
```

Supported formats: JPEG, PNG, GIF, WebP
Max file size: 5MB per image
Max images: 5 per report

## 📧 Email Notifications

Automated emails are sent for:

1. **Welcome Email** - When user registers
2. **Task Assignment** - When task is assigned to solver
3. **Report Status Update** - When report status changes
4. **Approval Notification** - When solver application is approved/rejected
5. **Reward Notification** - When solver earns points

## 📊 Sample API Usage

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "01712345678",
    "division": "Dhaka"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Report (with token)
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

### Get Reports (with filters)
```bash
curl "http://localhost:5000/api/reports?status=pending&severity=high&page=1&limit=10"
```

## 🧪 Testing

Test the API using:

1. **Postman**: Import the collection (coming soon)
2. **cURL**: Use examples above
3. **VS Code REST Client**: Create `.http` files

### Health Check:
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

## 🗃️ Database Schema

### User Model
- name, email, password (hashed)
- phone, avatar, division
- role: user | authority | problemSolver | ngo
- isApproved (for problemSolver/ngo)
- rewardPoints, solvedIssues
- createdAt, updatedAt

### Report Model
- title, description, images[]
- problemType, severity, status
- location (address, division, district, coordinates)
- upvotes[], comments[]
- createdBy, assignedTo
- history[] (status changes)
- createdAt, updatedAt

### Task Model
- title, description
- report (reference)
- assignedTo, assignedBy
- status, priority, deadline
- proofURL, completedAt
- rewardPoints, rating
- createdAt, updatedAt

## 🛠️ Development

### Run in Development Mode:
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

### Linting:
```bash
npm run lint
```

### Environment Variables:
Never commit `.env` file. Always use `.env.example` as template.

## 🚨 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ CORS configuration
- ✅ File upload validation
- ✅ Rate limiting (recommended to add)

## 📝 Notes

- API runs on port 5000 by default
- Uses ES6 module syntax (`import`/`export`)
- MongoDB connection with retry logic
- Cloudinary for image storage (auto-optimization)
- Email service uses Nodemailer (configure SMTP)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is part of NagarNirman platform.

---

**Built with ❤️ for Bangladesh**

For frontend documentation, see [FRONTEND_STRUCTURE.md](../FRONTEND_STRUCTURE.md)
