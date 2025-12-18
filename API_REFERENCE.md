# API Quick Reference - NagarNirman

<div align="center">

![NagarNirman Logo](frontend/public/logo/logo.png)

**Comprehensive API Documentation**

</div>

Base URL: `http://localhost:5000/api`

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01712345678",
  "division": "Dhaka"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "01798765432",
  "avatar": "https://..."
}
```

### Change Password
```http
PUT /auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

---

## 📋 Report Endpoints

### Get All Reports
```http
GET /reports
GET /reports?status=pending&severity=high&page=1&limit=10
```

### Get Single Report
```http
GET /reports/:id
```

### Create Report
```http
POST /reports
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Broken street light",
  "description": "Street light not working for 2 weeks",
  "problemType": "street light",
  "severity": "medium",
  "location": {
    "address": "Dhanmondi 27, Dhaka",
    "division": "Dhaka",
    "district": "Dhaka",
    "coordinates": [90.3742, 23.7461]
  },
  "images": ["https://cloudinary.com/..."]
}
```

### Update Report
```http
PUT /reports/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "severity": "high"
}
```

### Delete Report
```http
DELETE /reports/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Report Status (Authority Only)
```http
PATCH /reports/:id/status
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "approved",
  "comment": "Approved for resolution"
}
```

### Add Comment
```http
POST /reports/:id/comment
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "text": "This issue needs urgent attention"
}
```

### Upvote Report
```http
POST /reports/:id/upvote
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get User's Reports
```http
GET /reports/user/:userId
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📝 Task Endpoints

### Get All Tasks (Authority Only)
```http
GET /tasks
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Single Task
```http
GET /tasks/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Assign Task (Authority Only)
```http
POST /tasks/assign
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Fix broken street light",
  "description": "Replace the street light bulb",
  "reportId": "report_id_here",
  "assignedTo": "user_id_here",
  "deadline": "2026-12-31",
  "priority": "high",
  "rewardPoints": 50
}
```

### Update Task Status
```http
PATCH /tasks/:id/status
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "in-progress"
}
```

### Complete Task (Solver Only)
```http
POST /tasks/:id/complete
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "proofURL": "https://cloudinary.com/proof-image.jpg",
  "notes": "Task completed successfully"
}
```

### Grant Reward (Authority Only)
```http
POST /tasks/:id/reward
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "rating": 5,
  "feedback": "Excellent work!"
}
```

### Get My Tasks
```http
GET /tasks/my-tasks
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👥 User Endpoints

### Get All Users (Authority Only)
```http
GET /users
Authorization: Bearer YOUR_JWT_TOKEN
GET /users?role=problemSolver&isApproved=false
```

### Get Single User
```http
GET /users/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get User Statistics
```http
GET /users/:id/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

### Get Leaderboard (Public)
```http
GET /users/leaderboard
GET /users/leaderboard?limit=20
```

### Apply to be Problem Solver
```http
POST /users/apply-problem-solver
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "skills": "Electrical work, plumbing",
  "experience": "5 years",
  "reason": "Want to help my community"
}
```

### Approve User (Authority Only)
```http
PATCH /users/:id/approve
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "approve": true,
  "comment": "Application approved"
}
```

### Update User Status (Authority Only)
```http
PATCH /users/:id/status
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "isActive": false,
  "reason": "Policy violation"
}
```

---

## 📤 File Upload

### Upload Report with Images
```http
POST /reports
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

title: Broken road
description: Large pothole on main road
problemType: road
severity: high
images: [file1.jpg, file2.jpg]  # Max 5 images, 5MB each
location[address]: Gulshan Avenue, Dhaka
location[division]: Dhaka
location[district]: Dhaka
location[coordinates][0]: 90.4125
location[coordinates][1]: 23.7925
```

**Supported formats**: JPEG, PNG, GIF, WebP
**Max file size**: 5MB per image
**Max images**: 5 per report

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### Pagination Response
```json
{
  "success": true,
  "count": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "data": [ ... ]
}
```

---

## 🔑 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🎭 User Roles

- `user` - Regular citizen
- `authority` - Government official
- `problemSolver` - Verified problem solver (needs approval)
- `superAdmin` - Full system access (root user)

---

## 📍 Available Divisions

Dhaka, Chittagong, Rajshahi, Khulna, Barisal, Sylhet, Rangpur, Mymensingh

---

## 🔍 Problem Types

- road
- drainage
- street light
- waste management
- water supply
- electricity
- public property
- other

---

## ⚠️ Severity Levels

- low
- medium
- high
- urgent

---

## 📈 Report Status Flow

1. `pending` - Initial submission
2. `approved` - Reviewed and approved by authority
3. `in-progress` - Task assigned, work in progress
4. `resolved` - Issue fixed and verified
5. `rejected` - Not approved

---

## 🎯 Task Status Flow

1. `pending` - Task created, not assigned
2. `assigned` - Task assigned to solver
3. `in-progress` - Solver working on it
4. `completed` - Solver submitted proof
5. `verified` - Authority verified completion

---

## 🧪 Testing Tips

### Using cURL
```bash
# Save token to variable
TOKEN="your_jwt_token_here"

# Use in requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me
```

### Using Postman
1. Create environment variable `token`
2. Set in Authorization tab: Bearer Token `{{token}}`
3. Copy token from login response
4. Use in all protected routes

### Using VS Code REST Client
Create a file `api.http`:
```http
@baseUrl = http://localhost:5000/api
@token = your_token_here

### Register
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

### Get Reports
GET {{baseUrl}}/reports
```

---

## 🎉 Quick Start Commands

```bash
# Test health
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","phone":"01712345678","division":"Dhaka"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get reports
curl http://localhost:5000/api/reports

# Get leaderboard
curl http://localhost:5000/api/users/leaderboard
```

---

**For full documentation, see `backend/README.md`**
