import FooterPageLayout from './FooterPageLayout';

export default function ShippingPolicy() {
  return (
    <FooterPageLayout title="Shipping Policy" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-truck-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Fast, secure, and reliable delivery of your celebration essentials across India.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
            <i className="ri-information-line mr-2"></i>
            Important Notice
          </h3>
          <p className="text-blue-700">
            Due to the nature of fireworks and crackers, special shipping regulations apply. Please read our policy carefully to understand delivery timelines and restrictions.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-map-pin-line text-orange-500 mr-3"></i>
            Delivery Areas
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <i className="ri-check-line text-green-600 mr-2"></i>
                Available Locations
              </h4>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• All major cities in India</li>
                <li>• Tier 2 and Tier 3 cities</li>
                <li>• Rural areas (subject to courier availability)</li>
                <li>• Special arrangements for festival seasons</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                <i className="ri-close-line text-red-600 mr-2"></i>
                Restricted Areas
              </h4>
              <ul className="space-y-1 text-red-700 text-sm">
                <li>• Military zones and sensitive areas</li>
                <li>• Areas with local fireworks bans</li>
                <li>• Remote locations without courier access</li>
                <li>• International shipping not available</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-time-line text-orange-500 mr-3"></i>
            Delivery Timelines
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="p-3 text-left">Location Type</th>
                  <th className="p-3 text-left">Standard Delivery</th>
                  <th className="p-3 text-left">Express Delivery</th>
                  <th className="p-3 text-left">Festival Rush</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Metro Cities</td>
                  <td className="p-3">3-5 business days</td>
                  <td className="p-3">1-2 business days</td>
                  <td className="p-3">5-7 business days</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-3 font-medium">Tier 2 Cities</td>
                  <td className="p-3">5-7 business days</td>
                  <td className="p-3">2-3 business days</td>
                  <td className="p-3">7-10 business days</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Tier 3 Cities & Rural</td>
                  <td className="p-3">7-10 business days</td>
                  <td className="p-3">3-5 business days</td>
                  <td className="p-3">10-14 business days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-money-rupee-circle-line text-orange-500 mr-3"></i>
            Shipping Charges
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Standard Shipping</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Orders below ₹500: ₹75</li>
                <li>• Orders ₹500-₹1000: ₹50</li>
                <li>• Orders above ₹1000: Free shipping</li>
                <li>• Weight-based charges may apply for bulk orders</li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Express Shipping</h4>
              <ul className="space-y-2 text-orange-700 text-sm">
                <li>• Additional ₹100 on standard charges</li>
                <li>• Available in select cities only</li>
                <li>• Subject to product availability</li>
                <li>• Not available during peak festival days</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-shield-check-line text-orange-500 mr-3"></i>
            Packaging & Safety
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Secure Packaging:</strong> All products are packed in specially designed boxes with cushioning materials to prevent damage during transit.</span>
            </div>
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Safety Compliance:</strong> Packaging meets all transportation safety standards for hazardous materials.</span>
            </div>
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Weather Protection:</strong> Waterproof packaging to protect against moisture and weather conditions.</span>
            </div>
            <div className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Handling Instructions:</strong> Clear labeling with handling instructions for courier partners.</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-file-list-line text-orange-500 mr-3"></i>
            Order Processing
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Order Confirmation</h4>
              <p className="text-blue-700 text-sm">Orders are processed within 24 hours of confirmation. You'll receive an email with order details and tracking information.</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Quality Check</h4>
              <p className="text-yellow-700 text-sm">Each order undergoes a quality check to ensure all products meet our safety standards before packaging.</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Dispatch</h4>
              <p className="text-green-700 text-sm">Orders are dispatched through our trusted courier partners with real-time tracking facility.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <i className="ri-alert-line mr-2"></i>
            Important Terms
          </h3>
          <ul className="space-y-2 text-red-700 text-sm">
            <li>• Delivery timelines are estimates and may vary due to weather or unforeseen circumstances</li>
            <li>• Age verification (18+) required for delivery of fireworks</li>
            <li>• We reserve the right to refuse delivery to restricted areas</li>
            <li>• Customer must be available to receive the order or arrange for authorized person</li>
            <li>• Storage and usage instructions must be followed after delivery</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Need Help with Shipping?</h3>
          <p className="mb-4">Our customer support team is here to assist you with any shipping-related queries.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/contact-us" 
              className="inline-block bg-white text-blue-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Contact Support
            </a>
            <a 
              href="tel:+918688556898" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 border border-white"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}