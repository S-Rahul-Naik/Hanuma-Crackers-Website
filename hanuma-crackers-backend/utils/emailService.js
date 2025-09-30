const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Use Gmail SMTP (you can change this based on your email provider)
    const config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
      }
    };

    // For other email providers, you can use SMTP settings
    if (process.env.SMTP_HOST) {
      config.host = process.env.SMTP_HOST;
      config.port = process.env.SMTP_PORT || 587;
      config.secure = process.env.SMTP_SECURE === 'true';
      delete config.service;
    }

    return nodemailer.createTransport(config);
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service is ready');
      return true;
    } catch (error) {
      logger.error('Email service verification failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(resetData) {
    const { email, name, resetUrl, resetToken } = resetData;

    const resetEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Hanuma Crackers',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Password Reset</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <h2 style="color: #374151;">Hi ${name},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              You requested a password reset for your Hanuma Crackers account. 
              Click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Reset My Password
              </a>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>⚠️ Important:</strong><br>
                • This link will expire in 10 minutes<br>
                • If you didn't request this reset, please ignore this email<br>
                • For security, never share this link with anyone
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              If the button doesn't work, copy and paste this link in your browser:<br>
              <a href="${resetUrl}" style="color: #f97316; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                <strong>Hanuma Crackers</strong><br>
                Sivakasi, Tamil Nadu, India<br>
                📞 +91 86885 56898 | 📧 hanumacrackers@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Hi ${name},
        
        You requested a password reset for your Hanuma Crackers account.
        
        Click this link to reset your password: ${resetUrl}
        
        Important:
        - This link will expire in 10 minutes
        - If you didn't request this reset, please ignore this email
        - For security, never share this link with anyone
        
        ---
        Hanuma Crackers
        Sivakasi, Tamil Nadu, India
        📞 +91 86885 56898 | 📧 hanumacrackers@gmail.com
      `
    };

    try {
      await this.transporter.sendMail(resetEmail);
      
      logger.info('Password reset email sent successfully', {
        email: email,
        resetToken: resetToken
      });

      return {
        success: true,
        message: 'Password reset email sent successfully'
      };
    } catch (error) {
      logger.error('Failed to send password reset email:', error);
      throw error;
    }
  }

  async sendContactEmail(contactData) {
    const { name, email, phone, subject, message } = contactData;

    // Email to business owner
    const businessEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <h2 style="color: #374151; margin-top: 0;">Contact Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f97316;">
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
              <h3 style="color: #374151; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #4b5563;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                This email was sent from the Hanuma Crackers website contact form.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        This email was sent from the Hanuma Crackers website contact form.
      `
    };

    // Confirmation email to customer
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Hanuma Crackers!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You!</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb;">
            <h2 style="color: #374151;">Hi ${name},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for reaching out to us! We have received your message and will get back to you within 24 hours.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #374151; margin-top: 0;">Your Message Summary:</h3>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 10px 0;"><strong>Message:</strong> ${message}</p>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #92400e; margin-top: 0;">Need Immediate Assistance?</h3>
              <p style="color: #92400e; margin: 0;">
                📞 Call us at: <strong>+91 86885 56898</strong><br>
                📧 Email us at: <strong>hanumacrackers@gmail.com</strong><br>
                💬 WhatsApp: <strong>+91 86885 56898</strong>
              </p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for choosing Hanuma Crackers for your celebration needs!
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                <strong>Hanuma Crackers</strong><br>
                Sivakasi, Tamil Nadu, India<br>
                Mon-Sun: 9:00 AM - 8:00 PM
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Hi ${name},
        
        Thank you for reaching out to us! We have received your message and will get back to you within 24 hours.
        
        Your Message Summary:
        Subject: ${subject}
        Message: ${message}
        
        Need Immediate Assistance?
        Call us at: +91 86885 56898
        Email us at: hanumacrackers@gmail.com
        WhatsApp: +91 86885 56898
        
        Thank you for choosing Hanuma Crackers for your celebration needs!
        
        ---
        Hanuma Crackers
        Sivakasi, Tamil Nadu, India
        Mon-Sun: 9:00 AM - 8:00 PM
      `
    };

    try {
      // Send both emails
      await Promise.all([
        this.transporter.sendMail(businessEmail),
        this.transporter.sendMail(confirmationEmail)
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