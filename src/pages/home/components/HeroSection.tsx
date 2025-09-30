export default function HeroSection() {
  const scrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToOffers = () => {
    const offersSection = document.getElementById('offers');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Spectacular%20Diwali%20fireworks%20celebration%20background%20with%20colorful%20bursting%20fireworks%20in%20night%20sky%2C%20festive%20atmosphere%20with%20golden%20sparkles%20and%20vibrant%20colors%2C%20deep%20purple%20and%20orange%20tones%20creating%20magical%20celebration%20mood%2C%20fireworks%20display%20with%20diyas%20and%20lanterns%2C%20beautiful%20night%20sky%20filled%20with%20celebratory%20fireworks%20creating%20perfect%20backdrop%20for%20Diwali%20festival&width=1920&height=1080&seq=hero-bg-001&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/70 to-indigo-900/80"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Diyas */}
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <i className="ri-fire-line text-yellow-400 text-2xl opacity-60"></i>
        </div>
        <div className="absolute top-40 right-20 animate-bounce delay-2000">
          <i className="ri-fire-line text-orange-400 text-xl opacity-50"></i>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-3000">
          <i className="ri-fire-line text-red-400 text-lg opacity-40"></i>
        </div>
        
        {/* Twinkling Stars */}
        <div className="absolute top-32 right-40 animate-pulse">
          <i className="ri-star-fill text-yellow-300 text-sm opacity-70"></i>
        </div>
        <div className="absolute top-60 left-40 animate-pulse delay-1000">
          <i className="ri-star-fill text-orange-300 text-xs opacity-60"></i>
        </div>
        <div className="absolute bottom-60 right-60 animate-pulse delay-2000">
          <i className="ri-star-fill text-red-300 text-sm opacity-50"></i>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Celebrate This <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">Diwali</span>
            <br />
            with Joy &amp; Safety
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Shop Premium Crackers at Best Prices - Light up your celebrations with our eco-friendly and safe fireworks collection
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToShop}
              className="font-semibold rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl px-8 py-4 text-lg transform hover:scale-105 shadow-2xl"
            >
              <i className="ri-shopping-bag-line mr-2 text-xl"></i>
              Shop Now
            </button>
            
            <button 
              onClick={scrollToOffers}
              className="font-semibold rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900 px-8 py-4 text-lg transform hover:scale-105"
            >
              <i className="ri-gift-line mr-2 text-xl"></i>
              View Offers
            </button>
          </div>

          <div className="mt-12 flex justify-center items-center space-x-8 text-purple-200">
            <div className="flex items-center space-x-2">
              <i className="ri-shield-check-line text-green-400 text-xl"></i>
              <span className="text-sm">Safe &amp; Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-truck-line text-blue-400 text-xl"></i>
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-leaf-line text-green-400 text-xl"></i>
              <span className="text-sm">Eco-Friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <i className="ri-arrow-down-line text-white text-2xl opacity-70"></i>
      </div>
    </section>
  );
}
