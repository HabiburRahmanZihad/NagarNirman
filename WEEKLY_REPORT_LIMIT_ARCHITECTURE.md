# Weekly Report Limit Feature - Visual Architecture 📊

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                           │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  /dashboard/user/reports/new (NewReportPage Component)       │   │
│  │                                                               │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │ Weekly Limit Display Card                              │  │   │
│  │  │  ├─ Status Icon: 🟢/🟠/🔴                              │  │   │
│  │  │  ├─ Progress Bar (Green → Orange → Red)                │  │   │
│  │  │  ├─ Quota: "X remaining (Y/2 used)"                    │  │   │
│  │  │  ├─ Completed: "X reports completed"                   │  │   │
│  │  │  ├─ Reset Timer: "X days until reset"                  │  │   │
│  │  │  └─ Helpful Tip: "Complete current reports..."         │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  │                                                               │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │ Report Form (Category, Title, Description, Images...)  │  │   │
│  │  │                                                         │  │   │
│  │  │  [Submit Report Button]                                │  │   │
│  │  │          ↓                                              │  │   │
│  │  │    Form Validation                                     │  │   │
│  │  │          ↓                                              │  │   │
│  │  │    Send POST /api/reports                              │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  │                                                               │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │ Toast Notification System (react-hot-toast)            │  │   │
│  │  │                                                         │  │   │
│  │  │ Success Case (201):                                    │  │   │
│  │  │  🎉 Report Submitted Successfully!                     │  │   │
│  │  │  Remaining reports: X                                  │  │   │
│  │  │  [Auto-dismiss after 4 seconds]                        │  │   │
│  │  │                                                         │  │   │
│  │  │ Limit Exceeded Case (429):                             │  │   │
│  │  │  ⚠️ Weekly Limit Reached                               │  │   │
│  │  │  Reports submitted: 2/2                                │  │   │
│  │  │  Reset in: X days                                      │  │   │
│  │  │  [Auto-dismiss after 6 seconds]                        │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
                        HTTP POST/GET Requests
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                       │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Routes (userRoutes.js)                                      │   │
│  │                                                               │   │
│  │  GET  /api/users/weekly-report-limit                         │   │
│  │       └→ Controller: getWeeklyReportLimit()                  │   │
│  │          ↓                                                    │   │
│  │       Calls: User.checkReportSubmissionLimit(userId)         │   │
│  │          ↓                                                    │   │
│  │       Returns: { weeklyLimit, submitted, completed,          │   │
│  │                  remaining, daysLeft, canSubmit }            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Routes (reportRoutes.js)                                    │   │
│  │                                                               │   │
│  │  POST /api/reports (protected)                               │   │
│  │       └→ Controller: createNewReport()                       │   │
│  │                                                               │   │
│  │          1. Validate request data                            │   │
│  │             ↓                                                 │   │
│  │          2. Call: User.checkReportSubmissionLimit()          │   │
│  │             ↓                                                 │   │
│  │             ┌─ Can Submit? → Continue to step 3              │   │
│  │             │                                                 │   │
│  │             └─ Limit Exceeded? → Return 429 + limitInfo      │   │
│  │                ├─ weeklyLimit: 2                             │   │
│  │                ├─ submitted: 2                               │   │
│  │                ├─ completed: 0                               │   │
│  │                └─ daysLeft: X                                │   │
│  │             ↓                                                 │   │
│  │          3. Create report in database                        │   │
│  │             ↓                                                 │   │
│  │          4. Call: User.incrementReportSubmission(userId)     │   │
│  │             (Updates submittedThisWeek++)                    │   │
│  │             ↓                                                 │   │
│  │          5. Return 201 + report + limitInfo                  │   │
│  │             ├─ remaining: X                                  │   │
│  │             └─ submitted: Y                                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  User Model (User.js) - Helper Functions                     │   │
│  │                                                               │   │
│  │  1. checkReportSubmissionLimit(userId)                       │   │
│  │     ├─ Fetch user document from DB                           │   │
│  │     ├─ Check if 7 days have passed since lastResetDate       │   │
│  │     │  ├─ NO  → Use current values                           │   │
│  │     │  └─ YES → Auto-reset counters & update lastResetDate   │   │
│  │     ├─ Calculate remaining = weeklyLimit - submittedThisWeek │   │
│  │     ├─ Calculate daysLeft = 7 - daysSinceLastReset           │   │
│  │     └─ Return { canSubmit, remaining, message, etc. }        │   │
│  │                                                               │   │
│  │  2. incrementReportSubmission(userId)                        │   │
│  │     └─ Update: submittedThisWeek++                           │   │
│  │                                                               │   │
│  │  3. incrementCompletedReport(userId)                         │   │
│  │     └─ Update: completedThisWeek++                           │   │
│  │     └─ (Future: Unlocks additional submissions)              │   │
│  │                                                               │   │
│  │  4. resetWeeklyReportLimit(userId)                           │   │
│  │     ├─ Reset: submittedThisWeek = 0                          │   │
│  │     ├─ Reset: completedThisWeek = 0                          │   │
│  │     └─ Update: lastResetDate = now()                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
                        Database Queries
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                               │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Users Collection                                             │   │
│  │                                                               │   │
│  │ Document:                                                    │   │
│  │ {                                                            │   │
│  │   _id: ObjectId("..."),                                      │   │
│  │   email: "user@example.com",                                 │   │
│  │   name: "John Doe",                                          │   │
│  │   role: "user",                                              │   │
│  │   reportSubmissions: {                    ← NEW FIELD       │   │
│  │     weeklyLimit: 2,                       ← Config           │   │
│  │     submittedThisWeek: 1,                 ← Track            │   │
│  │     completedThisWeek: 0,                 ← Track            │   │
│  │     lastResetDate: ISODate("2024-01-15")  ← 7-day window    │   │
│  │   },                                                         │   │
│  │   createdAt: ISODate("..."),                                 │   │
│  │   updatedAt: ISODate("...")                                  │   │
│  │ }                                                            │   │
│  │                                                               │   │
│  │ Database Operations:                                         │   │
│  │  ├─ READ: Find user by _id                                  │   │
│  │  ├─ UPDATE: Increment submittedThisWeek                     │   │
│  │  ├─ UPDATE: Increment completedThisWeek                     │   │
│  │  └─ UPDATE: Reset counters & lastResetDate                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ Reports Collection                                           │   │
│  │                                                               │   │
│  │ Document:                                                    │   │
│  │ {                                                            │   │
│  │   _id: ObjectId("..."),                                      │   │
│  │   userId: ObjectId("..."),                                   │   │
│  │   title: "Street light not working",                         │   │
│  │   description: "...",                                        │   │
│  │   status: "pending",                                         │   │
│  │   createdAt: ISODate("..."),                                 │   │
│  │   ...                                                        │   │
│  │ }                                                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Weekly Limit State Machine

