# 📸 Task Workflow Visual Guide

## 🎯 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TASK WORKFLOW SYSTEM                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  AUTHORITY/SUPERADMIN ASSIGNS TASK                                   │
│  ────────────────────────────────────────────────────────────────   │
│  • Select problem solver/NGO                                         │
│  • Set priority (low/medium/high/urgent)                            │
│  • Assign task                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STATUS: ASSIGNED          PROGRESS: 50%                            │
│  ────────────────────────────────────────────────────────────────   │
│  Solver sees: "Accept Task" button (GREEN)                          │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [Solver Clicks "Accept Task"]
                              │
┌─────────────────────────────────────────────────────────────────────┐
│  STATUS: ACCEPTED          PROGRESS: 75%                            │
│  ────────────────────────────────────────────────────────────────   │
│  Solver sees: "Start Working" button (BLUE)                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [Solver Clicks "Start Working"]
                              │
┌─────────────────────────────────────────────────────────────────────┐
│  STATUS: IN-PROGRESS       PROGRESS: 75%                            │
│  ────────────────────────────────────────────────────────────────   │
│  Solver working on task...                                          │
│  Solver sees: "Submit Proof" button (PURPLE)                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [Solver Clicks "Submit Proof"]
                              │
┌─────────────────────────────────────────────────────────────────────┐
│  PROOF SUBMISSION MODAL                                              │
│  ────────────────────────────────────────────────────────────────   │
│  📸 Upload Images (Multiple):                                       │
│     ┌────┐ ┌────┐ ┌────┐                                           │
│     │ 1  │ │ 2  │ │ 3  │                                           │
│     └────┘ └────┘ └────┘                                           │
│  ✏️  Description:                                                   │
│     ┌─────────────────────────────────────┐                        │
│     │ Cleaned the area, removed debris... │                        │
│     └─────────────────────────────────────┘                        │
│  [Cancel]  [Submit Proof]                                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [Solver Submits]
                              │
┌─────────────────────────────────────────────────────────────────────┐
│  STATUS: SUBMITTED         PROGRESS: 90%                            │
│  ────────────────────────────────────────────────────────────────   │
│  Solver sees: "Waiting for Review..." (BLUE)                        │
│  Authority sees: Task appears in "Review Tasks" page                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ [Authority Reviews]
                              │
┌─────────────────────────────────────────────────────────────────────┐
│  AUTHORITY REVIEW MODAL                                              │
│  ────────────────────────────────────────────────────────────────   │
│  📸 View Proof Images                                               │
│  📝 Read Description                                                │
│  👤 View Solver Info                                                │
│                                                                      │
│  Choose Action:                                                      │
│  ┌─────────────┐  ┌─────────────┐                                  │
│  │   APPROVE   │  │   REJECT    │                                  │
│  └─────────────┘  └─────────────┘                                  │
└─────────────────────────────────────────────────────────────────────┘
                    │                    │
        ┌───────────┘                    └───────────┐
        ▼                                            ▼
┌──────────────────────┐              ┌──────────────────────┐
│    APPROVE PATH      │              │    REJECT PATH       │
│    ──────────────    │              │    ──────────────    │
│ • Set Points         │              │ • Write Reason       │
│ • Rate (1-5 stars)   │              │ • Submit Rejection   │
│ • Add Feedback       │              │                      │
│ • Submit Approval    │              │                      │
└──────────────────────┘              └──────────────────────┘
        │                                            │
        ▼                                            ▼
┌──────────────────────┐              ┌──────────────────────┐
│ STATUS: COMPLETED    │              │ STATUS: REJECTED     │
│ PROGRESS: 100% ✅    │              │ PROGRESS: 75% ❌     │
│ ──────────────────   │              │ ──────────────────   │
│ ✅ Task Done!        │              │ ⚠️  Needs Work       │
│ 💰 Points Awarded    │              │ 📝 Feedback Shown    │
│ ⭐ Rating Saved      │              │ 🔄 Can Resubmit      │
│ 📊 Report Resolved   │              │                      │
└──────────────────────┘              └──────────────────────┘
                                                    │
                                                    ▼
                                      [Solver Clicks "Resubmit Proof"]
                                                    │
                                                    ▼
                                      ┌──────────────────────┐
                                      │ Resubmission Count++ │
                                      │ Back to Proof Modal  │
                                      └──────────────────────┘
                                                    │
                                                    └─────┐
                                                          │
        ┌─────────────────────────────────────────────────┘
        │
        ▼ [Loops back to Submit Proof]
