# Weekly Report Limit Feature - Quick Test Guide 🧪

## ⚡ Quick Start Testing

### Setup
1. Ensure backend is running on `http://localhost:5000`
2. Ensure frontend is running on `http://localhost:3000`
3. Have a test user account ready

---

## Test Cases (5 minutes total)

### ✅ Test 1: Display Weekly Limit (30 seconds)
```
1. Log in as a user
2. Go to: /dashboard/user/reports/new
3. ✓ See weekly limit display with progress bar
4. ✓ Shows format: "Remaining: X/2"
5. ✓ Progress bar visible (should be animated)
```

**Expected Result:** Weekly limit card displays correctly with current quota

---

### ✅ Test 2: Submit First Report (1 minute)
```
1. On the Submit Report form
2. Fill out ALL required fields:
   - Category: Any category
   - Subcategory: Any option
   - Title: "Test Report 1"
   - Description: "This is a test report..."
   - Division: Select any division
   - District: Select matching district
   - Address: "Test Address"
   - Click "Get Current Location"
   - Severity: "High"
   - Upload at least 1 image

3. Click "Submit Report"
4. ✓ Success toast appears: "🎉 Report Submitted Successfully!"
5. ✓ Toast shows: "Remaining reports this week: 1 available"
6. ✓ Redirects to /dashboard/user/my-reports
```

**Expected Result:** Report created, user sees remaining quota (1/2 now)

---

### ✅ Test 3: Submit Second Report (1 minute)
```
1. Go back to /dashboard/user/reports/new
2. ✓ Weekly limit shows: "1 remaining (1/2 used)" 
3. ✓ Progress bar is half-full (orange)
4. Fill out report form again with different title
5. Click "Submit Report"
6. ✓ Success toast: "0 available remaining"
7. ✓ Note: "You've used all your reports for this week"
```

**Expected Result:** Second report submitted, quota now 0/2

---

### ✅ Test 4: Hit Weekly Limit (1 minute)
```
1. Go to /dashboard/user/reports/new
2. ✓ Weekly limit shows: "🔴 0 remaining (2/2 used)"
3. ✓ Progress bar is FULL RED
4. Fill out report form for 3rd report
5. Click "Submit Report"
6. ✓ Warning toast appears: "⚠️ Weekly Limit Reached"
7. ✓ Toast shows:
   - "Reports submitted: 2/2"
   - "Reports completed: 0"
   - "Reset available in: 6 day(s)"
   - "💡 Tip: Complete your current reports..."
8. ✓ Form submission prevented, user stays on form
9. ✓ Toast duration: ~6 seconds
```

**Expected Result:** User gets 429 error, limit enforced with helpful toast

---

### ✅ Test 5: API Testing (1 minute 30 seconds)

#### Test 5a: Get Weekly Limit Info
```bash
curl -X GET http://localhost:5000/api/users/weekly-report-limit \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Weekly report limit info fetched successfully",
  "data": {
    "weeklyLimit": 2,
    "submittedThisWeek": 2,
    "completedThisWeek": 0,
    "remaining": 0,
    "daysLeft": 6,
    "canSubmit": false
  }
}
```

#### Test 5b: Try to Submit When at Limit
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Report 3",
    "description": "This should fail...",
    "problemType": "road",
    "category": "Road & Infrastructure Issues",
    "severity": "high",
    "location": {
      "address": "Test Address, District, Division",
      "district": "Dhaka",
      "division": "Dhaka Division",
      "coordinates": [90.4074, 23.8103]
    },
    "images": ["base64ImageString..."]
  }'
```

**Expected Response (429):**
```json
{
  "success": false,
  "message": "You've reached your weekly limit of 2 reports. Try again after 6 days.",
  "limitInfo": {
    "weeklyLimit": 2,
    "submitted": 2,
    "completed": 0
  },
  "daysLeft": 6
}
```

---

## Visual Checks 🎨

### Weekly Limit Display States

**Green State (2 reports available):**
- Background: Light green (#D1FAE5)
- Icon: 🟢
- Progress bar: Empty (0% filled)
- Text: "2 remaining (0/2 used)"

**Orange State (1 report available):**
- Background: Light orange (#FEF3C7)
- Icon: 🟠
- Progress bar: 50% filled, orange
- Text: "1 remaining (1/2 used)"

**Red State (0 reports available):**
- Background: Light red (#FEE2E2)
- Icon: 🔴
- Progress bar: 100% filled, red
- Text: "🔴 0 remaining (2/2 used)"

---

## Toast Notification Checks ✅

### Success Toast (After submitting when limit NOT reached)
```
Location: Top-right of screen
Duration: 4 seconds
Border: Green (left side)
Content:
  🎉 Report Submitted Successfully!
  
  Your report has been submitted and will be 
  reviewed by the authorities.
  
  Remaining reports this week: X available
