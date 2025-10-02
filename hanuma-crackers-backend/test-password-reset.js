// Test password reset email functionality
require('dotenv').config();
const emailService = require('./utils/emailService');

async function testPasswordResetEmail() {
    try {
        console.log('🧪 Testing password reset email...');
        
        const resetData = {
            email: 'test@example.com',
            name: 'Test User',
            resetToken: 'test123abc456def789'
        };
        
        const result = await emailService.sendPasswordResetEmail(resetData);
        console.log('✅ Password reset email test result:', result);
        console.log('📧 Email should contain reset URL: https://hanuma-crackers.netlify.app/reset-password/test123abc456def789');
        
    } catch (error) {
        console.error('❌ Password reset email test failed:', error);
    }
}

// Run the test
testPasswordResetEmail();