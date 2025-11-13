# Testing Guide: Problem Solver Application Feature

## Prerequisites
- Backend server running on http://localhost:5000
- Frontend server running on http://localhost:3000
- MongoDB connected and running
- At least one user account with 'user' role
- At least one user account with 'authority' role

## Test Scenarios

### Scenario 1: User Submits Application

1. **Login as Regular User:**
   - Navigate to: http://localhost:3000/auth/login
   - Login with credentials for a user with role='user'
   - Verify you are redirected to dashboard

2. **Access Application Form:**
   - Navigate to: http://localhost:3000/join-as-a-Problem-Solver
   - Verify the form loads correctly
   - Verify email is pre-filled from user data

3. **Fill Step 1 - Personal Information:**
   - Full Name: Enter your name
   - Phone: Enter phone number (e.g., +880-1234567890)
   - Date of Birth: Select date
   - Gender: Select from dropdown
   - Division: Select division (e.g., Dhaka)
   - District: Select district (should populate based on division)
   - Address: Enter full address
   - Profession: Enter profession (e.g., Engineer, Teacher)
   - Click "Next"

4. **Fill Step 2 - Background & Skills:**
   - Organization: (Optional) Enter organization name
   - Skills: Select multiple skills from dropdown
   - Motivation: Enter at least 50 characters explaining why you want to be a problem solver
   - Experience: (Optional) Enter relevant experience
   - Profile Image: (Optional) Upload image file
   - ID Document: Upload ID document (PDF, JPG, or PNG)
   - Check the agreement checkbox

5. **Submit Application:**
   - Click "Submit Application"
   - Verify success toast message appears
   - Verify redirect to dashboard after ~2.5 seconds

6. **Verify Application Saved:**
   - Check MongoDB database
   - Collection: `problemSolverApplications`
   - Verify document exists with status='pending'

### Scenario 2: Check Application Status (User)

1. **Navigate to Status Page:**
   - Go to: http://localhost:3000/dashboard/user/application-status
   - Verify application details are displayed
   - Verify status shows "Application Under Review" with yellow indicator

2. **Verify Information Display:**
   - Personal information displayed correctly
   - Location information displayed correctly
   - Skills displayed as tags
   - Motivation text displayed
   - Applied date shown

### Scenario 3: Prevent Duplicate Applications

1. **Try to Apply Again:**
   - Navigate to: http://localhost:3000/join-as-a-Problem-Solver
   - Fill out the form
   - Try to submit
   - Verify error message: "You already have an application pending or approved"

### Scenario 4: Authority Reviews Application

1. **Login as Authority:**
   - Logout from user account
   - Login with credentials for a user with role='authority'

2. **Access Applications Dashboard:**
   - Navigate to: http://localhost:3000/dashboard/authority/applications
   - Verify list of applications loads
   - Verify pending applications are shown

3. **Filter Applications:**
   - Use status filter dropdown
   - Select "Pending" - verify only pending applications shown
   - Select "All Applications" - verify all shown

4. **View Application Details:**
   - Click "View Details" on any application
   - Verify modal opens with full application details
   - Review all sections:
     - Personal Information
     - Location
     - Professional Information
     - Motivation & Experience

5. **Approve Application:**
   - In the modal, add optional review note (e.g., "Great qualifications!")
   - Click "Approve"
   - Verify success toast message
   - Verify modal closes
   - Verify application list refreshes
   - Verify status badge changes to "Approved" (green)

6. **Verify User Role Updated:**
   - Check MongoDB `users` collection
   - Find the user by userId from application
   - Verify role is now 'problemSolver'
   - Verify approved is true

### Scenario 5: User Sees Approved Status

1. **Login as Approved User:**
   - Logout from authority account
   - Login with the user account that was approved

2. **Check Application Status:**
   - Navigate to: http://localhost:3000/dashboard/user/application-status
   - Verify status shows "Application Approved!" with green indicator
   - Verify congratulations message displayed
   - Verify review note is shown (if provided)

3. **Access Problem Solver Dashboard:**
   - Click "Go to Problem Solver Dashboard" button
   - Verify redirect to solver dashboard

### Scenario 6: Reject Application

1. **Login as Authority:**
   - Login with authority credentials

2. **Find Another Application:**
   - Navigate to applications page
   - Click "View Details" on a pending application

3. **Reject Application:**
   - Add review note explaining reason (e.g., "Insufficient experience")
   - Click "Reject"
   - Verify success toast message
   - Verify status updates to "Rejected" (red)

4. **Verify User Status:**
   - Check MongoDB `users` collection
   - Verify user role remains 'user' (not changed to problemSolver)

