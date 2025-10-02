// Simple Dashboard Debug Test
const http = require('http');

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

async function debugDashboard() {
  console.log('🔍 Dashboard Debug Test');
  console.log('======================');

  // Login first
  try {
    const loginResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
      email: 'testuser@example.com',
      password: 'TestPassword123!'
    });

    if (loginResponse.status !== 200) {
      console.log('❌ Login failed');
      return;
    }

    const authCookie = loginResponse.headers['set-cookie'][0];
    console.log('✅ Login successful');
    console.log('👤 User:', loginResponse.data.user.name);

    // Test dashboard with detailed error handling
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

    console.log('📊 Dashboard Response:');
    console.log('Status:', dashboardResponse.status);
    console.log('Headers:', JSON.stringify(dashboardResponse.headers, null, 2));
    console.log('Data:', JSON.stringify(dashboardResponse.data, null, 2));

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

debugDashboard();