```
┌────────────────────────────────────────────────────────────────────┐
│                    WEEKLY LIMIT STATES                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   START                                                             │
│     │                                                               │
│     └─→ ┌──────────────────────────────────────────────────┐       │
│         │ STATE 1: GREEN (2 Reports Available)             │       │
│         ├──────────────────────────────────────────────────┤       │
│         │ Condition:                                        │       │
│         │  - submittedThisWeek = 0                         │       │
│         │  - remaining = 2                                 │       │
│         │                                                  │       │
│         │ Actions Available:                               │       │
│         │  ✓ Submit 1st report                            │       │
│         │  ✓ Submit 2nd report                            │       │
│         │                                                  │       │
│         │ UI Display:                                      │       │
│         │  🟢 Green card, empty progress bar              │       │
│         │  "2 remaining (0/2 used)"                        │       │
│         └──────────────────────────────────────────────────┘       │
│         │ User submits 1st report                                   │
│         │ Calls: incrementReportSubmission()                        │
│         │ submittedThisWeek++  (0 → 1)                             │
│         │ remaining--         (2 → 1)                              │
│         └──→ ┌───────────────────────────────────────────┐        │
│             │ STATE 2: ORANGE (1 Report Available)       │        │
│             ├───────────────────────────────────────────┤        │
│             │ Condition:                                │        │
│             │  - submittedThisWeek = 1                 │        │
│             │  - remaining = 1                         │        │
│             │                                          │        │
│             │ Actions Available:                       │        │
│             │  ✓ Submit 1 more report                 │        │
│             │  ✓ Complete a report (unlock)           │        │
│             │                                          │        │
│             │ UI Display:                              │        │
│             │  🟠 Orange card, 50% progress bar        │        │
│             │  "1 remaining (1/2 used)"                │        │
│             └───────────────────────────────────────────┘        │
│             │                           │ (Path A: Submit)       │
│             │ Path B: Complete 1        │                        │
│             │ report                    │ User submits 2nd       │
│             │ (completedThisWeek++)     │ Calls:                 │
│             │                           │ incrementReportSubmission()
│             │                           │ submittedThisWeek++    │
│             │                           │ remaining--            │
│             └─────────────┬─────────────→ ┌──────────────────┐   │
│                           │              │ STATE 3: RED      │   │
│                           │              │ (0 Reports)       │   │
│                           │              ├──────────────────┤   │
│                           │              │ Condition:       │   │
│                           │              │  - submitted = 2 │   │
│                           │              │  - remaining = 0 │   │
│                           │              │                  │   │
│                           │              │ Actions:         │   │
│                           │              │  ✗ Cannot submit │   │
│                           │              │  ✓ Must wait or  │   │
│                           │              │    complete      │   │
│                           │              │                  │   │
│                           │              │ UI Display:      │   │
│                           │              │  🔴 Red card,    │   │
│                           │              │  100% progress   │   │
│                           │              │  "0 remaining"   │   │
│                           │              │  Form disabled   │   │
│                           │              │                  │   │
│                           │              │ HTTP 429:        │   │
│                           │              │  ⚠️ Limit toast  │   │
│                           │              │  Form rejected   │   │
│                           │              └──────────────────┘   │
│                           │              │                       │
│                           │    ┌─────────┴────────────┐          │
│                           │    │                      │          │
│                           │    │ (Option A)           │          │
│                           │    │ Wait 7 days          │          │
│                           │    │ Auto-reset occurs    │          │
│                           │    │ lastResetDate passed │          │
│                           │    │                      │          │
│                           │    ↓                      │          │
│                           │ ┌─────────────────────┐  │          │
│                           │ │ RESET STATE         │  │          │
│                           │ ├─────────────────────┤  │          │
│                           │ │submittedThisWeek=0  │  │          │
│                           │ │completedThisWeek=0  │  │          │
│                           │ │lastResetDate=now()  │  │          │
│                           │ │Return to STATE 1    │  │          │
│                           │ └─────────────────────┘  │          │
│                           │       ↑                  │          │
│                           │       │                  │          │
│                           │       └──────────────────┘          │
│                           │                                      │
│                           │ (Option B: Complete reports)        │
│                           │ Calls: incrementCompletedReport()    │
│                           │ completedThisWeek++                  │
│                           │                                      │
│                           └─→ Can submit more reports            │
│                               (Feature for Phase 2)              │
│                                                                   │
└────────────────────────────────────────────────────────────────────┘
```

