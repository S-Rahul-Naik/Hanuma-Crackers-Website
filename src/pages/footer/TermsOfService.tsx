import FooterPageLayout from './FooterPageLayout';

export default function TermsOfService() {
  return (
    <FooterPageLayout title="Terms of Service" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-file-text-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Please read these terms carefully before using our website and services.
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <i className="ri-information-line mr-2"></i>
            Agreement to Terms
          </h3>
          <p className="text-red-700">
            By accessing and using the Hanuma Crackers website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-user-line text-red-500 mr-3"></i>
            Account Terms
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Account Creation</h4>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• You must be at least 18 years old to create an account</li>
                <li>• You must provide accurate and complete information</li>
                <li>• You are responsible for maintaining account security</li>
                <li>• One account per person is allowed</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Account Responsibilities</h4>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Keep your login credentials confidential</li>
                <li>• Notify us immediately of any unauthorized access</li>
                <li>• Update your information when necessary</li>
                <li>• Comply with all applicable laws and regulations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-shopping-cart-line text-red-500 mr-3"></i>
            Order Terms
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Order Acceptance</h4>
                <p className="text-blue-700 text-sm">
                  All orders are subject to acceptance by Hanuma Crackers. We reserve the right to refuse or cancel orders at our discretion.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Pricing</h4>
                <p className="text-green-700 text-sm">
                  Prices are subject to change without notice. The price at the time of order confirmation will be honored.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Payment</h4>
                <p className="text-yellow-700 text-sm">
                  Payment must be made at the time of order. We accept various payment methods as displayed on our site.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Order Modifications</h4>
                <p className="text-purple-700 text-sm">
                  Orders can only be modified or cancelled within 2 hours of placement, subject to processing status.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-fire-line text-red-500 mr-3"></i>
            Product Safety & Usage
          </h3>
          
          <div className="bg-orange-50 rounded-lg p-6 mb-4">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
              <i className="ri-alert-line mr-2"></i>
              Important Safety Notice
            </h4>
            <p className="text-orange-700 mb-2">
              Fireworks and crackers are potentially dangerous products that require careful handling and use.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Age Restriction:</strong> You must be 18+ to purchase fireworks. Some products may have additional age restrictions.</span>
            </div>
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Safe Usage:</strong> You agree to use products according to provided safety instructions and applicable laws.</span>
            </div>
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Local Laws:</strong> You are responsible for ensuring compliance with local regulations regarding fireworks.</span>
            </div>
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Adult Supervision:</strong> Children must be supervised by adults when using any fireworks products.</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-scales-line text-red-500 mr-3"></i>
            Liability & Disclaimers
          </h3>
          
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Limitation of Liability</h4>
              <p className="text-red-700 text-sm">
                Hanuma Crackers shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or misuse of our products. Our liability is limited to the purchase price of the products.
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Product Disclaimers</h4>
              <p className="text-yellow-700 text-sm">
                Products are sold "as is" without warranties. We do not guarantee specific performance outcomes. All safety instructions must be followed to minimize risks.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">User Responsibility</h4>
              <p className="text-blue-700 text-sm">
                Users assume all risks associated with the purchase, transportation, storage, and use of fireworks and crackers. Proper safety precautions are the user's responsibility.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-copyright-line text-red-500 mr-3"></i>
            Intellectual Property
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of Hanuma Crackers or its licensors and is protected by copyright and trademark laws.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Permitted Use</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Personal, non-commercial use</li>
                  <li>• Browsing and shopping</li>
                  <li>• Sharing product information</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Prohibited Use</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Commercial reproduction</li>
                  <li>• Modification or distribution</li>
                  <li>• Reverse engineering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-prohibited-line text-red-500 mr-3"></i>
            Prohibited Activities
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Purchasing for resale without authorization</span>
              </div>
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Using products in prohibited areas or events</span>
              </div>
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Tampering with or modifying products</span>
              </div>
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Providing false information during orders</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Violating local laws and regulations</span>
              </div>
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Using automated systems to place orders</span>
              </div>
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Attempting to access unauthorized areas</span>
              </div>
              <div className="flex items-start">
                <i className="ri-close-line text-red-500 mr-3 mt-1"></i>
                <span className="text-gray-600">Harassing other users or staff</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-truck-line text-red-500 mr-3"></i>
            Shipping & Delivery Terms
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800 mb-4">
              Special shipping regulations apply to fireworks and crackers due to their hazardous nature.
            </p>
            
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>• Delivery timelines are estimates and may vary due to safety regulations</li>
              <li>• Some areas may be restricted from delivery due to local laws</li>
              <li>• Products must be accepted by someone 18 years or older</li>
              <li>• Shipping charges are non-refundable unless we made an error</li>
              <li>• Risk of loss transfers to you upon delivery</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-refund-line text-red-500 mr-3"></i>
            Returns & Refunds
          </h3>
          
          <p className="text-gray-600 mb-4">
            Due to the nature of fireworks and safety regulations, returns are limited. Please refer to our <a href="/returns-refunds" className="text-red-500 hover:text-red-600 underline">Returns & Refunds Policy</a> for detailed terms.
          </p>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Return Eligibility</h4>
            <p className="text-yellow-700 text-sm">
              Returns are only accepted for damaged, defective, or incorrectly shipped products within 48 hours of delivery.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-edit-line text-red-500 mr-3"></i>
            Modifications to Terms
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-scales-3-line text-red-500 mr-3"></i>
            Governing Law
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800">
              These terms are governed by the laws of India. Any disputes will be resolved in the courts of Tamil Nadu, India. If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Questions About Our Terms?</h3>
          <p className="mb-4">Contact us if you need clarification on any of these terms and conditions.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:hanumacrackers@gmail.com" 
              className="inline-block bg-white text-red-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Email Us
            </a>
            <a 
              href="/contact-us" 
              className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300 border border-white"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}