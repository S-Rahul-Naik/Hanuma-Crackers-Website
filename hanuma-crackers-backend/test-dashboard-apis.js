// Load environment variables first
require('dotenv').config();

// Dashboard API Testing Script
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_USER_EMAIL = 'hanumacrackers@gmail.com';
const TEST_USER_PASSWORD = 'HanumaCrackers@2024!';

let authCookie = '';

// Test Configuration
const TEST_CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 3
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logTest(testName) {
  console.log(colors.cyan + colors.bold + '\n📋 ' + testName + colors.reset);
}

function logSuccess(message) {
  console.log(colors.green + '✅ ' + message + colors.reset);
}

function logError(message) {
  console.log(colors.red + '❌ ' + message + colors.reset);
}

function logWarning(message) {
  console.log(colors.yellow + '⚠️ ' + message + colors.reset);
}

function logInfo(message) {
  console.log(colors.blue + 'ℹ️ ' + message + colors.reset);
}

// Authentication Helper
async function authenticate() {
  logTest('Authentication Test');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    }, {
      timeout: TEST_CONFIG.timeout,
      withCredentials: true
    });

    if (response.status === 200 && response.data.success) {
      // Extract cookie from response headers
      const setCookie = response.headers['set-cookie'];
      if (setCookie && setCookie.length > 0) {
        authCookie = setCookie[0].split(';')[0];
        logSuccess('Authentication successful');
        logInfo(`Auth Cookie: ${authCookie.substring(0, 50)}...`);
        return true;
      } else {
        logError('No authentication cookie received');
        return false;
      }
    } else {
      logError('Authentication failed');
      return false;
    }
  } catch (error) {
    logError(`Authentication error: ${error.message}`);
    return false;
  }
}

// Test Dashboard Overview API
async function testDashboardOverview() {
  logTest('Dashboard Overview API Test');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/overview`, {
      headers: {
        'Cookie': authCookie,
        'Content-Type': 'application/json'
      },
      timeout: TEST_CONFIG.timeout,
      withCredentials: true
    });

    if (response.status === 200) {
      logSuccess('Dashboard overview API responded successfully');
      
      const data = response.data;
      
      // Test response structure
      if (data.success !== undefined) {
        logSuccess('Response has success field');
      } else {
        logWarning('Response missing success field');
      }

      if (data.data || data.orderCount !== undefined) {
        logSuccess('Response has data structure');
        
        const dashboardData = data.data || data;
        
        // Test data fields
        const expectedFields = [
          'orderCount',
          'totalSpent', 
          'wishlistCount',
          'loyaltyPoints',
          'recentOrders'
        ];

        expectedFields.forEach(field => {
          if (dashboardData[field] !== undefined) {
            logSuccess(`✓ ${field}: ${dashboardData[field]}`);
          } else {
            logWarning(`✗ Missing field: ${field}`);
          }
        });

        // Test recent orders structure
        if (Array.isArray(dashboardData.recentOrders)) {
          logSuccess(`Recent orders array with ${dashboardData.recentOrders.length} items`);
          
          if (dashboardData.recentOrders.length > 0) {
            const order = dashboardData.recentOrders[0];
            const orderFields = ['id', 'date', 'items', 'amount', 'status'];
            
            orderFields.forEach(field => {
              if (order[field] !== undefined) {
                logSuccess(`  ✓ Order ${field}: ${order[field]}`);
              } else {
                logWarning(`  ✗ Order missing field: ${field}`);
              }
            });
          }
        } else {
          logWarning('Recent orders is not an array');
        }

        // Test data types
        if (typeof dashboardData.orderCount === 'number') {
          logSuccess('Order count is number type');
        } else {
          logWarning(`Order count type: ${typeof dashboardData.orderCount}`);
        }

        if (typeof dashboardData.totalSpent === 'number') {
          logSuccess('Total spent is number type');
        } else {
          logWarning(`Total spent type: ${typeof dashboardData.totalSpent}`);
        }

      } else {
        logError('Response missing data structure');
      }

      // Performance test
      const responseTime = response.headers['x-response-time'] || 'Not available';
      logInfo(`Response time: ${responseTime}`);

      return true;
    } else {
      logError(`Dashboard overview API failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Dashboard overview API error: ${error.message}`);
    if (error.response) {
      logError(`Response status: ${error.response.status}`);
      logError(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// Test Products API (used by dashboard for cart)
async function testProductsAPI() {
  logTest('Products API Test (Dashboard Cart)');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/products?limit=40`, {
      timeout: TEST_CONFIG.timeout
    });

    if (response.status === 200) {
      logSuccess('Products API responded successfully');
      
      const data = response.data;
      
      if (data.success && Array.isArray(data.products)) {
        logSuccess(`Products array with ${data.products.length} items`);
        
        if (data.products.length > 0) {
          const product = data.products[0];
          const productFields = ['_id', 'name', 'category', 'price', 'images'];
          
          productFields.forEach(field => {
            if (product[field] !== undefined) {
              logSuccess(`  ✓ Product ${field}: ${product[field]}`);
            } else {
              logWarning(`  ✗ Product missing field: ${field}`);
            }
          });
        }
      } else {
        logError('Products response invalid structure');
      }

      return true;
    } else {
      logError(`Products API failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Products API error: ${error.message}`);
    return false;
  }
}