---

## Frontend-Backend Communication Flow

```
FRONTEND ACTIONS                  HTTP METHOD/STATUS    BACKEND RESPONSE
─────────────────────────────────────────────────────────────────────

[1] User visits form
    │
    └─→ useEffect on mount
        │
        └─→ fetch(/api/users/weekly-report-limit)
            │
            GET /api/users/weekly-report-limit ──→ [Protected Route]
                                                    │
                                                    → Controller: getWeeklyReportLimit
                                                    → Call: User.checkReportSubmissionLimit
                                                    │
                                                    ← 200 OK
                                                    {
                                                      weeklyLimit: 2,
                                                      submitted: 0,
                                                      remaining: 2,
                                                      daysLeft: 7,
                                                      canSubmit: true
                                                    }
        │
        └─→ setWeeklyLimit(data)
            setIsLoadingLimit(false)


[2] User fills form & clicks Submit
    │
    └─→ onSubmit handler
        │
        └─→ fetch(POST /api/reports)
            │
            POST /api/reports ──→ [Protected Route]
            with { title, description, images, ... }
                │
                → Controller: createNewReport
                → Call: User.checkReportSubmissionLimit
                │
                ├─ If canSubmit = false:
                │  │
                │  ← 429 Too Many Requests
                │  {
                │    message: "Weekly limit reached...",
                │    limitInfo: { submitted: 2, ... },
                │    daysLeft: 5
                │  }
                │  │
                │  └─→ Frontend: Show warning toast
                │     "⚠️ Weekly Limit Reached"
                │     Form submission prevented
                │     User stays on form
                │
                └─ If canSubmit = true:
                  │
                  → Create report in DB
                  → Call: User.incrementReportSubmission
                  │
                  ← 201 Created
                  {
                    data: { report details },
                    limitInfo: { remaining: 1, ... }
                  }
                  │
                  └─→ Frontend: Show success toast
                     "🎉 Report Submitted!"
                     "Remaining: 1 report this week"
                     Redirect to /dashboard/user/my-reports
```

