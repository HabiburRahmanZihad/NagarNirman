# Earthquake Features - Quick Start Guide

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
cd backend
npm install
# mongoose will be removed from node_modules
```

### Step 2: Initialize Earthquake Indexes
Add to your server startup (server.js):

```javascript
import { createEarthquakeIndexes } from './models/Earthquake.js';

// After database connection
try {
  await createEarthquakeIndexes();
  console.log('✅ Earthquake indexes created successfully');
} catch (error) {
  console.error('❌ Failed to create earthquake indexes:', error);
}
```

### Step 3: Test the System

#### Option A: Sync Real Earthquake Data
```bash
curl http://localhost:5000/api/earthquakes/sync/usgs
```
Response includes number of earthquakes synced and notifications sent.

#### Option B: Create Test Earthquake
```bash
curl -X POST http://localhost:5000/api/earthquakes \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "test-2024-001",
    "magnitude": 6.5,
    "depth": 25,
    "location": "Dhaka, Bangladesh",
    "latitude": 23.81,
    "longitude": 90.41,
    "timestamp": "2024-01-15T10:30:00Z"
  }'
```

#### Option C: Check User's Notifications
```bash
# First, make sure your user has location data
# Then fetch their earthquake alerts
curl "http://localhost:5000/api/earthquakes/user123/notifications"
```

---

## 🎯 Core Concepts

### Alert Levels
- **Red** (≥7.0): Severe earthquakes → Send to ALL users
- **Orange** (≥6.0): Major earthquakes → Send to ALL users
- **Yellow** (≥4.5): Moderate earthquakes → Send to users within 150km
- **Green** (<4.5): Minor earthquakes → Send to users within 150km

### Notification Trigger
Whenever a new earthquake is created or imported from USGS:
1. System calculates distance from earthquake to each user
2. If distance ≤ 150km OR alert level is Red/Orange → User gets notification
3. Notification includes: distance, magnitude, alert level, coordinates

### Location-Based Filtering
- **Required**: User must have `location.latitude` and `location.longitude`
- **Distance Calculation**: Haversine formula for accuracy
- **Override**: Red/Orange alerts bypass distance filter

---

## 📡 API Endpoints

### Get Earthquakes
```bash
# All earthquakes (paginated)
GET /api/earthquakes?page=1&limit=20

# Recent earthquakes (last 7 days)
GET /api/earthquakes/recent

# High alert earthquakes only
GET /api/earthquakes/high-alert

# Nearby earthquakes (geospatial)
GET /api/earthquakes/location?latitude=23.81&longitude=90.41&maxDistance=100

# Statistics
GET /api/earthquakes/stats
```

### Get User Notifications
```bash
# All earthquake alerts for user
GET /api/earthquakes/:userId/notifications

# Only unread alerts
GET /api/earthquakes/:userId/notifications?read=false

# By alert level
GET /api/earthquakes/:userId/notifications/alert-level/Red

# Notification statistics
GET /api/earthquakes/:userId/notifications/stats
```

### Manage Notifications
```bash
# Mark specific notifications as read
POST /api/earthquakes/:userId/notifications/read
Body: { "notificationIds": ["id1", "id2", "id3"] }

# Or mark ALL as read (empty body)
POST /api/earthquakes/:userId/notifications/read
Body: {}
```

### Admin Operations
```bash
# Create earthquake (auto-notifies users)
POST /api/earthquakes
Body: {
  "eventId": "unique-id",
  "magnitude": 6.5,
  "depth": 25,
  "location": "Location name",
  "latitude": 23.81,
  "longitude": 90.41,
  "timestamp": "2024-01-15T10:30:00Z"
}

# Update earthquake
PUT /api/earthquakes/:id

# Delete earthquake
DELETE /api/earthquakes/:id

# Sync with USGS (imports real earthquakes)
GET /api/earthquakes/sync/usgs

