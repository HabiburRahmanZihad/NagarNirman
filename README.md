NagarNirman (NN) – Report. Resolve. Rebuild.(RRR)
1. Overview
CityFix is a citizen-powered platform for reporting, managing, and tracking public infrastructure issues in Bangladesh’s cities. It bridges citizens, city authorities, and problem-solving teams (cleaners, NGOs) to build smarter, cleaner, and more transparent communities, aligned to SDG 11 (Sustainable Cities and Communities).

2. Objectives
Empower users to report and follow up on local issues.
Enable authorities to assign and monitor solutions efficiently.
Incentivize NGOs and problem-solvers with rewards, visibility, and applications.
Provide a public dashboard showing progress across all 64 districts.

Problem Types for Reporting
Road & Infrastructure Issues
Broken/uneven roads
Potholes
Damaged footpaths/sidewalks
Blocked drains/gutters
Lighting & Electrical
Faulty streetlights
Exposed wires
Broken traffic signals
Garbage & Sanitation
Overflowing garbage bins
Illegal dumping
Unremoved waste
Dirty public spaces
Water Supply & Leakage
Water pipe leaks
Low water pressure
Unrepaired tanks/lines
Public Facilities
Damaged benches/seating
Broken playgrounds/parks
Public toilet maintenance
Environmental Hazards
Waterlogging/flooding
Air pollution/smoke
Noise pollution
Safety Issues
Unmarked construction
Unsafe crossings/zebra crossings
Broken fences/walls
Health & Hygiene
Mosquito breeding spots
Unclean markets/slaughterhouses
Transport
Broken bus stops
Unmaintained cycle lanes
Inaccessible walkways
Other (General/Custom)
Specify any issue not covered above

Reporting Form Implementation Suggestion:
Dropdown/select box for problem type
“Other” with custom description for rare cases
Example Reporting Form Fields:
Problem Type (Dropdown)
Subcategory (optional, e.g., “Road → Pothole”)
Description
Location (auto/manual)
Photo Upload
3. Stakeholder Roles & Features
A. User/Citizen
Submit reports (photo, geolocation, area selection, description)
Track personal and regional issue progress (by city, district, area)
Search/filter all Bangladesh reports by location/district
Apply to join as Cleaner/Problem Solver/NGO member
B. City Authority/Admin
View and filter reports across all regions/districts
Assign tasks to registered problem solvers/NGOs
Monitor task progress/status and mark as complete
Send notifications to users regarding updates
Review performance analytics, download monthly reports
Manage roles – approve/reject problem solver/NGO applications
C. Cleaner/Problem Solver/NGO
View and manage assigned tasks
Update task statuses and submit proof of completion
Receive rewards for completed tasks, climb leaderboard
Apply via dashboard to become a recognized problem solver/NGO

4. Tech Stack & Architecture
Layer
Technology
Usage
Frontend
Next.js, TypeScript, Tailwind CSS, ShadCn
Modern, scalable, type-safe, responsive UI
State Mgmt
Context API / Redux Toolkit
Role/user/task state handling
Backend API
Node.js + Express OR Next.js API Routes
RESTful endpoints
Database
MongoDB
User/reports/tasks/rewards Storage
Auth
NextAuth.js / JWT / Firebase
Secure role-based authentication
Map
Mapbox / Leaflet.js
Geolocation, issue mapping
File Upload
Multer / Cloudinary
Photo upload for reports, completion proofs
Notifications
Nodemailer / Firebase Cloud Messaging
Email & push alerts
Deployment
Vercel (frontend) + Render/Heroku (backend)
Hosting & scaling


Architecture Diagram
User Browser <-> Next.js Frontend (TS + Tailwind)
                             |
                             V
        REST API (Node/Express or Next.js API routes)
                             |
                             V
                 MongoDB (Reports, Users, Tasks)
Mapbox/Leaflet for map display; Cloudinary for photo uploads

5. Folder Structure
cityfix/
├── apps/
│   ├── web/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── public/
│   └── api/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── utils/
├── package.json
├── .env
├── README.md


NagarNirman Light Color Theme

Use
Color Name
HEX
Notes
Primary Color
Soft Green
#81d586
For main buttons, active links, highlights
Secondary Color
Lime Green
#aef452
Secondary buttons, icons, badges
Accent Color
Amber Gold
#f2a921
Alerts, actions, highlights, badges
Neutral color
Cool Gray
#6B7280
Neutral text, borders, icons, placeholders
Background 1
White
#FFFFFF
Main background, card interiors
Background 2
Gray-White
#F3F4F6
Page backgrounds, section dividers
Background 3
Mint Cream
#F6FFF9
Soft greenish tone for subtle sections / cards
Text Heading
Deep Green
#002E2E
Headings, strong text, emphasis

