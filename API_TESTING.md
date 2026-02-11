# 🧪 NagarNirman API Testing Manual

A professional guide to validating the NagarNirman API, featuring complete workflows, specific test cases, and common troubleshooting tips.

---

## 🚀 Base URL & Authentication

**Base URL**: `http://localhost:5000`

All protected requests require a JWT token in the Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 🔄 Core Workflow Test Sequence

Follow this sequence to validate the full lifecycle of a task assignment.

### 1. Authentication & Initialization
- **Login as Solver**: Authenticate at `POST /api/auth/login`. Save the token.
- **Get Tasks**: Fetch assigned tasks at `GET /api/tasks/my-tasks`.

### 2. Solver Workflow
- **Accept Task**: Transition status to `accepted` via `POST /api/tasks/:id/accept`.
- **Start Task**: Transition status to `in-progress` via `POST /api/tasks/:id/start`.
- **Submit Proof**: Upload base64 images and a description via `POST /api/tasks/:id/submit-proof`.

### 3. Authority Review Workflow
- **Login as Authority**: Authenticate as an authority user.
- **Review Pending**: Fetch tasks awaiting review at `GET /api/tasks/review/pending`.
- **Approve/Reject**: 
  - **Approve**: `POST /api/tasks/:id/approve` (Grants points and rating).
  - **Reject**: `POST /api/tasks/:id/reject` (Sends back for resubmission with reason).

---

## 📋 Endpoint Quick Reference

| Action | Method | Endpoint | Role |
| :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/api/auth/login` | Public |
| **My Tasks** | `GET` | `/api/tasks/my-tasks` | Solver |
| **Accept Task** | `POST` | `/api/tasks/:id/accept` | Solver |
| **Submit Proof** | `POST` | `/api/tasks/:id/submit-proof` | Solver |
| **Review Pending**| `GET` | `/api/tasks/review/pending`| Authority|
| **Approve Task** | `POST` | `/api/tasks/:id/approve` | Authority|
| **Reject Task** | `POST` | `/api/tasks/:id/reject` | Authority|

---

## 🧪 Edge Case Test Suits

### ❌ Rejection & Resubmission
1. Submit proof as Solver.
2. Reject as Authority with a clear reason.
3. Verify Solver sees the rejection reason and task remains in `rejected` status.
4. Resubmit proof as Solver.
5. Verify `resubmissionCount` increments.

### ⛔ Permission Checks
- Attempting to `approve` a task with a `user` or `solver` token should return `403 Forbidden`.
- Attempting to `accept` a task that is already `in-progress` should return `400 Bad Request`.

---

## 📊 Status Transitions

| From | To | Result |
| :--- | :--- | :--- |
| `assigned` | `accepted` | ✅ Success |
| `accepted` | `in-progress` | ✅ Success |
| `in-progress`| `submitted` | ✅ Success |
| `submitted` | `completed` | ✅ Approved |
| `submitted` | `rejected` | ❌ Disapproved |
| `rejected` | `submitted` | 🔄 Resubmitted |

---

## 🐛 Troubleshooting

| Error | Cause | Solution |
| :--- | :--- | :--- |
| **401 Unauthorized** | Missing/Invalid Token | Login again and provide a fresh token. |
| **403 Forbidden** | Wrong User Role | Ensure your user has `authority` or `superAdmin` role. |
| **400 Invalid Transition**| Skipping Workflow Steps | Follow the sequence: assigned -> accepted -> in-progress. |
| **Proof Required** | Empty Image Array | Ensure at least one base64 image is sent in the body. |
