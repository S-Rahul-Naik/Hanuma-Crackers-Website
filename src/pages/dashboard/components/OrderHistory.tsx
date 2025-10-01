

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  totalPrice: number;
  items: OrderItem[];
  trackingNumber?: string;
  shippingAddress?: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface OrderHistoryProps {
  user: any;
}

export default function OrderHistory({ user }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelComment, setCancelComment] = useState('');
  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
      console.log('Fetching orders from:', `${API_URL}/api/orders/myorders`);
      
      const response = await fetch(`${API_URL}/api/orders/myorders`, {
        credentials: 'include'
      });
      
      console.log('Orders fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Orders data received:', data);
        setOrders(data.orders || []);
      } else {
        const errorText = await response.text();
        console.error('Orders fetch error:', errorText);
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load your orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return 'ri-check-double-line';
      case 'shipped': return 'ri-truck-line';
      case 'processing': return 'ri-loader-4-line';
      case 'pending': return 'ri-time-line';
      case 'cancelled': return 'ri-close-circle-line';
      default: return 'ri-question-line';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadInvoice = (order: Order) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(255, 102, 0);
    pdf.text('HANUMA CRACKERS', 20, 30);
    
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Premium Quality Crackers & Fireworks', 20, 40);
    pdf.text('GST: 29ABCDE1234F1Z5', 20, 50);
    pdf.text('Phone: +91 9876543210', 20, 60);
    
    // Invoice details
    pdf.setFontSize(16);
    pdf.text('INVOICE', 150, 30);
    
    pdf.setFontSize(10);
    pdf.text(`Invoice No: INV-${order.orderNumber}`, 150, 45);
    pdf.text(`Order No: ${order.orderNumber}`, 150, 55);
    pdf.text(`Date: ${formatDate(order.createdAt)}`, 150, 65);
    pdf.text(`Status: ${order.status.toUpperCase()}`, 150, 75);
    
    // Customer details
    pdf.setFontSize(12);
    pdf.text('Bill To:', 20, 90);
    if (order.shippingAddress) {
      pdf.setFontSize(10);
      pdf.text(order.shippingAddress.name, 20, 100);
      pdf.text(order.shippingAddress.phone, 20, 110);
      pdf.text(order.shippingAddress.street, 20, 120);
      pdf.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`, 20, 130);
    }
    
    // Items table
    let yPos = 150;
    pdf.setFontSize(12);
    pdf.text('Items:', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(10);
    pdf.text('Item', 20, yPos);
    pdf.text('Qty', 120, yPos);
    pdf.text('Price', 140, yPos);
    pdf.text('Total', 170, yPos);
    
    yPos += 5;
    pdf.line(20, yPos, 190, yPos);
    
    order.items.forEach((item) => {
      yPos += 10;
      pdf.text(item.name, 20, yPos);
      pdf.text(item.quantity.toString(), 120, yPos);
      pdf.text(`₹${item.price}`, 140, yPos);
      pdf.text(`₹${(item.price * item.quantity).toLocaleString()}`, 170, yPos);
    });
    
    yPos += 10;
    pdf.line(20, yPos, 190, yPos);
    
    // Total
    yPos += 10;
    pdf.setFontSize(12);
    pdf.text(`Total Amount: ₹${order.totalPrice.toLocaleString()}`, 120, yPos);
    
    // Footer
    yPos += 30;
    pdf.setFontSize(8);
    pdf.text('Thank you for shopping with Hanuma Crackers!', 20, yPos);
    pdf.text('For support: support@hanumacrackers.com', 20, yPos + 10);
    
    pdf.save(`invoice-${order.orderNumber}.pdf`);
  };

  const trackOrder = (order: Order) => {
    setTrackingOrder(order);
    setShowTrackingModal(true);
  };

  const handleOrderAction = async (orderId: string, action: string, reason?: string, comment?: string) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
      const url = `${API_URL}/api/orders/${orderId}/${action}`;
      
      console.log('Making API call:', {
        url: url,
        method: 'PUT',
        data: { reason, comment }
      });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          reason: reason,
          comment: comment
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Success response:', data);
        
        // Refresh orders after action
        fetchMyOrders();
        alert(`Order ${action} request submitted successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({ message: `Server returned ${response.status}` }));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `Failed to ${action} order`);
      }
    } catch (error) {
      console.error(`Error ${action} order:`, error);
      alert(`Failed to ${action} order. ${error.message || 'Please try again.'}`);
    }
  };

  const handleCancelOrder = (order: Order) => {
    setCancelOrder(order);
    setCancelReason('');
    setCancelComment('');
    setShowCancelModal(true);
  };

  const submitCancellation = async () => {
    if (!cancelReason) {
      alert('Please select a reason for cancellation');
      return;
    }

    await handleOrderAction(cancelOrder!._id, 'cancel', cancelReason, cancelComment);
    setShowCancelModal(false);
    setCancelOrder(null);
  };

  const cancelReasons = [
    'Changed my mind',
    'Found a better price elsewhere', 
    'Ordered by mistake',
    'Product no longer needed',
    'Delivery time too long',
    'Payment issues',
    'Want to modify order',
    'Other reasons'
  ];

  const canCancelOrder = (order: Order) => {
    return ['pending', 'processing'].includes(order.status);
  };

  const canReturnOrder = (order: Order) => {
    // Don't allow returns for delivered orders in this case
    // You can modify this logic based on your business requirements
    return false; // Disabled as per user request
  };

  const canRefundOrder = (order: Order) => {
    return order.paymentStatus === 'paid' && ['cancelled'].includes(order.status);
  };

  const getTrackingSteps = (status: string) => {
    const allSteps = [
      { key: 'pending', label: 'Order Placed', icon: 'ri-shopping-bag-line' },
      { key: 'processing', label: 'Processing', icon: 'ri-settings-line' },
      { key: 'shipped', label: 'Shipped', icon: 'ri-truck-line' },
      { key: 'delivered', label: 'Delivered', icon: 'ri-check-double-line' }
    ];

    const statusIndex = allSteps.findIndex(step => step.key === status);
    
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      current: index === statusIndex
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-6 w-1/3"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Orders</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={fetchMyOrders}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchMyOrders}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh orders"
            >
              <i className="ri-refresh-line"></i>
            </button>
            <div className="text-sm text-gray-500">
              Total Orders: {orders.length}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-shopping-bag-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your order history here!</p>
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <i className="ri-shopping-cart-line mr-2"></i>
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <i className={`${getStatusIcon(order.status)} text-orange-600 text-lg`}></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                      <p className="text-sm text-gray-500">Ordered on {formatDate(order.createdAt)}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-blue-600 mt-1">Track: {order.trackingNumber}</p>
                    )}
                  </div>
                </div>

                {selectedOrder?._id === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <i className="ri-gift-line text-gray-400"></i>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">₹{item.price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {order.shippingAddress && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.phone}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      {(order.status === 'shipped' || order.status === 'processing' || order.status === 'delivered') && (
                        <button 
                          onClick={() => trackOrder(order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                          <i className="ri-truck-line mr-2"></i>
                          Track Order
                        </button>
                      )}
                      
                      <button 
                        onClick={() => downloadInvoice(order)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-download-line mr-2"></i>
                        Download Invoice
                      </button>

                      {canCancelOrder(order) && (
                        <button 
                          onClick={() => handleCancelOrder(order)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                        >
                          <i className="ri-close-line mr-2"></i>
                          Cancel Order
                        </button>
                      )}

                      {canReturnOrder(order) && (
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to return this order?')) {
                              handleOrderAction(order._id, 'return');
                            }
                          }}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors whitespace-nowrap"
                        >
                          <i className="ri-arrow-go-back-line mr-2"></i>
                          Return Order
                        </button>
                      )}

                      {canRefundOrder(order) && (
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to request a refund?')) {
                              handleOrderAction(order._id, 'refund');
                            }
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                        >
                          <i className="ri-money-dollar-circle-line mr-2"></i>
                          Request Refund
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Tracking Modal */}
      {showTrackingModal && trackingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Track Order</h3>
              <button
                onClick={() => setShowTrackingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">{trackingOrder.orderNumber}</h4>
              <p className="text-sm text-gray-500">
                Ordered on {formatDate(trackingOrder.createdAt)}
              </p>
              {trackingOrder.trackingNumber && (
                <p className="text-sm text-blue-600 mt-1">
                  Tracking ID: {trackingOrder.trackingNumber}
                </p>
              )}
            </div>

            {/* Tracking Progress */}
            <div className="mb-8">
              <div className="relative">
                {getTrackingSteps(trackingOrder.status).map((step, index) => (
                  <div key={step.key} className="flex items-center mb-6 last:mb-0">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-100 text-green-600 border-2 border-green-500'
                            : step.current
                            ? 'bg-orange-100 text-orange-600 border-2 border-orange-500'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                        }`}
                      >
                        <i className={`${step.icon} text-lg`}></i>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h5
                        className={`font-medium ${
                          step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </h5>
                      {step.current && (
                        <p className="text-sm text-orange-600 mt-1">
                          Current Status
                        </p>
                      )}
                      {step.completed && step.key === 'delivered' && (
                        <p className="text-sm text-green-600 mt-1">
                          Delivered on {formatDate(trackingOrder.createdAt)}
                        </p>
                      )}
                    </div>

                    {step.completed && (
                      <div className="flex-shrink-0">
                        <i className="ri-check-line text-green-600 text-xl"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Delivery */}
            {trackingOrder.status !== 'delivered' && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <i className="ri-truck-line text-blue-600 text-xl mr-3 mt-1"></i>
                  <div>
                    <h5 className="font-medium text-blue-900">Estimated Delivery</h5>
                    <p className="text-sm text-blue-700 mt-1">
                      Expected delivery by{' '}
                      {new Date(
                        new Date(trackingOrder.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Address */}
            {trackingOrder.shippingAddress && (
              <div className="border-t pt-4">
                <h5 className="font-medium text-gray-900 mb-3">Delivery Address</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{trackingOrder.shippingAddress.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{trackingOrder.shippingAddress.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {trackingOrder.shippingAddress.street}
                  </p>
                  <p className="text-sm text-gray-600">
                    {trackingOrder.shippingAddress.city}, {trackingOrder.shippingAddress.state} {trackingOrder.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons in Modal */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => downloadInvoice(trackingOrder)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="ri-download-line mr-2"></i>
                Download Invoice
              </button>
              
              {canCancelOrder(trackingOrder) && (
                <button
                  onClick={() => {
                    setShowTrackingModal(false);
                    handleCancelOrder(trackingOrder);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i className="ri-close-line mr-2"></i>
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {showCancelModal && cancelOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Cancel Order</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{cancelOrder.orderNumber}</h4>
              <p className="text-sm text-gray-500">
                Total: ₹{cancelOrder.totalPrice.toLocaleString()} • {cancelOrder.items.length} items
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Why are you cancelling this order? *
              </label>
              <div className="space-y-2">
                {cancelReasons.map((reason) => (
                  <label key={reason} className="flex items-center">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="mr-3 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {cancelReason === 'Other reasons' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify your reason
                </label>
                <textarea
                  value={cancelComment}
                  onChange={(e) => setCancelComment(e.target.value)}
                  placeholder="Please provide more details..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {cancelComment.length}/500 characters
                </p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional comments (Optional)
              </label>
              <textarea
                value={cancelComment}
                onChange={(e) => setCancelComment(e.target.value)}
                placeholder="Any additional details you'd like to share..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows={2}
                maxLength={300}
              />
              <p className="text-xs text-gray-500 mt-1">
                {cancelComment.length}/300 characters
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <i className="ri-information-line text-yellow-600 text-lg mr-2 mt-0.5"></i>
                <div>
                  <h5 className="font-medium text-yellow-800">Cancellation Policy</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    • Orders can be cancelled before they are shipped
                    • Refund will be processed within 3-5 business days
                    • No cancellation charges will be applied
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={submitCancellation}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={!cancelReason}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}