
import { useState } from 'react';
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
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
}: CartSidebarProps) {
  const { user } = useAuth();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shipping, setShipping] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

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
      window.location.href = '/signin';
      return;
    }
    setStep('shipping');
    setOrderError(null);
    setShowCheckoutForm(true);
  };

  const isShippingValid = () => {
    return shipping.name && shipping.phone && shipping.street && shipping.city && shipping.state && shipping.pincode;
  };

  const placeOrder = async () => {
    if (!isShippingValid()) {
      setOrderError('Please fill all required shipping fields.');
      return;
    }
    setOrderError(null);
    setCreatingOrder(true);
    try {
      const cartProducts = getCartProducts();
      if (cartProducts.length === 0) {
        setOrderError('Cart is empty.');
        setCreatingOrder(false);
        return;
      }
      const items = cartProducts.map(p => ({
        product: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        image: p.image
      }));
      const itemsPrice = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
      const taxPrice = 0;
      const shippingPrice = 0;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items,
          shippingAddress: shipping,
          paymentMethod: 'upi',
          itemsPrice,
          taxPrice,
            shippingPrice,
            totalPrice
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to create order');
      }
      setOrderNumber(data.order?.orderNumber || '');
      setOrderId(data.order?._id || '');
      setStep('payment');
    } catch (err: any) {
      let msg = err.message || 'Error placing order';
      // Clean mongoose "Path 'field' is required." style message
      msg = msg.replace(/^Path\s+'(.*)'\s+is required\.$/, 'Missing required: $1');
      setOrderError(msg);
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleUPIPaymentConfirmation = () => {
    // In a real integration we'd hit an endpoint to mark payment paid after verifying.
    setShowCheckoutForm(false);
    setShowPaymentConfirmation(true);
  };

  const handleOrderComplete = () => {
    setShowPaymentConfirmation(false);
    onClose();
    Object.keys(cartItems).forEach((productId) => {
      onRemoveItem(productId);
    });
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
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
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

      {/* Checkout Form Modal */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Checkout</h3>
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="space-y-6">
                {/* ORDER SUMMARY */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-1 text-sm">
                    {cartProducts.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                {/* SHIPPING STEP */}
                {step === 'shipping' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 text-center">Shipping Details</h4>
                    {orderError && <div className="text-sm bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">{orderError}</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input className="px-3 py-2 border rounded" placeholder="Full Name" value={shipping.name} onChange={e=>setShipping(s=>({...s,name:e.target.value}))} />
                      <input className="px-3 py-2 border rounded" placeholder="Phone" value={shipping.phone} onChange={e=>setShipping(s=>({...s,phone:e.target.value}))} />
                      <input className="px-3 py-2 border rounded sm:col-span-2" placeholder="Street / Area" value={shipping.street} onChange={e=>setShipping(s=>({...s,street:e.target.value}))} />
                      <input className="px-3 py-2 border rounded" placeholder="City" value={shipping.city} onChange={e=>setShipping(s=>({...s,city:e.target.value}))} />
                      <input className="px-3 py-2 border rounded" placeholder="State" value={shipping.state} onChange={e=>setShipping(s=>({...s,state:e.target.value}))} />
                      <input className="px-3 py-2 border rounded" placeholder="PIN Code" value={shipping.pincode} onChange={e=>setShipping(s=>({...s,pincode:e.target.value}))} />
                      <input className="px-3 py-2 border rounded" placeholder="Country" value={shipping.country} onChange={e=>setShipping(s=>({...s,country:e.target.value}))} />
                    </div>
                    <button
                      onClick={placeOrder}
                      disabled={creatingOrder}
                      className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${creatingOrder ? 'bg-orange-300 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'}`}
                    >
                      {creatingOrder ? 'Placing Order...' : 'Place Order & Continue'}
                    </button>
                  </div>
                )}

                {/* PAYMENT STEP */}
                {step === 'payment' && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 text-center">UPI Payment {orderNumber && (<span className="text-blue-600">({orderNumber})</span>)}</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center mb-4">
                      <i className="ri-smartphone-line text-2xl text-blue-600 mr-2"></i>
                      <h5 className="text-lg font-semibold text-blue-800">Pay with UPI</h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/* QR Code */}
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-md mb-2">
                          <img
                            src="https://readdy.ai/api/search-image?query=UPI%20QR%20code%20payment%20scanner%20for%20Indian%20digital%20payments%2C%20clean%20white%20background%20with%20QR%20code%20pattern%2C%20professional%20payment%20gateway%20design%2C%20mobile%20payment%20interface%20style%2C%20simple%20and%20clear%20QR%20code%20for%20scanning&width=200&height=200&seq=upi-qr-001&orientation=squarish"
                            alt="UPI QR Code"
                            className="w-32 h-32 mx-auto object-cover rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Scan QR Code</p>
                        <p className="text-xs text-gray-500">Use any UPI app</p>
                      </div>

                      {/* UPI ID */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            UPI ID
                          </label>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                            <span className="text-sm font-mono text-gray-800">hanuma@paytm</span>
                            <button
                              onClick={() => navigator.clipboard.writeText('hanuma@paytm')}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                            >
                              <i className="ri-file-copy-line text-sm"></i>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-1">
                            Alternative UPI ID
                          </label>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                            <span className="text-sm font-mono text-gray-800">8688556898@ybl</span>
                            <button
                              onClick={() => navigator.clipboard.writeText('8688556898@ybl')}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                            >
                              <i className="ri-file-copy-line text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <i className="ri-information-line text-yellow-600 mt-0.5"></i>
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">Payment Instructions:</p>
                          <ul className="text-xs space-y-1">
                            <li>• Scan QR code or use UPI ID to pay ₹{getTotalPrice()}</li>
                            <li>• Send screenshot of payment confirmation</li>
                            <li>• Your order will be confirmed within 30 minutes</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleUPIPaymentConfirmation}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-smartphone-line mr-2"></i>
                      I've Paid via UPI
                    </button>
                  </div>

                  {/* Call to Order Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <i className="ri-phone-line text-3xl text-green-500 mb-3"></i>
                      <h5 className="text-lg font-bold text-gray-800 mb-2">Or Call to Order</h5>
                      <p className="text-gray-600 mb-4 text-sm">Speak directly with our team</p>
                      <a
                        href="tel:+918688556898"
                        className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-phone-line mr-2"></i>
                        Call +91 86885 56898
                      </a>
                      <p className="text-xs text-gray-500 mt-2">Available 9 AM - 8 PM</p>
                    </div>
                  </div>

                  {/* WhatsApp Order Section */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <i className="ri-whatsapp-line text-3xl text-green-600 mb-3"></i>
                      <h5 className="text-lg font-bold text-gray-800 mb-2">Order via WhatsApp</h5>
                      <p className="text-gray-600 mb-4 text-sm">Quick and easy ordering</p>
                      <a
                        href={`https://wa.me/918688556898?text=Hi! I want to order: ${cartProducts
                          .map((item) => `${item.name} x${item.quantity}`)
                          .join(', ')}. Total: ₹${getTotalPrice()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-whatsapp-line mr-2"></i>
                        Order on WhatsApp
                      </a>
                    </div>
                  </div>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPaymentConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 text-center">
              {/* Success Animation */}
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-4xl text-green-500"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Recorded!</h3>
              <p className="text-gray-600 mb-6">Thank you for your order. We'll verify and process it shortly.</p>

              {/* Order Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">Order Number:</span>
                  <span className="font-bold text-blue-600">#{orderNumber || orderId}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">Total Amount:</span>
                  <span className="font-bold text-green-600">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Payment Verification Pending
                  </span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• We'll verify your payment within 30 minutes</li>
                  <li>• You'll receive a confirmation call/message</li>
                  <li>• Your order will be prepared for delivery</li>
                  <li>• Estimated delivery: 2-3 hours</li>
                </ul>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">Need help? Contact us:</p>

                <div className="flex space-x-3">
                  <a
                    href="tel:+918688556898"
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 whitespace-nowrap cursor-pointer text-center"
                  >
                    <i className="ri-phone-line mr-1"></i>
                    Call Us
                  </a>

                  <a
                    href={`https://wa.me/918688556898?text=Hi! I just placed order #${orderNumber}. Please confirm my payment.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 whitespace-nowrap cursor-pointer text-center"
                  >
                    <i className="ri-whatsapp-line mr-1"></i>
                    WhatsApp
                  </a>
                </div>

                <button
                  onClick={handleOrderComplete}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 whitespace-nowrap cursor-pointer mt-4"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
