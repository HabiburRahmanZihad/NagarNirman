# 🌟 NagarNirman Features & Workflows

Detailed guide to the features, user roles, and operational workflows of the NagarNirman platform.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (4 user roles)
- Password encryption with bcryptjs
- Protected routes and API endpoints
- User profile management

### 📋 Intelligent Report Management
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

### 📝 Task Assignment System
- Authorities can assign tasks to verified problem solvers
- Task priority levels (Low, Medium, High, Critical)
- Deadline management with notifications
- Proof submission with photo evidence
- Rating and feedback system
- Automated reward distribution

### 👥 Comprehensive User System
- **User Profiles**: Custom avatars, divisions, contact details
- **Problem Solver Applications**: Apply and get verified by authorities
- **Leaderboard**: Top contributors ranked by reward points
- **User Statistics**: Track reports submitted, tasks completed, rewards earned
- **Status Management**: Active/Inactive user control

### 📧 Email Notification System
Professional HTML email templates for:
- Welcome emails on registration
- Task assignment notifications
- Report status update alerts
- Problem solver approval/rejection
- Task completion and reward notifications

### 🌍 Earthquake Monitoring & Alerts
- Real-time earthquake data integration with USGS API
- Interactive map visualization with Leaflet
- Magnitude-based color coding
- Automatic email alerts for significant events (M4.5+)
- Historical earthquake data access
- Location-based filtering

### 📊 Analytics & Statistics
- User activity dashboards
- Report statistics by division/type
- Task completion rates
- Solver performance metrics
- Trend analysis and charts (Recharts)

### 📱 Modern UI/UX
- Responsive design for mobile, tablet, and desktop
- Tailwind CSS v4 with DaisyUI components
- Smooth animations with Framer Motion
- AOS (Animate On Scroll) effects
- Interactive Swiper carousels
- React Hot Toast notifications
- Loading states and error handling

### 🗺️ Interactive Maps
- Leaflet-based map integration
- Report location visualization
- Earthquake epicenter mapping
- Clickable markers with detailed info

---

## 🚀 Usage Guide

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

## 👥 User Roles & Workflows

### 1️⃣ Regular User (Citizen)
**Default role upon registration**
- **Permissions**: Create reports, upload images, view public reports, comment, upvote, track own status.
- **Workflow**: `Register → Login → Create Report → Track Status → Engage with Community`

### 2️⃣ Authority (Government Official)
**Assigned by system administrator**
- **Permissions**: All user permissions + Review/Approve reports, Assign tasks, Review submissions, Grant rewards, View analytics.
- **Workflow**: `Login → Review Pending Reports → Approve Reports → Assign Tasks → Verify Completed Work → Grant Rewards`

### 3️⃣ Problem Solver (Verified Contributor)
**Applied by user, approved by authority**
- **Permissions**: All user permissions + View/Accept tasks, Submit proof, Earn rewards, Appear on leaderboard.
- **Workflow**: `Apply as Solver → Wait for Approval → View Assigned Tasks → Accept Task → Complete Work → Submit Proof → Earn Rewards`

### 4️⃣ Super Admin (System Manager)
**Highest level unique access**
- **Permissions**: Full System Access, Manage all roles, System configuration, Backups, Audit logs, Dispute resolution.
- **Workflow**: `System Config → User Role Management → Platform Oversight → Security Audits`
