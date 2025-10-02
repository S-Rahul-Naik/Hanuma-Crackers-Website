const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔧 Testing SMTP Connection on Render...');

// Test SMTP configuration matching Render environment
const config = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 120000, // 2 minutes
  greetingTimeout: 60000,   // 1 minute
  socketTimeout: 120000,    // 2 minutes
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3',
    servername: 'smtp.gmail.com'
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  debug: true,
  logger: true
};

console.log('📧 Testing SMTP Config:', {
  host: config.host,
  port: config.port,
  secure: config.secure,
  user: config.auth.user,
  timeout: config.connectionTimeout
});

async function testSMTP() {
  try {
    const transporter = nodemailer.createTransporter(config);
    
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    // Test sending a simple email
    console.log('📧 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '🎆 Render SMTP Test - ' + new Date().toLocaleString(),
      text: 'This is a test email sent from Render deployment to verify SMTP connectivity.',
      html: `
        <h2>🎆 Render SMTP Test</h2>
        <p>This is a test email sent from Render deployment.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Status:</strong> ✅ SMTP Working on Render!</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    
    await transporter.close();
    console.log('🎉 SMTP test completed successfully!');
    
  } catch (error) {
    console.error('❌ SMTP test failed:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // Try alternative configuration
    console.log('🔄 Trying alternative configuration...');
    
    const altConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    };
    
    try {
      const altTransporter = nodemailer.createTransporter(altConfig);
      await altTransporter.verify();
      console.log('✅ Alternative Gmail service configuration works!');
      await altTransporter.close();
    } catch (altError) {
      console.error('❌ Alternative configuration also failed:', altError.message);
    }
  }
}

testSMTP();