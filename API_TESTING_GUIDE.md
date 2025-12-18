# 🧪 Task Workflow API Testing Guide

<div align="center">

![NagarNirman Logo](frontend/public/logo/logo.png)

**Task Workflow Validation Manual**

</div>

## Base URL
```
http://localhost:5000
```

## Authentication
All requests require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🔄 Complete Workflow Test Sequence

### Step 1: Login as Problem Solver
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "solver@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "solver_id",
    "role": "problemSolver",
    ...
  }
}
```

### Step 2: Get My Tasks
```http
GET /api/tasks/my-tasks
Authorization: Bearer <solver_token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "task_id",
      "title": "Clean Drainage System",
      "status": "assigned",
      "progress": 50,
      ...
    }
  ]
}
```

### Step 3: Accept Task
```http
POST /api/tasks/<task_id>/accept
Authorization: Bearer <solver_token>

Response:
{
  "success": true,
  "message": "Task accepted successfully",
  "data": {
    "_id": "task_id",
    "status": "accepted",
    "progress": 75,
    "acceptedAt": "2024-12-14T10:30:00.000Z",
    ...
  }
}
```

### Step 4: Start Task
```http
POST /api/tasks/<task_id>/start
Authorization: Bearer <solver_token>

Response:
{
  "success": true,
  "message": "Task started successfully",
  "data": {
    "_id": "task_id",
    "status": "in-progress",
    "progress": 75,
    "startedAt": "2024-12-14T10:35:00.000Z",
    ...
  }
}
```

### Step 5: Submit Proof
```http
POST /api/tasks/<task_id>/submit-proof
Authorization: Bearer <solver_token>
Content-Type: application/json

{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
  ],
  "description": "Cleaned the drainage system completely. Removed all debris and sanitized the area. Used proper tools and safety equipment."
}

Response:
{
  "success": true,
  "message": "Proof submitted successfully. Awaiting review.",
  "data": {
    "_id": "task_id",
    "status": "submitted",
    "progress": 90,
    "submittedAt": "2024-12-14T12:00:00.000Z",
    "proof": {
      "images": [...],
      "description": "Cleaned the drainage...",
      "submittedAt": "2024-12-14T12:00:00.000Z"
    },
    ...
  }
}
```

### Step 6: Login as Authority
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "authority@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "authority_id",
    "role": "authority",
    ...
  }
}
```

### Step 7: Get Pending Review Tasks
```http
GET /api/tasks/review/pending?page=1&limit=10
Authorization: Bearer <authority_token>

Response:
{
  "success": true,
  "data": [
    {
      "_id": "task_id",
      "title": "Clean Drainage System",
      "status": "submitted",
      "progress": 90,
      "proof": {
        "images": [...],
        "description": "...",
        "submittedAt": "..."
      },
      "assignedTo": {
        "_id": "solver_id",
        "name": "John Doe",
        "email": "solver@example.com"
      },
      "report": {
        "_id": "report_id",
        "title": "...",
        ...
      },
      ...
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalTasks": 1
  }
}
```

### Step 8A: Approve Task
```http
POST /api/tasks/<task_id>/approve
Authorization: Bearer <authority_token>
Content-Type: application/json

{
  "points": 50,
  "rating": 5,
  "feedback": "Excellent work! Very thorough cleanup. Keep it up!"
}

Response:
{
  "success": true,
  "message": "Task approved successfully. Points awarded to problem solver.",
  "data": {
    "_id": "task_id",
    "status": "completed",
    "progress": 100,
    "reviewStatus": "approved",
    "points": 50,
    "rating": 5,
    "feedback": "Excellent work!...",
    "completedAt": "2024-12-14T14:00:00.000Z",
    ...
  }
}
```

### Step 8B: Reject Task (Alternative)
```http
POST /api/tasks/<task_id>/reject
Authorization: Bearer <authority_token>
Content-Type: application/json

{
  "rejectionReason": "The images are blurry and don't clearly show the completed work. Please retake photos in better lighting and include before/after shots."
}

Response:
{
  "success": true,
  "message": "Task rejected. Reason sent to problem solver for resubmission.",
  "data": {
    "_id": "task_id",
    "status": "rejected",
    "progress": 75,
    "reviewStatus": "rejected",
    "rejectionReason": "The images are blurry...",
    "resubmissionCount": 1,
    ...
  }
}
```

### Step 9: Resubmit (After Rejection)
```http
POST /api/tasks/<task_id>/submit-proof
Authorization: Bearer <solver_token>
Content-Type: application/json

{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
  ],
  "description": "Resubmitting with clearer images taken in daylight. Included before and after shots as requested."
}

Response:
{
  "success": true,
  "message": "Proof submitted successfully. Awaiting review.",
  "data": {
    "_id": "task_id",
    "status": "submitted",
    "progress": 90,
    "resubmissionCount": 1,
    ...
  }
}
```

## 📋 API Endpoint Reference

### Problem Solver/NGO Endpoints

#### 1. Get My Tasks
```http
GET /api/tasks/my-tasks
Authorization: Bearer <token>
```

#### 2. Accept Task
```http
POST /api/tasks/:id/accept
Authorization: Bearer <token>
```

#### 3. Start Task
```http
POST /api/tasks/:id/start
Authorization: Bearer <token>
```

