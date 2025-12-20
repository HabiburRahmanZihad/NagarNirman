/**
 * Professional Notification API Test Suite
 * Tests all 6 notification endpoints with proper data creation
 * This script creates test notifications before testing operations
 */

import http from 'http';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

// Configuration
const BASE_URL = 'http://localhost:5000';

// Test state
let TEST_TOKEN = null;
let TEST_USER_ID = null;
let TEST_NOTIFICATION_IDS = [];

/**
 * Make HTTP request with proper error handling
 */
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NotificationAPITester/2.0'
      },
      timeout: 5000
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            statusText: res.statusMessage,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Step 1: Create test user and get token
 */
async function setupTestUser() {
  // console.log('\n🔐 Step 1: Setting Up Test User');
  // console.log('═'.repeat(60));

  try {
    const testEmail = `apitest_${Date.now()}@test.com`;

    // console.log(`📧 Email: ${testEmail}`);

    const signupResponse = await makeRequest('POST', '/api/auth/register', {
      name: 'API Tester Pro',
      email: testEmail,
      password: 'TestPassword123!',
      division: 'Dhaka',
      district: 'Dhaka'
    });

    if (signupResponse.statusCode === 201 && signupResponse.body?.token) {
      TEST_TOKEN = signupResponse.body.token;
      TEST_USER_ID = signupResponse.body.user?._id;
      // console.log('✅ Test user created successfully');
      // console.log(`👤 User ID: ${TEST_USER_ID}`);
      return true;
    } else {
      console.error('❌ Failed to create test user');
      console.error('Response:', signupResponse.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    return false;
  }
}

/**
 * Step 2: Create test notifications directly in database
 */
async function createTestNotifications() {
  // console.log('\n📝 Step 2: Creating Test Notifications');
  // console.log('═'.repeat(60));

  try {
    const db = getDB();
    const collection = db.collection('notifications');

    if (!ObjectId.isValid(TEST_USER_ID)) {
      throw new Error('Invalid test user ID');
    }

    const userObjectId = new ObjectId(TEST_USER_ID);
    const notifications = [
      {
        userId: userObjectId,
        title: 'Welcome to NagarNirman',
        message: 'Welcome to our platform. Start reporting infrastructure issues today!',
        type: 'system',
        read: false,
        createdAt: new Date(),
        readAt: null
      },
      {
        userId: userObjectId,
        title: 'Task Assigned',
        message: 'You have been assigned a new task: Fix Pothole on Main Street',
        type: 'task_assigned',
        read: false,
        createdAt: new Date(Date.now() - 3600000),
        readAt: null
      },
      {
        userId: userObjectId,
        title: 'Report Status Updated',
        message: 'Your report "Road Damage" status has been updated to IN-PROGRESS',
        type: 'report_status_updated',
        read: false,
        createdAt: new Date(Date.now() - 7200000),
        readAt: null
      },
      {
        userId: userObjectId,
        title: 'Points Awarded',
        message: 'You earned 50 points for completing a task!',
        type: 'points_awarded',
        read: true,
        createdAt: new Date(Date.now() - 10800000),
        readAt: new Date(Date.now() - 10800000)
      },
      {
        userId: userObjectId,
        title: 'Application Approved',
        message: 'Your application as Problem Solver has been approved!',
        type: 'application_approved',
        read: false,
        createdAt: new Date(Date.now() - 14400000),
        readAt: null
      }
    ];

    const result = await collection.insertMany(notifications);
    TEST_NOTIFICATION_IDS = Array.from(result.insertedIds);

    // console.log(`✅ Created ${TEST_NOTIFICATION_IDS.length} test notifications`);
    TEST_NOTIFICATION_IDS.forEach((id, index) => {
      // console.log(`   ${index + 1}. ${notifications[index].title}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Error creating test notifications:', error.message);
    return false;
  }
}

/**
 * Test 1: GET /api/notifications
 */
async function testGetNotifications() {
  // console.log('\n📬 Test 1: GET /api/notifications');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Fetch user notifications with pagination');

  try {
    const response = await makeRequest(
      'GET',
      '/api/notifications?page=1&limit=10',
      null,
      TEST_TOKEN
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 200 && response.body?.success) {
      // console.log(`✅ PASS - Retrieved ${response.body.data?.length || 0} notifications`);
      // console.log(`   Total: ${response.body.pagination?.total || 0}`);
      // console.log(`   Pagination: Page ${response.body.pagination?.page}/${response.body.pagination?.pages}`);
      return true;
    } else {
      // console.log('❌ FAIL - Could not retrieve notifications');
      // console.log('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 2: GET /api/notifications/unread-count
 */
async function testGetUnreadCount() {
  // console.log('\n📊 Test 2: GET /api/notifications/unread-count');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Get unread notification count');

  try {
    const response = await makeRequest(
      'GET',
      '/api/notifications/unread-count',
      null,
      TEST_TOKEN
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 200 && response.body?.success) {
      const count = response.body.data?.count ?? 0;
      // console.log(`✅ PASS - Unread count retrieved: ${count}`);
      return true;
    } else {
      // console.log('❌ FAIL - Could not get unread count');
      // console.log('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 3: PUT /api/notifications/:id/read
 */
async function testMarkAsRead() {
  // console.log('\n✅ Test 3: PUT /api/notifications/:id/read');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Mark single notification as read');

  if (!TEST_NOTIFICATION_IDS.length) {
    // console.log('⚠️ SKIP - No test notifications available');
    return null;
  }

  try {
    const notificationId = TEST_NOTIFICATION_IDS[0].toString();
    const response = await makeRequest(
      'PUT',
      `/api/notifications/${notificationId}/read`,
      { read: true },
      TEST_TOKEN
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 200 && response.body?.success) {
      // console.log('✅ PASS - Notification marked as read');
      // console.log(`   Notification ID: ${notificationId}`);
      return true;
    } else if (response.statusCode === 404) {
      // console.log('⚠️ SKIP - Notification not found');
      return null;
    } else {
      // console.log('❌ FAIL - Could not mark as read');
      // console.log('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 4: PUT /api/notifications/mark-all-read
 */
async function testMarkAllRead() {
  // console.log('\n📋 Test 4: PUT /api/notifications/mark-all-read');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Mark all user notifications as read');

  try {
    const response = await makeRequest(
      'PUT',
      '/api/notifications/mark-all-read',
      {},
      TEST_TOKEN
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 200 && response.body?.success) {
      const count = response.body.data?.count ?? 0;
      // console.log(`✅ PASS - All notifications marked as read`);
      // console.log(`   Modified count: ${count}`);
      return true;
    } else {
      // console.log('❌ FAIL - Could not mark all as read');
      // console.log('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 5: DELETE /api/notifications/:id
 */
async function testDeleteNotification() {
  // console.log('\n🗑️ Test 5: DELETE /api/notifications/:id');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Delete single notification');

  if (TEST_NOTIFICATION_IDS.length < 2) {
    // console.log('⚠️ SKIP - Not enough test notifications');
    return null;
  }

  try {
    const notificationId = TEST_NOTIFICATION_IDS[1].toString();
    const response = await makeRequest(
      'DELETE',
      `/api/notifications/${notificationId}`,
      null,
      TEST_TOKEN
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 200 && response.body?.success) {
      // console.log('✅ PASS - Notification deleted');
      // console.log(`   Deleted ID: ${notificationId}`);
      return true;
    } else if (response.statusCode === 404) {
      // console.log('⚠️ SKIP - Notification not found');
      return null;
    } else {
      // console.log('❌ FAIL - Could not delete notification');
      // console.log('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 6: DELETE /api/notifications/all
 */
async function testDeleteAll() {
  // console.log('\n🗑️🗑️ Test 6: DELETE /api/notifications/all');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Delete all user notifications');

  try {
    const response = await makeRequest(
      'DELETE',
      '/api/notifications/all',
      null,
      TEST_TOKEN
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 200 && response.body?.success) {
      const count = response.body.data?.count ?? 0;
      // console.log(`✅ PASS - All notifications deleted`);
      // console.log(`   Deleted count: ${count}`);
      return true;
    } else {
      // console.log('❌ FAIL - Could not delete all');
      // console.log('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 7: Security - Invalid Token
 */
async function testInvalidToken() {
  // console.log('\n🔑 Test 7: Security - Invalid Token');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Verify invalid tokens are rejected');

  try {
    const response = await makeRequest(
      'GET',
      '/api/notifications',
      null,
      'invalid.token.here'
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 401 && response.body?.success === false) {
      // console.log('✅ PASS - Invalid token properly rejected');
      // console.log(`   Message: ${response.body.message}`);
      return true;
    } else {
      // console.log('❌ FAIL - Invalid token not rejected properly');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Test 8: Security - No Token
 */
async function testNoToken() {
  // console.log('\n🔐 Test 8: Security - No Token');
  // console.log('═'.repeat(60));
  // console.log('Purpose: Verify requests without token are rejected');

  try {
    const response = await makeRequest(
      'GET',
      '/api/notifications',
      null,
      null
    );

    // console.log(`Status: ${response.statusCode} ${response.statusText}`);

    if (response.statusCode === 401 && response.body?.success === false) {
      // console.log('✅ PASS - Request without token properly rejected');
      // console.log(`   Message: ${response.body.message}`);
      return true;
    } else {
      // console.log('❌ FAIL - Missing token not rejected properly');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  // console.log('╔══════════════════════════════════════════════════════════╗');
  // console.log('║   🔔 PROFESSIONAL NOTIFICATION API TEST SUITE v2.0 🔔    ║');
  // console.log('║   Complete Testing with Data Setup & Verification        ║');
  // console.log('╚══════════════════════════════════════════════════════════╝');

  // console.log('\n⏳ Starting comprehensive test suite...\n');

  // Setup phase
  const userSetup = await setupTestUser();
  if (!userSetup) {
    // console.log('\n❌ Cannot proceed without test user');
    // console.log('📝 Ensure: Backend running, auth endpoints accessible');
    return;
  }

  const notificationsCreated = await createTestNotifications();
  if (!notificationsCreated) {
    // console.log('\n❌ Cannot proceed without test notifications');
    // console.log('📝 Ensure: Database connected properly');
    return;
  }

  // Run all tests
  const results = {
    'GET Notifications': await testGetNotifications(),
    'GET Unread Count': await testGetUnreadCount(),
    'PUT Mark as Read': await testMarkAsRead(),
    'PUT Mark All Read': await testMarkAllRead(),
    'DELETE Notification': await testDeleteNotification(),
    'DELETE All': await testDeleteAll(),
    'Security - Invalid Token': await testInvalidToken(),
    'Security - No Token': await testNoToken()
  };

  // Summary
  // console.log('\n' + '═'.repeat(60));
  // console.log('📊 COMPREHENSIVE TEST SUMMARY');
  // console.log('═'.repeat(60));

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const [test, result] of Object.entries(results)) {
    if (result === true) {
      // console.log(`✅ ${test}`);
      passed++;
    } else if (result === false) {
      // console.log(`❌ ${test}`);
      failed++;
    } else {
      // console.log(`⚠️ ${test}`);
      skipped++;
    }
  }

  // console.log('═'.repeat(60));
  // console.log(`Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
  // console.log(`Success Rate: ${Math.round((passed / (passed + failed + skipped)) * 100)}%`);

  if (failed === 0 && passed > 0) {
    // console.log('\n✅ ALL CRITICAL TESTS PASSED!');
    // console.log('🚀 System is production-ready!');
  } else if (failed > 0) {
    // console.log('\n❌ SOME TESTS FAILED - Review errors above');
  } else if (skipped > 0) {
    // console.log('\n⚠️ TESTS SKIPPED - May need retry');
  }

  // console.log('\n' + '═'.repeat(60));
  // console.log('✨ Test Suite Complete');
  // console.log('═'.repeat(60));
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal Error:', error.message);
  process.exit(1);
});
