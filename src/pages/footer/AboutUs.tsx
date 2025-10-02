import FooterPageLayout from './FooterPageLayout';

export default function AboutUs() {
  return (
    <FooterPageLayout title="About Us" lastUpdated="October 2, 2025">
      <div className="prose prose-lg max-w-none">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="ri-fire-line text-3xl text-white"></i>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Bringing joy, celebration, and unforgettable moments to your festivals since our inception.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="ri-rocket-line text-orange-500 mr-3"></i>
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              At Hanuma Crackers, our mission is to illuminate your celebrations with premium quality fireworks and crackers. We are committed to providing safe, environmentally conscious, and spectacular pyrotechnic products that bring families and communities together during festive occasions.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="ri-eye-line text-orange-500 mr-3"></i>
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To become the most trusted and preferred brand for celebration essentials, while promoting responsible and sustainable festivities that preserve our environment for future generations.
            </p>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-heart-line text-red-500 mr-3"></i>
            Our Values
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Quality First</h4>
              <p className="text-gray-600 text-sm">Every product undergoes rigorous quality checks to ensure safety and performance.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🌱 Eco-Friendly</h4>
              <p className="text-gray-600 text-sm">We prioritize environmentally sustainable products and practices.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🤝 Customer Trust</h4>
              <p className="text-gray-600 text-sm">Building lasting relationships through reliable service and genuine products.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎉 Celebration</h4>
              <p className="text-gray-600 text-sm">Spreading joy and happiness through memorable festive experiences.</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-star-line text-yellow-500 mr-3"></i>
            What Makes Us Special
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Premium Quality:</strong> Sourced from certified manufacturers with the highest safety standards.</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Wide Range:</strong> From traditional crackers to modern fireworks, we have something for every celebration.</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Safety Focus:</strong> Comprehensive safety instructions and guidelines with every purchase.</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Fast Delivery:</strong> Reliable shipping across India with secure packaging.</span>
            </li>
            <li className="flex items-start">
              <i className="ri-check-line text-green-500 mr-3 mt-1"></i>
              <span className="text-gray-600"><strong>Expert Support:</strong> Our knowledgeable team is always ready to help you choose the right products.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Celebrate?</h3>
          <p className="mb-4">Explore our extensive collection of premium crackers and fireworks.</p>
          <a 
            href="/" 
            className="inline-block bg-white text-orange-500 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
          >
            Shop Now
          </a>
        </div>
      </div>
    </FooterPageLayout>
  );
}