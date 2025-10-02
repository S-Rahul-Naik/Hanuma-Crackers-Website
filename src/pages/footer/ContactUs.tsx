import { useState } from 'react';
import FooterPageLayout from './FooterPageLayout';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'https://hanuma-crackers.onrender.com';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FooterPageLayout title="Contact Us" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-customer-service-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're here to help! Get in touch with us for any questions, concerns, or feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="ri-mail-line text-blue-500 mr-3"></i>
              Send us a Message
            </h3>
            
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 flex items-center">
                  <i className="ri-check-line mr-2"></i>
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 flex items-center">
                  <i className="ri-error-warning-line mr-2"></i>
                  Sorry, there was an error sending your message. Please try again or contact us directly.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Shipping Inquiry">Shipping Inquiry</option>
                  <option value="Return/Refund">Return/Refund</option>
                  <option value="Bulk Order">Bulk Order</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="ri-send-plane-line mr-2"></i>
                    Send Message
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <i className="ri-contacts-line text-orange-500 mr-3"></i>
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="ri-phone-line text-orange-500 mr-3 mt-1"></i>
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <a href="tel:+918688556898" className="text-orange-600 hover:text-orange-700">
                      +91 86885 56898
                    </a>
                    <p className="text-sm text-gray-600">Mon-Sat, 9 AM - 7 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="ri-mail-line text-orange-500 mr-3 mt-1"></i>
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a href="mailto:hanumacrackers@gmail.com" className="text-orange-600 hover:text-orange-700">
                      hanumacrackers@gmail.com
                    </a>
                    <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="ri-whatsapp-line text-orange-500 mr-3 mt-1"></i>
                  <div>
                    <p className="font-medium text-gray-800">WhatsApp</p>
                    <a href="https://wa.me/8688556898" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                      +91 86885 56898
                    </a>
                    <p className="text-sm text-gray-600">Quick support & order updates</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                <i className="ri-time-line mr-2"></i>
                Business Hours
              </h3>
              <div className="space-y-2 text-blue-700">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span>9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Festival Season</span>
                  <span>Extended Hours</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center">
                <i className="ri-customer-service-2-line mr-2"></i>
                Quick Support
              </h3>
              <div className="space-y-3">
                <a 
                  href="/faqs" 
                  className="block p-3 bg-white rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <i className="ri-question-answer-line text-green-600 mr-3"></i>
                    <span className="font-medium text-green-800">Check FAQs</span>
                  </div>
                </a>
                <a 
                  href="/shipping-policy" 
                  className="block p-3 bg-white rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <i className="ri-truck-line text-green-600 mr-3"></i>
                    <span className="font-medium text-green-800">Shipping Info</span>
                  </div>
                </a>
                <a 
                  href="/returns-refunds" 
                  className="block p-3 bg-white rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <i className="ri-refund-line text-green-600 mr-3"></i>
                    <span className="font-medium text-green-800">Returns Policy</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Follow Us on Social Media</h3>
          <p className="mb-4">Stay updated with our latest products and offers</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
            >
              <i className="ri-instagram-line text-lg"></i>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
            >
              <i className="ri-facebook-line text-lg"></i>
            </a>
            <a 
              href="https://wa.me/8688556898" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
            >
              <i className="ri-whatsapp-line text-lg"></i>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
            >
              <i className="ri-twitter-line text-lg"></i>
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}