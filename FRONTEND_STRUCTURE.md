# NagarNirman Frontend Structure

<div align="center">

![NagarNirman Logo](frontend/public/logo/logo.png)

**Frontend Architecture & Design System**

</div>

## ✅ Created Structure

### 📁 Folder Organization

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with AuthProvider, Navbar, Footer
│   ├── page.tsx                 # Home page (landing)
│   ├── globals.css              # Global styles with custom color theme
│   │
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── register/
│   │       └── page.tsx        # Registration page
│   │
│   ├── dashboard/               # Role-based dashboards
│   │   ├── user/
│   │   │   └── page.tsx        # Citizen dashboard
│   │   ├── authority/
│   │   │   └── page.tsx        # City authority dashboard
│   │   ├── solver/
│   │   │   └── page.tsx        # Problem solver dashboard
│   │   └── admin/
│   │       └── page.tsx        # Super Admin dashboard
│   │
│   └── reports/                 # Report management
│       └── page.tsx            # Reports listing page
│
├── components/
│   └── common/                  # Reusable UI components
│       ├── Button.tsx          # Custom button with variants
│       ├── Card.tsx            # Card container component
│       ├── Input.tsx           # Form input component
│       ├── Navbar.tsx          # Navigation bar with auth
│       ├── Footer.tsx          # Footer component
│       └── index.ts            # Component exports
│
├── context/
│   └── AuthContext.tsx         # Authentication context & provider
│
├── types/
│   └── index.ts                # TypeScript interfaces
│                               # - User, Report, Task, Location
│                               # - API response types
│
├── constants/
│   └── index.ts                # App constants
│                               # - Colors, Districts, Problem Types
│                               # - API endpoints, Storage keys
│
└── utils/
    ├── helpers.ts              # Utility functions
    │                           # - Date formatting, validation
    │                           # - Status/role formatting
    └── api.ts                  # API client functions
                                # - Report API, Task API
```

## 🎨 Design System

### Colors (from README.md)
- **Primary**: #81d586 (Soft Green)
- **Secondary**: #aef452 (Lime Green)
- **Accent**: #f2a921 (Amber Gold)
- **Neutral**: #6B7280 (Cool Gray)
- **Backgrounds**: #FFFFFF, #F3F4F6, #F6FFF9
- **Text Heading**: #002E2E (Deep Green)
- **Text Body**: #374151

### Typography
- **Font**: Urbanist (Google Font)
- **Weights**: 300, 400, 500, 600, 700

## 📄 Key Pages Created

### 1. Home Page (`/`)
- Hero section with logo and tagline
- Feature cards explaining the platform
- Statistics section (districts, reports, etc.)
- Call-to-action buttons

### 2. Authentication Pages
- **Login** (`/auth/login`): Email & password login
- **Register** (`/auth/register`): User registration with district selection

### 3. Dashboard Pages
- **User Dashboard** (`/dashboard/user`): For citizens
  - Report stats, quick actions, recent activity
- **Authority Dashboard** (`/dashboard/authority`): For city authorities
  - Report overview, problem solver management
- **Solver Dashboard** (`/dashboard/solver`): For problem solvers/NGOs
  - Assigned tasks, points, activity tracking

### 4. Reports Page (`/reports`)
- Filters (district, status, category)
- Reports listing (to be implemented with data)

## 🔧 Core Features Implemented

### Authentication System
- **AuthContext** with login/register/logout
- Token-based authentication (localStorage)
- Role-based access control
- Protected routes

### Component Library
- **Button**: 4 variants (primary, secondary, accent, outline), 3 sizes
- **Card**: Hover effects, customizable
- **Input**: Label, error handling, validation
- **Navbar**: Dynamic based on auth state and user role
- **Footer**: Site links and information

### Utilities
- **API Client**: Centralized fetch wrapper with auth
- **Helpers**: Validation, formatting, color utilities
- **Constants**: Centralized configuration

## 🎯 Next Steps (Backend Required)

To complete the frontend functionality, you'll need:

1. **Backend API** - Implement the API endpoints:
   - POST `/api/users/register`
   - POST `/api/users/login`
   - GET/POST `/api/reports`
   - PATCH `/api/reports/:id/status`
   - POST `/api/tasks/assign`
   - POST `/api/tasks/complete`

2. **Database** - MongoDB with schemas for:
   - Users (with role-based access)
   - Reports (with location, photos, status)
   - Tasks (assigned to problem solvers)

3. **Additional Pages to Create**:
   - `/reports/new` - Create new report form
   - `/reports/[id]` - Single report detail view
   - `/dashboard/user/my-reports` - User's reports list
   - `/apply` - Apply to become problem solver
   - `/about` - About page
   - `/contact` - Contact page

4. **Features to Add**:
   - Image upload (Cloudinary integration)
   - Map integration (Mapbox/Leaflet)
   - Real-time notifications
   - Search and filtering
   - Comments system
   - Upvoting mechanism
   - Leaderboard for problem solvers

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Additional Dependencies Needed

For full functionality, install:

```bash
# For maps
npm install mapbox-gl leaflet react-leaflet

# For image upload
npm install cloudinary

# For forms
npm install react-hook-form zod

# For date handling
npm install date-fns

# For notifications
npm install react-hot-toast
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## ✨ Current Status

✅ **Completed:**
- Clean, organized folder structure
- Type-safe TypeScript interfaces
- Authentication context and flow
- Role-based routing
- Responsive common components
- Dashboard layouts for all roles
- Landing page with full design
- Auth pages (login/register)
- Reports listing page structure

⏳ **Pending (Requires Backend):**
- Actual data fetching
- Report creation form
- Image uploads
- Map integration
- Task assignment
- Real-time updates
- Search and filtering logic

---

**Note**: All components follow the design system specified in README.md with proper color palette and typography. The structure is scalable and follows Next.js 14+ best practices with App Router.
