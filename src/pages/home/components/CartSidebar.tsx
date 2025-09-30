import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  originalPrice?: number;
  discount?: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [key: string]: number };
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart?: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartSidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getCartProducts = () => {
    return Object.entries(cartItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return product ? { ...product, quantity } : null;
      })
      .filter(Boolean) as (Product & { quantity: number })[];
  };

  const getTotalPrice = () => {
    return getCartProducts().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    const cartProducts = getCartProducts();
    if (cartProducts.length === 0) {
      return;
    }
    
    // Navigate to dedicated checkout page with cart data
    navigate('/checkout', { 
      state: { 
        items: cartProducts,
        totalPrice: getTotalPrice()
      } 
    });
    onClose();
  };

  const cartProducts = getCartProducts();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center space-x-2">
              <i className="ri-shopping-cart-2-line text-xl"></i>
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {getTotalItems()} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <i className="ri-shopping-cart-line text-6xl mb-4 opacity-50"></i>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-sm text-center">Add some crackers to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartProducts.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img src={item.image && typeof item.image === 'string' && item.image.trim() ? item.image : '/placeholder-image.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.category}</p>
                      <p className="text-green-600 font-bold">₹{item.price}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xs transition-colors duration-200 cursor-pointer"
                        >
                          <i className="ri-subtract-line"></i>
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-xs transition-colors duration-200 cursor-pointer"
                        >
                          <i className="ri-add-line"></i>
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs transition-colors duration-200 cursor-pointer"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartProducts.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-bold text-lg text-green-600">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Delivery:</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="font-bold text-xl text-green-600">₹{getTotalPrice()}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-secure-payment-line mr-2"></i>
                  Proceed to Checkout
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 whitespace-nowrap cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
}
