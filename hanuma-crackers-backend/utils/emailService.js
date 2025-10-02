const nodemailer = require('nodemailer');
const logger = require('./logger');

// Try to import SendGrid service (fallback if not available)
let sendGridService = null;
try {
  sendGridService = require('./sendGridEmailService');
  console.log('🌟 Using SendGrid email service (recommended for production)');
} catch (error) {
  console.log('📧 SendGrid not available, using SMTP fallback');
}

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Debug environment variables
    console.log('Email service initialization:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (length: ' + process.env.EMAIL_PASS.length + ')' : 'Not set');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('⚠️ Email credentials not properly configured');
      return;
    }

    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Check if SMTP environment variables are provided (Render setup)
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      console.log('🌐 Using dedicated SMTP configuration from environment');
      
      const config = {
        host: process.env.SMTP_HOST, // smtp.gmail.com
        port: parseInt(process.env.SMTP_PORT), // 587
        secure: process.env.SMTP_SECURE === 'true', // false for 587, true for 465
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
        // Enhanced production settings for Render
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
        // Rate limiting PERMANENTLY DISABLED - Unlimited email sending
      };

      console.log('📧 SMTP Config from ENV:', {
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: config.auth.user
      });
      
      return nodemailer.createTransport(config);
    }
    // Production environment - use SMTP settings for better reliability
    else if (process.env.NODE_ENV === 'production') {
      console.log('🌐 Production mode: Using default SMTP configuration');
      
      const config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS
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
        // Enhanced production settings for Render
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
        // Rate limiting PERMANENTLY DISABLED - Unlimited email sending
      };

      console.log('📧 SMTP Config: host=' + config.host + ', port=' + config.port + ', secure=' + config.secure);
      return nodemailer.createTransport(config);
    } else {
      // Development environment - use Gmail service
      console.log('🔧 Development mode: Using Gmail service');
      
      const config = {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        tls: {
          rejectUnauthorized: false
        }
      };

      return nodemailer.createTransport(config);
    }
  }

  async verifyConnection() {
    try {
      // Reinitialize transporter if it's null (for cases where env vars loaded later)
      if (!this.transporter) {
        console.log('🔄 Reinitializing email transporter...');
        this.initializeTransporter();
      }
      
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
      // Try SendGrid first if available (recommended for production)
      if (sendGridService && process.env.SENDGRID_API_KEY) {
        console.log('🌟 Using SendGrid for email delivery');
        
        // For contact form emails, use specialized SendGrid method
        if (mailOptions.isContactForm) {
          return await sendGridService.sendContactFormEmails(
            mailOptions.name,
            mailOptions.email,
            mailOptions.phone,
            mailOptions.subject,
            mailOptions.message
          );
        }
        
        // For other emails, fall back to SMTP
        console.log('📧 Falling back to SMTP for non-contact emails');
      }
      
      // Reinitialize transporter if it's null (for cases where env vars loaded later)
      if (!this.transporter) {
        console.log('🔄 Reinitializing email transporter for sending...');
        this.initializeTransporter();
      }
      
      if (!this.transporter) {
        throw new Error('Email transporter not initialized - check EMAIL_USER and EMAIL_PASS environment variables');
      }
      
      // Add production-specific logging
      console.log('📧 Attempting to send email:', {
        to: mailOptions.to,
        subject: mailOptions.subject,
        from: mailOptions.from,
        environment: process.env.NODE_ENV
      });
      
      const info = await this.transporter.sendMail(mailOptions);
      
      // Enhanced success logging for production debugging
      console.log('✅ Email sent successfully:', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response
      });
      
      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
        accepted: info.accepted,
        rejected: info.rejected
      });
      
      return {
        success: true,
        messageId: info.messageId,
        info,
        accepted: info.accepted,
        rejected: info.rejected
      };
    } catch (error) {
      // Enhanced error logging for production debugging
      console.error('❌ Email sending failed:', {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        to: mailOptions.to,
        subject: mailOptions.subject,
        environment: process.env.NODE_ENV
      });
      
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(order, userEmail) {
    // Format order items for display
    const itemsHtml = order.items.map(item => {
      const product = item.product || {};
      return `
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 10px; border-right: 1px solid #e0e0e0;">
            ${product.name || item.name}
          </td>
          <td style="padding: 10px; text-align: center; border-right: 1px solid #e0e0e0;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; text-align: right; border-right: 1px solid #e0e0e0;">
            ₹${item.price}
          </td>
          <td style="padding: 10px; text-align: right;">
            ₹${(item.quantity * item.price).toFixed(2)}
          </td>
        </tr>
      `;
    }).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🎆 Order Confirmation - ${order.orderNumber} | Hanuma Crackers`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto;">
          <h2 style="color: #f97316; border-bottom: 3px solid #f97316; padding-bottom: 10px;">
            🎆 Thank You for Your Order!
          </h2>
          <p style="font-size: 16px;">Hello <strong>${order.user.name}</strong>,</p>
          <p>Thank you for choosing Hanuma Crackers! Your order has been successfully placed and we're excited to help make your celebrations memorable.</p>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
            <h3 style="color: #333; margin-top: 0;">📋 Order Summary</h3>
            <p><strong>🆔 Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>💰 Total Amount:</strong> ₹${order.totalPrice}</p>
            <p><strong>💳 Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>📅 Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
            <p><strong>📦 Order Status:</strong> <span style="color: #28a745; font-weight: bold;">${order.status}</span></p>
            <p><strong>🚚 Estimated Delivery:</strong> ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN') : '3-7 business days'}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🚚 Shipping Address</h3>
            <p><strong>${order.shippingAddress.name}</strong></p>
            <p>${order.shippingAddress.street}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
            <p><strong>📞 Contact:</strong> ${order.shippingAddress.phone}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🛍️ Your Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 4px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f97316; color: white;">
                  <th style="padding: 12px; text-align: left;">Product</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                  <th style="padding: 12px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #f0f0f0; font-weight: bold;">
                  <td colspan="3" style="padding: 12px; text-align: right;">Total Amount:</td>
                  <td style="padding: 12px; text-align: right; color: #f97316;">₹${order.totalPrice}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📞 Need Help?</h3>
            <p><strong>📧 Email us:</strong> <a href="mailto:hanumacrackers@gmail.com" style="color: #f97316;">hanumacrackers@gmail.com</a></p>
            <p><strong>📱 Call us:</strong> <a href="tel:+918686556898" style="color: #f97316;">+91 86865 56898</a></p>
            <p><strong>⏰ Support Hours:</strong> Mon-Sun: 9:00 AM - 8:00 PM</p>
          </div>

          <div style="background-color: #fff2e6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #d68910;">
              <strong>⚠️ Safety First:</strong> Please follow all safety guidelines when using crackers and fireworks. 
              Keep children supervised and ensure proper safety measures are in place.
            </p>
          </div>

          <p>We'll notify you via email and SMS when your order is processed and shipped.</p>
          <p style="font-size: 16px;"><strong>Thank you for shopping with Hanuma Crackers!</strong></p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px;">
              Hanuma Crackers<br>
              Sivakasi, Tamil Nadu, India<br>
              <a href="https://hanuma-crackers.netlify.app" style="color: #f97316;">Visit Our Website</a>
            </p>
          </div>
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

  async sendPasswordResetEmail(userOrData, resetToken = null) {
    // Handle both old format (user, resetToken) and new format (data object)
    let userData, resetUrl;
    
    if (typeof userOrData === 'object' && userOrData.resetUrl) {
      // New format: data object with resetUrl
      userData = userOrData;
      resetUrl = userOrData.resetUrl;
    } else {
      // Old format: user object and separate resetToken
      userData = userOrData;
      resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userData.email,
      subject: 'Password Reset Request - Hanuma Crackers',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Password Reset Request</h2>
          <p>Hello ${userData.name},</p>
          <p>You recently requested to reset your password for your Hanuma Crackers account.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0;">Reset Password</a>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link in your browser:<br>
              <a href="${resetUrl}">${resetUrl}</a>
            </p>
          </div>

          <p><strong>Important:</strong> This link will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          
          <p>Best regards,<br>Hanuma Crackers Team</p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  // Old sendAdminNotification method removed - now using enhanced sendContactFormEmails

  async sendContactFormEmails(name, email, phone, subject, message) {
    try {
      // Try SendGrid first if available (recommended for production)
      if (sendGridService && process.env.SENDGRID_API_KEY) {
        console.log('🌟 Using SendGrid for contact form emails');
        return await sendGridService.sendContactFormEmails(name, email, phone, subject, message);
      }
      
      // Fallback to SMTP if SendGrid is not available
      console.log('📧 Using SMTP fallback for contact form emails');
      // Use BUSINESS_EMAIL as admin email if ADMIN_EMAIL is not set
      const adminEmail = process.env.BUSINESS_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      
      // Admin notification email
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `🎆 NEW INQUIRY: ${subject} - Action Required`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <h2 style="color: #f97316; border-bottom: 3px solid #f97316; padding-bottom: 10px;">
              🔔 NEW CUSTOMER INQUIRY - ACTION REQUIRED
            </h2>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0;">⚡ PRIORITY: Respond within 24 hours</h3>
              <p style="margin: 0; font-size: 14px;">📅 <strong>Received:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">� CUSTOMER CONTACT INFORMATION</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Full Name:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}" style="color: #f97316; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="tel:${phone}" style="color: #f97316; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px; color: #f97316; font-weight: bold;">${subject}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fff2e6; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #f97316;">
              <h3 style="color: #333; margin-top: 0;">💬 CUSTOMER INQUIRY MESSAGE</h3>
              <div style="background: white; padding: 20px; border-radius: 6px; border: 1px solid #e0e0e0; font-family: 'Courier New', monospace; line-height: 1.6; white-space: pre-wrap; color: #333;">${message}</div>
            </div>

            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">� IMMEDIATE ACTIONS</h3>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="mailto:${email}?subject=Re: ${subject}&body=Dear ${name},%0D%0A%0D%0AThank you for your inquiry about ${subject}. I'm happy to help you with your crackers requirements.%0D%0A%0D%0ABest regards,%0D%0AHanuma Crackers Team" 
                   style="background: #f97316; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px 0;">
                  � REPLY NOW
                </a>
                <a href="tel:${phone}" 
                   style="background: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin: 5px 0;">
                  📞 CALL NOW
                </a>
              </div>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h4 style="color: #333; margin-top: 0;">📋 RESPONSE CHECKLIST</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>☐ Read customer requirements carefully</li>
                <li>☐ Check product availability and pricing</li>
                <li>☐ Prepare detailed quote/response</li>
                <li>☐ Contact customer within 24 hours</li>
                <li>☐ Follow up if needed</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 12px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 30px;">
              🏪 <strong>Hanuma Crackers Business Dashboard</strong><br>
              📧 Auto-generated admin notification | 📱 Immediate action required
            </p>
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

      // Send emails with timeout protection
      // Don't send customer acknowledgment if customer email is same as admin email (testing scenario)
      const emailsToSend = [this.sendEmail(adminMailOptions)];
      
      // Only send customer acknowledgment if customer email is different from admin email
      if (email.toLowerCase() !== adminEmail.toLowerCase()) {
        emailsToSend.push(this.sendEmail(customerMailOptions));
      } else {
        console.log('⚠️ Skipping customer acknowledgment - customer email same as admin email');
      }

      await Promise.allSettled(emailsToSend);

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

  async sendNewOrderNotificationToAdmin(order) {
    try {
      const adminEmail = process.env.BUSINESS_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
      
      // Format order items for display
      const itemsHtml = order.items.map(item => {
        const product = item.product || {};
        return `
          <tr style="border-bottom: 1px solid #e0e0e0;">
            <td style="padding: 10px; border-right: 1px solid #e0e0e0;">
              ${product.name || item.name}
            </td>
            <td style="padding: 10px; text-align: center; border-right: 1px solid #e0e0e0;">
              ${item.quantity}
            </td>
            <td style="padding: 10px; text-align: right; border-right: 1px solid #e0e0e0;">
              ₹${item.price}
            </td>
            <td style="padding: 10px; text-align: right;">
              ₹${(item.quantity * item.price).toFixed(2)}
            </td>
          </tr>
        `;
      }).join('');

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `🎆 New Order Received - ${order.orderNumber} (₹${order.totalPrice})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <h2 style="color: #f97316; border-bottom: 3px solid #f97316; padding-bottom: 10px;">
              🎆 New Order Received!
            </h2>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="color: #333; margin-top: 0;">📋 Order Summary</h3>
              <p><strong>🆔 Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>💰 Total Amount:</strong> ₹${order.totalPrice}</p>
              <p><strong>💳 Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>📅 Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
              <p><strong>📦 Status:</strong> ${order.status}</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">👤 Customer Information</h3>
              <p><strong>📝 Name:</strong> ${order.user.name}</p>
              <p><strong>📧 Email:</strong> <a href="mailto:${order.user.email}">${order.user.email}</a></p>
              <p><strong>📱 Phone:</strong> <a href="tel:${order.user.phone}">${order.user.phone || 'Not provided'}</a></p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🚚 Shipping Address</h3>
              <p><strong>${order.shippingAddress.name}</strong></p>
              <p>${order.shippingAddress.street}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
              <p><strong>📞 Contact:</strong> ${order.shippingAddress.phone}</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🛍️ Order Items</h3>
              <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 4px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f97316; color: white;">
                    <th style="padding: 12px; text-align: left;">Product</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                    <th style="padding: 12px; text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f0f0f0; font-weight: bold;">
                    <td colspan="3" style="padding: 12px; text-align: right;">Total Amount:</td>
                    <td style="padding: 12px; text-align: right; color: #f97316;">₹${order.totalPrice}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">⚡ Quick Actions</h3>
              <p><strong>📧 Contact Customer:</strong> <a href="mailto:${order.user.email}?subject=Regarding Your Order ${order.orderNumber}" style="color: #f97316;">Send Email</a></p>
              <p><strong>📱 Call Customer:</strong> <a href="tel:${order.user.phone}" style="color: #f97316;">${order.user.phone || 'No phone provided'}</a></p>
              <p><strong>📦 Action Required:</strong> Please process this order and update the status in the admin panel.</p>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center;">
              ⏰ <strong>Order received on:</strong> ${new Date(order.createdAt).toLocaleString('en-IN')}<br>
              🏪 <strong>Hanuma Crackers Admin Panel</strong>
            </p>
          </div>
        `
      };

      return await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error('Failed to send admin order notification:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();