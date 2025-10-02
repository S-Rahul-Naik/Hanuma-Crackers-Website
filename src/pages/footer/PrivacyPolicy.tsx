import FooterPageLayout from './FooterPageLayout';

export default function PrivacyPolicy() {
  return (
    <FooterPageLayout title="Privacy Policy" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-shield-user-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
            <i className="ri-information-line mr-2"></i>
            Overview
          </h3>
          <p className="text-blue-700">
            This Privacy Policy explains how Hanuma Crackers collects, uses, shares, and protects your personal information when you use our website and services. By using our services, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-file-list-line text-indigo-500 mr-3"></i>
            Information We Collect
          </h3>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <i className="ri-user-line text-indigo-500 mr-2"></i>
                Personal Information
              </h4>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Name, email address, and phone number</li>
                <li>• Shipping and billing addresses</li>
                <li>• Date of birth (for age verification)</li>
                <li>• Payment information (processed securely by payment providers)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <i className="ri-shopping-cart-line text-indigo-500 mr-2"></i>
                Order Information
              </h4>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Products purchased and quantities</li>
                <li>• Order history and preferences</li>
                <li>• Customer service communications</li>
                <li>• Reviews and feedback</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <i className="ri-computer-line text-indigo-500 mr-2"></i>
                Technical Information
              </h4>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• IP address and browser information</li>
                <li>• Device type and operating system</li>
                <li>• Website usage patterns and preferences</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-settings-line text-indigo-500 mr-3"></i>
            How We Use Your Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing and shipping.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Customer Service:</strong> To respond to your inquiries and provide customer support.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Account Management:</strong> To create and manage your user account and preferences.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Communication:</strong> To send order updates, promotional emails, and important notices.</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Personalization:</strong> To customize your shopping experience and recommend products.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Analytics:</strong> To analyze website usage and improve our services.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Legal Compliance:</strong> To comply with applicable laws and regulations.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Security:</strong> To protect against fraud and ensure website security.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-share-line text-indigo-500 mr-3"></i>
            Information Sharing
          </h3>
          
          <div className="bg-yellow-50 rounded-lg p-6 mb-4">
            <p className="text-yellow-800 font-medium mb-2">
              We do not sell, trade, or rent your personal information to third parties.
            </p>
            <p className="text-yellow-700 text-sm">
              We may share your information only in the following circumstances:
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Service Providers</h4>
              <p className="text-gray-600 text-sm">We share information with trusted third-party service providers who help us operate our business (payment processors, shipping companies, email services).</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Legal Requirements</h4>
              <p className="text-gray-600 text-sm">We may disclose information when required by law, court order, or to protect our rights and safety.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Business Transfers</h4>
              <p className="text-gray-600 text-sm">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-cookie-line text-indigo-500 mr-3"></i>
            Cookies and Tracking
          </h3>
          
          <p className="text-gray-600 mb-4">
            We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Essential Cookies</h4>
              <p className="text-blue-700 text-sm">Required for basic website functionality and security.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Performance Cookies</h4>
              <p className="text-green-700 text-sm">Help us understand how visitors interact with our website.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Marketing Cookies</h4>
              <p className="text-purple-700 text-sm">Used to deliver personalized advertisements and offers.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-shield-check-line text-indigo-500 mr-3"></i>
            Data Security
          </h3>
          
          <div className="bg-green-50 rounded-lg p-6">
            <p className="text-green-800 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• SSL encryption for data transmission</li>
                <li>• Secure payment processing</li>
                <li>• Regular security audits and updates</li>
              </ul>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Access controls and authentication</li>
                <li>• Data backup and recovery procedures</li>
                <li>• Employee training on data protection</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-user-settings-line text-indigo-500 mr-3"></i>
            Your Rights
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <i className="ri-eye-line text-indigo-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Access:</strong> Request a copy of the personal information we hold about you.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-edit-line text-indigo-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Correction:</strong> Update or correct any inaccurate or incomplete information.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-delete-bin-line text-indigo-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements).</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <i className="ri-pause-line text-indigo-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Restriction:</strong> Limit how we process your personal information.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-download-line text-indigo-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Portability:</strong> Receive your data in a structured, commonly used format.</span>
              </div>
              <div className="flex items-start">
                <i className="ri-close-line text-indigo-500 mr-3 mt-1"></i>
                <span className="text-gray-600"><strong>Objection:</strong> Object to processing of your personal information in certain circumstances.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-time-line text-indigo-500 mr-3"></i>
            Data Retention
          </h3>
          
          <p className="text-gray-600 mb-4">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>• Account information: Until account deletion or 3 years of inactivity</li>
              <li>• Order history: 7 years for tax and legal compliance</li>
              <li>• Website analytics: 2 years for performance optimization</li>
              <li>• Marketing communications: Until you unsubscribe</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <i className="ri-alert-line mr-2"></i>
            Changes to This Policy
          </h3>
          <p className="text-red-700 text-sm">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically for any changes.
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Questions About Our Privacy Policy?</h3>
          <p className="mb-4">Contact us if you have any questions about how we handle your personal information.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:hanumacrackers@gmail.com" 
              className="inline-block bg-white text-indigo-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Email Us
            </a>
            <a 
              href="/contact-us" 
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 border border-white"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}