#### 4. Submit Proof
```http
POST /api/tasks/:id/submit-proof
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "images": [String],     // Array of base64 image strings
  "description": String   // Required, min 10 characters
}
```

### Authority/SuperAdmin Endpoints

#### 5. Get Pending Review Tasks
```http
GET /api/tasks/review/pending?page=<number>&limit=<number>
Authorization: Bearer <token>
```

#### 6. Approve Task
```http
POST /api/tasks/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "points": Number,      // Optional (auto-calculated if omitted)
  "rating": Number,      // Optional (1-5)
  "feedback": String     // Optional
}
```

#### 7. Reject Task
```http
POST /api/tasks/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "rejectionReason": String  // Required
}
```

## 🧪 Test Cases

### Happy Path Test
```
1. ✅ Login as solver
2. ✅ Get tasks (see assigned task)
3. ✅ Accept task (status: accepted, progress: 75%)
4. ✅ Start task (status: in-progress)
5. ✅ Submit proof (status: submitted, progress: 90%)
6. ✅ Login as authority
7. ✅ Get pending tasks (see submitted task)
8. ✅ Approve task (status: completed, progress: 100%, points awarded)
```

### Rejection Flow Test
```
1. ✅ Login as solver
2. ✅ Get tasks (see assigned task)
3. ✅ Accept and start task
4. ✅ Submit proof
5. ✅ Login as authority
6. ✅ Get pending tasks
7. ✅ Reject task (status: rejected, progress: 75%, reason provided)
8. ✅ Login as solver
9. ✅ See rejection reason
10. ✅ Resubmit proof (resubmissionCount: 1)
11. ✅ Login as authority
12. ✅ Approve resubmission
```

### Error Case Tests

#### Test 1: Submit proof without images
```http
POST /api/tasks/<task_id>/submit-proof
Body: {
  "images": [],
  "description": "Work completed"
}

Expected Response: 400 Bad Request
{
  "success": false,
  "message": "At least one proof image is required"
}
```

#### Test 2: Accept already accepted task
```http
POST /api/tasks/<task_id>/accept

Expected Response: 400 Bad Request
{
  "success": false,
  "message": "Task is not in a state to be accepted"
}
```

#### Test 3: Submit proof before starting
```http
POST /api/tasks/<assigned_task_id>/submit-proof

Expected Response: 400 Bad Request
{
  "success": false,
  "message": "Task must be in-progress to submit proof"
}
```

#### Test 4: Approve without authorization
```http
POST /api/tasks/<task_id>/approve
Authorization: Bearer <solver_token>

Expected Response: 403 Forbidden
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

#### Test 5: Reject without reason
```http
POST /api/tasks/<task_id>/reject
Body: {
  "rejectionReason": ""
}

Expected Response: 400 Bad Request
{
  "success": false,
  "message": "Rejection reason is required"
}
```

## 🔍 Response Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid request data
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

## 📊 Expected State Transitions

```
Valid Transitions:
assigned → accepted ✅
accepted → in-progress ✅
in-progress → submitted ✅
submitted → completed ✅
submitted → rejected ✅
rejected → submitted ✅ (resubmit)

Invalid Transitions:
assigned → completed ❌
accepted → completed ❌
assigned → rejected ❌
completed → rejected ❌
```

## 🎯 Points Auto-Calculation

If `points` not provided in approve request, auto-calculated by priority:
```javascript
low: 20 points
medium: 30 points
high: 50 points
urgent: 100 points
```

## 📝 Sample cURL Commands

### Accept Task
```bash
curl -X POST http://localhost:5000/api/tasks/task_id/accept \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json"
```

### Submit Proof
```bash
curl -X POST http://localhost:5000/api/tasks/task_id/submit-proof \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{
    "images": ["data:image/jpeg;base64,..."],
    "description": "Completed the task successfully"
  }'
```

### Approve Task
```bash
curl -X POST http://localhost:5000/api/tasks/task_id/approve \
  -H "Authorization: Bearer authority_token" \
  -H "Content-Type: application/json" \
  -d '{
    "points": 50,
    "rating": 5,
    "feedback": "Great work!"
  }'
```

## 🐛 Common Issues & Solutions

### Issue 1: "Task not found"
- **Cause**: Invalid task ID or task doesn't belong to user
- **Solution**: Verify task ID and ensure user has access

### Issue 2: "Invalid transition"
- **Cause**: Trying to skip workflow steps
- **Solution**: Follow the correct workflow sequence

### Issue 3: "Insufficient permissions"
- **Cause**: Wrong user role for the action
- **Solution**: Use correct role token (solver for accept/submit, authority for review)

### Issue 4: "Proof images required"
- **Cause**: Empty images array
- **Solution**: Include at least one base64 image

### Issue 5: "Token expired"
- **Cause**: JWT token expired
- **Solution**: Login again to get new token

## ✅ Test Checklist

- [ ] Login as problem solver
- [ ] View assigned tasks
- [ ] Accept a task
- [ ] Start working on task
- [ ] Submit proof with images and description
- [ ] Login as authority
- [ ] View pending review tasks
- [ ] Approve a task
- [ ] Verify points awarded
- [ ] Reject a task
- [ ] Login as solver again
- [ ] View rejection feedback
- [ ] Resubmit proof
- [ ] Verify resubmission count
- [ ] Approve resubmission
- [ ] Verify final completion

---

**Testing Guide Version**: 1.0.0
**Last Updated**: December 2024
