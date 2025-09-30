
import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturedProducts from './components/FeaturedProducts';
import SpecialOffers from './components/SpecialOffers';
import SafetySection from './components/SafetySection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

export default function Home() {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [cart, setCart] = useState<{[key: string]: number}>(() => {
    // Load cart from localStorage on component mount
    try {
      const savedCart = localStorage.getItem('hanuma-crackers-cart');
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return {};
    }
  });
  const [loadedProducts, setLoadedProducts] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever cart state changes
  useEffect(() => {
    try {
      localStorage.setItem('hanuma-crackers-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCart(prev => ({
        ...prev,
        [productId]: quantity
      }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const handleClearCart = () => {
    setCart({});
    try {
      localStorage.removeItem('hanuma-crackers-cart');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={cart} onCartClick={handleCartClick} />
      <main>
        <div id="home">
          <HeroSection />
        </div>
        
        <div id="products">
          <FeaturedProducts 
            cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onProductsLoaded={(p)=> setLoadedProducts(p)}
          />
        </div>
        
        <div id="offers">
          <SpecialOffers currentIndex={currentOfferIndex} setCurrentIndex={setCurrentOfferIndex} />
        </div>
        
        <div id="safety">
          <SafetySection />
        </div>
        
        <div id="contact">
          <ContactForm />
        </div>
      </main>
      
      <Footer />
      
      <CartSidebar 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          products={loadedProducts}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
    </div>
  );
}
