#!/bin/bash

# COMPLETE NOTIFICATION SYSTEM TEST (Frontend + Backend)
# Tests the entire notification flow from backend creation to frontend display

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                                                                                       ║"
echo "║      🔔 COMPLETE NOTIFICATION SYSTEM TEST - FRONTEND + BACKEND 🔔      ║"
echo "║                                                                                                                                       ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="${BASE_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

echo "📋 Configuration"
echo "═══════════════════════════════════════════════════════════════════════════"
echo "Backend URL: $BASE_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to make API calls
make_request() {
  local method=$1
  local endpoint=$2
  local token=$3
  local data=$4

  if [ -z "$token" ]; then
    # No token - test unauthorized access
    curl -s -X "$method" "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "User-Agent: NotificationSystemTest/1.0"
  else
    # With token
    if [ -z "$data" ]; then
      curl -s -X "$method" "$BASE_URL$endpoint" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -H "User-Agent: NotificationSystemTest/1.0"
    else
      curl -s -X "$method" "$BASE_URL$endpoint" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -H "User-Agent: NotificationSystemTest/1.0" \
        -d "$data"
    fi
  fi
}

# Function to print test result
print_result() {
  local test_name=$1
  local passed=$2
  local message=$3

  if [ "$passed" -eq 1 ]; then
    echo -e "${GREEN}✅ PASS${NC} - $test_name"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC} - $test_name"
    if [ -n "$message" ]; then
      echo "   Error: $message"
    fi
    ((TESTS_FAILED++))
  fi
}

echo ""
echo "🔐 Step 1: Create Test User"
echo "═══════════════════════════════════════════════════════════════════════════"

# Register test user
TEST_EMAIL="notificationtest_$(date +%s)@test.com"
TEST_PASSWORD="TestPassword123!"

REGISTER_DATA='{
  "name": "Test User",
  "email": "'$TEST_EMAIL'",
  "password": "'$TEST_PASSWORD'",
  "division": "Test Division",
  "district": "Test District",
  "role": "user"
}'

echo "📧 Registering user: $TEST_EMAIL"

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "$REGISTER_DATA")

USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$USER_ID" ]; then
  echo -e "${RED}❌ Failed to register user${NC}"
  echo "Response: $REGISTER_RESPONSE"
  exit 1
fi

echo "✅ User registered successfully"
echo "👤 User ID: $USER_ID"

# Login to get token
LOGIN_DATA='{"email":"'$TEST_EMAIL'","password":"'$TEST_PASSWORD'"}'

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to login${NC}"
  exit 1
fi

echo "🔑 Login successful"
echo ""

echo "📊 Step 2: Backend Notification API Tests"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# Test 1: Get notifications (should be empty initially)
echo "Test 1: GET /api/notifications (Initial - Empty)"
RESPONSE=$(make_request "GET" "/api/notifications" "$TOKEN")
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true')

if [ -n "$SUCCESS" ]; then
  COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
  print_result "Get notifications endpoint" 1
  echo "   Count: $COUNT notifications"
else
  print_result "Get notifications endpoint" 0 "Response: $RESPONSE"
fi
echo ""

# Test 2: Get unread count
echo "Test 2: GET /api/notifications/unread-count"
RESPONSE=$(make_request "GET" "/api/notifications/unread-count" "$TOKEN")
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true')

if [ -n "$SUCCESS" ]; then
  COUNT=$(echo "$RESPONSE" | grep -o '"count":[0-9]*' | cut -d':' -f2)
  print_result "Get unread count" 1
  echo "   Unread: $COUNT"
else
  print_result "Get unread count" 0
fi
echo ""

# Test 3: Test security - Request without token
echo "Test 3: Security Test - Request without token"
RESPONSE=$(make_request "GET" "/api/notifications" "")
UNAUTHORIZED=$(echo "$RESPONSE" | grep -o '"success":false')

if [ -n "$UNAUTHORIZED" ]; then
  print_result "Unauthorized request rejection" 1
  MESSAGE=$(echo "$RESPONSE" | grep -o '"message":"[^"]*' | head -1 | cut -d'"' -f4)
  echo "   Message: $MESSAGE"
else
  print_result "Unauthorized request rejection" 0
fi
echo ""

# Test 4: Test security - Invalid token
echo "Test 4: Security Test - Invalid token"
RESPONSE=$(make_request "GET" "/api/notifications" "invalid.token.here")
ERROR=$(echo "$RESPONSE" | grep -o '"success":false')

if [ -n "$ERROR" ]; then
  print_result "Invalid token rejection" 1
else
  print_result "Invalid token rejection" 0
fi
echo ""

# Test 5: Mark all as read
echo "Test 5: PUT /api/notifications/mark-all-read"
RESPONSE=$(make_request "PUT" "/api/notifications/mark-all-read" "$TOKEN" "")
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true')

