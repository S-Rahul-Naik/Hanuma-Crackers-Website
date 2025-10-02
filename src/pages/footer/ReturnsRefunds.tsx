import FooterPageLayout from './FooterPageLayout';

export default function ReturnsRefunds() {
  return (
    <FooterPageLayout title="Returns & Refunds" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-refund-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your satisfaction is our priority. Learn about our return and refund policies.
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-yellow-800 mb-3 flex items-center">
            <i className="ri-alert-line mr-2"></i>
            Important Notice
          </h3>
          <p className="text-yellow-700">
            Due to the safety nature of fireworks and crackers, special return policies apply. Please read carefully before placing your order.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-check-line text-green-500 mr-3"></i>
            Eligible for Returns
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">✅ What Can Be Returned</h4>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Products damaged during shipping</li>
                <li>• Wrong items delivered</li>
                <li>• Manufacturing defects (unused products only)</li>
                <li>• Expired products (rare cases)</li>
                <li>• Incomplete orders</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-3">❌ What Cannot Be Returned</h4>
              <ul className="space-y-2 text-red-700 text-sm">
                <li>• Used or partially used products</li>
                <li>• Products damaged by customer</li>
                <li>• Custom or personalized orders</li>
                <li>• Products after the return window</li>
                <li>• Items without original packaging</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-time-line text-orange-500 mr-3"></i>
            Return Timeline
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <i className="ri-calendar-line mr-2"></i>
                48 Hour Window
              </h4>
              <p className="text-blue-700 text-sm">
                Returns must be initiated within 48 hours of delivery. This strict timeline ensures product safety and quality.
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                <i className="ri-camera-line mr-2"></i>
                Immediate Documentation
              </h4>
              <p className="text-orange-700 text-sm">
                Take photos of damaged or incorrect items immediately upon delivery. This helps expedite the return process.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-list-check-line text-orange-500 mr-3"></i>
            Return Process
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Contact Us Immediately</h4>
                <p className="text-gray-600 text-sm">Call us at +91 86885 56898 or email hanumacrackers@gmail.com within 48 hours of delivery.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Provide Documentation</h4>
                <p className="text-gray-600 text-sm">Share order number, photos of the issue, and description of the problem.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Return Authorization</h4>
                <p className="text-gray-600 text-sm">We'll review your case and provide return authorization if eligible.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">4</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Pickup Arrangement</h4>
                <p className="text-gray-600 text-sm">We'll arrange pickup from your location for authorized returns.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-4 mt-1 text-sm font-bold">5</div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Refund Processing</h4>
                <p className="text-gray-600 text-sm">Refund will be processed within 5-7 business days after product verification.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-money-rupee-circle-line text-green-500 mr-3"></i>
            Refund Policy
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Full Refund Cases</h4>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Products damaged during shipping</li>
                <li>• Wrong items delivered</li>
                <li>• Manufacturing defects</li>
                <li>• Order cancellation before dispatch</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Partial Refund Cases</h4>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• Incomplete orders (for missing items only)</li>
                <li>• Package tampering (verified cases)</li>
                <li>• Courier-related damages</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-exchange-line text-orange-500 mr-3"></i>
            Exchange Policy
          </h3>
          <div className="bg-orange-50 rounded-lg p-6">
            <p className="text-orange-800 mb-4">
              Due to safety regulations, we don't offer exchanges for fireworks and crackers. However, we can provide:
            </p>
            <ul className="space-y-2 text-orange-700">
              <li>• Store credit for future purchases</li>
              <li>• Replacement of damaged items with same product</li>
              <li>• Alternative product suggestions of equal value</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-bank-card-line text-orange-500 mr-3"></i>
            Refund Methods
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className="p-3 text-left">Payment Method</th>
                  <th className="p-3 text-left">Refund Method</th>
                  <th className="p-3 text-left">Processing Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Credit/Debit Cards</td>
                  <td className="p-3">Back to original card</td>
                  <td className="p-3">5-7 business days</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium">Net Banking</td>
                  <td className="p-3">Bank account credit</td>
                  <td className="p-3">3-5 business days</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">UPI</td>
                  <td className="p-3">UPI account credit</td>
                  <td className="p-3">1-3 business days</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 font-medium">Cash on Delivery</td>
                  <td className="p-3">Bank transfer</td>
                  <td className="p-3">7-10 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <i className="ri-shield-check-line mr-2"></i>
            Safety Guidelines
          </h3>
          <ul className="space-y-2 text-red-700 text-sm">
            <li>• Never attempt to return used or ignited fireworks</li>
            <li>• Keep returned products in original packaging</li>
            <li>• Store products safely until pickup is arranged</li>
            <li>• Do not expose products to moisture or extreme temperatures</li>
            <li>• Follow all handling instructions during return process</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need to Process a Return?</h3>
          <p className="mb-4">Contact our customer support team immediately for quick assistance.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:hanumacrackers@gmail.com" 
              className="inline-block bg-white text-green-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Email Us
            </a>
            <a 
              href="tel:+918688556898" 
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 border border-white"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}