// SendGrid Email Service Alternative
require('dotenv').config();
const sgMail = require('@sendgrid/mail');

class SendGridEmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('✅ SendGrid initialized successfully');
    } else {
      console.log('⚠️ SendGrid API key not found');
    }
  }

  async sendEmail(mailOptions) {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key not configured');
      }

      const msg = {
        to: mailOptions.to,
        from: process.env.EMAIL_USER || 'hanumacrackers@gmail.com',
        subject: mailOptions.subject,
        html: mailOptions.html,
      };

      console.log('📧 Sending email via SendGrid:', {
        to: msg.to,
        subject: msg.subject,
        from: msg.from
      });

      const response = await sgMail.send(msg);
      
      console.log('✅ SendGrid email sent successfully:', {
        messageId: response[0].headers['x-message-id'],
        to: msg.to,
        subject: msg.subject
      });

      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        accepted: [msg.to],
        rejected: []
      };

    } catch (error) {
      console.error('❌ SendGrid email failed:', {
        error: error.message,
        code: error.code,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  async sendContactFormEmails(name, email, phone, subject, message) {
    const adminEmail = process.env.BUSINESS_EMAIL || 'hanumacrackers@gmail.com';
    
    // Admin notification
    const adminResult = await this.sendEmail({
      to: adminEmail,
      subject: `🎆 NEW INQUIRY: ${subject} - Action Required`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #f97316;">New Customer Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `
    });

    // Customer confirmation (only if different email)
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      await this.sendEmail({
        to: email,
        subject: 'Thank you for contacting us - Hanuma Crackers',
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2 style="color: #f97316;">Thank You for Contacting Us!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to Hanuma Crackers. We have received your message and will get back to you as soon as possible.</p>
            <p>Our team typically responds within 24 hours during business days.</p>
            <p>Best regards,<br>Hanuma Crackers Team</p>
          </div>
        `
      });
    }

    return adminResult;
  }

  async sendOrderConfirmation(order, userEmail) {
    return await this.sendEmail({
      to: userEmail,
      subject: `🎆 Order Confirmation - ${order.orderNumber} | Hanuma Crackers`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #f97316;">Order Confirmation</h2>
          <p>Thank you for your order!</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p>We'll process your order and send you updates via email.</p>
          <p>Best regards,<br>Hanuma Crackers Team</p>
        </div>
      `
    });
  }

  async sendNewOrderNotificationToAdmin(order) {
    const adminEmail = process.env.BUSINESS_EMAIL || 'hanumacrackers@gmail.com';
    
    return await this.sendEmail({
      to: adminEmail,
      subject: `🎆 New Order Received - ${order.orderNumber} (₹${order.totalPrice})`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #f97316;">New Order Received!</h2>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Customer:</strong> ${order.user.name}</p>
          <p><strong>Email:</strong> ${order.user.email}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p>Please process this order as soon as possible.</p>
        </div>
      `
    });
  }
}

module.exports = new SendGridEmailService();