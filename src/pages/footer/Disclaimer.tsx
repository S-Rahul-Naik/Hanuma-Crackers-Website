import FooterPageLayout from './FooterPageLayout';

export default function Disclaimer() {
  return (
    <FooterPageLayout title="Disclaimer" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-alert-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Important legal disclaimers regarding the use of our website and products.
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <i className="ri-error-warning-line mr-2"></i>
            Important Safety Notice
          </h3>
          <p className="text-red-700">
            Fireworks and crackers are potentially dangerous products. Use of these products involves inherent risks including but not limited to fire, explosion, and personal injury. Users assume all risks associated with the purchase, handling, and use of these products.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-shield-line text-gray-500 mr-3"></i>
            General Disclaimer
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Hanuma Crackers excludes all representations, warranties, obligations, and liabilities arising out of or in connection with:
            </p>
            
            <ul className="space-y-2 text-gray-600">
              <li>• The accuracy, completeness, or reliability of website information</li>
              <li>• The suitability of products for any particular purpose</li>
              <li>• The uninterrupted or error-free operation of the website</li>
              <li>• The security of data transmission over the internet</li>
              <li>• Any technical issues or malfunctions that may occur</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-fire-line text-red-500 mr-3"></i>
            Product Safety Disclaimer
          </h3>
          
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-lg p-6">
              <h4 className="font-bold text-orange-800 mb-3 flex items-center">
                <i className="ri-alert-line mr-2"></i>
                Age Restrictions
              </h4>
              <p className="text-orange-700 text-sm">
                Fireworks and crackers are intended for use by persons 18 years of age or older. Children must be supervised by adults at all times when fireworks are being used. We are not responsible for injuries resulting from underage use or lack of supervision.
              </p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6">
              <h4 className="font-bold text-red-800 mb-3 flex items-center">
                <i className="ri-fire-line mr-2"></i>
                Inherent Risks
              </h4>
              <p className="text-red-700 text-sm">
                The use of fireworks and crackers involves inherent risks including but not limited to burns, cuts, eye injuries, hearing damage, and property damage. Users acknowledge these risks and agree to use products at their own risk and responsibility.
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6">
              <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                <i className="ri-book-read-line mr-2"></i>
                Safety Instructions
              </h4>
              <p className="text-yellow-700 text-sm">
                All products come with safety instructions that must be read and followed carefully. Failure to follow safety instructions may result in serious injury or death. We are not liable for injuries resulting from improper use or failure to follow instructions.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <i className="ri-map-pin-line mr-2"></i>
                Local Laws and Regulations
              </h4>
              <p className="text-blue-700 text-sm">
                Users are responsible for ensuring compliance with all local, state, and federal laws regarding the purchase, possession, and use of fireworks. Some areas may prohibit or restrict fireworks use. We are not responsible for violations of local laws.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-scales-line text-gray-500 mr-3"></i>
            Limitation of Liability
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by applicable law, Hanuma Crackers shall not be liable for any:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Direct Damages</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Personal injury or death</li>
                  <li>• Property damage</li>
                  <li>• Medical expenses</li>
                  <li>• Economic losses</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Indirect Damages</h4>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Loss of profits or business</li>
                  <li>• Emotional distress</li>
                  <li>• Consequential damages</li>
                  <li>• Punitive damages</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-red-100 rounded-lg">
              <p className="text-red-800 text-sm font-medium">
                In no event shall our total liability exceed the purchase price of the products involved in the claim.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-information-line text-gray-500 mr-3"></i>
            Information Accuracy
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Product Information</h4>
              <p className="text-blue-700 text-sm">
                While we strive to provide accurate product descriptions, specifications, and images, we cannot guarantee that all information is completely accurate, complete, or current. Product appearances may vary.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Pricing Information</h4>
              <p className="text-green-700 text-sm">
                Prices and availability are subject to change without notice. We reserve the right to correct any pricing errors on our website and to refuse or cancel orders placed at incorrect prices.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-link-line text-gray-500 mr-3"></i>
            Third-Party Links
          </h3>
          
          <div className="bg-yellow-50 rounded-lg p-6">
            <p className="text-yellow-800 mb-3">
              Our website may contain links to third-party websites or services. These links are provided for convenience only.
            </p>
            
            <ul className="space-y-2 text-yellow-700 text-sm">
              <li>• We do not endorse or guarantee third-party content</li>
              <li>• We are not responsible for third-party privacy practices</li>
              <li>• Use of third-party sites is at your own risk</li>
              <li>• Third-party terms and conditions apply</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-shield-check-line text-gray-500 mr-3"></i>
            Indemnification
          </h3>
          
          <div className="bg-orange-50 rounded-lg p-6">
            <p className="text-orange-800 mb-3">
              By using our products and services, you agree to indemnify and hold harmless Hanuma Crackers, its owners, employees, and agents from and against any claims, damages, costs, or expenses arising from:
            </p>
            
            <ul className="space-y-2 text-orange-700 text-sm">
              <li>• Your use or misuse of our products</li>
              <li>• Your violation of these terms or applicable laws</li>
              <li>• Your negligent or intentional actions</li>
              <li>• Any third-party claims related to your use of our products</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-global-line text-gray-500 mr-3"></i>
            Jurisdiction and Governing Law
          </h3>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-blue-800 mb-3">
              This disclaimer is governed by the laws of India, specifically the state of Tamil Nadu.
            </p>
            
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>• Any disputes shall be resolved in Tamil Nadu courts</li>
              <li>• Indian law applies to all transactions</li>
              <li>• International users subject to local import laws</li>
              <li>• Severability clause applies if any provision is invalid</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-health-book-line text-gray-500 mr-3"></i>
            Health and Environmental Disclaimer
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <i className="ri-leaf-line mr-2"></i>
                Environmental Impact
              </h4>
              <p className="text-green-700 text-sm">
                Use of fireworks may have environmental impacts including air pollution, noise pollution, and waste generation. Users should consider environmental factors and follow local environmental guidelines.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                <i className="ri-heart-pulse-line mr-2"></i>
                Health Considerations
              </h4>
              <p className="text-purple-700 text-sm">
                Individuals with respiratory conditions, heart problems, or sensitivity to loud noises should exercise caution. Pregnant women and individuals with certain medical conditions should consult healthcare providers before exposure.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
            <i className="ri-refresh-line mr-2"></i>
            Changes to This Disclaimer
          </h3>
          <p className="text-red-700 text-sm">
            We reserve the right to modify this disclaimer at any time without prior notice. Changes will be effective immediately upon posting on our website. Your continued use of our website and products constitutes acceptance of any changes.
          </p>
        </div>

        <div className="bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Understanding the Risks</h3>
          <p className="mb-4">By purchasing and using our products, you acknowledge that you have read, understood, and accepted all disclaimers and risks.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/terms-of-service" 
              className="inline-block bg-white text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a 
              href="/contact-us" 
              className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-300 border border-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}