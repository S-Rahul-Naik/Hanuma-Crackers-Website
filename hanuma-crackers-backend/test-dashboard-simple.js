// Simple Dashboard API Test
const http = require('http');
const https = require('https');

const API_BASE_URL = 'http://localhost:5000/api';
const TEST_EMAIL = 'hanumacrackers@gmail.com';
const TEST_PASSWORD = 'HanumaCrackers@2024!';

// Colors for output
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

// Simple HTTP request helper
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function testDashboardAPIs() {
  log('🚀 Dashboard API Testing', 'bold');
  log('========================', 'cyan');

  let authCookie = '';

  // Test 1: Server Health Check
  log('\n📋 Server Health Check', 'cyan');
  try {
    const response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products?limit=1',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      log('✅ Server is responding', 'green');
      log(`📊 Response: ${response.status}`, 'blue');
    } else {
      log(`⚠️ Server responded with status: ${response.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ Server health check failed: ${error.message}`, 'red');
    return;
  }

  // Test 2: Authentication
  log('\n📋 Authentication Test', 'cyan');
  try {
    const authResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });

    if (authResponse.status === 200 && authResponse.data.success) {
      log('✅ Authentication successful', 'green');
      
      // Extract cookie
      const setCookie = authResponse.headers['set-cookie'];
      if (setCookie && setCookie.length > 0) {
        authCookie = setCookie[0];
        log(`🍪 Cookie received: ${authCookie.substring(0, 30)}...`, 'blue');
      }
    } else {
      log(`❌ Authentication failed: ${authResponse.status}`, 'red');
      log(`📄 Response: ${JSON.stringify(authResponse.data, null, 2)}`, 'yellow');
      return;
    }
  } catch (error) {
    log(`❌ Authentication error: ${error.message}`, 'red');
    return;
  }

  // Test 3: Dashboard Overview
  log('\n📋 Dashboard Overview API Test', 'cyan');
  try {
    const dashboardResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/overview',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie
      }
    });

    if (dashboardResponse.status === 200) {
      log('✅ Dashboard API responded successfully', 'green');
      
      const data = dashboardResponse.data;
      
      if (data && (data.success || data.orderCount !== undefined)) {
        log('✅ Valid dashboard data structure', 'green');
        
        const dashData = data.data || data;
        
        // Check expected fields
        const fields = ['orderCount', 'totalSpent', 'wishlistCount', 'loyaltyPoints', 'recentOrders'];
        fields.forEach(field => {
          if (dashData[field] !== undefined) {
            log(`  ✓ ${field}: ${dashData[field]}`, 'green');
          } else {
            log(`  ✗ Missing: ${field}`, 'yellow');
          }
        });

        // Check recent orders
        if (Array.isArray(dashData.recentOrders)) {
          log(`  ✓ Recent orders: ${dashData.recentOrders.length} items`, 'green');
          
          if (dashData.recentOrders.length > 0) {
            const order = dashData.recentOrders[0];
            log(`    - Order ID: ${order.id}`, 'blue');
            log(`    - Status: ${order.status}`, 'blue');
            log(`    - Amount: ₹${order.amount}`, 'blue');
          }
        }
      } else {
        log('❌ Invalid dashboard data structure', 'red');
        log(`📄 Response: ${JSON.stringify(data, null, 2)}`, 'yellow');
      }
    } else {
      log(`❌ Dashboard API failed: ${dashboardResponse.status}`, 'red');
      log(`📄 Response: ${JSON.stringify(dashboardResponse.data, null, 2)}`, 'yellow');
    }
  } catch (error) {
    log(`❌ Dashboard API error: ${error.message}`, 'red');
  }

  // Test 4: Products API (used by cart)
  log('\n📋 Products API Test', 'cyan');
  try {
    const productsResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products?limit=5',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (productsResponse.status === 200) {
      log('✅ Products API responded successfully', 'green');
      
      const data = productsResponse.data;
      if (data.success && Array.isArray(data.products)) {
        log(`✅ Products array: ${data.products.length} items`, 'green');
        
        if (data.products.length > 0) {
          const product = data.products[0];
          log(`  - Product: ${product.name}`, 'blue');
          log(`  - Price: ₹${product.price}`, 'blue');
          log(`  - Category: ${product.category}`, 'blue');
        }
      } else {
        log('❌ Invalid products data structure', 'red');
      }
    } else {
      log(`❌ Products API failed: ${productsResponse.status}`, 'red');
    }
  } catch (error) {
    log(`❌ Products API error: ${error.message}`, 'red');
  }

  // Test 5: User Info API
  log('\n📋 User Info API Test', 'cyan');
  try {
    const userResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie
      }
    });

    if (userResponse.status === 200) {
      log('✅ User info API responded successfully', 'green');
      
      const data = userResponse.data;
      if (data.success && data.user) {
        log(`✅ User data: ${data.user.name}`, 'green');
        log(`  - Email: ${data.user.email}`, 'blue');
        log(`  - Role: ${data.user.role}`, 'blue');
      } else {
        log('❌ Invalid user data structure', 'red');
      }
    } else {
      log(`❌ User info API failed: ${userResponse.status}`, 'red');
    }
  } catch (error) {
    log(`❌ User info API error: ${error.message}`, 'red');
  }

  // Test 6: Error Handling
  log('\n📋 Error Handling Test', 'cyan');
  try {
    // Test unauthorized access
    const unauthorizedResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/dashboard/overview',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (unauthorizedResponse.status === 401) {
      log('✅ Unauthorized access properly rejected', 'green');
    } else {
      log(`⚠️ Expected 401, got: ${unauthorizedResponse.status}`, 'yellow');
    }
  } catch (error) {
    log(`❌ Error handling test failed: ${error.message}`, 'red');
  }

  log('\n🎉 Dashboard API testing completed!', 'bold');
}

// Run the tests
testDashboardAPIs().catch(console.error);