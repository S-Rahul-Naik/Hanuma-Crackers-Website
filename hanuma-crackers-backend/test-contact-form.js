// Test Contact Form API
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

async function testContactFormAPI() {
  console.log('🔍 Testing Contact Form API');
  console.log('===========================');

  try {
    // Test 1: Valid contact form data (matching the screenshot)
    console.log('\n📋 Test 1: Valid Contact Form Data');
    const validFormData = {
      name: 'KAMPALI USHA PAUL',
      email: 'ushapaul2326@gmail.com',
      phone: '+917378544094',
      subject: 'Bulk Order',
      message: 'zdxfcgvhb'
    };

    const validResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, validFormData);

    console.log('📊 Valid Form Response:');
    console.log('Status:', validResponse.status);
    console.log('Data:', JSON.stringify(validResponse.data, null, 2));

    // Test 2: Invalid form data (missing required fields)
    console.log('\n📋 Test 2: Invalid Form Data');
    const invalidFormData = {
      name: 'A', // Too short
      email: 'invalid-email',
      phone: '123', // Invalid format
      subject: 'Hi', // Too short
      message: 'Test' // Too short
    };

    const invalidResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, invalidFormData);

    console.log('📊 Invalid Form Response:');
    console.log('Status:', invalidResponse.status);
    console.log('Data:', JSON.stringify(invalidResponse.data, null, 2));

    // Test 3: Missing fields
    console.log('\n📋 Test 3: Missing Fields');
    const missingFieldsData = {
      name: 'Test User'
      // Missing other required fields
    };

    const missingResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, missingFieldsData);

    console.log('📊 Missing Fields Response:');
    console.log('Status:', missingResponse.status);
    console.log('Data:', JSON.stringify(missingResponse.data, null, 2));

    // Test 4: Empty request
    console.log('\n📋 Test 4: Empty Request');
    const emptyResponse = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {});

    console.log('📊 Empty Request Response:');
    console.log('Status:', emptyResponse.status);
    console.log('Data:', JSON.stringify(emptyResponse.data, null, 2));

  } catch (error) {
    console.log('❌ API test error:', error.message);
  }
}

testContactFormAPI();