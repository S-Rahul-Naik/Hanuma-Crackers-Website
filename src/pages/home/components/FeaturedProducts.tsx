
import { useState, useEffect } from 'react';

const categories = ['All', 'Sparklers', 'Bombs', 'Rockets', 'Assorted Packs', 'Kids Special'];

// Initial static products act as a fallback until backend loads
const staticProducts = [
  {
    id: '1',
    name: 'Premium Golden Sparklers Pack',
    category: 'Sparklers',
    price: 299,
    originalPrice: 399,
    discount: 25,
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20golden%20sparklers%20fireworks%20crackers%20pack%20with%20elegant%20packaging%2C%20premium%20quality%20sparklers%20in%20decorative%20box%2C%20festive%20Diwali%20themed%20design%20with%20golden%20sparkles%20effect%2C%20product%20photography%20with%20simple%20clean%20background%20highlighting%20the%20sparklers%2C%20warm%20golden%20lighting%20creating%20celebratory%20mood&width=400&height=300&seq=sparklers-001&orientation=landscape',
    bestseller: true
  },
  {
    id: '2',
    name: 'Thunder Bomb Crackers Set',
    category: 'Bombs',
    price: 599,
    originalPrice: 799,
    discount: 25,
    image: 'https://readdy.ai/api/search-image?query=Professional%20thunder%20bomb%20crackers%20fireworks%20set%20in%20colorful%20packaging%2C%20powerful%20crackers%20with%20safety%20warnings%2C%20festive%20Diwali%20themed%20product%20display%2C%20vibrant%20red%20and%20orange%20colored%20packaging%20design%2C%20clean%20product%20photography%20with%20simple%20background%20emphasizing%20the%20crackers%20quality&width=400&height=300&seq=bombs-001&orientation=landscape',
    bestseller: true
  },
  {
    id: '3',
    name: 'Sky Rocket Fireworks Bundle',
    category: 'Rockets',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    image: 'https://readdy.ai/api/search-image?query=Spectacular%20sky%20rocket%20fireworks%20bundle%20with%20colorful%20rockets%2C%20professional%20grade%20fireworks%20in%20premium%20packaging%2C%20festive%20Diwali%20celebration%20theme%2C%20multiple%20colored%20rockets%20arranged%20beautifully%2C%20clean%20product%20photography%20with%20simple%20background%20showcasing%20the%20rocket%20variety%20and%20quality&width=400&height=300&seq=rockets-001&orientation=landscape'
  },
  {
    id: '4',
    name: 'Festival Combo Pack Deluxe',
    category: 'Assorted Packs',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    image: 'https://readdy.ai/api/search-image?query=Luxury%20festival%20combo%20pack%20with%20assorted%20crackers%20and%20fireworks%2C%20premium%20deluxe%20packaging%20with%20golden%20accents%2C%20variety%20of%20crackers%20including%20sparklers%20bombs%20rockets%20in%20elegant%20gift%20box%2C%20festive%20Diwali%20themed%20presentation%2C%20clean%20product%20photography%20with%20simple%20background%20highlighting%20the%20comprehensive%20collection&width=400&height=300&seq=combo-001&orientation=landscape',
    combo: true
  },
  {
    id: '5',
    name: 'Safe Kids Fireworks Kit',
    category: 'Kids Special',
    price: 249,
    originalPrice: 349,
    discount: 29,
    image: 'https://readdy.ai/api/search-image?query=Child-safe%20fireworks%20kit%20with%20colorful%20mild%20crackers%2C%20kids%20special%20safe%20fireworks%20in%20bright%20cheerful%20packaging%2C%20family-friendly%20Diwali%20celebration%20theme%2C%20small%20safe%20crackers%20designed%20for%20children%2C%20clean%20product%20photography%20with%20simple%20background%20emphasizing%20safety%20and%20fun%20colors&width=400&height=300&seq=kids-001&orientation=landscape'
  },
  {
    id: '6',
    name: 'Rainbow Sparkler Collection',
    category: 'Sparklers',
    price: 449,
    originalPrice: 599,
    discount: 25,
    image: 'https://readdy.ai/api/search-image?query=Vibrant%20rainbow%20colored%20sparklers%20collection%2C%20multi-colored%20sparklers%20in%20beautiful%20display%20packaging%2C%20festive%20Diwali%20celebration%20with%20rainbow%20theme%2C%20colorful%20sparklers%20arranged%20in%20spectrum%20colors%2C%20clean%20product%20photography%20with%20simple%20background%20showcasing%20the%20rainbow%20sparkler%20variety%20and%20premium%20quality&width=400&height=300&seq=rainbow-001&orientation=landscape'
  },
  {
    id: '7',
    name: 'Ground Spinner Wheel Set',
    category: 'Assorted Packs',
    price: 199,
    originalPrice: 299,
    discount: 33,
    image: 'https://readdy.ai/api/search-image?query=Exciting%20ground%20spinner%20wheel%20fireworks%20set%2C%20rotating%20wheel%20crackers%20with%20colorful%20effects%2C%20traditional%20Diwali%20ground%20fireworks%20in%20attractive%20packaging%2C%20spinning%20wheel%20crackers%20arrangement%2C%20clean%20product%20photography%20with%20simple%20background%20highlighting%20the%20wheel%20fireworks%20and%20their%20spinning%20motion%20effects&width=400&height=300&seq=spinner-001&orientation=landscape'
  },
  {
    id: '8',
    name: 'Mega Celebration Bundle',
    category: 'Assorted Packs',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    image: 'https://readdy.ai/api/search-image?query=Ultimate%20mega%20celebration%20fireworks%20bundle%2C%20comprehensive%20collection%20of%20premium%20crackers%20and%20fireworks%2C%20luxury%20packaging%20with%20festival%20themes%2C%20extensive%20variety%20including%20all%20types%20of%20crackers%2C%20clean%20product%20photography%20with%20simple%20background%20showcasing%20the%20complete%20mega%20collection%20for%20grand%20Diwali%20celebrations&width=400&height=300&seq=mega-001&orientation=landscape',
    bestseller: true
  }
];

