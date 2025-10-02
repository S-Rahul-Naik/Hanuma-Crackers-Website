const express = require('express');
const { body, validationResult } = require('express-validator');
const emailService = require('../utils/emailService');
const logger = require('../utils/logger');

const router = express.Router();

// RATE LIMITING PERMANENTLY DISABLED - Unlimited contact form submissions allowed
console.log('⚠️  Contact form rate limiting is PERMANENTLY DISABLED');

// Validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/)
    .withMessage('Name can only contain letters, spaces, dots, apostrophes, and hyphens'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .trim()
    .matches(/^\+?[\d\s\-()]{10,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send contact form submission
 *     description: Submit a contact form message which will be emailed to the business and a confirmation sent to the customer
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+91 98765 43210"
 *               subject:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "Product Inquiry"
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *                 example: "I'm interested in your diwali crackers collection..."
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Your message has been sent successfully! We'll get back to you within 24 hours."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Please check your input data"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 */
router.post('/', validateContactForm, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please check your input data',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    const { name, email, phone, subject, message } = req.body;

    // Log contact form submission
    logger.info('Contact form submission received', {
      customerEmail: email,
      subject: subject,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // For now, just log the contact details instead of sending email
    // This prevents the 500 error when email service is not configured
    console.log('📧 Contact Form Submission:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('---');

    // Send immediate response to user, then send emails asynchronously
    res.json({
      success: true,
      message: "Your message has been sent successfully! We'll get back to you within 24 hours."
    });

    // Send emails asynchronously in the background (non-blocking)
    setImmediate(async () => {
      try {
        await emailService.sendContactFormEmails(name, email, phone, subject, message);
        console.log('✅ Contact form emails sent successfully (background)');
      } catch (emailError) {
        console.log('⚠️ Email service error:', emailError.message);
        logger.error('Contact form email failed:', {
          error: emailError.message,
          customerEmail: email,
          subject: subject
        });
      }
    });

  } catch (error) {
    logger.error('Contact form submission failed:', {
      error: error.message,
      stack: error.stack,
      customerEmail: req.body?.email,
      ip: req.ip
    });

    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @swagger
 * /api/contact/health:
 *   get:
 *     summary: Check email service health
 *     description: Verify if the email service is properly configured and working
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Email service is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email service is working properly"
 *       500:
 *         description: Email service is not working
 */
router.get('/health', async (req, res) => {
  try {
    const isWorking = await emailService.verifyConnection();
    
    if (isWorking) {
      res.json({
        success: true,
        message: 'Email service is working properly'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Email service is not properly configured'
      });
    }
  } catch (error) {
    logger.error('Email service health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Email service health check failed'
    });
  }
});

module.exports = router;