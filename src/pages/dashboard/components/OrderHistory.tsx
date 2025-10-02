

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
    const doc = new jsPDF();
    
    // Set font sizes and styles
    const headerFontSize = 20;
    const subHeaderFontSize = 16;
    const bodyFontSize = 12;
    const smallFontSize = 10;
    
    let yPosition = 20;
    
    // Header with company branding
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 102, 0); // Orange color
    doc.text('🎆 Hanuma Crackers', 20, yPosition);
    
    yPosition += 8;
    doc.setFontSize(smallFontSize);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text('Premium Quality Fireworks', 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(subHeaderFontSize);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER INVOICE', 20, yPosition);
    
    // Add horizontal line
    yPosition += 5;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    
    yPosition += 15;
    
    // Order Information Section with background
    doc.setFillColor(245, 245, 245);
    doc.rect(15, yPosition - 5, 85, 55, 'F');
    
    doc.setFontSize(bodyFontSize);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Information', 20, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(smallFontSize);
    doc.text(`Order Number: ${order.orderNumber}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Date: ${formatDate(order.createdAt)}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Total Items: ${order.items.length}`, 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ₹${order.totalPrice.toLocaleString()}`, 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    
    // Status badges with colors
    const statusColor: [number, number, number] = order.status.toLowerCase() === 'delivered' ? [34, 197, 94] : 
                       order.status.toLowerCase() === 'processing' ? [59, 130, 246] : [156, 163, 175];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, yPosition);
    yPosition += 6;
    
    const paymentColor: [number, number, number] = order.paymentStatus.toLowerCase() === 'paid' ? [34, 197, 94] : [239, 68, 68];
    doc.setTextColor(paymentColor[0], paymentColor[1], paymentColor[2]);
    doc.text(`Payment: ${order.paymentStatus.toUpperCase()}`, 20, yPosition);
    
    // Reset color
    doc.setTextColor(0, 0, 0);
    
    // Customer Information Section with background
    yPosition = 40; // Reset to top for customer info
    doc.setFillColor(240, 253, 244);
    doc.rect(110, yPosition - 5, 75, 55, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(bodyFontSize);
    doc.text('Customer Information', 115, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(smallFontSize);
    doc.text(`Name: ${user?.name || 'Customer'}`, 115, yPosition);
    yPosition += 6;
    doc.text(`Email: ${user?.email || 'N/A'}`, 115, yPosition);
    yPosition += 6;
    doc.text(`Phone: ${user?.phone || order.shippingAddress?.phone || 'N/A'}`, 115, yPosition);
    
    // Shipping Address (if available)
    if (order.shippingAddress) {
      yPosition += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Shipping Address:', 115, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const address = `${order.shippingAddress.street}, ${order.shippingAddress.city}`;
      const addressLine2 = `${order.shippingAddress.state} ${order.shippingAddress.pincode}`;
      doc.text(address.length > 25 ? address.substring(0, 25) + '...' : address, 115, yPosition);
      yPosition += 4;
      doc.text(addressLine2, 115, yPosition);
      doc.setFontSize(smallFontSize);
    }
    
    yPosition = 110; // Move to items section
    
    // Order Items Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(bodyFontSize);
    doc.text('Order Items', 20, yPosition);
    yPosition += 10;
    
    // Table headers with orange background
    doc.setFillColor(255, 102, 0); // Orange background
    doc.rect(15, yPosition - 3, 175, 8, 'F');
    
    doc.setFontSize(smallFontSize);
    doc.setTextColor(255, 255, 255); // White text
    doc.setFont('helvetica', 'bold');
    doc.text('Item Name', 20, yPosition);
    doc.text('Qty', 110, yPosition);
    doc.text('Price', 130, yPosition);
    doc.text('Total', 160, yPosition);
    yPosition += 10;
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Table rows with alternating background
    doc.setFont('helvetica', 'normal');
    order.items.forEach((item, index) => {
      if (yPosition > 270) { // Check if we need a new page
        doc.addPage();
        yPosition = 20;
      }
      
      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(15, yPosition - 3, 175, 8, 'F');
      }
      
      const itemName = item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name;
      doc.text(itemName, 20, yPosition);
      doc.text(item.quantity.toString(), 110, yPosition);
      doc.text(`₹${item.price.toLocaleString()}`, 130, yPosition);
      doc.text(`₹${(item.quantity * item.price).toLocaleString()}`, 160, yPosition);
      yPosition += 8;
    });
    
    // Add tracking number if available
    if (order.trackingNumber) {
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(smallFontSize);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text(`Tracking Number: ${order.trackingNumber}`, 20, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 5;
    }
    
    // Add total section with emphasis
    yPosition += 10;
    doc.setLineWidth(1);
    doc.line(130, yPosition, 190, yPosition);
    yPosition += 8;
    
    doc.setFillColor(255, 102, 0);
    doc.rect(125, yPosition - 4, 65, 10, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(bodyFontSize);
    doc.setTextColor(255, 255, 255);
    doc.text(`TOTAL: ₹${order.totalPrice.toLocaleString()}`, 130, yPosition);
    
    // Footer
    yPosition = 275;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 4;
    doc.text('Thank you for choosing Hanuma Crackers!', 20, yPosition);
    yPosition += 4;
    doc.text('For queries: hanumacracker@gmail.com | +918688556898', 20, yPosition);
    
    // Save the PDF
    doc.save(`Hanuma-Crackers-Invoice-${order.orderNumber}.pdf`);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order History</h2>
          <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
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
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <i className={`${getStatusIcon(order.status)} text-orange-600 text-base sm:text-lg`}></i>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.orderNumber}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Ordered on {formatDate(order.createdAt)}</p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        {order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">₹{order.totalPrice.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-blue-600 mt-1 truncate">Track: {order.trackingNumber}</p>
                    )}
                  </div>
                </div>

                {selectedOrder?._id === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">₹{(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-xs sm:text-sm text-gray-500">₹{item.price} each</p>
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
                    
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {(order.status === 'shipped' || order.status === 'processing' || order.status === 'delivered') && (
                        <button 
                          onClick={() => trackOrder(order)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <i className="ri-truck-line mr-2"></i>
                          Track Order
                        </button>
                      )}
                      
                      <button 
                        onClick={() => downloadInvoice(order)}
                        className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <i className="ri-download-line mr-2"></i>
                        Download Invoice
                      </button>

                      {canCancelOrder(order) && (
                        <button 
                          onClick={() => handleCancelOrder(order)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
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
                          className="flex-1 sm:flex-none px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
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
                          className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
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