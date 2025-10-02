import FooterPageLayout from './FooterPageLayout';

export default function CookiePolicy() {
  return (
    <FooterPageLayout title="Cookie Policy" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-cookie-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Learn about how we use cookies and similar technologies to enhance your browsing experience.
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-yellow-800 mb-3 flex items-center">
            <i className="ri-information-line mr-2"></i>
            What Are Cookies?
          </h3>
          <p className="text-yellow-700">
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and improving site functionality.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-file-list-line text-yellow-500 mr-3"></i>
            Types of Cookies We Use
          </h3>
          
          <div className="grid gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                <i className="ri-settings-line mr-2"></i>
                Essential Cookies
              </h4>
              <p className="text-blue-700 mb-3">
                These cookies are necessary for the website to function properly and cannot be disabled.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left p-2 font-semibold text-blue-800">Cookie Name</th>
                      <th className="text-left p-2 font-semibold text-blue-800">Purpose</th>
                      <th className="text-left p-2 font-semibold text-blue-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-blue-700">
                    <tr className="border-b border-blue-100">
                      <td className="p-2">sessionId</td>
                      <td className="p-2">Maintains user session and login status</td>
                      <td className="p-2">Session</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-2">cart</td>
                      <td className="p-2">Stores shopping cart contents</td>
                      <td className="p-2">7 days</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="p-2">csrf_token</td>
                      <td className="p-2">Security protection against attacks</td>
                      <td className="p-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center">
                <i className="ri-speed-line mr-2"></i>
                Performance Cookies
              </h4>
              <p className="text-green-700 mb-3">
                These cookies help us understand how visitors interact with our website by collecting anonymous information.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-200">
                      <th className="text-left p-2 font-semibold text-green-800">Cookie Name</th>
                      <th className="text-left p-2 font-semibold text-green-800">Purpose</th>
                      <th className="text-left p-2 font-semibold text-green-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-green-700">
                    <tr className="border-b border-green-100">
                      <td className="p-2">_ga</td>
                      <td className="p-2">Google Analytics - tracks website usage</td>
                      <td className="p-2">2 years</td>
                    </tr>
                    <tr className="border-b border-green-100">
                      <td className="p-2">_gid</td>
                      <td className="p-2">Google Analytics - visitor identification</td>
                      <td className="p-2">24 hours</td>
                    </tr>
                    <tr className="border-b border-green-100">
                      <td className="p-2">page_views</td>
                      <td className="p-2">Tracks popular pages and content</td>
                      <td className="p-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-purple-800 mb-3 flex items-center">
                <i className="ri-user-line mr-2"></i>
                Functionality Cookies
              </h4>
              <p className="text-purple-700 mb-3">
                These cookies remember your preferences and choices to provide a personalized experience.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left p-2 font-semibold text-purple-800">Cookie Name</th>
                      <th className="text-left p-2 font-semibold text-purple-800">Purpose</th>
                      <th className="text-left p-2 font-semibold text-purple-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-700">
                    <tr className="border-b border-purple-100">
                      <td className="p-2">language</td>
                      <td className="p-2">Remembers your language preference</td>
                      <td className="p-2">1 year</td>
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="p-2">wishlist</td>
                      <td className="p-2">Stores your wishlist items</td>
                      <td className="p-2">30 days</td>
                    </tr>
                    <tr className="border-b border-purple-100">
                      <td className="p-2">viewed_products</td>
                      <td className="p-2">Tracks recently viewed products</td>
                      <td className="p-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="text-xl font-bold text-orange-800 mb-3 flex items-center">
                <i className="ri-advertisement-line mr-2"></i>
                Marketing Cookies
              </h4>
              <p className="text-orange-700 mb-3">
                These cookies are used to deliver relevant advertisements and track marketing campaign effectiveness.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-orange-200">
                      <th className="text-left p-2 font-semibold text-orange-800">Cookie Name</th>
                      <th className="text-left p-2 font-semibold text-orange-800">Purpose</th>
                      <th className="text-left p-2 font-semibold text-orange-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-orange-700">
                    <tr className="border-b border-orange-100">
                      <td className="p-2">_fbp</td>
                      <td className="p-2">Facebook Pixel - tracks conversions</td>
                      <td className="p-2">90 days</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2">utm_source</td>
                      <td className="p-2">Tracks traffic sources and campaigns</td>
                      <td className="p-2">30 days</td>
                    </tr>
                    <tr className="border-b border-orange-100">
                      <td className="p-2">referrer</td>
                      <td className="p-2">Identifies referring websites</td>
                      <td className="p-2">7 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-settings-3-line text-yellow-500 mr-3"></i>
            Managing Your Cookie Preferences
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <i className="ri-browser-line mr-2"></i>
                Browser Settings
              </h4>
              <p className="text-blue-700 mb-3 text-sm">
                You can control cookies through your browser settings. Here's how for popular browsers:
              </p>
              <ul className="space-y-2 text-blue-600 text-sm">
                <li>• <strong>Chrome:</strong> Settings → Privacy → Cookies and other site data</li>
                <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li>• <strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <i className="ri-toggle-line mr-2"></i>
                Cookie Consent
              </h4>
              <p className="text-green-700 mb-3 text-sm">
                When you first visit our website, you'll see a cookie consent banner where you can:
              </p>
              <ul className="space-y-2 text-green-600 text-sm">
                <li>• Accept all cookies</li>
                <li>• Reject non-essential cookies</li>
                <li>• Customize your preferences</li>
                <li>• Learn more about each cookie type</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
              <i className="ri-alert-line mr-2"></i>
              Important Note
            </h4>
            <p className="text-yellow-700 text-sm">
              Disabling certain cookies may impact your browsing experience and some website features may not work properly. Essential cookies cannot be disabled as they are required for basic website functionality.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-shield-line text-yellow-500 mr-3"></i>
            Third-Party Cookies
          </h3>
          
          <p className="text-gray-600 mb-4">
            We also use third-party services that may place cookies on your device. These services have their own privacy policies:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Analytics Services</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• <strong>Google Analytics:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a></li>
                <li>• <strong>Google Tag Manager:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Marketing Services</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• <strong>Facebook Pixel:</strong> <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 underline">Privacy Policy</a></li>
                <li>• <strong>Payment Processors:</strong> Various secure payment providers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-time-line text-yellow-500 mr-3"></i>
            Cookie Retention
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Different cookies have different retention periods based on their purpose:
            </p>
            
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="bg-white rounded-lg p-3">
                <i className="ri-time-line text-2xl text-blue-500 mb-2 block"></i>
                <h4 className="font-semibold text-gray-800 text-sm">Session</h4>
                <p className="text-gray-600 text-xs">Deleted when browser closes</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <i className="ri-calendar-line text-2xl text-green-500 mb-2 block"></i>
                <h4 className="font-semibold text-gray-800 text-sm">24 Hours</h4>
                <p className="text-gray-600 text-xs">Short-term analytics</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <i className="ri-calendar-2-line text-2xl text-orange-500 mb-2 block"></i>
                <h4 className="font-semibold text-gray-800 text-sm">30 Days</h4>
                <p className="text-gray-600 text-xs">User preferences</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <i className="ri-calendar-todo-line text-2xl text-purple-500 mb-2 block"></i>
                <h4 className="font-semibold text-gray-800 text-sm">2 Years</h4>
                <p className="text-gray-600 text-xs">Long-term analytics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-refresh-line text-yellow-500 mr-3"></i>
            Updates to This Policy
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Last Updated" date at the top of this policy and notify users through our website banner.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Questions About Our Cookie Policy?</h3>
          <p className="mb-4">Contact us if you have any questions about how we use cookies on our website.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:hanumacrackers@gmail.com" 
              className="inline-block bg-white text-yellow-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Email Us
            </a>
            <a 
              href="/contact-us" 
              className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-300 border border-white"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}