```

## 🎨 UI Components

### 1. Problem Solver Task Card

```
┌───────────────────────────────────────────────────┐
│ ████████████████░░░░░░░░░ 75%                    │ ← Progress Bar
├───────────────────────────────────────────────────┤
│  [Accepted] 🟡                     75%            │ ← Status Badge
│                                                    │
│  🎯 Clean Drainage System                         │ ← Title
│  Clear blocked drains on Main Street...           │ ← Description
│                                                    │
│  📍 Dhaka, Dhaka Division                         │ ← Location
│                                                    │
│  ┌──────────────────────────────────────────┐    │
│  │  [Start Working] 🚀                      │    │ ← Action Button
│  └──────────────────────────────────────────┘    │
└───────────────────────────────────────────────────┘
```

### 2. Proof Submission Modal

```
┌───────────────────────────────────────────────────────┐
│  Submit Work Proof                          [X]       │
│  Upload images and description of completed work      │
├───────────────────────────────────────────────────────┤
│                                                        │
│  Upload Proof Images *                                │
│  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │      │  │      │  │      │                        │
│  │ IMG1 │  │ IMG2 │  │ IMG3 │                        │
│  │  [X] │  │  [X] │  │  [X] │  ← Remove buttons      │
│  └──────┘  └──────┘  └──────┘                        │
│                                                        │
│  ┌────────────────────────────────────────────┐      │
│  │  📸 Click to upload images                 │      │
│  │  PNG, JPG up to 5MB each                   │      │
│  └────────────────────────────────────────────┘      │
│                                                        │
│  Work Description *                                   │
│  ┌────────────────────────────────────────────┐      │
│  │ We cleaned the drainage system and         │      │
│  │ removed all debris. Used proper tools...   │      │
│  │                                             │      │
│  └────────────────────────────────────────────┘      │
│                                                        │
│  [Cancel]              [Submit Proof] 📤              │
└───────────────────────────────────────────────────────┘
```

### 3. Authority Review Modal

```
┌───────────────────────────────────────────────────────┐
│  Review Task Submission                      [X]       │
├───────────────────────────────────────────────────────┤
│                                                        │
│  Task: Clean Drainage System                          │
│  Solver: John Doe (@johndoe)                          │
│  Priority: High 🔴                                    │
│  Resubmissions: 0                                     │
│                                                        │
│  📸 Proof Images:                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐                        │
│  │      │  │      │  │      │                        │
│  │ IMG1 │  │ IMG2 │  │ IMG3 │  ← Click to enlarge    │
│  └──────┘  └──────┘  └──────┘                        │
│                                                        │
│  📝 Description:                                      │
│  We cleaned the drainage system and removed all       │
│  debris. Used proper tools and sanitized the area.    │
│                                                        │
│  ────────────────────────────────────────────         │
│                                                        │
│  Choose Action:                                        │
│  [ Approve ]  [ Reject ]                              │
│                                                        │
│  ─── APPROVE SECTION ───                              │
│  Points: [50] (Suggested: 50)                         │
│  Rating: ⭐⭐⭐⭐⭐                                      │
│  Feedback:                                            │
│  ┌────────────────────────────────────────────┐      │
│  │ Excellent work! Very thorough cleanup.     │      │
│  └────────────────────────────────────────────┘      │
│                                                        │
│  [Cancel]              [✓ Approve Task]               │
└───────────────────────────────────────────────────────┘
```

### 4. Rejection Notice (on Task Card)

```
┌───────────────────────────────────────────────────┐
│  ⚠️  Rejection Feedback:                          │
│  ─────────────────────────────────────────────    │
│  The images are blurry and don't show the         │
│  completed work clearly. Please retake photos     │
│  in better lighting and show before/after views.  │
│                                                    │
│  Resubmission #1                                  │
└───────────────────────────────────────────────────┘
```

## 📊 Dashboard Statistics

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│   Total  │ Assigned │  Ongoing │Submitted │Completed │ Rejected │
│    🎯    │    ⏰    │    📈    │    📤    │    ✅    │    ⚠️    │
│    24    │     3    │     8    │     5    │     7    │     1    │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

## 🎨 Color Scheme

### Progress Colors:
- **50%** - 🟠 Orange (Assigned)
- **75%** - 🟡 Yellow (Accepted/In Progress/Rejected)
- **90%** - 🔵 Blue (Submitted)
- **100%** - 🟢 Green (Completed)

### Status Colors:
- **Assigned** - Gray
- **Accepted** - Yellow
- **In Progress** - Purple
- **Submitted** - Blue
- **Rejected** - Red
- **Completed** - Green
- **Verified** - Purple

### Button Colors:
- **Accept** - Green gradient
- **Start** - Blue gradient
- **Submit** - Purple gradient
- **Resubmit** - Orange gradient
- **Approve** - Green gradient
- **Reject** - Red gradient

## 🔔 Toast Notifications

```
┌─────────────────────────────────────────┐
│  ✅ Success!                            │
│  Task accepted! You can now start       │
│  working on it. 🎯                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🚀 Task Started!                       │
│  Good luck! Don't forget to submit      │
│  proof when done.                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📤 Proof Submitted!                    │
│  Your submission is now under review.   │
│  Waiting for approval. ✅               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🎉 Task Approved!                      │
│  You earned 50 points! Great work! 💰   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ⚠️  Task Rejected                      │
│  Please review the feedback and         │
│  resubmit your work.                    │
└─────────────────────────────────────────┘
```

## 🎯 User Journey Map

### Problem Solver Journey:
```
1. 📥 Receive Task Notification
2. 👀 View Task Details
3. ✅ Accept Task
4. 🚀 Start Working
5. 🛠️  Complete Physical Work
6. 📸 Take Photos
7. 📤 Submit Proof
8. ⏳ Wait for Review
9. 🎉 Receive Approval OR 📝 Receive Feedback
10. 💰 Earn Points (if approved) OR 🔄 Resubmit (if rejected)
```

### Authority Journey:
```
1. 🔔 Task Submission Notification
2. 🔍 Navigate to Review Tasks
3. 👀 View Pending Submissions
4. 📋 Review Task Details
5. 🖼️  View Proof Images
6. 📝 Read Description
7. 🤔 Make Decision
8. ✅ Approve (set points) OR ❌ Reject (provide feedback)
9. 📊 View Updated Statistics
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
┌─────────┐
│  Card 1 │  1 column grid
├─────────┤
│  Card 2 │
├─────────┤
│  Card 3 │
└─────────┘

Tablet (768px - 1280px):
┌─────────┬─────────┐
│  Card 1 │  Card 2 │  2 column grid
├─────────┼─────────┤
│  Card 3 │  Card 4 │
└─────────┴─────────┘

Desktop (> 1280px):
┌─────────┬─────────┬─────────┐
│  Card 1 │  Card 2 │  Card 3 │  3 column grid
├─────────┼─────────┼─────────┤
│  Card 4 │  Card 5 │  Card 6 │
└─────────┴─────────┴─────────┘
```

## 🎬 Animation Sequences

### Task Card Entry:
```
1. Scale: 0.9 → 1.0 (bounce)
2. Opacity: 0 → 1
3. Stagger delay: 0.1s per card
```

### Progress Bar Fill:
```
1. Width: 0% → target%
2. Duration: 0.8s
3. Ease: cubic-bezier
```

### Modal Open/Close:
```
Open:
- Background: opacity 0 → 1
- Modal: scale 0.9 → 1, opacity 0 → 1

Close:
- Background: opacity 1 → 0
- Modal: scale 1 → 0.9, opacity 1 → 0
```

---

**Visual Guide Version**: 1.0.0
**Last Updated**: December 2024