---

## Weekly Reset Logic

```
┌─────────────────────────────────────────────────────┐
│        WEEKLY AUTO-RESET MECHANISM                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│ On every API call to /api/reports:                  │
│                                                       │
│  1. Fetch user's lastResetDate from DB              │
│  2. Calculate: daysSinceLastReset                   │
│     = (NOW - lastResetDate) / (24*60*60*1000)       │
│  3. Check: Is daysSinceLastReset >= 7 days?        │
│     │                                                │
│     ├─ NO  → Use current counters                   │
│     │         (submittedThisWeek, completedThisWeek)
│     │                                                │
│     └─ YES → AUTO-RESET!                            │
│             submittedThisWeek = 0                   │
│             completedThisWeek = 0                   │
│             lastResetDate = NOW()                   │
│             Update database                         │
│             Use new counters                        │
│                                                       │
│ Result:                                              │
│  User can always submit 2 new reports               │
│  Every 7 days automatically                         │
│  No manual admin intervention needed                │
│                                                       │
└─────────────────────────────────────────────────────┘

EXAMPLE TIMELINE:
─────────────────

Monday 12:00 PM
  └─→ User submitted 2 reports
      submittedThisWeek = 2
      lastResetDate = Monday 12:00 PM

Monday-Sunday (6 days pass)

Next Sunday 11:59 PM
  └─→ If user tries to submit
      daysSinceLastReset = 6.9 days
      Is 6.9 >= 7? NO
      Still LIMITED to 0 remaining

Next Monday 12:01 AM
  └─→ User tries to submit
      daysSinceLastReset = 7.001 days
      Is 7.001 >= 7? YES
      AUTO-RESET!
      submittedThisWeek = 0
      lastResetDate = Monday 12:01 AM
      Can now submit 2 NEW reports!
```

---

## HTTP Status Codes Used

