# 🎨 NagarNirman Frontend

<div align="center">

![NagarNirman Frontend](https://img.shields.io/badge/NagarNirman-Frontend-81d586?style=for-the-badge&logo=next.js&logoColor=white)

**The Modern User Interface for Bangladesh's Infrastructure Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.0-5a0ef8?style=flat-square&logo=daisyui)](https://daisyui.com/)

</div>

---

## 📖 Overview

The **NagarNirman Frontend** is a cutting-edge web application built with **Next.js 16 (App Router)**. It provides an intuitive, responsive, and accessible interface for citizens, authorities, and problem solvers to interact with the platform.

### 🌟 Key Features

- **🚀 Ultra-Fast Performance**: Server-Side Rendering (SSR) and Static Site Generation (SSG) with Next.js
- **🎨 Modern Design System**: Built with Tailwind CSS v4 and DaisyUI components
- **📱 Fully Responsive**: Mobile-first approach ensuring seamless experience on all devices
- **🗺️ Interactive Maps**: Integrated Leaflet.js for report geolocation and visualization
- **🔐 Secure Authentication**: Role-based access control with protected routes
- **🎭 Animations**: Smooth transitions using Framer Motion and AOS
- **📊 Data Visualization**: Beautiful charts and stats with Recharts
- **🌍 Earthquake Monitoring**: Real-time earthquake data visualization

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | Next.js | 16.0.10 | Core functionality & Routing |
| **Library** | React | 19.2.0 | UI Components |
| **Language** | TypeScript | 5.0+ | Type safety & developer experience |
| **Styling** | Tailwind CSS | 4.1.16 | Utility-first, responsive styling |
| **Components** | DaisyUI | 5.4.5 | Pre-built UI components |
| **Icons** | Lucide React | 0.553 | SVG Icons |
| **Maps** | React Leaflet | 5.0.0 | Interactive mapping |
| **Animations** | Framer Motion | 12.0 | Complex animations |
| **Forms** | React Hook Form | 7.66 | Form handling & validation |
| **Notifications** | React Hot Toast | 2.6.0 | Toast alerts |

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Homepage
│   │   ├── auth/            # Authentication (Login/Register)
│   │   ├── dashboard/       # Role-based dashboards
│   │   ├── reports/         # Report management
│   │   └── ...
│   │
│   ├── components/          # Reusable UI Components
│   │   ├── common/          # Shared components (Navbar, Footer, etc.)
│   │   ├── dashboard/       # Dashboard widgets
│   │   └── home/            # Homepage sections
│   │
│   ├── context/             # Global State (AuthContext)
│   ├── types/               # TypeScript Interfaces
│   ├── constants/           # App Constants & Routes
│   ├── utils/               # Helper Functions (API, Formatting)
│   └── styles/              # Global CSS
│
├── public/                  # Static Assets
├── next.config.ts           # Next.js Configuration
├── tailwind.config.ts       # Tailwind Configuration
└── package.json             # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root of `frontend/`:

   ```env
   # API URL (Backend)
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   
   # Optional: Mapbox or other keys if needed later
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open Browser**:
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Starts the development server |
| `build` | `npm run build` | Builds the application for production |
| `start` | `npm start` | Starts the production server |
| `lint` | `npm run lint` | Runs ESLint to check for code issues |

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#81d586` | Main buttons, active states, branding |
| **Secondary** | `#aef452` | Highlights, badges, secondary actions |
| **Accent** | `#f2a921` | Warnings, important notices, calls to action |
| **Dark** | `#004d40` | Headers, footer, dark mode elements |

### Typography

- **Font Family**: Urbanist (Google Fonts)
- **Weights**: Light (300) to Black (900)

---

## 🧩 Key Components

### `AuthContext`
Manages user authentication state, login, logout, and token storage using React Context API.

### `Navbar`
Dynamic navigation bar that adapts based on user login status and role (User, Authority, Solver).

### `ProtectRoute`
High-order component (HOC) or wrapper to secure pages that require authentication.

### `MapComponent`
Reusable Leaflet map component for displaying report locations and earthquake data.

---

## 🧪 Testing

We use **Jest** and **React Testing Library** (setup pending). 

To run manual verification:
```bash
# Verify build
npm run build && npm start
```

---

## 🤝 Contributing

1. **Frontend additions** should follow the component structure in `src/components`.
2. **Global styles** should be added to `src/app/globals.css`.
3. **Types** must be defined in `src/types/index.ts`.
4. Always restart the dev server after changing `tailwind.config.ts`.

---

<div align="center">

**[⬅ Back to Main Project](../README.md)**

</div>