// Test User Info API
async function testUserInfoAPI() {
  logTest('User Info API Test');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Cookie': authCookie,
        'Content-Type': 'application/json'
      },
      timeout: TEST_CONFIG.timeout,
      withCredentials: true
    });

    if (response.status === 200) {
      logSuccess('User info API responded successfully');
      
      const data = response.data;
      
      if (data.success && data.user) {
        logSuccess('User data structure valid');
        
        const userFields = ['_id', 'name', 'email', 'role'];
        userFields.forEach(field => {
          if (data.user[field] !== undefined) {
            logSuccess(`  ✓ User ${field}: ${data.user[field]}`);
          } else {
            logWarning(`  ✗ User missing field: ${field}`);
          }
        });
      } else {
        logError('User info response invalid structure');
      }

      return true;
    } else {
      logError(`User info API failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`User info API error: ${error.message}`);
    return false;
  }
}

// Test Error Handling
async function testErrorHandling() {
  logTest('Error Handling Test');
  
  try {
    // Test unauthorized request (without auth cookie)
    const response = await axios.get(`${API_BASE_URL}/dashboard/overview`, {
      timeout: TEST_CONFIG.timeout
    });
    
    logWarning('Expected 401 error but got success response');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logSuccess('Unauthorized request properly rejected with 401');
    } else {
      logError(`Unexpected error: ${error.message}`);
    }
  }

  try {
    // Test invalid endpoint
    const response = await axios.get(`${API_BASE_URL}/dashboard/invalid-endpoint`, {
      headers: {
        'Cookie': authCookie
      },
      timeout: TEST_CONFIG.timeout
    });
    
    logWarning('Expected 404 error but got success response');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logSuccess('Invalid endpoint properly rejected with 404');
    } else {
      logError(`Unexpected error: ${error.message}`);
    }
  }
}

// Main test runner
async function runDashboardAPITests() {
  log('🚀 Starting Dashboard API Testing Suite', 'bold');
  log('=========================================', 'cyan');
  
  const startTime = Date.now();
  let testsPassed = 0;
  let testsTotal = 0;

  // Test authentication
  testsTotal++;
  if (await authenticate()) {
    testsPassed++;
  }

  // Test dashboard overview API
  testsTotal++;
  if (await testDashboardOverview()) {
    testsPassed++;
  }

  // Test products API
  testsTotal++;
  if (await testProductsAPI()) {
    testsPassed++;
  }

  // Test user info API
  testsTotal++;
  if (await testUserInfoAPI()) {
    testsPassed++;
  }

  // Test error handling
  testsTotal++;
  if (await testErrorHandling()) {
    testsPassed++;
  }

  // Summary
  const endTime = Date.now();
  const duration = endTime - startTime;

  log('\n📊 Test Summary', 'bold');
  log('===============', 'cyan');
  log(`✅ Tests Passed: ${testsPassed}/${testsTotal}`, testsPassed === testsTotal ? 'green' : 'red');
  log(`⏱️ Total Duration: ${duration}ms`, 'blue');
  log(`🏁 Success Rate: ${Math.round((testsPassed / testsTotal) * 100)}%`, 'cyan');

  if (testsPassed === testsTotal) {
    log('\n🎉 All dashboard API tests passed successfully!', 'green');
  } else {
    log('\n⚠️ Some tests failed. Please check the errors above.', 'yellow');
  }
}

// Run the tests
runDashboardAPITests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});