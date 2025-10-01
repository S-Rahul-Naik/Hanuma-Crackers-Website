import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CheckoutData {
  items: CartItem[];
  totalPrice: number;
}

interface CouponDiscount {
  coupon: {
    code: string;
    discountPercentage: number;
    description: string;
  };
  discount: {
    totalDiscount: number;
    originalTotal: number;
    discountedTotal: number;
    shippingCost: number;
    finalTotal: number;
    applicableItems: any[];
  };
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutData = location.state as CheckoutData;

  const [step, setStep] = useState<'details' | 'payment' | 'receipt' | 'confirmation'>('details');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponDiscount | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  
  const [paymentSettings, setPaymentSettings] = useState({
    primaryUpi: 'hanuma@paytm',
    alternativeUpi: '8688556898@ybl',
    qrCodeImage: 'https://readdy.ai/api/search-image?query=UPI%20QR%20code%20payment%20scanner%20for%20Indian%20digital%20payments%2C%20clean%20white%20background%20with%20QR%20code%20pattern%2C%20professional%20payment%20gateway%20design%2C%20mobile%20payment%20interface%20style%2C%20simple%20and%20clear%20QR%20code%20for%20scanning&width=200&height=200&seq=upi-qr-001&orientation=squarish',
    whatsappNumber: '918688556898',
    phoneNumber: '+918688556898'
  });
  
