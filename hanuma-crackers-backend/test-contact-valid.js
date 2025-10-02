// Test Contact Form API with Valid Data
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

async function testValidContactForm() {
  console.log('🔍 Testing Contact Form with Valid Data');
  console.log('=======================================');

  try {
    // Test with properly formatted data that meets all validation requirements
    const validFormData = {
      name: 'KAMPALI USHA PAUL',
      email: 'ushapaul2326@gmail.com',
      phone: '+917378544094',
      subject: 'Bulk Order',
      message: 'I am interested in placing a bulk order for crackers for the upcoming festival season. Please provide pricing details and availability.'
    };

    console.log('📤 Sending valid contact form data:');
    console.log('Name:', validFormData.name);
    console.log('Email:', validFormData.email);
    console.log('Phone:', validFormData.phone);
    console.log('Subject:', validFormData.subject);
    console.log('Message length:', validFormData.message.length, 'characters');

    const response = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, validFormData);

    console.log('\n📊 API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.success) {
      console.log('\n✅ Contact form submission successful!');
      console.log('📧 Email should be sent in the background');
    } else {
      console.log('\n❌ Contact form submission failed');
      if (response.data.errors) {
        console.log('🔍 Validation errors:');
        response.data.errors.forEach(error => {
          console.log(`  - ${error.field}: ${error.message}`);
        });
      }
    }

  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

testValidContactForm();