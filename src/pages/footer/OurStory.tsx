import FooterPageLayout from './FooterPageLayout';

export default function OurStory() {
  return (
    <FooterPageLayout title="Our Story" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-book-open-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            A journey that began with a passion for celebration and grew into a trusted name in the fireworks industry.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <i className="ri-time-line text-orange-500 mr-3"></i>
            Our Journey
          </h3>
          
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg font-bold text-center">
                  Inception
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">The Spark of an Idea</h4>
                <p className="text-gray-600 leading-relaxed">
                  Hanuma Crackers was born from a simple observation - festivals bring people together, and fireworks amplify that joy. Our founder recognized the need for a reliable, quality-focused fireworks retailer that prioritizes both celebration and safety.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold text-center">
                  Early Days
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Building Trust</h4>
                <p className="text-gray-600 leading-relaxed">
                  Starting with a small collection of traditional crackers, we focused on building relationships with local manufacturers and understanding what customers truly wanted. Quality control and customer satisfaction became our cornerstone principles.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <div className="bg-green-100 text-green-600 px-4 py-2 rounded-lg font-bold text-center">
                  Growth
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Expanding Horizons</h4>
                <p className="text-gray-600 leading-relaxed">
                  As word spread about our commitment to quality and safety, we expanded our product range to include modern fireworks, eco-friendly options, and specialty items for different occasions. Our customer base grew from local to national.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <div className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg font-bold text-center">
                  Digital Era
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Online Revolution</h4>
                <p className="text-gray-600 leading-relaxed">
                  Recognizing the shift towards digital commerce, we launched our online platform to reach customers across India. This move allowed us to serve remote areas and provide detailed product information and safety guidelines to all customers.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex-shrink-0">
                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-center">
                  Today
                </div>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Leading the Celebration</h4>
                <p className="text-gray-600 leading-relaxed">
                  Today, Hanuma Crackers stands as a trusted name in the industry, serving thousands of families across India. We continue to innovate while maintaining our core values of quality, safety, and environmental responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-lightbulb-line text-yellow-500 mr-3"></i>
            Our Philosophy
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <i className="ri-shield-check-line text-orange-500 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Safety First</h4>
              <p className="text-gray-600 text-sm">Every product is tested and comes with comprehensive safety guidelines.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <i className="ri-leaf-line text-green-500 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Eco-Conscious</h4>
              <p className="text-gray-600 text-sm">We promote environmentally friendly celebration practices.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <i className="ri-heart-line text-blue-500 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Community</h4>
              <p className="text-gray-600 text-sm">Bringing communities together through joyful celebrations.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Be Part of Our Story</h3>
          <p className="mb-4">Join thousands of satisfied customers who trust Hanuma Crackers for their celebrations.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/" 
              className="inline-block bg-white text-purple-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
            >
              Explore Products
            </a>
            <a 
              href="/contact-us" 
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-300 border border-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </FooterPageLayout>
  );
}