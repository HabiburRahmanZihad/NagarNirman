# 🏆 Leaderboard System Documentation

## Overview

The Leaderboard System is a comprehensive ranking and performance tracking feature for Problem Solvers in the Nagar Nirman application. It aggregates data from multiple collections to provide real-time rankings based on performance metrics.

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (Next.js/React)              │
│  - Leaderboard Page Component                           │
│  - Real-time data fetching                              │
│  - Interactive UI with sorting & filtering              │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP Request
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API Routes                         │
│  - /api/leaderboard                                    │
│  - /api/leaderboard/filtered                           │
│  - /api/leaderboard/rank/:userId                       │
│  - /api/leaderboard/district/:district                 │
└────────────────┬────────────────────────────────────────┘
                 │ Query/Aggregation
                 ▼
┌─────────────────────────────────────────────────────────┐
│         MongoDB Collections                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Users     │  │  Statistics  │  │    Tasks     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Database Collections

### 1. **Users Collection**
Problem solver user data

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  role: "problem_solver",
  status: "active",
  district: String,
  division: String,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Statistics Collection**
Performance metrics for each problem solver

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  points: Number,             // Total earned points
  completedTasks: Number,     // Number of completed tasks
  ongoingTasks: Number,       // Currently assigned tasks
  totalTasks: Number,         // Total tasks assigned
  level: Number,              // User level based on points
  xp: Number,                 // Experience points (0-1000)
  xpRequired: Number,         // XP needed for next level (1000)
  streak: Number,             // Days of continuous activity
  totalRating: Number,        // Average rating (3.5-5.0)
  badges: [String],           // Achievement badges
  lastUpdated: Date
}
```

### 3. **Tasks Collection**
Individual task assignments for problem solvers

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  location: {
    district: String,
    division: String,
    latitude: Number,
    longitude: Number,
    address: String
  },
  priority: String,           // "high", "medium", "low"
  status: String,             // "completed", "ongoing", "pending"
  solver: ObjectId,           // Reference to User (_id)
  solverEmail: String,
  reward: Number,             // Points/money for completion
  createdAt: Date,
  completedAt: Date,
  updatedAt: Date
}
```

## Backend Architecture

### Controllers: `leaderboardController.js`

#### 1. **getLeaderboard()**
Returns top 100 problem solvers with all metrics

**Endpoint:** `GET /api/leaderboard`

**Aggregation Pipeline:**
- Matches active problem solvers
- Looks up statistics from `statistics` collection
- Counts completed tasks from `tasks` collection
- Calculates ranks based on points and completed tasks
- Returns sorted list with rank positions

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "_id": "user_id",
        "name": "আহমেদ করিম",
        "email": "solver@example.com",
        "district": "ঢাকা",
        "points": 5200,
        "completedTasks": 45,
        "ongoingTasks": 3,
        "totalTasks": 48,
        "level": 5,
        "xp": 200,
        "totalRating": 4.8,
        "streak": 25,
        "badges": ["⭐ Star Solver", "🏆 Top Performer"],
        "rank": 1
      }
    ]
  }
}
```

#### 2. **getLeaderboardFiltered()**
Paginated leaderboard with optional filters

**Endpoint:** `GET /api/leaderboard/filtered`

**Query Parameters:**
- `page` (default: 1) - Page number for pagination
- `limit` (default: 20) - Records per page
- `sortBy` (default: 'points') - Sort field: 'points', 'streak', 'completed', 'rating'
- `district` (optional) - Filter by district
- `division` (optional) - Filter by division

**Example Request:**
```
GET /api/leaderboard/filtered?page=1&limit=20&sortBy=points&district=ঢাকা
```

**Response:** Similar to getLeaderboard but paginated

#### 3. **getUserRankWithNearby()**
Get user's rank with 5 competitors above and below

**Endpoint:** `GET /api/leaderboard/rank/:userId`

**Authentication:** Required (protected route)

**Response:**
```json
{
  "success": true,
  "data": {
    "userRank": {
      "rank": 15,
      "totalSolvers": 450,
      "user": { /* user data */ }
    },
    "nearby": [
      { "rank": 10, /* user data */ },
      { "rank": 11, /* user data */ },
      // ... up to 10 positions (5 above, 5 below)
      { "rank": 19, /* user data */ }
    ]
  }
}
```

#### 4. **getDistrictLeaderboard()**
Get leaderboard for specific district

**Endpoint:** `GET /api/leaderboard/district/:district`

**Response:** Top 50 performers in specified district

## Frontend Components

### Main Page Component: `leaderboard/page.tsx`

**Features:**
- Real-time data fetching from API
- Loading state with spinner
- Stats cards showing user metrics
  - Current Streak
  - Current Level with XP progress bar
  - Badges Earned
  - Tasks Completed
- LeaderboardTable displaying rankings

**State Management:**
```typescript
const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
const [loading, setLoading] = useState(true);
const [sortBy, setSortBy] = useState<'points' | 'streak' | 'completed' | 'rating'>('points');
const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
```

### LeaderboardTable Component: `solver/LeaderboardTable.tsx`

**Displays:**
- Rank number with medals (🥇🥈🥉)
- User name and profile image
- District location
- Points scored
- Completed tasks
- Current streak
- Average rating
- Badges

## Ranking Algorithm

### Score Calculation

```
Primary Sort: Points (descending)
Secondary Sort: Completed Tasks (descending)
Tertiary Sort: Average Rating (descending)

