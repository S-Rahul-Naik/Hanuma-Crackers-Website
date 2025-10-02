# 📧 SENDGRID SETUP FOR RENDER

## Add these environment variables to Render:

SENDGRID_API_KEY=your_sendgrid_api_key_here
EMAIL_FROM=hanumacrackers@gmail.com

## Then update your email service to use SendGrid instead of SMTP

This will solve the connection timeout issues on Render.

## Steps:
1. Sign up for SendGrid (free tier: 100 emails/day)
2. Get API key from SendGrid dashboard
3. Add SENDGRID_API_KEY to Render environment
4. Update email service to use SendGrid API instead of SMTP