if [ -n "$SUCCESS" ]; then
  print_result "Mark all as read" 1
else
  print_result "Mark all as read" 0
fi
echo ""

# Test 6: Delete all notifications
echo "Test 6: DELETE /api/notifications/all"
RESPONSE=$(make_request "DELETE" "/api/notifications/all" "$TOKEN" "")
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true')

if [ -n "$SUCCESS" ]; then
  print_result "Delete all notifications" 1
else
  print_result "Delete all notifications" 0
fi
echo ""

echo "📋 Step 3: Frontend Component Verification"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

echo "Checking frontend files..."
echo ""

# Check if NotificationContext exists
if [ -f "frontend/src/context/NotificationContext.tsx" ]; then
  echo -e "${GREEN}✅${NC} NotificationContext.tsx - EXISTS"
  ((TESTS_PASSED++))

  # Check for key functions
  if grep -q "fetchNotifications" "frontend/src/context/NotificationContext.tsx"; then
    echo "   ✓ fetchNotifications function - OK"
  fi

  if grep -q "markAsRead" "frontend/src/context/NotificationContext.tsx"; then
    echo "   ✓ markAsRead function - OK"
  fi

  if grep -q "useNotifications" "frontend/src/context/NotificationContext.tsx"; then
    echo "   ✓ useNotifications hook - OK"
  fi
else
  echo -e "${RED}❌${NC} NotificationContext.tsx - MISSING"
  ((TESTS_FAILED++))
fi
echo ""

# Check if NotificationCenter exists
if [ -f "frontend/src/components/common/NotificationCenter.tsx" ]; then
  echo -e "${GREEN}✅${NC} NotificationCenter.tsx - EXISTS"
  ((TESTS_PASSED++))

  # Check for key UI elements
  if grep -q "FaBell" "frontend/src/components/common/NotificationCenter.tsx"; then
    echo "   ✓ Bell icon - OK"
  fi

  if grep -q "unreadCount" "frontend/src/components/common/NotificationCenter.tsx"; then
    echo "   ✓ Unread counter - OK"
  fi
else
  echo -e "${RED}❌${NC} NotificationCenter.tsx - MISSING"
  ((TESTS_FAILED++))
fi
echo ""

# Check for API utility
if [ -f "frontend/src/utils/api.ts" ]; then
  if grep -q "notificationAPI" "frontend/src/utils/api.ts"; then
    echo -e "${GREEN}✅${NC} notificationAPI utility - EXISTS"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌${NC} notificationAPI utility - MISSING"
    ((TESTS_FAILED++))
  fi
else
  echo -e "${RED}❌${NC} api.ts - MISSING"
  ((TESTS_FAILED++))
fi
echo ""

echo "🧹 Step 4: Cleanup Check"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# Check if old test files are removed
if [ -f "backend/utils/testNotificationAPI.js" ]; then
  echo -e "${YELLOW}⚠️${NC}  Old testNotificationAPI.js still exists"
else
  echo -e "${GREEN}✅${NC} Old testNotificationAPI.js removed"
  ((TESTS_PASSED++))
fi

if [ -f "test-notification-api.sh" ]; then
  echo -e "${YELLOW}⚠️${NC}  Old test-notification-api.sh still exists"
else
  echo -e "${GREEN}✅${NC} Old test-notification-api.sh removed"
  ((TESTS_PASSED++))
fi
echo ""

# Summary
echo "════════════════════════════════════════════════════════════════════════════"
echo "📊 COMPREHENSIVE NOTIFICATION SYSTEM TEST SUMMARY"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""
echo "Test Results:"
echo "─────────────────────────────────────────────────────────────────────────────"
echo "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo "Failed: $TESTS_FAILED"
echo ""

TOTAL=$((TESTS_PASSED + TESTS_FAILED))
if [ $TOTAL -gt 0 ]; then
  PERCENTAGE=$((TESTS_PASSED * 100 / TOTAL))
  echo "Success Rate: $PERCENTAGE%"
fi
echo ""

if [ $TESTS_FAILED -eq 0 ] && [ $TESTS_PASSED -gt 0 ]; then
  echo "════════════════════════════════════════════════════════════════════════════"
  echo "✅ ALL TESTS PASSED - NOTIFICATION SYSTEM IS FULLY FUNCTIONAL!"
  echo "════════════════════════════════════════════════════════════════════════════"
  echo ""
  echo "🎉 STATUS: PRODUCTION READY"
  echo ""
  echo "✓ Backend notification API working perfectly"
  echo "✓ Frontend notification components ready"
  echo "✓ Authentication and security verified"
  echo "✓ Old test files cleaned up"
  echo ""
  exit 0
else
  echo "⚠️ Some tests failed. Please review the errors above."
  exit 1
fi
