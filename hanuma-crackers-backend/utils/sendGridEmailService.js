const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('🌟 SendGrid email service initialized');
} else {
    console.log('⚠️ SendGrid API key not found - using fallback email service');
}

const sendContactFormEmails = async (name, email, phone, subject, message) => {
    try {
        const emailFrom = process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || 'hanumacrackers@gmail.com';
        
        // Admin notification email
        const adminMsg = {
            to: emailFrom,
            from: emailFrom,
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #FF6B35; text-align: center;">🎆 New Contact Form Submission</h2>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong><br>${message}</p>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center;">Sent from Hanuma Crackers Website</p>
                </div>
            `
        };

        // Customer confirmation email
        const customerMsg = {
            to: email,
            from: emailFrom,
            subject: 'Thank you for contacting Hanuma Crackers! 🎆',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #FF6B35; text-align: center;">🎆 Thank You for Contacting Us!</h2>
                    <p>Dear ${name},</p>
                    <p>Thank you for reaching out to <strong>Hanuma Crackers</strong>! We have received your message and will get back to you within 24 hours.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #FF6B35; margin-top: 0;">Your Message Details:</h3>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong><br>${message}</p>
                    </div>
                    
                    <p>In the meantime, feel free to explore our wide range of premium crackers and fireworks for all your celebration needs!</p>
                    
                    <p style="color: #666;">Best regards,<br><strong>Hanuma Crackers Team</strong></p>
                    <p style="color: #666; font-size: 12px; text-align: center;">Making your celebrations brighter! 🎆</p>
                </div>
            `
        };

        // Send both emails
        await sgMail.send(adminMsg);
        await sgMail.send(customerMsg);
        
        console.log('✅ Contact form emails sent successfully via SendGrid');
        return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
        console.error('❌ SendGrid contact email error:', error);
        throw error;
    }
};

const sendOrderConfirmation = async (orderData, userEmail) => {
    try {
        const emailFrom = process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || 'hanumacrackers@gmail.com';
        
        const msg = {
            to: userEmail,
            from: emailFrom,
            subject: `Order Confirmation - ${orderData.orderId} 🎆`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #FF6B35; text-align: center;">🎆 Order Confirmation</h2>
                    <p>Thank you for your order with <strong>Hanuma Crackers</strong>!</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #FF6B35; margin-top: 0;">Order Details:</h3>
                        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                        <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
                        <p><strong>Status:</strong> ${orderData.status}</p>
                    </div>
                    
                    <p>We will process your order and keep you updated on the delivery status.</p>
                    <p style="color: #666;">Best regards,<br><strong>Hanuma Crackers Team</strong></p>
                </div>
            `
        };

        await sgMail.send(msg);
        console.log('✅ Order confirmation email sent via SendGrid');
        return { success: true };
    } catch (error) {
        console.error('❌ SendGrid order confirmation error:', error);
        throw error;
    }
};

const sendPasswordResetEmail = async (userEmail, resetToken) => {
    try {
        const emailFrom = process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || 'hanumacrackers@gmail.com';
        const resetUrl = `${process.env.FRONTEND_URL || 'https://hanuma-crackers.netlify.app'}/reset-password?token=${resetToken}`;
        
        const msg = {
            to: userEmail,
            from: emailFrom,
            subject: 'Password Reset Request - Hanuma Crackers 🎆',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #FF6B35; text-align: center;">🎆 Password Reset Request</h2>
                    <p>You requested a password reset for your Hanuma Crackers account.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                    </div>
                    
                    <p>If you didn't request this reset, please ignore this email.</p>
                    <p><strong>This link will expire in 10 minutes.</strong></p>
                    
                    <p style="color: #666; font-size: 12px;">If the button doesn't work, copy and paste this link: ${resetUrl}</p>
                </div>
            `
        };

        await sgMail.send(msg);
        console.log('✅ Password reset email sent via SendGrid');
        return { success: true };
    } catch (error) {
        console.error('❌ SendGrid password reset error:', error);
        throw error;
    }
};

module.exports = {
    sendContactFormEmails,
    sendOrderConfirmation,
    sendPasswordResetEmail
};