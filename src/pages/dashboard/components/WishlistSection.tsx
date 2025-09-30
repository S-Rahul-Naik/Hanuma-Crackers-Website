
import { useState, useEffect } from 'react';

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  stock: number;
  addedDate?: string;
  createdAt?: string;
}

interface WishlistSectionProps {
  user: any;
  // cart props removed for global cart
}

export default function WishlistSection({ user }: WishlistSectionProps) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch wishlist data from API
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
      setError('Please log in to view your wishlist');
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      console.log('Fetching wishlist...');
  const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/api/wishlist`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Wishlist response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Wishlist data:', data);
        setWishlistItems(data.data || []);
        if (typeof onProductsLoaded === 'function') {
          onProductsLoaded(data.data || []);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch wishlist');
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
  const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/api/wishlist/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item._id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (item: WishlistItem) => {
    if (item.stock === 0) return;
    try {
      setCart(prev => ({
        ...prev,
        [item._id]: (prev[item._id] || 0) + 1
      }));
      if (!addToCart.bulkMode) {
        alert(`${item.name} added to cart!`);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (!addToCart.bulkMode) {
        alert('Failed to add item to cart');
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const availableItems = wishlistItems.filter(item => item.stock > 0).map(item => item._id);
      setSelectedItems(availableItems);
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const addSelectedToCart = () => {
    const selectedProducts = wishlistItems.filter(item => 
      selectedItems.includes(item._id) && item.stock > 0
    );
    
    if (selectedProducts.length === 0) {
      alert('Please select at least one available item');
      return;
    }
    
  // Set bulk mode flag to suppress notification
  addToCart.bulkMode = true;
  selectedProducts.forEach(item => addToCart(item));
  addToCart.bulkMode = false;
  setSelectedItems([]);
  };

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) return;
    
    try {
  const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
  const response = await fetch(`${API_URL}/api/wishlist`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setWishlistItems([]);
        setSelectedItems([]);
      } else {
        throw new Error('Failed to clear wishlist');
      }
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      alert('Failed to clear wishlist');
    }
  };

  const toggleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    const availableItems = wishlistItems.filter(item => item.stock > 0);
    if (selectedItems.length === availableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(availableItems.map(item => item._id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchWishlist}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
    
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <div className="text-sm text-gray-500">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-heart-line text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist and shop them later!</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Bulk Actions */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === wishlistItems.filter(item => item.stock > 0).length && wishlistItems.filter(item => item.stock > 0).length > 0}
                    onChange={selectAllItems}
                    className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Select All Available</span>
                </label>
                {selectedItems.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {selectedItems.length} selected
                  </span>
                )}
              </div>
              {selectedItems.length > 0 && (
                <button
                  onClick={addSelectedToCart}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                >
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Add Selected to Cart
                </button>
              )}
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <div key={item._id} className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow w-full max-w-xs mx-auto" style={{ minWidth: 220 }}>
                  {item.stock > 0 && (
                    <div className="absolute top-2 left-2 z-20">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleSelectItem(item._id)}
                        className="w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500 shadow-sm"
                      />
                    </div>
                  )}

                  {/* Remove button always on top */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-2 right-2 z-30 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                  >
                    <i className="ri-close-line text-gray-600 hover:text-red-600 text-base"></i>
                  </button>

                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 z-10 flex items-center justify-center pointer-events-none">
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  <div className="w-full h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? (typeof item.images[0] === 'string'
                              ? item.images[0]
                              : item.images[0].url || '/placeholder-image.jpg')
                          : '/placeholder-image.jpg'
                      }
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="p-3">
                    <div className="mb-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">{item.name}</h3>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      {item.originalPrice && (
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      Added on {new Date(item.addedDate || item.createdAt).toLocaleDateString()}
                    </div>

                    {item.stock > 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap bg-orange-600 text-white hover:bg-orange-700"
                      >
                        <i className="ri-shopping-cart-line mr-2"></i>
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap bg-gray-200 text-gray-500 cursor-not-allowed"
                      >
                        <i className="ri-shopping-cart-line mr-2"></i>
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Recommended Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">You Might Also Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
              <h4 className="font-medium text-sm text-gray-900 mb-1">Recommended Item {item}</h4>
              <p className="text-orange-600 font-semibold text-sm">₹{(item * 200).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
