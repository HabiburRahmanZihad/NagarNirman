<div align="center">

![NagarNirman Logo](frontend/public/logo/logo.png)

**Complete Route Navigation Structure**

</div>

## 📍 Public Routes (No Authentication Required)

### Main Pages
- `/` - Home/Landing page
- `/about` - About NagarNirman
- `/contact` - Contact page
- `/reports` - Browse all reports (public view)
- `/reports/map` - Map view of all reports
- `/help` - Help center
- `/faq` - Frequently asked questions
- `/guidelines` - Reporting guidelines
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Authentication
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/forgot-password` - Password recovery

---

## 👤 Citizen Routes (Role: 'user')

### Dashboard
- `/dashboard/user` - Main user dashboard
- `/dashboard/user/profile` - User profile settings
- `/dashboard/user/my-reports` - List of user's submitted reports
- `/dashboard/user/notifications` - User notifications

### Reports
- `/reports/new` - Create new report form
- `/reports/[id]` - View specific report details
- `/reports/[id]/edit` - Edit user's own report

### Applications
- `/apply` - Apply to become a problem solver/NGO

---

## 🏛️ Authority Routes (Role: 'authority')

### Dashboard
- `/dashboard/authority` - Main authority dashboard
- `/dashboard/authority/overview` - Overview statistics
- `/dashboard/authority/profile` - Authority profile settings

### Report Management
- `/dashboard/authority/reports` - Manage all reports
- `/dashboard/authority/reports/pending` - Pending reports
- `/dashboard/authority/reports/in-progress` - In-progress reports
- `/dashboard/authority/reports/resolved` - Resolved reports

### Task Management
- `/dashboard/authority/assign` - Assign tasks to solvers
- `/dashboard/authority/tasks` - View all tasks
- `/dashboard/authority/tasks/[id]` - Task details

### User Management
- `/dashboard/authority/solvers` - Manage problem solvers
- `/dashboard/authority/applications` - Review solver applications
- `/dashboard/authority/users` - View all users

### Analytics
- `/dashboard/authority/analytics` - Analytics dashboard
- `/dashboard/authority/reports/export` - Export reports

---

## ⚡ Super Admin Routes (Role: 'superAdmin')

### Dashboard
- `/dashboard/admin` - Main admin overview
- `/dashboard/admin/logs` - System audit logs
- `/dashboard/admin/settings` - Global configuration

### User Role Management
- `/dashboard/admin/roles` - Manage roles
- `/dashboard/admin/users` - Advanced user controls (Ban/Delete)

### System Health
- `/dashboard/admin/health` - Server health status
- `/dashboard/admin/database` - Database backup/restore

---

## 🔧 Problem Solver Routes (Role: 'problemSolver')

### Dashboard
- `/dashboard/solver` - Main solver dashboard
- `/dashboard/solver/profile` - Solver profile settings

### Tasks
- `/dashboard/solver/tasks` - All assigned tasks
- `/dashboard/solver/tasks/pending` - Pending tasks
- `/dashboard/solver/tasks/in-progress` - Tasks in progress
- `/dashboard/solver/completed` - Completed tasks
- `/dashboard/solver/tasks/[id]` - Task details
- `/dashboard/solver/tasks/[id]/submit` - Submit task completion

### Performance
- `/dashboard/solver/leaderboard` - Leaderboard rankings
- `/dashboard/solver/rewards` - Rewards and points
- `/dashboard/solver/statistics` - Performance statistics
- `/dashboard/solver/history` - Task history

---

## 🔍 Report Filtering Routes

### By Status
- `/reports?status=pending` - Pending reports
- `/reports?status=inProgress` - In-progress reports
- `/reports?status=resolved` - Resolved reports

### By District
- `/reports?district=Dhaka` - Reports from Dhaka
- `/reports?district=Chittagong` - Reports from Chittagong
- (etc. for all 64 districts)

### By Category
- `/reports?category=road_infrastructure` - Road & Infrastructure
- `/reports?category=garbage_sanitation` - Garbage & Sanitation
- `/reports?category=lighting_electrical` - Lighting & Electrical
- `/reports?category=water_supply` - Water Supply
- `/reports?category=public_facilities` - Public Facilities
- `/reports?category=environmental` - Environmental Hazards
- `/reports?category=safety` - Safety Issues
- `/reports?category=health_hygiene` - Health & Hygiene
- `/reports?category=transport` - Transport
- `/reports?category=other` - Other issues

### Combined Filters
- `/reports?district=Dhaka&status=pending` - Pending reports in Dhaka
- `/reports?category=road_infrastructure&status=resolved` - Resolved road issues

---

## 📱 API Routes (Backend Endpoints)

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/apply-problem-solver` - Apply as problem solver

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `PATCH /api/reports/:id/status` - Update report status
- `POST /api/reports/:id/comment` - Add comment to report
- `POST /api/reports/:id/upvote` - Upvote a report

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks/assign` - Assign task to solver
- `POST /api/tasks/complete` - Mark task as complete
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status

### Analytics
- `GET /api/analytics/overview` - Overall statistics
- `GET /api/analytics/district/:district` - District-specific stats
- `GET /api/analytics/leaderboard` - Problem solver leaderboard

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/mark-read` - Mark notification as read