Rank = Position in sorted list (1-based)
```

### Points System

Points are typically awarded based on:
- Task completion: Base reward + bonus
- Rating quality: Additional points based on user ratings
- Streak maintenance: Bonus points for consecutive days
- Performance level: Multiplier based on task difficulty

## API Implementation

### Routes: `leaderboardRoutes.js`

```javascript
import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getLeaderboard,
  getLeaderboardFiltered,
  getUserRankWithNearby,
  getDistrictLeaderboard
} from '../controllers/leaderboardController.js';

const router = express.Router();

// Public routes
router.get('/', getLeaderboard);
router.get('/filtered', getLeaderboardFiltered);
router.get('/district/:district', getDistrictLeaderboard);

// Protected routes
router.get('/rank/:userId', protect, getUserRankWithNearby);

export default router;
```

### Server Integration: `server.js`

```javascript
import leaderboardRoutes from './routes/leaderboardRoutes.js';

// Register leaderboard routes
app.use('/api/leaderboard', leaderboardRoutes);
```

## Seeding Test Data

### Step 1: Run Seed Script

```bash
cd backend
node scripts/seedLeaderboard.js
```

**Output:**
```
🌱 Starting leaderboard seed...
✅ Created 10 problem solvers
✅ Created 10 statistics records
✅ Created 30 sample tasks

✨ Leaderboard seed completed successfully!

📊 Summary:
   - Problem Solvers: 10
   - Statistics Records: 10
   - Sample Tasks: 30

🎯 You can now visit /api/leaderboard to see the leaderboard data!
```

### Step 2: Verify Data

**Check MongoDB:**
```javascript
// Users collection
db.users.find({ role: "problem_solver" }).count()  // Should show 10+

// Statistics collection
db.statistics.find().count()  // Should show 10+

// Tasks collection
db.tasks.find().count()  // Should show 30+
```

**Test API:**
```bash
curl http://localhost:5000/api/leaderboard
curl http://localhost:5000/api/leaderboard/filtered?page=1&limit=5&sortBy=points
curl http://localhost:5000/api/leaderboard/district/ঢাকা
```

## Why Data Shows as 0?

### Common Issues & Solutions

#### 1. **No Statistics Records**
Problem: Statistics collection is empty
Solution: Run `node scripts/seedLeaderboard.js`

#### 2. **Statistics Not Linked to Users**
Problem: `userId` in statistics doesn't match user `_id`
Solution: Ensure statistics are created with correct user ObjectId references

#### 3. **No Completed Tasks**
Problem: Tasks collection has no completed tasks
Solution: Update task status to "completed" in MongoDB or run seed script

#### 4. **Task Status Values**
Problem: Task status values don't match aggregation query
Solution: Use exact status values: "completed", "ongoing", "pending"

#### 5. **Role Mismatch**
Problem: Problem solvers don't have `role: "problem_solver"`
Solution: Update user role in database

### Debug Script

```bash
# Run this in MongoDB console to check data integrity
db.users.findOne({ role: "problem_solver" })
db.statistics.findOne({ userId: ObjectId("...") })
db.tasks.findOne({ status: "completed" })
```

## Frontend API Integration

### Usage: `utils/api.ts`

```typescript
// Get full leaderboard
const response = await leaderboardAPI.getLeaderboard();

// Get filtered leaderboard
const response = await leaderboardAPI.getFiltered({
  page: 1,
  limit: 20,
  sortBy: 'points',
  district: 'ঢাকা'
});

// Get user's rank with nearby competitors
const response = await leaderboardAPI.getUserRank(userId);

// Get district leaderboard
const response = await leaderboardAPI.getDistrictLeaderboard('ঢাকা', 50);
```

## Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| Basic Leaderboard | ✅ Complete | Top 100 problem solvers |
| Filtering | ✅ Complete | By district, division |
| Sorting | ✅ Complete | By points, streak, tasks, rating |
| Pagination | ✅ Complete | Page-based navigation |
| User Rank | ✅ Complete | Personal rank with competitors |
| Real-time Updates | ⏳ Pending | WebSocket integration |
| Statistics | ✅ Complete | Comprehensive metrics |
| Badges | ✅ Complete | Achievement display |

## Performance Notes

- **Aggregation Pipeline** uses MongoDB's native capabilities for efficient data retrieval
- **Indexes Recommended**: Create indexes on `role`, `status`, `userId`, `solver` fields
- **Cache Strategy**: Consider caching top 100 leaderboard (5-10 min TTL)
- **Load**: Can handle 1000+ problem solvers without performance issues

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live rank changes
2. **Historical Tracking**: Store daily snapshots for progress charts
3. **Achievements**: Dynamic badge system based on milestones
4. **Competitions**: Seasonal/monthly leaderboards
5. **Custom Filters**: Filter by performance level, badges earned
6. **Export**: Download leaderboard as CSV/PDF

## Troubleshooting

| Issue | Solution |
|-------|----------|
| All data showing 0 | Run seed script, check statistics collection |
| API returns empty array | Verify problem_solver role exists, check filters |
| 404 on endpoints | Ensure routes are registered in server.js |
| Slow queries | Add MongoDB indexes on frequently filtered fields |
| Auth errors on /rank/:userId | Check JWT middleware, verify token in Authorization header |

## API Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid filters/parameters) |
| 401 | Unauthorized (missing/invalid token) |
| 404 | Not found (user/district not found) |
| 500 | Server error (database issue) |

---

**Version:** 1.0.0
**Last Updated:** December 2024
**Maintainer:** Nagar Nirman Team