interface FeaturedProductsProps {
  cart: { [key: string]: number };
  onAddToCart: (productId: string, productName: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProductsLoaded?: (products: any[]) => void;
}

export default function FeaturedProducts({ cart, onAddToCart, onUpdateQuantity: _onUpdateQuantity, onRemoveItem: _onRemoveItem, onProductsLoaded }: FeaturedProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNotification, setShowNotification] = useState<{show: boolean, productName: string}>({show: false, productName: ''});
  const [wishlistNotification, setWishlistNotification] = useState<{show: boolean, productName: string, isAdded: boolean}>({show: false, productName: '', isAdded: false});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [wishlistLoading, setWishlistLoading] = useState<Set<string>>(new Set());
  // Products start empty; we hydrate instantly from cache if present to avoid perceived delay
  const [products, setProducts] = useState<any[]>([]);
  // Fetch products directly from server (no client-side persistent caching per policy)
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    (async () => {
      try {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Use environment variable for API URL
  const res = await fetch(`${API_URL}/api/products?limit=40`); // No abort signal for infinite rate limit
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
            setProducts(mapped);
            if (onProductsLoaded) onProductsLoaded(mapped);
            setError(null);
          }
        }
      } catch (err: any) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Error loading products');
          if (products.length === 0) {
            setProducts(staticProducts);
            if (onProductsLoaded) onProductsLoaded(staticProducts);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; controller.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch wishlist items on component mount
  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
          const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Use environment variable for API URL
  const response = await fetch(`${API_URL}/api/wishlist`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
  const wishlistIds = new Set<string>((data.data?.map((item: any) => String(item._id)) || []) as string[]);
  setWishlistItems(wishlistIds);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      // Silently fail for wishlist - user might not be logged in
    }
  };

