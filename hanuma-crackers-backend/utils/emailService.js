const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Debug environment variables
    console.log('Email service initialization:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (length: ' + process.env.EMAIL_PASS.length + ')' : 'Not set');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('⚠️ Email credentials not properly configured');
      return null;
    }

    // Use Gmail SMTP (you can change this based on your email provider)
    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
      },
      // Add timeout configurations
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
      socketTimeout: 10000, // 10 seconds
      tls: {
        rejectUnauthorized: false
      }
    };

    // For other email providers, you can use SMTP settings
    if (process.env.SMTP_HOST) {
      config.host = process.env.SMTP_HOST;
      config.port = process.env.SMTP_PORT || 587;
      config.secure = process.env.SMTP_SECURE === 'true';
      delete config.service;
    }

    console.log('Creating email transporter with Gmail service');
    return nodemailer.createTransport(config);
  }

  async verifyConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }
      await this.transporter.verify();
      logger.info('Email service connection verified successfully');
      return true;
    } catch (error) {
      logger.error('Email service verification failed:', error);
      console.error('Email verification error details:', {
        message: error.message,
        code: error.code,
        command: error.command
      });
      return false;
    }
  }

  async sendEmail(mailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      return {
        success: true,
        messageId: info.messageId,
        info
      };
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(order, userEmail) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Order Confirmation</h2>
          <p>Thank you for your order! Here are the details:</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Items Ordered</h3>
            ${order.items.map(item => `
              <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Quantity: ${item.quantity} | Price: ₹${item.price}</p>
              </div>
            `).join('')}
          </div>

          <p>We'll notify you once your order is processed and shipped.</p>
          <p>Thank you for shopping with Hanuma Crackers!</p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  async sendOrderStatusUpdate(order, userEmail, oldStatus) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Order Status Update</h2>
          <p>Your order status has been updated.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Previous Status:</strong> ${oldStatus}</p>
            <p><strong>Current Status:</strong> ${order.status}</p>
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
          </div>

          <p>Thank you for shopping with Hanuma Crackers!</p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Hanuma Crackers!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Welcome to Hanuma Crackers!</h2>
          <p>Hello ${user.name},</p>
          <p>Thank you for joining Hanuma Crackers! We're excited to have you as part of our family.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's Next?</h3>
            <ul>
              <li>Browse our premium collection of crackers and fireworks</li>
              <li>Add items to your wishlist for easy access</li>
              <li>Enjoy secure and convenient online shopping</li>
              <li>Get notified about special offers and new arrivals</li>
            </ul>
          </div>

          <p>Start shopping now and make your celebrations memorable!</p>
          <p>Best regards,<br>Hanuma Crackers Team</p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request - Hanuma Crackers',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You recently requested to reset your password for your Hanuma Crackers account.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0;">Reset Password</a>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link in your browser:<br>
              <a href="${resetUrl}">${resetUrl}</a>
            </p>
          </div>

          <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          
          <p>Best regards,<br>Hanuma Crackers Team</p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  async sendAdminNotification(subject, message, data = {}) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `[Admin Alert] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Admin Notification</h2>
          <h3>${subject}</h3>
          <p>${message}</p>
          
          ${Object.keys(data).length > 0 ? `
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4>Additional Details:</h4>
              ${Object.entries(data).map(([key, value]) => `
                <p><strong>${key}:</strong> ${value}</p>
              `).join('')}
            </div>
          ` : ''}
          
          <p>This is an automated notification from Hanuma Crackers system.</p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  async sendContactFormEmails(name, email, phone, subject, message) {
    try {
      // Use BUSINESS_EMAIL as admin email if ADMIN_EMAIL is not set
      const adminEmail = process.env.BUSINESS_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      
      // Admin notification email
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">🔔 New Contact Form Submission</h2>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📋 Customer Details</h3>
              <p><strong>👤 Full Name:</strong> ${name}</p>
              <p><strong>📧 Email Address:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>📱 Phone Number:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p><strong>📝 Subject:</strong> ${subject}</p>
            </div>

            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0;">💬 Customer Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; background: white; padding: 15px; border-radius: 4px; border: 1px solid #e0e0e0;">${message}</p>
            </div>

            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📞 Quick Actions</h3>
              <p><strong>📧 Reply by Email:</strong> <a href="mailto:${email}?subject=Re: ${subject}" style="color: #f97316;">Click to Reply</a></p>
              <p><strong>📱 Call Customer:</strong> <a href="tel:${phone}" style="color: #f97316;">${phone}</a></p>
            </div>

            <p style="color: #666; font-size: 14px;">⏰ <strong>Response Time:</strong> Please respond to this inquiry within 24 hours for best customer experience.</p>
          </div>
        `
      };

      // Customer acknowledgment email
      const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting us - Hanuma Crackers',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">Thank You for Contacting Us!</h2>
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to Hanuma Crackers. We have received your message and will get back to you as soon as possible.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Message Summary</h3>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>

            <p>Our team typically responds within 24 hours during business days.</p>
            <p>Thank you for your patience!</p>
            
            <p>Best regards,<br>Hanuma Crackers Team</p>
          </div>
        `
      };

      // Send both emails with timeout protection
      await Promise.allSettled([
        this.sendEmail(adminMailOptions),
        this.sendEmail(customerMailOptions)
      ]);

      logger.info('Contact form emails sent successfully', {
        customerEmail: email,
        subject: subject,
        customerName: name
      });

      return {
        success: true,
        message: 'Emails sent successfully'
      };
    } catch (error) {
      logger.error('Failed to send contact form emails:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();