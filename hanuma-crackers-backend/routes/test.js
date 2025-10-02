const express = require('express');
const router = express.Router();
const emailService = require('../utils/emailService');

// @desc    Test order confirmation email
// @route   POST /api/test/order-confirmation
// @access  Public (for testing only)
router.post('/order-confirmation', async (req, res) => {
  try {
    console.log('🧪 Testing order confirmation email...');
    
    // Sample order data
    const sampleOrder = {
      orderNumber: 'ORD-TEST-001',
      totalPrice: 2500,
      status: 'confirmed',
      user: {
        name: 'John Doe',
        email: 'customer@test.com'
      },
      items: [
        {
          name: '100 Wala Crackers',
          quantity: 5,
          price: 200,
          product: { name: '100 Wala Crackers' }
        },
        {
          name: 'Flower Pots',
          quantity: 10,
          price: 150,
          product: { name: 'Flower Pots' }
        }
      ],
      shippingAddress: {
        street: '123 Main Street',
        city: 'Sivakasi',
        state: 'Tamil Nadu',
        pincode: '626123'
      },
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      paymentMethod: 'Cash on Delivery'
    };
    
    const result = await emailService.sendOrderConfirmation(sampleOrder, sampleOrder.user.email);
    
    res.json({
      success: true,
      message: 'Order confirmation email sent successfully!',
      emailResult: result
    });
    
  } catch (error) {
    console.error('❌ Test order confirmation failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation email',
      error: error.message
    });
  }
});

// @desc    Test admin order notification email
// @route   POST /api/test/admin-order-notification
// @access  Public (for testing only)
router.post('/admin-order-notification', async (req, res) => {
  try {
    console.log('🧪 Testing admin order notification email...');
    
    // Sample order data for admin notification
    const sampleOrder = {
      orderNumber: 'ORD-TEST-002',
      totalPrice: 3500,
      paymentMethod: 'Online Payment',
      status: 'processing',
      user: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+919876543210'
      },
      items: [
        {
          name: 'Rocket Crackers',
          quantity: 3,
          price: 500,
          product: { name: 'Rocket Crackers' }
        },
        {
          name: 'Ground Chakkar',
          quantity: 20,
          price: 100,
          product: { name: 'Ground Chakkar' }
        }
      ],
      shippingAddress: {
        street: '456 Park Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001'
      },
      createdAt: new Date()
    };
    
    const result = await emailService.sendNewOrderNotificationToAdmin(sampleOrder);
    
    res.json({
      success: true,
      message: 'Admin order notification sent successfully!',
      emailResult: result
    });
    
  } catch (error) {
    console.error('❌ Test admin notification failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send admin order notification',
      error: error.message
    });
  }
});

module.exports = router;