UI/UX Best Practices with this Palette
Primary (#81d586): Use for CTAs (call-to-action), active states, and selection indicators.
Secondary (#aef452): Use for secondary buttons, info cards, and secondary highlights.
Accent (#f2a921): Reserved for accents: notification badges, icons, warning highlights (not as a dominant color).
Bg 1 (#FFFFFF): As the main base for cards, components, and modal windows.
Bg 2 (#F3F4F6): For subtle layered backgrounds, page sections, footers.
Text Color (#002E2E): Headings, navigation, and areas needing strong readability.
Body text: Use dark gray (e.g., #273043 or #374151) for best contrast on white backgrounds.
Typography Selection
Designated Typefaces: Montserrat, Urbanist, Jost, or a standard Sans-serif font stack are the preferred options.
Application Guidelines:
Employ the bold or semi-bold variations exclusively for section headings and emphasis within the text.
Utilize the light or regular weights for all body content to maintain a contemporary aesthetic and ensure optimal readability.
6. Database Schema (Example, MongoDB)
User
interface User {
  _id: ObjectId
  name: string
  email: string
  password: string // hashed
  role: 'user' | 'authority' | 'problemSolver' | 'ngo'
  district: string
  points?: number
  approved?: boolean // for NGO/problemSolver applications
}


Report
interface Report {
  _id: ObjectId
  title: string
  description: string
  photoURL: string
  location: {
    city: string
    district: string
    coordinates: [number, number]
  }
  status: 'pending' | 'inProgress' | 'resolved'
  createdBy: ObjectId // user id
  assignedTo?: ObjectId // problem solver/Ngo id
  history: Array<{status: string, updatedBy: ObjectId, date: Date}>
  upvotes: number
  comments: Array<{user: ObjectId, comment: string, date: Date}>
  createdAt: Date
}
Task
interface Task {
  _id: ObjectId
  reportId: ObjectId
  assignedTo: ObjectId // problem solver/Ngo
  status: 'pending' | 'inProgress' | 'completed'
  proofURL?: string
  rewardGranted?: boolean
  completedAt?: Date
}

7. Key API Endpoints
Method
Endpoint
Description
POST
/api/users/register
Register user
POST
/api/users/login
Login user
GET
/api/reports
Get all reports (filterable)
GET
/api/reports/:id
Get single report details
POST
/api/reports
Submit new issue
PATCH
/api/reports/:id/status
Update issue/task status
POST
/api/tasks/assign
Authority assigns task
POST
/api/tasks/complete
Submit proof of completion
POST
/api/users/apply-problem-solver
Apply for problem solver





8. Features/Workflows
User Flow
Register/login, get access token
Submit report (photo, area, description, location)
Receive notifications for updates/comments
Search/filter reports by area/district
Apply for problem solver/NGO role
Authority Flow
Dashboard for all reports (filters: area, type, status)
Assign task to problem solver/NGO
Track task status/progress, send notifications
Approve new applications for solvers/NGOs
Analytics download (monthly stats)
Problem Solver/NGO Flow
Dashboard: assigned/pending/completed tasks
Update status, upload completion proof
Earn points/badges for verified completion
Apply to join, track leaderboard

9. Wireframe/UX Overview
Landing Page: Choice of login for different roles, summary stats
User Dashboard: “Report Issue”, view map/list, status updates, apply for new role
Authority Dashboard: Issue status, assign/monitor tasks, analytics
Problem Solver Dashboard: Task list, update progress, upload proof, view rewards

10. Deployment & Environment
Next.js deployed on Vercel (CI/CD auto)
Backend on Render/Heroku (MongoDB Atlas for DB)
Store secret keys in .env, use config files for separation

11. Expected Screenshot Layouts
Home page: login/register, district stats/map
Report form: photo, location picker, description
Issue list/map: cards/pins by area, search/filter bar
Status view: issue details, progress timeline
Authority panel: assign task form, analytics chart
Problem solver: tasks list, proof upload, leaderboard

Submission/Readme Notes
Add setup scripts and getting started instructions in the README:
Install dependencies, configure .env
Start dev server: npm run dev
Run backend: npm run server
Access roles from demo credentials list