# Cleanup old notifications
POST /api/earthquakes/admin/cleanup-notifications
Body: { "daysOld": 30 }
```

---

## 🔧 Configuration

### Adjust Notification Radius
Edit `backend/services/earthquakeNotificationService.js`:
```javascript
const NOTIFICATION_RADIUS_KM = 150;  // Change to desired km
```

### Adjust Alert Thresholds
Edit `backend/models/Earthquake.js`:
```javascript
export const calculateAlertLevel = (magnitude) => {
  if (magnitude >= 7.0) return 'Red';      // Change 7.0
  if (magnitude >= 6.0) return 'Orange';   // Change 6.0
  if (magnitude >= 4.5) return 'Yellow';   // Change 4.5
  return 'Green';
};
```

### Adjust Cleanup Period
Edit `backend/services/earthquakeNotificationService.js`:
```javascript
export const deleteOldEarthquakeNotifications = async (daysOld = 30) => {
  // Change 30 to desired days
};
```

---

## 🧪 Testing Checklist

### Local Testing
- [ ] `npm install` completes without errors
- [ ] Server starts without mongoose errors
- [ ] Earthquake indexes created on startup
- [ ] Create test earthquake returns notification count
- [ ] USGS sync imports earthquakes
- [ ] User with location receives nearby earthquake notifications
- [ ] User without location still receives Red/Orange alerts

### Integration Testing
- [ ] High alert earthquakes notify all users instantly
- [ ] Moderate earthquakes only notify nearby users
- [ ] Notification distance calculations are accurate
- [ ] Mark as read functionality works
- [ ] Filters by alert level work correctly
- [ ] Statistics aggregation is accurate

### Performance Testing
- [ ] Notification creation < 10 seconds for 1000 users
- [ ] Queries return < 100ms with indexes
- [ ] Geospatial queries efficient with 2dsphere index

---

## 📊 Common Issues & Solutions

### Issue: "Earthquake indexes not created"
**Solution**: Call `createEarthquakeIndexes()` on server startup

### Issue: Users not receiving notifications
**Cause**: Users don't have location data
**Solution**: Ensure `user.location.latitude` and `user.location.longitude` exist

### Issue: High alert earthquakes not reaching all users
**Cause**: Alert level calculation may be wrong
**Solution**: Check magnitude thresholds in `calculateAlertLevel()`

### Issue: Slow geospatial queries
**Cause**: 2dsphere index not created
**Solution**: Verify `createEarthquakeIndexes()` was called

---

## 🎨 Frontend Integration

### React Example
```javascript
import { useState, useEffect } from 'react';

export function EarthquakeAlerts({ userId }) {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch alerts
    fetch(`/api/earthquakes/${userId}/notifications?read=false`)
      .then(r => r.json())
      .then(data => setAlerts(data.data));

    // Fetch stats
    fetch(`/api/earthquakes/${userId}/notifications/stats`)
      .then(r => r.json())
      .then(data => setStats(data.data));
  }, [userId]);

  const markAsRead = async (notificationIds) => {
    await fetch(`/api/earthquakes/${userId}/notifications/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationIds }),
    });
    // Refresh alerts
  };

  return (
    <div className="earthquakes-panel">
      <h2>Earthquake Alerts ({stats?.unread || 0})</h2>
      {alerts.map(alert => (
        <div
          key={alert._id}
          className={`alert alert-${alert.metadata.alertLevel.toLowerCase()}`}
        >
          <strong>Magnitude {alert.metadata.magnitude}</strong>
          <p>{alert.metadata.distance.toFixed(1)}km away</p>
          <p>{alert.message}</p>
          <button onClick={() => markAsRead([alert._id])}>
            Mark as Read
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 📚 Documentation Files

- **Full System Guide**: `EARTHQUAKE_NOTIFICATION_SYSTEM.md`
- **Implementation Summary**: `EARTHQUAKE_IMPLEMENTATION_COMPLETE.md`
- **This Quick Start**: `EARTHQUAKE_QUICK_START.md`

---

## 🎓 Architecture Summary

```
USGS Earthquake API
        ↓
   Sync Endpoint
        ↓
   Create Earthquake
        ↓
   Calculate Alert Level
        ↓
   Automatic Notifications
        ├─ Red/Orange → All Users
        └─ Yellow/Green → Users within 150km
        ↓
   Stored in Database
        ↓
   User Fetches via API
        ↓
   Display in UI
```

---

## 🚀 Next Steps

1. **Install Dependencies**: `npm install` in backend
2. **Test Endpoints**: Use curl or Postman to test
3. **Create Test Data**: Sync with USGS or create test earthquake
4. **Build Frontend**: Create earthquake alert UI component
5. **Add WebSocket**: For real-time alerts (optional)
6. **Mobile Alerts**: Push notifications (optional)

---

## ✨ You're All Set!

The earthquake notification system is fully implemented and ready to use. Users will automatically receive location-based earthquake alerts, with high-severity earthquakes reaching everyone instantly.

**No Mongoose. Pure MongoDB. Perfect earthquakes. ⚡**

For questions, refer to the complete system documentation: `EARTHQUAKE_NOTIFICATION_SYSTEM.md`
