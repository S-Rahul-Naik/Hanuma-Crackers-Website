const logger = require('./logger');

// SendGrid is now the ONLY email service - SMTP permanently removed
let sendGridService = null;
try {
  sendGridService = require('./sendGridEmailService');
  console.log('🌟 SendGrid email service loaded - SMTP permanently disabled');
} catch (error) {
  console.error('❌ SendGrid service failed to load:', error);
  throw new Error('Email service unavailable - SendGrid is required');
}

class EmailService {
  constructor() {
    console.log('📧 Email Service: SMTP permanently removed - Using SendGrid only');
    if (!sendGridService) {
      throw new Error('SendGrid service is required - SMTP has been permanently disabled');
    }
  }

  async sendEmail(mailOptions) {
    try {
      // SendGrid ONLY - SMTP permanently removed
      if (!sendGridService || !process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid is required - SMTP has been permanently disabled. Please configure SENDGRID_API_KEY.');
      }

      console.log('🌟 Using SendGrid for email delivery (SMTP permanently disabled)');
      
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
      
      // For order confirmation emails
      if (mailOptions.isOrderConfirmation) {
        return await sendGridService.sendOrderConfirmation(
          mailOptions.orderData,
          mailOptions.to
        );
      }
      
      // For password reset emails
      if (mailOptions.isPasswordReset) {
        return await sendGridService.sendPasswordResetEmail(
          mailOptions.to,
          mailOptions.resetToken
        );
      }
      
      // For other generic emails, throw error since SMTP is removed
      throw new Error('Email type not supported - only SendGrid templates are available');
      
    } catch (error) {
      console.error('❌ SendGrid email failed:', error);
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendOrderConfirmation(order, userEmail) {
    try {
      // SendGrid ONLY - SMTP permanently removed
      if (!sendGridService || !process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid is required for order confirmations - SMTP has been permanently disabled. Please configure SENDGRID_API_KEY.');
      }

      console.log('🌟 Using SendGrid for order confirmation (SMTP permanently disabled)');
      
      const orderData = {
        orderId: order.orderNumber,
        totalAmount: order.totalPrice,
        status: order.status,
        customerName: order.user.name,
        items: order.items,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
        paymentMethod: order.paymentMethod
      };
      
      return await sendGridService.sendOrderConfirmation(orderData, userEmail);
      
    } catch (error) {
      console.error('❌ SendGrid order confirmation failed:', error);
      throw error;
    }
  }

  async sendContactFormEmails(name, email, phone, subject, message) {
    try {
      // SendGrid ONLY - SMTP permanently removed
      if (!sendGridService || !process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid is required for contact form emails - SMTP has been permanently disabled. Please configure SENDGRID_API_KEY.');
      }
      
      console.log('🌟 Using SendGrid for contact form emails (SMTP permanently disabled)');
      return await sendGridService.sendContactFormEmails(name, email, phone, subject, message);
      
    } catch (error) {
      console.error('❌ SendGrid contact form emails failed:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    try {
      // SendGrid ONLY - SMTP permanently removed
      if (!sendGridService || !process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid is required for password reset emails - SMTP has been permanently disabled. Please configure SENDGRID_API_KEY.');
      }

      console.log('🌟 Using SendGrid for password reset email (SMTP permanently disabled)');
      return await sendGridService.sendPasswordResetEmail(userEmail, resetToken);
      
    } catch (error) {
      console.error('❌ SendGrid password reset email failed:', error);
      throw error;
    }
  }

  // Legacy method for backward compatibility - now uses SendGrid only
  async sendAdminNotification(data) {
    console.log('⚠️ sendAdminNotification is deprecated - use sendContactFormEmails instead');
    return await this.sendContactFormEmails(
      data.name,
      data.email,
      data.phone,
      data.subject,
      data.message
    );
  }

  async sendNewOrderNotificationToAdmin(order) {
    try {
      // SendGrid ONLY - SMTP permanently removed
      if (!sendGridService || !process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid is required for admin order notifications - SMTP has been permanently disabled. Please configure SENDGRID_API_KEY.');
      }

      console.log('🌟 Using SendGrid for admin order notification (SMTP permanently disabled)');
      
      // Prepare order data for the new admin notification template
      const orderData = {
        orderId: order.orderNumber,
        totalAmount: order.totalPrice,
        paymentMethod: order.paymentMethod,
        status: order.status,
        customerName: order.user.name,
        customerEmail: order.user.email,
        customerPhone: order.user.phone || 'Not provided',
        items: order.items,
        shippingAddress: order.shippingAddress ? 
          `${order.shippingAddress.street}\n${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}` :
          'Address not provided',
        createdAt: order.createdAt
      };
      
      return await sendGridService.sendNewOrderNotificationToAdmin(orderData);
      
    } catch (error) {
      console.error('❌ SendGrid admin order notification failed:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();