  const [shipping, setShipping] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin', { replace: true });
      return;
    }
    if (!checkoutData || !checkoutData.items?.length) {
      navigate('/', { replace: true });
      return;
    }
    
    // Fetch payment settings
    fetchPaymentSettings();
  }, [user, checkoutData, navigate]);

  const fetchPaymentSettings = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admin/payment-settings`, {
        credentials: 'include', // Send cookies automatically
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.settings) {
          setPaymentSettings(data.settings);
        }
      }
    } catch (error) {
      // Use default settings if API fails
      console.log('Using default payment settings');
    }
  };

  const isShippingValid = () => {
    return shipping.name && shipping.phone && shipping.street && shipping.city && shipping.state && shipping.pincode;
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    setCouponError(null);
    
    try {
      const cartItems = checkoutData.items.map(item => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode,
          cartItems
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAppliedCoupon(data);
        setCouponError(null);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError('Failed to apply coupon. Please try again.');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const getFinalTotal = () => {
    return appliedCoupon ? appliedCoupon.discount.finalTotal : checkoutData.totalPrice;
  };

  const getShippingCost = () => {
    // If coupon is applied, use the shipping cost from the coupon validation response
    if (appliedCoupon && typeof appliedCoupon.discount.shippingCost !== 'undefined') {
      return appliedCoupon.discount.shippingCost;
    }
    
    // Otherwise, calculate based on current total
    const finalAmount = getFinalTotal();
    return finalAmount < 2000 ? 150 : 0;
  };

  const getTotalWithShipping = () => {
    // If coupon is applied, use the final total from coupon response (already includes shipping)
    if (appliedCoupon && typeof appliedCoupon.discount.finalTotal !== 'undefined') {
      return appliedCoupon.discount.finalTotal;
    }
    
    // Otherwise, add shipping to the current total
    return getFinalTotal() + getShippingCost();
  };

  const placeOrder = async () => {
    if (!isShippingValid()) {
      setOrderError('Please fill all required shipping fields.');
      return;
    }
    setOrderError(null);
    setCreatingOrder(true);
    try {
      const items = checkoutData.items.map(p => ({
        product: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        image: p.image
      }));
      const itemsPrice = checkoutData.totalPrice;
      const discountAmount = appliedCoupon ? appliedCoupon.discount.totalDiscount : 0;
      const finalItemsPrice = itemsPrice - discountAmount;
      const taxPrice = 0;
      const shippingPrice = getShippingCost();
      const totalPrice = finalItemsPrice + taxPrice + shippingPrice;

      const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Send cookies automatically
        body: JSON.stringify({
          items,
          shippingAddress: shipping,
          paymentMethod: 'upi',
          itemsPrice: finalItemsPrice,
          discountAmount,
          couponCode: appliedCoupon?.coupon.code || null,
          taxPrice,
          shippingPrice,
          totalPrice
        })
      });
      // Mark coupon as used if applied
      if (appliedCoupon) {
        try {
          await fetch('/api/coupons/use', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code: appliedCoupon.coupon.code })
          });
        } catch (couponError) {
          console.log('Failed to mark coupon as used:', couponError);
        }
      }
      
      setStep('payment');
    } catch (err: any) {
      let msg = err.message || 'Error placing order';
      msg = msg.replace(/^Path\s+'(.*)'\s+is required\.$/, 'Missing required: $1');
      setOrderError(msg);
    } finally {
      setCreatingOrder(false);
    }
  };

  const handlePaymentComplete = () => {
    setStep('receipt');
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setOrderError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setOrderError('File size should be less than 5MB');
      return;
    }

    setReceiptFile(file);
    setOrderError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submitPaymentReceipt = async () => {
    if (!receiptFile) {
      setOrderError('Please upload your payment receipt');
      return;
    }

    setUploadingReceipt(true);
    setOrderError(null);

    try {
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      formData.append('orderId', orderId);
      formData.append('orderNumber', orderNumber);

      const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/orders/upload-receipt`, {
        method: 'POST',
        credentials: 'include', // Send cookies automatically
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep('confirmation');
      } else {
        throw new Error(data.message || 'Failed to upload receipt');
      }
    } catch (error: any) {
      setOrderError(error.message || 'Failed to upload payment receipt');
    } finally {
      setUploadingReceipt(false);
    }
  };

  if (!checkoutData || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-orange-600 hover:text-orange-700 font-bold text-xl"
                style={{ fontFamily: '"Pacifico", serif' }}
              >
                Hanuma Crackers
              </button>
              <span className="ml-4 text-gray-400">|</span>
              <span className="ml-4 text-gray-600 font-medium">Checkout</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {/* Step 1: Details */}
            <div className={`flex items-center space-x-2 ${step === 'details' ? 'text-orange-600' : (step === 'payment' || step === 'receipt' || step === 'confirmation') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'details' 
                  ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-300' 
                  : (step === 'payment' || step === 'receipt' || step === 'confirmation')
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step === 'details' ? '1' : <i className="ri-check-line"></i>}
              </div>
              <span className="font-medium hidden sm:block">Shipping Details</span>
            </div>

            {/* Connector */}
            <div className={`h-1 w-12 rounded ${(step === 'payment' || step === 'receipt' || step === 'confirmation') ? 'bg-orange-300' : 'bg-gray-200'}`}></div>

            {/* Step 2: Payment */}
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-orange-600' : (step === 'receipt' || step === 'confirmation') ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'payment' 
                  ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-300' 
                  : (step === 'receipt' || step === 'confirmation')
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {(step === 'receipt' || step === 'confirmation') ? <i className="ri-check-line"></i> : '2'}
              </div>
              <span className="font-medium hidden sm:block">Payment</span>
            </div>

            {/* Connector */}
            <div className={`h-1 w-12 rounded ${(step === 'receipt' || step === 'confirmation') ? 'bg-orange-300' : 'bg-gray-200'}`}></div>

            {/* Step 3: Receipt */}
            <div className={`flex items-center space-x-2 ${step === 'receipt' ? 'text-orange-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'receipt' 
                  ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-300' 
                  : step === 'confirmation'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step === 'confirmation' ? <i className="ri-check-line"></i> : '3'}
              </div>
              <span className="font-medium hidden sm:block">Receipt</span>
            </div>

            {/* Connector */}
            <div className={`h-1 w-12 rounded ${step === 'confirmation' ? 'bg-orange-300' : 'bg-gray-200'}`}></div>

            {/* Step 4: Confirmation */}
            <div className={`flex items-center space-x-2 ${step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'confirmation' 
                  ? 'bg-green-100 text-green-600 ring-2 ring-green-300' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                4
              </div>
              <span className="font-medium hidden sm:block">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Details */}
            {step === 'details' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                
                {orderError && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <div className="flex">
                      <i className="ri-error-warning-line text-red-400 mr-3 mt-0.5"></i>
                      <p className="text-red-700 font-medium">{orderError}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      value={shipping.name}
                      onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="+91 XXXXX XXXXX"
                      value={shipping.phone}
                      onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="House/Building no, Street, Area"
                      value={shipping.street}
                      onChange={e => setShipping(s => ({ ...s, street: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter city"
                      value={shipping.city}
                      onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter state"
                      value={shipping.state}
                      onChange={e => setShipping(s => ({ ...s, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="6 digit PIN code"
                      value={shipping.pincode}
                      onChange={e => setShipping(s => ({ ...s, pincode: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                      value={shipping.country}
                      onChange={e => setShipping(s => ({ ...s, country: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={placeOrder}
                    disabled={creatingOrder}
                    className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                      creatingOrder
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {creatingOrder ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Order...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Continue to Payment</span>
                        <i className="ri-arrow-right-line"></i>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
                  <p className="text-gray-600">Order #{orderNumber}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* QR Code Section */}
                  <div className="text-center">
                    <div className="bg-gray-50 p-6 rounded-xl mb-4">
                      <img
                        src={paymentSettings.qrCodeImage}
                        alt="UPI QR Code"
                        className="w-48 h-48 mx-auto object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Scan QR Code</h3>
                    <p className="text-gray-600">Use any UPI app like PhonePe, GPay, Paytm</p>
                  </div>

                  {/* UPI Details Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Or Pay Using UPI ID</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary UPI ID</label>
                          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                            <span className="font-mono text-gray-800 font-semibold">{paymentSettings.primaryUpi}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(paymentSettings.primaryUpi)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded"
                            >
                              <i className="ri-file-copy-line"></i>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Alternative UPI ID</label>
                          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                            <span className="font-mono text-gray-800 font-semibold">{paymentSettings.alternativeUpi}</span>
                            <button
                              onClick={() => navigator.clipboard.writeText(paymentSettings.alternativeUpi)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded"
                            >
                              <i className="ri-file-copy-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <i className="ri-information-line text-yellow-600 mr-3 mt-0.5"></i>
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">Payment Instructions:</h4>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Pay exactly ₹{getTotalWithShipping()} to complete your order</li>
                            <li>• Take a screenshot of payment confirmation</li>
                            <li>• We'll verify and confirm within 30 minutes</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={handlePaymentComplete}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <i className="ri-check-line"></i>
                      <span>I Have Made the Payment</span>
                    </div>
                  </button>
                </div>

                {/* Alternative Options */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Need Help? Contact Us</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href={`tel:${paymentSettings.phoneNumber}`}
                      className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <i className="ri-phone-line"></i>
                      <span>Call {paymentSettings.phoneNumber}</span>
                    </a>
                    <a
                      href={`https://wa.me/${paymentSettings.whatsappNumber}?text=Hi! I need help with order ${orderNumber}. Total: ₹${getTotalWithShipping()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <i className="ri-whatsapp-line"></i>
                      <span>WhatsApp Support</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Receipt Upload */}
            {step === 'receipt' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Payment Receipt</h2>
                  <p className="text-gray-600">Please upload a screenshot of your payment confirmation</p>
                  {orderNumber && <p className="text-orange-600 text-sm mt-1">Order #{orderNumber}</p>}
                </div>

                {orderError && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <div className="flex">
                      <i className="ri-error-warning-line text-red-400 mr-3 mt-0.5"></i>
                      <p className="text-red-700 font-medium">{orderError}</p>
                    </div>
                  </div>
                )}

                <div className="max-w-md mx-auto">
                  {/* Upload Area */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Receipt *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                      <input
                        type="file"
                        id="receipt-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                        disabled={uploadingReceipt}
                      />
                      <label
                        htmlFor="receipt-upload"
                        className={`cursor-pointer ${uploadingReceipt ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {receiptPreview ? (
                          <div className="space-y-3">
                            <img
                              src={receiptPreview}
                              alt="Payment Receipt Preview"
                              className="w-32 h-32 mx-auto object-cover rounded-lg border-2 border-green-200"
                            />
                            <p className="text-green-700 font-medium">Receipt uploaded successfully!</p>
                            <p className="text-sm text-gray-500">Click to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <i className="ri-upload-cloud-line text-3xl text-purple-500 mb-2"></i>
                            <span className="text-gray-700 font-medium">Click to upload receipt</span>
                            <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-start">
                      <i className="ri-information-line text-blue-500 mt-1 mr-3"></i>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">Upload Guidelines:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Take a clear screenshot of your payment confirmation</li>
                          <li>• Include transaction ID and amount</li>
                          <li>• Ensure image is readable and not blurry</li>
                          <li>• This helps us verify your payment faster</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep('payment')}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <i className="ri-arrow-left-line mr-2"></i>
                      Back to Payment
                    </button>
                    <button
                      onClick={submitPaymentReceipt}
                      disabled={!receiptFile || uploadingReceipt}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                        !receiptFile || uploadingReceipt
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {uploadingReceipt ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <i className="ri-check-line"></i>
                          <span>Submit Receipt</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 'confirmation' && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-check-line text-4xl text-green-600"></i>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-8">Thank you for your order and payment receipt. We'll process it shortly.</p>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <span className="text-gray-600">Order Number:</span>
                      <p className="font-bold text-blue-600">#{orderNumber || orderId}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Amount:</span>
                      <p className="font-bold text-green-600">₹{getTotalWithShipping()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <p className="font-bold text-blue-600">Payment Receipt Uploaded - Under Verification</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <p className="font-bold text-gray-800">2-3 hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {checkoutData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              {!appliedCoupon ? (
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Have a Coupon Code?</h4>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-red-600 text-xs mt-2">{couponError}</p>
                  )}
                  <div className="mt-3 text-xs text-gray-600">
                    <p className="font-medium mb-1">Available coupons:</p>
                    <div className="grid grid-cols-2 gap-1">
                      <span className="bg-white px-2 py-1 rounded text-orange-600 font-medium">SAVE5 - 5% OFF</span>
                      <span className="bg-white px-2 py-1 rounded text-orange-600 font-medium">SAVE10 - 10% OFF</span>
                      <span className="bg-white px-2 py-1 rounded text-orange-600 font-medium">SAVE20 - 20% OFF</span>
                      <span className="bg-white px-2 py-1 rounded text-orange-600 font-medium">SAVE25 - 25% OFF</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-green-800">Coupon Applied! 🎉</h4>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">
                      {appliedCoupon.coupon.code} ({appliedCoupon.coupon.discountPercentage}% OFF)
                    </span>
                    <span className="text-sm font-semibold text-green-800">
                      -₹{appliedCoupon.discount.totalDiscount}
                    </span>
                  </div>
                  {appliedCoupon.coupon.description && (
                    <p className="text-xs text-green-600 mt-1">{appliedCoupon.coupon.description}</p>
                  )}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{checkoutData.totalPrice}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-600">Discount ({appliedCoupon.coupon.code}):</span>
                    <span className="font-semibold text-green-600">-₹{appliedCoupon.discount.totalDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className={`font-semibold ${getShippingCost() === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {getShippingCost() === 0 ? 'Free' : `₹${getShippingCost()}`}
                  </span>
                </div>
                {getShippingCost() > 0 && (
                  <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <i className="ri-information-line mr-1"></i>
                    {appliedCoupon 
                      ? `Add ₹${2000 - appliedCoupon.discount.discountedTotal} more for free shipping!`
                      : `Add ₹${2000 - getFinalTotal()} more for free shipping!`
                    }
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">₹{getTotalWithShipping()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}