```

### Limit Exceeded Toast (When limit IS reached)
```
Location: Top-right of screen
Duration: 6 seconds
Border: Orange (left side)
Content:
  ⚠️ Weekly Limit Reached
  
  You've reached your weekly report submission limit.
  
  Reports submitted: 2/2
  Reports completed: 0
  Reset available in: X day(s)
  
  💡 Tip: Complete your current reports to submit more!
```

---

## Database Checks 🗄️

After submitting 2 reports, check MongoDB:

```javascript
// Open MongoDB Shell
db.users.findOne({ email: "your-test-user@example.com" })

// Look for this structure:
{
  _id: ObjectId(...),
  email: "...",
  name: "...",
  reportSubmissions: {
    weeklyLimit: 2,
    submittedThisWeek: 2,
    completedThisWeek: 0,
    lastResetDate: ISODate("2024-01-15T10:30:00Z")
  }
}
```

---

## Debugging Tips 🔧

### If weekly limit doesn't show:
1. Check browser console for errors
2. Verify token is valid: `localStorage.getItem('nn_auth_token')`
3. Network tab: Is GET `/api/users/weekly-report-limit` returning 200?

### If toast doesn't show:
1. Verify `react-hot-toast` is installed
2. Check browser console for toast errors
3. Verify form is actually submitting (check Network tab)

### If 429 error doesn't trigger:
1. Verify you've actually submitted 2 reports
2. Check backend logs for limit checking
3. Verify database has correct `submittedThisWeek` value

### If progress bar doesn't change color:
1. Check CSS was added to `globals.css`
2. Inspect element to verify classes are applied
3. Browser dev tools → Elements → check for `.report-progress-0/1/2` classes

---

## Expected Behavior Summary

| Action | Expected Result |
|--------|-----------------|
| Visit form with 0 reports | Green display (2/2), empty progress bar |
| Submit 1st report | Success toast, display shows 1/2, 50% progress bar |
| Submit 2nd report | Success toast, display shows 0/2, full progress bar (orange) |
| Try 3rd submission | Warning toast (429), form stays on page, no redirect |
| Wait 7 days | Display resets to 2/2, green state |

---

## Pass/Fail Criteria

### ✅ PASS if:
- [x] Weekly limit displays before submitting
- [x] Can submit 2 reports successfully
- [x] 3rd submission is blocked with 429 error
- [x] Toast notifications show correct messages
- [x] Progress bar changes color: green → orange → red
- [x] API endpoints return correct status codes
- [x] Database updates correctly

### ❌ FAIL if:
- [ ] Weekly limit doesn't display
- [ ] Can submit more than 2 reports
- [ ] Error toast doesn't appear for 3rd submission
- [ ] API returns wrong status code
- [ ] Toast shows incorrect information
- [ ] Progress bar doesn't update

---

## Quick Reset for Testing

**To reset a user's weekly limit and test again:**

Option 1: Wait 7 days (not practical! 😄)

Option 2: Use MongoDB to reset (admin only):
```javascript
db.users.updateOne(
  { email: "test@example.com" },
  {
    $set: {
      "reportSubmissions.submittedThisWeek": 0,
      "reportSubmissions.completedThisWeek": 0,
      "reportSubmissions.lastResetDate": new Date()
    }
  }
)
```

Option 3: Create a new test user account for each test cycle

---

## Feature Commit Reference

**Commit:** `5a7d46b`
**Message:** "feat: implement weekly report submission limit with perfect toast notifications"

**Files Modified:**
- `frontend/src/app/dashboard/user/reports/new/page.tsx` - Added weekly limit display & error handling
- `frontend/src/app/globals.css` - Added progress bar styling
- `backend/controllers/userController.js` - Added getWeeklyReportLimit function
- `backend/routes/userRoutes.js` - Added new route for limit info

---

## Time Estimates for Testing

| Test | Duration |
|------|----------|
| Test 1: Display | 30 sec |
| Test 2: First submission | 1 min |
| Test 3: Second submission | 1 min |
| Test 4: Hit limit | 1 min |
| Test 5: API testing | 1.5 min |
| **Total** | **~5 min** |

---

## Support Resources

📚 Full Documentation: See `WEEKLY_REPORT_LIMIT_FEATURE.md`

🐛 Issues? Check:
1. Browser console (F12)
2. Network tab (for API calls)
3. MongoDB data
4. Server logs

---

**Happy Testing! 🚀**
