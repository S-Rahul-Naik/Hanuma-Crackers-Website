const emailService = require('./utils/emailService');

// Test Order Confirmation Email
async function testOrderConfirmationEmail() {
    console.log('🧪 Testing Order Confirmation Email...');
    
    // Sample order data
    const sampleOrder = {
        orderNumber: 'ORD-TEST-001',
        totalPrice: 2500,
        status: 'confirmed',
        user: {
            name: 'John Doe'
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
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        paymentMethod: 'Cash on Delivery'
    };
    
    const customerEmail = 'customer@test.com';
    
    try {
        const result = await emailService.sendOrderConfirmation(sampleOrder, customerEmail);
        console.log('✅ Order confirmation email sent successfully!');
        console.log('📧 Email details:', result);
    } catch (error) {
        console.error('❌ Failed to send order confirmation email:', error);
    }
}

// Test Admin Order Notification
async function testAdminOrderNotification() {
    console.log('🧪 Testing Admin New Order Notification...');
    
    // Create a manual admin notification for new order
    const orderData = {
        orderNumber: 'ORD-TEST-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+919876543210',
        totalAmount: 3500,
        items: [
            { name: 'Rocket Crackers', quantity: 3, price: 500 },
            { name: 'Ground Chakkar', quantity: 20, price: 100 }
        ],
        paymentMethod: 'Online Payment',
        shippingAddress: 'Chennai, Tamil Nadu'
    };
    
    // Create a new order notification email using contact form template (we can enhance this)
    try {
        const adminNotification = await emailService.sendContactFormEmails(
            `NEW ORDER: ${orderData.customerName}`,
            orderData.customerEmail,
            orderData.customerPhone,
            `New Order Received - ${orderData.orderNumber}`,
            `🛒 NEW ORDER ALERT!\n\nOrder: ${orderData.orderNumber}\nCustomer: ${orderData.customerName}\nTotal: ₹${orderData.totalAmount}\nPayment: ${orderData.paymentMethod}\n\nItems:\n${orderData.items.map(item => `- ${item.name} (${item.quantity}x) - ₹${item.price * item.quantity}`).join('\n')}\n\nShipping: ${orderData.shippingAddress}\n\nPlease process this order immediately!`
        );
        
        console.log('✅ Admin order notification sent successfully!');
        console.log('📧 Admin notification details:', adminNotification);
    } catch (error) {
        console.error('❌ Failed to send admin order notification:', error);
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting Email Tests...\n');
    
    await testOrderConfirmationEmail();
    console.log('\n' + '='.repeat(50) + '\n');
    await testAdminOrderNotification();
    
    console.log('\n🎉 Email tests completed!');
    process.exit(0);
}

runTests();