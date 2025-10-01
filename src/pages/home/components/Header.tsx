
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';

interface HeaderProps {
  cartItems?: { [key: string]: number };
  onCartClick?: () => void;
}

export default function Header({ cartItems, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const cartItemCount = Object.values(cartItems ?? {}).reduce((sum, count) => sum + count, 0);

  const handleUserClick = () => {
    if (!user) return navigate('/signin');
    if (user.role === 'admin') navigate('/admin'); else navigate('/dashboard');
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      // Home - scroll to very top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        // Different offsets for mobile and desktop
        const isMobile = window.innerWidth < 768; // md breakpoint
        const mobileOffset = (sectionId === 'products' || sectionId === 'offers' || sectionId === 'safety' || sectionId === 'contact') ? 205 : 0;
        const desktopOffset = (sectionId === 'products' || sectionId === 'offers' || sectionId === 'safety' || sectionId === 'contact') ? 60 : 0;
        
        const offset = isMobile ? mobileOffset : desktopOffset;
        
        window.scrollTo({
          top: element.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-orange-600 cursor-pointer select-none" 
              style={{ fontFamily: '"Pacifico", serif' }}
              onClick={() => scrollToSection('home')}
            >
              Hanuma Crackers
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-orange-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('products')} className="text-gray-700 hover:text-orange-600 transition-colors">Products</button>
            <button onClick={() => scrollToSection('offers')} className="text-gray-700 hover:text-orange-600 transition-colors">Offers</button>
            <button onClick={() => scrollToSection('safety')} className="text-gray-700 hover:text-orange-600 transition-colors">Safety</button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-orange-600 transition-colors">Contact</button>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative cursor-pointer hover:scale-110 transition-transform duration-300">
              <i className="ri-search-line text-2xl"></i>
            </div>

            {/* User Account / Dropdown */}
            <div className="relative flex items-center">
              <div
                className="relative cursor-pointer hover:scale-110 transition-transform duration-300"
                onClick={handleUserClick}
              >
                <i className="ri-user-line text-2xl"></i>
              </div>
                {/* Desktop: Logout button after cart icon */}
                {user && (
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await logout();
                      navigate('/', { replace: true });
                    }}
                    className="hidden md:inline-block ml-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-5 py-2 rounded-full shadow hover:scale-105 hover:from-orange-600 hover:to-red-600 transition-all duration-200 border-2 border-orange-600"
                    style={{ minWidth: 90 }}
                  >
                    Logout
                  </button>
                )}
            </div>

            {/* Cart */}
            <div
              className="relative cursor-pointer hover:scale-110 transition-transform duration-300"
              onClick={onCartClick}
            >
              <i className="ri-shopping-cart-line text-2xl"></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-orange-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('products')} className="text-left text-gray-700 hover:text-orange-600 transition-colors">Products</button>
              <button onClick={() => scrollToSection('offers')} className="text-left text-gray-700 hover:text-orange-600 transition-colors">Offers</button>
              <button onClick={() => scrollToSection('safety')} className="text-left text-gray-700 hover:text-orange-600 transition-colors">Safety</button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-orange-600 transition-colors">Contact</button>
              {/* Mobile: Logout button in hamburger menu */}
              {user && (
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await logout();
                    navigate('/', { replace: true });
                  }}
                  className="mt-2 bg-white border shadow rounded px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
