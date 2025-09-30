
interface SpecialOffersProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const offers = [
  {
    id: 1,
    title: 'Buy 1 Get 1 Free',
    subtitle: 'On All Sparklers',
    description: 'Double the sparkle, double the joy! Get an extra pack free with every sparkler purchase.',
    discount: '50% OFF',
    validity: 'Valid till Diwali',
    gradient: 'from-red-500 to-orange-500'
  },
  {
    id: 2,
    title: 'Diwali Combo Packs',
    subtitle: 'Up to 40% Off',
    description: 'Complete celebration packages with rockets, bombs, and sparklers at unbeatable prices.',
    discount: '40% OFF',
    validity: 'Limited Time',
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    id: 3,
    title: 'Kids Special Pack',
    subtitle: 'Safe & Fun',
    description: 'Child-friendly crackers with extra safety features. Perfect for family celebrations.',
    discount: '30% OFF',
    validity: 'Festival Special',
    gradient: 'from-green-500 to-blue-500'
  },
  {
    id: 4,
    title: 'Premium Rockets',
    subtitle: 'Sky High Savings',
    description: 'Professional grade rockets for spectacular displays. Light up the night sky!',
    discount: '35% OFF',
    validity: 'While Stocks Last',
    gradient: 'from-yellow-500 to-red-500'
  }
];

export default function SpecialOffers({ currentIndex, setCurrentIndex }: SpecialOffersProps) {
  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? offers.length - 1 : currentIndex - 1);
  };

  return (
    <section id="offers" className="py-20 bg-gradient-to-b from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Special <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Offers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss these incredible deals on your favorite crackers and fireworks
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {offers.map((offer) => (
                <div key={offer.id} className="w-full flex-shrink-0">
                  <div className={`relative bg-gradient-to-r ${offer.gradient} text-white overflow-hidden`}>
                    <div className="absolute inset-0 bg-cover bg-center opacity-20"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
                      <div className="flex flex-col justify-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                          <span className="text-2xl font-bold">{offer.discount}</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold mb-2">{offer.title}</h3>
                        <p className="text-xl md:text-2xl text-white/90 mb-4">{offer.subtitle}</p>
                        <p className="text-lg text-white/80 mb-6 leading-relaxed">{offer.description}</p>
                        <div className="flex items-center mb-8">
                          <i className="ri-time-line mr-2 text-yellow-300"></i>
                          <span className="text-yellow-300 font-semibold">{offer.validity}</span>
                        </div>
                        <div>
                          <button className="font-semibold rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-gray-800 px-8 py-4 text-lg border-2">
                            <i className="ri-shopping-cart-line mr-2"></i>
                            Claim Offer
                          </button>
                        </div>
                      </div>
                      <div className="relative flex items-center justify-center">
                        <div className="relative">
                          <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
                            <div className="w-48 h-48 bg-white/10 rounded-full border border-white/30 flex items-center justify-center">
                              <i className="ri-gift-line text-6xl text-white/80"></i>
                            </div>
                          </div>
                          <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
                          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-400 rounded-full animate-ping opacity-60"></div>
                          <div className="absolute top-1/2 -left-8 w-4 h-4 bg-red-400 rounded-full animate-pulse opacity-70"></div>
                          <div className="absolute top-8 right-8 w-3 h-3 bg-purple-300 rounded-full animate-bounce opacity-80"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      <div className="w-full h-full bg-gradient-to-bl from-white to-transparent rounded-bl-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            <i className="ri-arrow-left-line text-xl text-gray-700"></i>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            <i className="ri-arrow-right-line text-xl text-gray-700"></i>
          </button>

          <div className="flex justify-center mt-8 space-x-3">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