```
┌──────────────────────────────────────────────────────┐
│ STATUS CODE REFERENCE                                │
├──────────────────────────────────────────────────────┤
│                                                       │
│ 200 OK                                               │
│ └─ GET /api/users/weekly-report-limit (success)      │
│    Response: Current user's limit info               │
│                                                       │
│ 201 Created                                          │
│ └─ POST /api/reports (success, limit not exceeded)  │
│    Response: Report created + remaining quota        │
│                                                       │
│ 401 Unauthorized                                     │
│ └─ Any request without valid token                   │
│    Response: "Please log in"                         │
│                                                       │
│ 429 Too Many Requests                                │
│ └─ POST /api/reports (weekly limit exceeded)         │
│    Response: Limit info + days until reset           │
│    Frontend Action: Show warning toast, reject form  │
│                                                       │
│ 500 Internal Server Error                            │
│ └─ Database or server errors                         │
│    Response: Error message                           │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## Component State Lifecycle

```
┌─────────────────────────────────────────────────────┐
│ COMPONENT MOUNT & LIFECYCLE                          │
├─────────────────────────────────────────────────────┤
│                                                       │
│ useEffect([isAuthenticated, user?.role])            │
│   ├─→ IF user is authenticated:                      │
│   │   └─→ Call: fetchWeeklyLimit()                   │
│   │       setIsLoadingLimit(true)                    │
│   │       GET /api/users/weekly-report-limit         │
│   │         │                                        │
│   │         ├─ Success: setWeeklyLimit(data)        │
│   │         │            setIsLoadingLimit(false)    │
│   │         │                                        │
│   │         └─ Error: console.warn                   │
│   │                  setIsLoadingLimit(false)        │
│   │                                                  │
│   └─ ELSE: setIsLoadingLimit(false)                  │
│                                                       │
│ During Form Render:                                  │
│   ├─ IF isLoadingLimit:                              │
│   │  └─→ Show skeleton loader                        │
│   │      (animated gray box)                         │
│   │                                                  │
│   └─ ELSE IF weeklyLimit is loaded:                  │
│      └─→ Display limit card with:                    │
│          ├─ Status icon (🟢/🟠/🔴)                  │
│          ├─ Progress bar                             │
│          ├─ Quota info (X/2)                         │
│          ├─ Days until reset                         │
│          └─ Helpful tip                              │
│                                                       │
│ On Form Submit:                                      │
│   ├─→ Local validation                               │
│   ├─→ POST /api/reports                              │
│   │   ├─ Success (201):                              │
│   │   │  ├─ Show success toast                       │
│   │   │  ├─ reset() form                             │
│   │   │  └─ Redirect after 2 seconds                 │
│   │   │                                              │
│   │   └─ Limit Exceeded (429):                       │
│   │      ├─ Show warning toast                       │
│   │      └─ Keep user on form (no redirect)          │
│   │                                                  │
│   └─→ Error (other):                                 │
│       └─ Show error toast                            │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow Summary

```
User Input
    ↓
Frontend Form Validation
    ↓
Convert Images to Base64
    ↓
POST /api/reports (with auth token)
    ↓
Backend Auth Middleware (verify token)
    ↓
reportController.createNewReport()
    ├─→ User.checkReportSubmissionLimit()
    │   ├─→ Database: Find user by ID
    │   ├─→ Check if 7 days since lastResetDate
    │   ├─→ If expired: Reset counters (DB update)
    │   └─→ Return: { canSubmit, remaining, ... }
    │
    ├─ If NOT canSubmit:
    │  └─→ Return 429 + limitInfo
    │
    └─ If canSubmit:
       ├─→ Database: Create new report
       ├─→ User.incrementReportSubmission()
       │  └─→ Database: submittedThisWeek++
       └─→ Return 201 + report + limitInfo
           
Frontend Response Handler
    │
    ├─ If 429 (Limit Exceeded):
    │  ├─→ Parse limitInfo from response
    │  ├─→ Show warning toast with details
    │  └─→ Keep user on form
    │
    └─ If 201 (Success):
       ├─→ Parse remaining from response
       ├─→ Show success toast with quota
       ├─→ Reset form state
       └─→ Redirect to dashboard after 2 sec

User Sees Toast Notification
    ↓
Either:
 A) Views success message, gets redirected
 B) Sees warning, must complete or wait for reset
```

---

This architecture ensures a smooth, user-friendly experience while maintaining strict backend enforcement of the weekly limit policy.