---

## 🎯 Route Structure by User Role

### Guest/Visitor
```
/ → Home
/about → About
/reports → Browse Reports
/auth/login → Login
/auth/register → Register
```

### Citizen (After Login)
```
/dashboard/user → Dashboard
/reports/new → Report Issue
/dashboard/user/my-reports → My Reports
/apply → Apply as Solver
```

### Authority (After Login)
```
/dashboard/authority → Dashboard
/dashboard/authority/reports → Manage Reports
/dashboard/authority/assign → Assign Tasks
/dashboard/authority/solvers → Manage Solvers
/dashboard/authority/analytics → Analytics
```

### Problem Solver (After Login)
```
/dashboard/solver → Dashboard
/dashboard/solver/tasks → My Tasks
/dashboard/solver/completed → Completed
/dashboard/solver/leaderboard → Leaderboard
/dashboard/solver/rewards → Rewards
```

---

## 🔒 Protected Routes

Routes requiring authentication:
- All `/dashboard/*` routes
- `/reports/new`
- `/reports/[id]/edit`
- `/apply`

Role-specific access:
- `/dashboard/authority/*` → Only 'authority'
- `/dashboard/solver/*` → Only 'problemSolver' or 'ngo'
- `/dashboard/user/*` → Only 'user'

---

## 📊 Route Priority Implementation

### Phase 1 (Essential - Completed ✅)
- [x] Home page
- [x] Auth pages (login, register)
- [x] Reports listing
- [x] User dashboard
- [x] Authority dashboard
- [x] Solver dashboard

### Phase 2 (Core Features - To Implement)
- [ ] Report creation form
- [ ] Report details page
- [ ] Task assignment
- [ ] Profile pages
- [ ] My reports page

### Phase 3 (Advanced Features - To Implement)
- [ ] Map view
- [ ] Analytics
- [ ] Leaderboard
- [ ] Application system
- [ ] Notifications

### Phase 4 (Support Pages - To Implement)
- [ ] About page
- [ ] Contact page
- [ ] Help center
- [ ] FAQ
- [ ] Terms & Privacy

---

## 🚀 Navigation Flow

```
Landing Page (/)
    ├─→ Register → User Dashboard
    ├─→ Login → Role-based Dashboard
    │   ├─→ User → /dashboard/user
    │   ├─→ Authority → /dashboard/authority
    │   └─→ Solver → /dashboard/solver
    └─→ Browse Reports → Report Details
        └─→ Create Report (if logged in)
```

---

**Total Routes Planned**: 60+
**Current Implementation**: 12 pages ✅
**Remaining**: 48+ pages to build
