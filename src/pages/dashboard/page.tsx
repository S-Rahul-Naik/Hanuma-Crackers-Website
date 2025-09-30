
import { useState } from 'react';
import CartSidebar from '../home/components/CartSidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import UserHeader from './components/UserHeader';
import OrderHistory from './components/OrderHistory';
import ProfileSettings from './components/ProfileSettings';
import WishlistSection from './components/WishlistSection';
import DashboardOverview from './components/DashboardOverview';

export default function UserDashboard() {
  // Fetch products for cart sidebar
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/products?limit=40', { signal: controller.signal });
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const mapped = data.products.map((p: any) => ({
            id: p._id?.toString(),
            name: p.name,
            category: p.category || 'Misc',
            price: p.price,
            originalPrice: p.price && p.discountPrice ? p.price : p.price * 1.2,
            discount: p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0,
            image: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/400x300?text=No+Image',
            bestseller: p.totalSales ? p.totalSales > 150 : false,
            combo: p.tags ? p.tags.includes('combo') : false
          }));
          if (isMounted) {
            setLoadedProducts(mapped);
          }
        }
      } catch (err) {
        if (isMounted) {
          setLoadedProducts([]);
        }
      } finally {
        // nothing
      }
    })();
    return () => { isMounted = false; controller.abort(); };
  }, []);
  // Expose cart open function for header button
  window.dashboardCartOpen = () => setIsCartOpen(true);

  const [activeTab, setActiveTab] = useState('overview');
  // Cart logic copied from home page
  const [cart, setCart] = useState<{[key: string]: number}>(() => {
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

  useEffect(() => {
    try {
      localStorage.setItem('hanuma-crackers-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

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
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Removed dashboard cart localStorage logic

  if (user && user.role === 'admin') navigate('/admin');

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview user={user} />;
      case 'orders':
        return <OrderHistory user={user} />;
      case 'wishlist':
        return <WishlistSection user={user} />;
      case 'profile':
        return <ProfileSettings user={user} />;
      default:
        return <DashboardOverview user={user} />;
    }
  };

  // Removed dashboard cart sidebar event logic

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader user={user} activeTab={activeTab} setActiveTab={setActiveTab} cartItems={cart} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
        {/* Pass cart logic to WishlistSection if needed */}
        {/* <WishlistSection user={user} cart={cart} setCart={setCart} onProductsLoaded={setLoadedProducts} /> */}
      </main>
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
    // Cart sidebar event logic removed
}
