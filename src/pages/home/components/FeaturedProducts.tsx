
import { useState, useEffect } from 'react';

// Categories will be fetched dynamically from the database

// Initial static products act as a fallback until backend loads
const staticProducts = [
  {
    id: '1',
    name: 'Premium Golden Sparklers Pack',
    category: 'Sparklers',
    description: 'Beautiful golden sparklers with long-lasting golden effects. Perfect for creating magical moments during festivals.',
    price: 299,
    originalPrice: 399,
    discount: 25,
    stock: 15,
    image: 'https://readdy.ai/api/search-image?query=Beautiful%20golden%20sparklers%20fireworks%20crackers%20pack%20with%20elegant%20packaging%2C%20premium%20quality%20sparklers%20in%20decorative%20box%2C%20festive%20Diwali%20themed%20design%20with%20golden%20sparkles%20effect%2C%20product%20photography%20with%20simple%20clean%20background%20highlighting%20the%20sparklers%2C%20warm%20golden%20lighting%20creating%20celebratory%20mood&width=400&height=300&seq=sparklers-001&orientation=landscape',
    bestseller: true
  },
  {
    id: '2',
    name: 'Thunder Bomb Crackers Set',
    category: 'Bombs',
    description: 'High-quality thunder bombs that create spectacular sound effects. Safe and tested for amazing celebrations.',
    price: 599,
    originalPrice: 799,
    discount: 25,
    stock: 0, // Out of stock for testing
    image: 'https://readdy.ai/api/search-image?query=Professional%20thunder%20bomb%20crackers%20fireworks%20set%20in%20colorful%20packaging%2C%20powerful%20crackers%20with%20safety%20warnings%2C%20festive%20Diwali%20themed%20product%20display%2C%20vibrant%20red%20and%20orange%20colored%20packaging%20design%2C%20clean%20product%20photography%20with%20simple%20background%20emphasizing%20the%20crackers%20quality&width=400&height=300&seq=bombs-001&orientation=landscape',
    bestseller: true
  },
  {
    id: '3',
    name: 'Sky Rocket Fireworks Bundle',
    category: 'Rockets',
    description: 'Colorful rockets that soar high into the sky with beautiful burst patterns. Premium quality for grand celebrations.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    stock: 8,
    image: 'https://readdy.ai/api/search-image?query=Spectacular%20sky%20rocket%20fireworks%20bundle%20with%20colorful%20rockets%2C%20professional%20grade%20fireworks%20in%20premium%20packaging%2C%20festive%20Diwali%20celebration%20theme%2C%20multiple%20colored%20rockets%20arranged%20beautifully%2C%20clean%20product%20photography%20with%20simple%20background%20showcasing%20the%20rocket%20variety%20and%20quality&width=400&height=300&seq=rockets-001&orientation=landscape'
  },
  {
    id: '4',
    name: 'Festival Combo Pack Deluxe',
    category: 'Assorted Packs',
    description: 'Complete festival pack with variety of crackers including sparklers, bombs, and rockets. Perfect for family celebrations.',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    stock: 5,
    image: 'https://readdy.ai/api/search-image?query=Luxury%20festival%20combo%20pack%20with%20assorted%20crackers%20and%20fireworks%2C%20premium%20deluxe%20packaging%20with%20golden%20accents%2C%20variety%20of%20crackers%20including%20sparklers%20bombs%20rockets%20in%20elegant%20gift%20box%2C%20festive%20Diwali%20themed%20presentation%2C%20clean%20product%20photography%20with%20simple%20background%20highlighting%20the%20comprehensive%20collection&width=400&height=300&seq=combo-001&orientation=landscape',
    combo: true
  },
  {
    id: '5',
    name: 'Safe Kids Fireworks Kit',
    category: 'Kids Special',
    description: 'Child-safe fireworks designed specially for kids. Mild effects with maximum safety and colorful fun.',
    price: 249,
    originalPrice: 349,
    discount: 29,
    stock: 12,
    image: 'https://readdy.ai/api/search-image?query=Child-safe%20fireworks%20kit%20with%20colorful%20mild%20crackers%2C%20kids%20special%20safe%20fireworks%20in%20bright%20cheerful%20packaging%2C%20family-friendly%20Diwali%20celebration%20theme%2C%20small%20safe%20crackers%20designed%20for%20children%2C%20clean%20product%20photography%20with%20simple%20background%20emphasizing%20safety%20and%20fun%20colors&width=400&height=300&seq=kids-001&orientation=landscape'
  },
  {
    id: '6',
    name: 'Rainbow Sparkler Collection',
    category: 'Sparklers',
    description: 'Multi-colored sparklers that create rainbow effects. Premium quality with vibrant colors for memorable moments.',
    price: 449,
    originalPrice: 599,
    discount: 25,
    stock: 20,
    image: 'https://readdy.ai/api/search-image?query=Vibrant%20rainbow%20colored%20sparklers%20collection%2C%20multi-colored%20sparklers%20in%20beautiful%20display%20packaging%2C%20festive%20Diwali%20celebration%20with%20rainbow%20theme%2C%20colorful%20sparklers%20arranged%20in%20spectrum%20colors%2C%20clean%20product%20photography%20with%20simple%20background%20showcasing%20the%20rainbow%20sparkler%20variety%20and%20premium%20quality&width=400&height=300&seq=rainbow-001&orientation=landscape'
  },
  {
    id: '7',
    name: 'Ground Spinner Wheel Set',
    category: 'Assorted Packs',
    description: 'Exciting ground spinners that create beautiful rotating wheel effects with colorful sparks and patterns.',
    price: 199,
    originalPrice: 299,
    discount: 33,
    stock: 25,
    image: 'https://readdy.ai/api/search-image?query=Exciting%20ground%20spinner%20wheel%20fireworks%20set%2C%20rotating%20wheel%20crackers%20with%20colorful%20effects%2C%20traditional%20Diwali%20ground%20fireworks%20in%20attractive%20packaging%2C%20spinning%20wheel%20crackers%20arrangement%2C%20clean%20product%20photography%20with%20simple%20background%20highlighting%20the%20wheel%20fireworks%20and%20their%20spinning%20motion%20effects&width=400&height=300&seq=spinner-001&orientation=landscape'
  },
  {
    id: '8',
    name: 'Mega Celebration Bundle',
    category: 'Assorted Packs',
    description: 'Ultimate celebration package with premium crackers, sparklers, and aerial fireworks for grand festivities.',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    stock: 3,
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
  const [categories, setCategories] = useState<string[]>(['All']); // Dynamic categories from DB
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotification, setShowNotification] = useState<{show: boolean, productName: string}>({show: false, productName: ''});
  const [wishlistNotification, setWishlistNotification] = useState<{show: boolean, productName: string, isAdded: boolean}>({show: false, productName: '', isAdded: false});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [wishlistLoading, setWishlistLoading] = useState<Set<string>>(new Set());
  // Products start empty; we hydrate instantly from cache if present to avoid perceived delay
  const [products, setProducts] = useState<any[]>([]);
  // Fetch products and categories separately for better performance
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
        
        // Fetch products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/products?limit=40`),
          fetch(`${API_URL}/api/products/categories`).catch(() => null) // Optional endpoint
        ]);
        
        if (!productsRes.ok) throw new Error('Failed to load products');
        const productsData = await productsRes.json();
        
        if (productsData.success && Array.isArray(productsData.products)) {
          const mapped = productsData.products.map((p: any) => ({
            id: p._id?.toString(),
            name: p.name,
            category: p.category || 'Misc',
            description: p.description || '',
            price: p.price,
            originalPrice: p.originalPrice || p.price,
            stock: p.stock || 0, // Add stock information
            discountPercentage: p.discountPercentage || (p.originalPrice && p.originalPrice > p.price ? 
              Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0),
            discount: p.originalPrice && p.originalPrice > p.price ? 
              Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0,
            image: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/400x300?text=No+Image',
            bestseller: p.totalSales ? p.totalSales > 150 : false,
            combo: p.tags ? p.tags.includes('combo') : false
          }));
          
          // Try to get categories from dedicated endpoint, fallback to extracting from products
          let allCategories = ['All'];
          if (categoriesRes && categoriesRes.ok) {
            const categoriesData = await categoriesRes.json();
            if (categoriesData.success && Array.isArray(categoriesData.categories)) {
              allCategories = ['All', ...categoriesData.categories.sort()];
            }
          } else {
            // Fallback: Extract unique categories from products
            const uniqueCategories = Array.from(new Set(mapped.map((product: any) => product.category).filter(Boolean))) as string[];
            allCategories = ['All', ...uniqueCategories.sort()];
          }
          
          if (isMounted) {
            setProducts(mapped);
            setCategories(allCategories);
            if (onProductsLoaded) onProductsLoaded(mapped);
            setError(null);
          }
        }
      } catch (err: any) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Error loading products');
          if (products.length === 0) {
            setProducts(staticProducts);
            // Extract categories from static products as fallback
            const staticCategories = Array.from(new Set(staticProducts.map(product => product.category).filter(Boolean))) as string[];
            setCategories(['All', ...staticCategories.sort()]);
            if (onProductsLoaded) onProductsLoaded(staticProducts);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchData();
    return () => { isMounted = false; controller.abort(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch wishlist items on component mount
  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
          const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
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
            const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
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
          
          // Dispatch custom event to refresh dashboard
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } else {
          throw new Error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist (use /api/wishlist/:productId as per backend)
            const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
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
          
          // Dispatch custom event to refresh dashboard
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
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

  const filteredProducts = products
    .filter(product => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Price range filter
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'newest':
        default:
          return 0; // Keep original order (newest first from backend)
      }
    });

    const addToCart = (productId: string, productName: string) => {
      // Find the product to check stock
      const product = filteredProducts.find(p => p.id === productId);
      
      // Check if product exists and is in stock
      if (!product || product.stock <= 0) {
        setShowNotification({show: true, productName: `${productName} is out of stock!`});
        setTimeout(() => {
          setShowNotification({show: false, productName: ''});
        }, 2000);
        return;
      }
      
      // Check if adding one more would exceed stock
      const currentQuantity = getCartQuantity(productId);
      if (currentQuantity >= product.stock) {
        setShowNotification({show: true, productName: `Only ${product.stock} ${productName} available!`});
        setTimeout(() => {
          setShowNotification({show: false, productName: ''});
        }, 2000);
        return;
      }
      
      // Add to cart if stock is available
      onAddToCart(productId, productName);
      
      // Show success notification
      setShowNotification({show: true, productName: `${productName} added to cart!`});
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
          <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-bounce ${
            showNotification.productName.includes('out of stock') || showNotification.productName.includes('available')
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}>
            <div className="flex items-center space-x-2">
              <i className={`text-xl ${
                showNotification.productName.includes('out of stock') || showNotification.productName.includes('available')
                  ? 'ri-error-warning-line'
                  : 'ri-check-line'
              }`}></i>
              <span className="font-medium">{showNotification.productName}</span>
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

        {/* Advanced Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="w-full lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category} {category !== 'All' ? `(${products.filter(p => p.category === category).length})` : `(${products.length})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="category">Category: A to Z</option>
              </select>
            </div>

            {/* Price Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                showFilters
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
              }`}
            >
              <i className="ri-filter-line mr-2"></i>
              Filters
              {showFilters && <i className="ri-arrow-up-line ml-2"></i>}
              {!showFilters && <i className="ri-arrow-down-line ml-2"></i>}
            </button>
          </div>

          {/* Expandable Price Range Filter */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <span className="self-center text-gray-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 5000 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setPriceRange({ min: 0, max: 5000 });
                      setSortBy('newest');
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <i className="ri-refresh-line mr-2"></i>
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {filteredProducts.length} of {products.length} products
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4" data-product-shop="true">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group relative border border-yellow-200">
              {(product.bestseller || product.combo) && (
                <div className="absolute top-2 left-2 z-10">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                    product.bestseller 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  }`}>
                    {product.bestseller ? 'Best' : 'Combo'}
                  </span>
                </div>
              )}

              {/* Out of Stock Badge */}
              {product.stock <= 0 && (
                <div className="absolute top-2 left-2 z-20">
                  <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-red-600">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Wishlist Heart Icon */}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  disabled={wishlistLoading.has(product.id)}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                    wishlistItems.has(product.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                  } ${wishlistLoading.has(product.id) ? 'animate-pulse' : ''}`}
                >
                  {wishlistLoading.has(product.id) ? (
                    <i className="ri-loader-4-line animate-spin text-xs md:text-sm"></i>
                  ) : (
                    <i className={`text-xs md:text-sm ${
                      wishlistItems.has(product.id) ? 'ri-heart-fill' : 'ri-heart-line'
                    }`}></i>
                  )}
                </button>
              </div>

              {getCartQuantity(product.id) > 0 && (
                <div className="absolute top-8 right-2 z-10">
                  <span className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {getCartQuantity(product.id)}
                  </span>
                </div>
              )}

              <div className="relative overflow-hidden h-32 md:h-36">
                <img 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={product.image}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-2 md:p-3">
                <div className="mb-1">
                  <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full font-medium">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300 text-xs md:text-sm">
                  {product.name}
                </h3>
                
                {/* Product Description */}
                <p className="text-xs text-gray-600 mb-2 line-clamp-1 leading-relaxed">
                  {product.description || 'Premium quality cracker'}
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm md:text-base font-bold text-green-600">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-green-600 font-medium">
                      {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => product.stock > 0 ? addToCart(product.id, product.name) : null}
                  disabled={product.stock <= 0}
                  className={`font-medium rounded-md transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg py-1.5 md:py-2 text-xs md:text-sm w-full ${
                    product.stock <= 0
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-60'
                      : getCartQuantity(product.id) > 0
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  <i className={`${
                    product.stock <= 0 
                      ? 'ri-close-line' 
                      : getCartQuantity(product.id) > 0 
                        ? 'ri-check-line' 
                        : 'ri-shopping-cart-line'
                  } mr-1`}></i>
                  <span className="hidden md:inline">
                    {product.stock <= 0 
                      ? 'Out of Stock'
                      : getCartQuantity(product.id) > 0 
                        ? `Added (${getCartQuantity(product.id)})` 
                        : 'Add to Cart'
                    }
                  </span>
                  <span className="md:hidden">
                    {product.stock <= 0 
                      ? 'Out'
                      : getCartQuantity(product.id) > 0 
                        ? `${getCartQuantity(product.id)}` 
                        : 'Add'
                    }
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading && products.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mt-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg border border-yellow-100 overflow-hidden animate-pulse">
                <div className="h-32 md:h-36 bg-gradient-to-r from-orange-100 to-red-100" />
                <div className="p-2 md:p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="flex gap-1 items-center">
                    <div className="h-4 bg-gray-200 rounded w-12" />
                    <div className="h-4 bg-gray-200 rounded w-8" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-full mt-2" />
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
