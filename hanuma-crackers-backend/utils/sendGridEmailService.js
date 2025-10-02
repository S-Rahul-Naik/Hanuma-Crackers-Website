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
            subject: `🎆 NEW INQUIRY: ${subject} - Action Required`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #ff6b35; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h2 style="margin: 0; font-size: 18px;">🔔 NEW CUSTOMER INQUIRY - ACTION REQUIRED</h2>
                    </div>
                    
                    <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ff6b35; margin: 0;">
                        <p style="margin: 5px 0; font-weight: bold;">⚡ PRIORITY: Respond within 24 hours</p>
                        <p style="margin: 5px 0;">📅 Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border: 1px solid #dee2e6;">
                        <h3 style="color: #333; margin-top: 0; font-size: 16px;">👤 CUSTOMER CONTACT INFORMATION</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 30%;">Full Name:</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${email}" style="color: #ff6b35; text-decoration: none;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                                <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="tel:${phone}" style="color: #ff6b35; text-decoration: none;">${phone}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold;">Subject:</td>
                                <td style="padding: 8px;"><strong style="color: #ff6b35;">${subject}</strong></td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-top: none;">
                        <h3 style="color: #333; margin-top: 0; font-size: 16px;">💬 CUSTOMER INQUIRY MESSAGE</h3>
                        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #ff6b35; font-style: italic;">
                            ${message}
                        </div>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-top: none;">
                        <h3 style="color: #333; margin-top: 0; font-size: 16px;">⚡ IMMEDIATE ACTIONS</h3>
                        <div style="text-align: center; margin: 15px 0;">
                            <a href="mailto:${email}" style="background-color: #ff6b35; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">📧 REPLY NOW</a>
                            <a href="tel:${phone}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold;">📞 CALL NOW</a>
                        </div>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 8px 8px;">
                        <h3 style="color: #333; margin-top: 0; font-size: 16px;">✅ RESPONSE CHECKLIST</h3>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li style="margin-bottom: 8px;">☐ Read customer requirements carefully</li>
                            <li style="margin-bottom: 8px;">☐ Check product availability and pricing</li>
                            <li style="margin-bottom: 8px;">☐ Prepare detailed quote/response</li>
                            <li style="margin-bottom: 8px;">☐ Contact customer within 24 hours</li>
                            <li style="margin-bottom: 8px;">☐ Follow up if needed</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                        <p style="margin: 0; color: #666; font-size: 12px;">
                            🎆 <strong>Hanuma Crackers Business Dashboard</strong><br>
                            ⭐ Auto-generated admin notification | 🔥 Immediate action required
                        </p>
                    </div>
                </div>
            `
        };

        // Customer confirmation email
        const customerMsg = {
            to: email,
            from: emailFrom,
            subject: 'Thank you for contacting Hanuma Crackers! 🎆',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #ff6b35; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px;">🎆 Thank You for Contacting Us!</h2>
                    </div>
                    
                    <div style="background-color: #fff; padding: 25px; border: 1px solid #dee2e6; border-top: none;">
                        <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>${name}</strong>,</p>
                        
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                            Thank you for reaching out to <strong>Hanuma Crackers</strong>! We have received your message and our team will get back to you within <strong>24 hours</strong>.
                        </p>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #ff6b35; margin: 20px 0;">
                            <h3 style="color: #ff6b35; margin-top: 0; font-size: 18px;">📝 Your Message Details:</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 25%;">Subject:</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd; color: #ff6b35; font-weight: bold;">${subject}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
                                    <td style="padding: 8px; font-style: italic;">${message}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #333; margin-top: 0; font-size: 16px;">🌟 What happens next?</h3>
                            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                                <li>Our team will review your inquiry carefully</li>
                                <li>We'll prepare a detailed response with product information and pricing</li>
                                <li>You'll receive a personalized reply within 24 hours</li>
                                <li>We'll follow up to ensure all your questions are answered</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #fff2e6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #333; margin-top: 0; font-size: 16px;">📞 Need immediate assistance?</h3>
                            <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:hanumacrackers@gmail.com" style="color: #ff6b35;">hanumacrackers@gmail.com</a></p>
                            <p style="margin: 10px 0;"><strong>📱 Phone:</strong> <a href="tel:+918686556898" style="color: #ff6b35;">+91 86865 56898</a></p>
                            <p style="margin: 10px 0;"><strong>⏰ Business Hours:</strong> Mon-Sun: 9:00 AM - 8:00 PM (IST)</p>
                        </div>
                        
                        <p style="font-size: 16px; margin-top: 25px;">
                            In the meantime, feel free to explore our wide range of premium crackers and fireworks for all your celebration needs!
                        </p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="https://hanuma-crackers.netlify.app" style="background-color: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">🌐 Visit Our Website</a>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
                            <strong>Best regards,</strong><br>
                            <strong style="color: #ff6b35;">Hanuma Crackers Team</strong><br>
                            <em>Making your celebrations brighter! 🎆</em>
                        </p>
                    </div>
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
        
        // Format order items for display
        const itemsHtml = orderData.items ? orderData.items.map(item => {
            const product = item.product || {};
            return `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px; border-right: 1px solid #e0e0e0;">
                        ${product.name || item.name || 'Product'}
                    </td>
                    <td style="padding: 10px; text-align: center; border-right: 1px solid #e0e0e0;">
                        ${item.quantity || 1}
                    </td>
                    <td style="padding: 10px; text-align: right; border-right: 1px solid #e0e0e0;">
                        ₹${item.price || 0}
                    </td>
                    <td style="padding: 10px; text-align: right;">
                        ₹${((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                    </td>
                </tr>
            `;
        }).join('') : '<tr><td colspan="4" style="padding: 10px; text-align: center;">No items found</td></tr>';
        
        const msg = {
            to: userEmail,
            from: emailFrom,
            subject: `🎆 Order Confirmation - ${orderData.orderId} | Hanuma Crackers`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #FF6B35; text-align: center; border-bottom: 3px solid #FF6B35; padding-bottom: 10px;">
                        🎆 Thank You for Your Order!
                    </h2>
                    <p style="font-size: 16px;">Hello <strong>${orderData.customerName || 'Valued Customer'}</strong>,</p>
                    <p>Thank you for choosing <strong>Hanuma Crackers</strong>! Your order has been successfully placed and we're excited to help make your celebrations memorable.</p>
                    
                    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B35;">
                        <h3 style="color: #333; margin-top: 0;">📋 Order Summary</h3>
                        <p><strong>🆔 Order Number:</strong> ${orderData.orderId}</p>
                        <p><strong>💰 Total Amount:</strong> ₹${orderData.totalAmount}</p>
                        <p><strong>💳 Payment Method:</strong> ${orderData.paymentMethod || 'Cash on Delivery'}</p>
                        <p><strong>📅 Order Date:</strong> ${orderData.createdAt ? new Date(orderData.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</p>
                        <p><strong>📦 Order Status:</strong> <span style="color: #28a745; font-weight: bold;">${orderData.status || 'Confirmed'}</span></p>
                        <p><strong>🚚 Estimated Delivery:</strong> ${orderData.estimatedDelivery ? new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN') : '3-7 business days'}</p>
                    </div>

                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">🛍️ Order Items</h3>
                        <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden;">
                            <thead>
                                <tr style="background-color: #FF6B35; color: white;">
                                    <th style="padding: 12px; text-align: left;">Product</th>
                                    <th style="padding: 12px; text-align: center;">Quantity</th>
                                    <th style="padding: 12px; text-align: right;">Price</th>
                                    <th style="padding: 12px; text-align: right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsHtml}
                            </tbody>
                            <tfoot>
                                <tr style="background-color: #f0f0f0; font-weight: bold;">
                                    <td colspan="3" style="padding: 12px; text-align: right;">Total Amount:</td>
                                    <td style="padding: 12px; text-align: right; color: #FF6B35;">₹${orderData.totalAmount}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">📞 Need Help?</h3>
                        <p><strong>📧 Email us:</strong> <a href="mailto:hanumacrackers@gmail.com" style="color: #FF6B35;">hanumacrackers@gmail.com</a></p>
                        <p><strong>📱 Call us:</strong> <a href="tel:+918686556898" style="color: #FF6B35;">+91 86865 56898</a></p>
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
                            <a href="https://hanuma-crackers.netlify.app" style="color: #FF6B35;">Visit Our Website</a>
                        </p>
                    </div>
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

const sendNewOrderNotificationToAdmin = async (orderData) => {
    try {
        const emailFrom = process.env.EMAIL_FROM || process.env.BUSINESS_EMAIL || 'hanumacrackers@gmail.com';
        
        // Format order items for display
        const itemsHtml = orderData.items ? orderData.items.map(item => {
            const product = item.product || {};
            return `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 12px; background-color: #ff6b35; color: white; font-weight: bold;">${product.name || item.name || 'Product'}</td>
                    <td style="padding: 12px; text-align: center; background-color: #ff6b35; color: white; font-weight: bold;">${item.quantity || 1}</td>
                    <td style="padding: 12px; text-align: center; background-color: #ff6b35; color: white; font-weight: bold;">₹${item.price || 0}</td>
                    <td style="padding: 12px; text-align: center; background-color: #ff6b35; color: white; font-weight: bold;">₹${((item.quantity || 1) * (item.price || 0)).toFixed(2)}</td>
                </tr>
            `;
        }).join('') : '<tr><td colspan="4" style="padding: 12px; text-align: center;">No items found</td></tr>';
        
        const msg = {
            to: emailFrom,
            from: emailFrom,
            subject: `New Order Received - ${orderData.orderId} (₹${orderData.totalAmount})`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f8f9fa;">
                    <div style="background-color: #ff6b35; color: white; padding: 20px; text-align: center;">
                        <h2 style="margin: 0; font-size: 20px;">🎆 New Order Received!</h2>
                    </div>
                    
                    <div style="padding: 25px; background-color: white;">
                        <!-- Order Summary Section -->
                        <div style="background-color: #fff3cd; padding: 20px; border-left: 4px solid #ff6b35; margin-bottom: 25px;">
                            <h3 style="color: #333; margin-top: 0; font-size: 16px;">📋 Order Summary</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; font-weight: bold; width: 30%;">🆔 Order Number:</td>
                                    <td style="padding: 8px; color: #ff6b35; font-weight: bold;">${orderData.orderId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">💰 Total Amount:</td>
                                    <td style="padding: 8px; color: #ff6b35; font-weight: bold;">₹${orderData.totalAmount}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">💳 Payment Method:</td>
                                    <td style="padding: 8px;">${orderData.paymentMethod || 'Cash on Delivery'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">📅 Order Date:</td>
                                    <td style="padding: 8px;">${orderData.createdAt ? new Date(orderData.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">📦 Status:</td>
                                    <td style="padding: 8px; color: #28a745; font-weight: bold;">${orderData.status || 'processing'}</td>
                                </tr>
                            </table>
                        </div>

                        <!-- Customer Information Section -->
                        <div style="background-color: #e7f3ff; padding: 20px; margin-bottom: 25px;">
                            <h3 style="color: #333; margin-top: 0; font-size: 16px;">👤 Customer Information</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; font-weight: bold; width: 30%;">✏️ Name:</td>
                                    <td style="padding: 8px;">${orderData.customerName || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">📧 Email:</td>
                                    <td style="padding: 8px;"><a href="mailto:${orderData.customerEmail}" style="color: #ff6b35; text-decoration: none;">${orderData.customerEmail}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">📱 Phone:</td>
                                    <td style="padding: 8px;"><a href="tel:${orderData.customerPhone}" style="color: #ff6b35; text-decoration: none;">${orderData.customerPhone || 'Not provided'}</a></td>
                                </tr>
                            </table>
                        </div>

                        <!-- Shipping Address Section -->
                        <div style="background-color: #f8f9fa; padding: 20px; margin-bottom: 25px;">
                            <h3 style="color: #333; margin-top: 0; font-size: 16px;">🚚 Shipping Address</h3>
                            <p style="margin: 5px 0; font-weight: bold;">${orderData.customerName || 'Customer'}</p>
                            <p style="margin: 5px 0;">${orderData.shippingAddress || 'Address not provided'}</p>
                            <p style="margin: 5px 0;">📞 Contact: <a href="tel:${orderData.customerPhone}" style="color: #ff6b35; text-decoration: none;">${orderData.customerPhone || 'Not provided'}</a></p>
                        </div>

                        <!-- Order Items Section -->
                        <div style="margin-bottom: 25px;">
                            <h3 style="color: #333; margin-top: 0; font-size: 16px;">🎆 Order Items</h3>
                            <table style="width: 100%; border-collapse: collapse; border: 2px solid #ff6b35;">
                                <thead>
                                    <tr style="background-color: #ff6b35; color: white;">
                                        <th style="padding: 12px; text-align: left; font-weight: bold;">Product</th>
                                        <th style="padding: 12px; text-align: center; font-weight: bold;">Qty</th>
                                        <th style="padding: 12px; text-align: center; font-weight: bold;">Price</th>
                                        <th style="padding: 12px; text-align: center; font-weight: bold;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr style="background-color: #fff3cd;">
                                        <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Total Amount:</td>
                                        <td style="padding: 12px; text-align: center; color: #ff6b35; font-weight: bold; font-size: 18px;">₹${orderData.totalAmount}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <!-- Quick Actions Section -->
                        <div style="background-color: #e7f3ff; padding: 20px; margin-bottom: 25px;">
                            <h3 style="color: #333; margin-top: 0; font-size: 16px;">⚡ Quick Actions</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; font-weight: bold; width: 30%;">📧 Contact Customer:</td>
                                    <td style="padding: 8px;"><a href="mailto:${orderData.customerEmail}" style="color: #ff6b35; text-decoration: none; font-weight: bold;">Send Email</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">📞 Call Customer:</td>
                                    <td style="padding: 8px;"><a href="tel:${orderData.customerPhone}" style="color: #ff6b35; text-decoration: none; font-weight: bold;">${orderData.customerPhone || 'Not provided'}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">📦 Action Required:</td>
                                    <td style="padding: 8px;">Please process this order and update the status in the admin panel</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #dee2e6;">
                        <p style="margin: 0; color: #666; font-size: 12px;">
                            📅 Order received on: ${orderData.createdAt ? new Date(orderData.createdAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}<br>
                            🎆 <strong>Hanuma Crackers Admin Panel</strong>
                        </p>
                    </div>
                </div>
            `
        };

        await sgMail.send(msg);
        console.log('✅ New order notification sent to admin via SendGrid');
        return { success: true };
    } catch (error) {
        console.error('❌ SendGrid new order notification error:', error);
        throw error;
    }
};

module.exports = {
    sendContactFormEmails,
    sendOrderConfirmation,
    sendPasswordResetEmail,
    sendNewOrderNotificationToAdmin
};