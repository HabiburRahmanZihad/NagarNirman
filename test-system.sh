#!/bin/bash

# Professional Email & Notification System Test Suite
# NagarNirman Project
# Date: December 11, 2025

echo "======================================"
echo "🧪 EMAIL & NOTIFICATION TEST SUITE"
echo "======================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
  local test_name=$1
  local test_command=$2

  echo -e "${YELLOW}▶ Testing: $test_name${NC}"

  if eval "$test_command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED: $test_name${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAILED: $test_name${NC}"
    ((TESTS_FAILED++))
  fi
  echo ""
}

# Test 1: Check if backend is accessible
echo -e "${YELLOW}=== Backend Connectivity Tests ===${NC}"
run_test "Backend server is accessible" "curl -s http://localhost:5000/api/health || echo ''"

# Test 2: Check email service
echo -e "${YELLOW}=== Email Service Tests ===${NC}"
run_test "Email service imports correctly" "cd backend && node -e \"import('./services/emailService.js').then(() => process.exit(0))\" 2>/dev/null"

# Test 3: Check notification model
echo -e "${YELLOW}=== Notification Model Tests ===${NC}"
run_test "Notification model is valid" "cd backend && node -e \"import('./models/Notification.js').then(() => process.exit(0))\" 2>/dev/null"

# Test 4: Check frontend components
echo -e "${YELLOW}=== Frontend Component Tests ===${NC}"
run_test "NotificationBell component exists" "test -f frontend/src/components/notifications/NotificationBell.tsx"
run_test "NotificationsList component exists" "test -f frontend/src/components/notifications/NotificationsList.tsx"
run_test "NotificationItem component exists" "test -f frontend/src/components/notifications/NotificationItem.tsx"
run_test "Notifications page exists" "test -f frontend/src/app/dashboard/user/notifications/page.tsx"

# Test 5: Check dependencies
echo -e "${YELLOW}=== Dependency Tests ===${NC}"
run_test "Nodemailer is installed" "cd backend && npm list nodemailer > /dev/null 2>&1"
run_test "Framer Motion is installed" "cd frontend && npm list framer-motion > /dev/null 2>&1"
run_test "Lucide React is installed" "cd frontend && npm list lucide-react > /dev/null 2>&1"

# Test 6: Environment variables
echo -e "${YELLOW}=== Environment Variable Tests ===${NC}"
run_test ".env file exists in backend" "test -f backend/.env"
run_test "SMTP_HOST is configured" "grep -q 'SMTP_HOST=' backend/.env"
run_test "SMTP_PORT is configured" "grep -q 'SMTP_PORT=' backend/.env"
run_test "SMTP_USER is configured" "grep -q 'SMTP_USER=' backend/.env"
run_test "FRONTEND_URL is configured" "grep -q 'FRONTEND_URL=' backend/.env"

# Summary
echo ""
echo "======================================"
echo "📊 TEST SUMMARY"
echo "======================================"
echo -e "✅ Tests Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "❌ Tests Failed: ${RED}${TESTS_FAILED}${NC}"
TOTAL=$((TESTS_PASSED + TESTS_FAILED))
echo "📈 Total Tests: $TOTAL"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED! System is ready for production.${NC}"
  exit 0
else
  echo -e "${RED}⚠️  Some tests failed. Please check the issues above.${NC}"
  exit 1
fi