  const toggleWishlist = async (productId: string, productName: string) => {
    const isInWishlist = wishlistItems.has(productId);
    
    // Add to loading state
    setWishlistLoading(prev => new Set([...prev, productId]));
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Use environment variable for API URL
  const response = await fetch(`${API_URL}/api/wishlist/${productId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setWishlistItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
          
          // Show notification
          setWishlistNotification({show: true, productName, isAdded: false});
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist (use /api/wishlist/:productId as per backend)
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Use environment variable for API URL
  const response = await fetch(`${API_URL}/api/wishlist/${productId}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setWishlistItems(prev => new Set([...prev, productId]));
          // Show notification
          setWishlistNotification({show: true, productName, isAdded: true});
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to add to wishlist');
        }
      }
    } catch (err: any) {
      console.error('Error toggling wishlist:', err);
      alert(err.message || 'Please log in to use wishlist feature');
    } finally {
      // Remove from loading state
      setWishlistLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
      
      // Hide notification after 2 seconds
      setTimeout(() => {
        setWishlistNotification({show: false, productName: '', isAdded: false});
      }, 2000);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

    const addToCart = (productId: string, productName: string) => { // Function to add product to cart
    onAddToCart(productId, productName); // parent ignores productName currently
    
    // Show notification
    setShowNotification({show: true, productName});
    setTimeout(() => {
      setShowNotification({show: false, productName: ''});
    }, 2000);
  };

  const getCartQuantity = (productId: string) => cart[productId] || 0;

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  return (
    <section id="shop" className="py-20 bg-gradient-to-b from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Cart Notification */}
        {showNotification.show && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            <div className="flex items-center space-x-2">
              <i className="ri-check-line text-xl"></i>
              <span className="font-medium">{showNotification.productName} added to cart!</span>
            </div>
          </div>
        )}

        {/* Wishlist Notification */}
        {wishlistNotification.show && (
          <div className={`fixed top-32 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-bounce ${
            wishlistNotification.isAdded 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              <i className={`text-xl ${
                wishlistNotification.isAdded 
                  ? 'ri-heart-fill' 
                  : 'ri-heart-line'
              }`}></i>
              <span className="font-medium">
                {wishlistNotification.productName} {wishlistNotification.isAdded ? 'added to' : 'removed from'} wishlist!
              </span>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of crackers and fireworks for an unforgettable Diwali celebration
          </p>
          {loading && (
            <div className="mt-6 text-orange-600 font-medium flex items-center justify-center gap-2">
              <i className="ri-loader-4-line animate-spin"></i> Loading products...
            </div>
          )}
          {error && !loading && (
            <div className="mt-6 text-red-600 font-medium">{error} (showing fallback list)</div>
          )}
          {getTotalCartItems() > 0 && (
            <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <i className="ri-shopping-cart-line mr-2"></i>
              <span className="font-medium">{getTotalCartItems()} items in cart</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-orange-100 border border-orange-200 hover:border-orange-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-product-shop="true">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative border border-yellow-200">
              {(product.bestseller || product.combo) && (
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    product.bestseller 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  }`}>
                    {product.bestseller ? 'Bestseller' : 'Festive Combo'}
                  </span>
                </div>
              )}

              {/* Wishlist Heart Icon */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  disabled={wishlistLoading.has(product.id)}
                  className={`w-10 h-10 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                    wishlistItems.has(product.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                  } ${wishlistLoading.has(product.id) ? 'animate-pulse' : ''}`}
                >
                  {wishlistLoading.has(product.id) ? (
                    <i className="ri-loader-4-line animate-spin text-lg"></i>
                  ) : (
                    <i className={`text-lg ${
                      wishlistItems.has(product.id) ? 'ri-heart-fill' : 'ri-heart-line'
                    }`}></i>
                  )}
                </button>
              </div>

              {getCartQuantity(product.id) > 0 && (
                <div className="absolute top-16 right-3 z-10">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {getCartQuantity(product.id)} in cart
                  </span>
                </div>
              )}

              <div className="relative overflow-hidden h-48">
                <img 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={product.image}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              </div>

              <div className="p-5">
                <div className="text-sm text-purple-600 font-medium mb-1">{product.category}</div>
                <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">₹{(product.price * 1.15).toFixed(2)}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    {product.discount === 0 ? '15% OFF' : `${product.discount}% OFF`}
                  </span>
                </div>
                <button 
                  onClick={() => addToCart(product.id, product.name)}
                  className={`font-semibold rounded-lg transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-lg hover:shadow-xl px-4 py-2 text-sm w-full ${
                    getCartQuantity(product.id) > 0
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  <i className={`${getCartQuantity(product.id) > 0 ? 'ri-check-line' : 'ri-shopping-cart-line'} mr-2`}></i>
                  {getCartQuantity(product.id) > 0 ? `Added (${getCartQuantity(product.id)})` : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading && products.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4 gap-8 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-yellow-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gradient-to-r from-orange-100 to-red-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="flex gap-2 items-center">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-10" />
                  </div>
                  <div className="h-9 bg-gray-200 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && products.length === 0 && (
          <div className="text-center text-gray-500 mt-12">No products available.</div>
        )}
      </div>
    </section>
  );
}

// Export kept for backward compatibility if other components imported it
export { staticProducts as products };