### Scenario 7: User Sees Rejected Status

1. **Login as Rejected User:**
   - Login with the rejected user account

2. **Check Application Status:**
   - Navigate to application status page
   - Verify status shows "Application Not Approved" with red indicator
   - Verify rejection message displayed
   - Verify review note with reason is shown

## API Testing with Postman/Thunder Client

### 1. Submit Application
```
POST http://localhost:5000/api/users/apply-problem-solver
Headers:
  Authorization: Bearer <user_token>
  Content-Type: application/json

Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+880-1234567890",
  "dateOfBirth": "1995-01-15",
  "gender": "male",
  "division": "Dhaka",
  "district": "Dhaka",
  "address": "123 Main St, Dhaka",
  "profession": "Software Engineer",
  "organization": "Tech Corp",
  "skills": ["technology", "infrastructure"],
  "motivation": "I want to help my community by solving problems related to technology and infrastructure...",
  "experience": "5 years of experience in software development",
  "profileImage": null,
  "nidOrIdDoc": "base64_encoded_string_here"
}

Expected Response (201):
{
  "success": true,
  "message": "Application submitted successfully. Awaiting approval from authorities.",
  "data": { ... application object ... }
}
```

### 2. Get My Application
```
GET http://localhost:5000/api/users/my-application
Headers:
  Authorization: Bearer <user_token>

Expected Response (200):
{
  "success": true,
  "data": { ... application object ... }
}
```

### 3. Get All Applications (Authority)
```
GET http://localhost:5000/api/users/applications/all?status=pending&page=1&limit=10
Headers:
  Authorization: Bearer <authority_token>

Expected Response (200):
{
  "success": true,
  "count": 5,
  "pagination": {
    "total": 15,
    "page": 1,
    "pages": 2,
    "limit": 10
  },
  "data": [ ... array of applications ... ]
}
```

### 4. Get Application Details (Authority)
```
GET http://localhost:5000/api/users/applications/:id
Headers:
  Authorization: Bearer <authority_token>

Expected Response (200):
{
  "success": true,
  "data": {
    ... application object with userInfo ...
  }
}
```

### 5. Review Application (Authority)
```
PATCH http://localhost:5000/api/users/applications/:id/review
Headers:
  Authorization: Bearer <authority_token>
  Content-Type: application/json

Body:
{
  "status": "approved",
  "reviewNote": "Excellent qualifications and motivation"
}

Expected Response (200):
{
  "success": true,
  "message": "Application approved successfully",
  "data": { ... updated application object ... }
}
```

## Error Cases to Test

### 1. Non-User Tries to Apply:
- Login as 'authority' or 'problemSolver'
- Try to access application form
- Expected: Error message and redirect

### 2. Missing Required Fields:
- Submit application with missing fields
- Expected: Validation error messages

### 3. Duplicate Application:
- Submit application twice
- Expected: Error "You already have an application pending or approved"

### 4. Short Motivation:
- Submit with motivation less than 50 characters
- Expected: Validation error

### 5. No Skills Selected:
- Submit without selecting any skills
- Expected: Validation error

### 6. Unauthorized Access to Authority Pages:
- Login as regular user
- Try to access /dashboard/authority/applications
- Expected: Unauthorized error and redirect

### 7. Review Already Reviewed Application:
- Try to review an approved/rejected application
- Expected: Error "Only pending applications can be reviewed"

## Database Verification

After each test, verify in MongoDB:

1. **Check Application Document:**
```javascript
db.problemSolverApplications.findOne({ email: "john@example.com" })
```

2. **Check User Role Update:**
```javascript
db.users.findOne({ email: "john@example.com" })
// Verify role='problemSolver' after approval
```

3. **Check Application Statistics:**
```javascript
// Count by status
db.problemSolverApplications.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

## Success Criteria

✅ User can submit complete application
✅ Application is saved to database correctly
✅ User cannot submit duplicate applications
✅ Non-users cannot access application form
✅ User can view their application status
✅ Authority can view all applications
✅ Authority can filter applications
✅ Authority can view application details
✅ Authority can approve applications
✅ User role is updated to problemSolver on approval
✅ Authority can reject applications
✅ User role remains unchanged on rejection
✅ Review notes are saved and displayed
✅ Proper error messages for validation failures
✅ Toast notifications work correctly
✅ Navigation and redirects work as expected

## Next Steps

After successful testing:
1. Add email notifications for application status changes
2. Implement application resubmission for rejected users
3. Add file preview for uploaded documents
4. Create analytics dashboard for application statistics
5. Add export functionality for application data
