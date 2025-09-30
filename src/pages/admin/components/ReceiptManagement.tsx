import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationSettings from './NotificationSettings';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  paymentReceipt?: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReceiptManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { triggerReceiptNotification, addNotification } = useNotifications();

  useEffect(() => {
    fetchOrdersWithReceipts();
  }, []);

  const fetchOrdersWithReceipts = async () => {
    try {
  const response = await fetch(`${API_URL}/api/admin/orders-with-receipts`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ paymentStatus: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, paymentStatus: newStatus, status: newStatus === 'paid' ? 'processing' : order.status }
            : order
        ));
        
        // Update selected order if it's open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ 
            ...selectedOrder, 
            paymentStatus: newStatus,
            status: newStatus === 'paid' ? 'processing' : selectedOrder.status
          });
        }
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const viewReceiptDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowReceiptModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'pending_verification': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'payment_verification': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading orders with receipts...</span>
          </div>
        </div>
      </div>
    );
  }

  const ordersWithReceipts = orders.filter(order => order.paymentReceipt);

  return (
    <>
      <NotificationSettings />
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Receipt Verification</h2>
            <p className="text-gray-600 mt-1">Review payment receipts and verify orders</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Test Notification Button - Remove in production */}
            <button
              onClick={() => triggerReceiptNotification('ORD-TEST')}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 transition-colors"
              title="Test notification (remove in production)"
            >
              Test Notification
            </button>
            
            {/* Browser Permission Test */}
            <button
              onClick={() => {
                console.log('Testing browser notification...');
                if ('Notification' in window) {
                  if (Notification.permission === 'granted') {
                    addNotification({
                      type: 'receipt',
                      title: 'Test Browser Notification',
                      message: 'This is a test notification with sound!'
                    });
                  } else {
                    Notification.requestPermission().then((permission) => {
                      if (permission === 'granted') {
                        addNotification({
                          type: 'receipt',
                          title: 'Permission Granted!',
                          message: 'Notifications are now enabled with sound!'
                        });
                      }
                    });
                  }
                } else {
                  alert('Browser notifications not supported');
                }
              }}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
              title="Test browser notification & sound"
            >
              <i className="ri-volume-up-line mr-1"></i>
              Test Sound
            </button>
            
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="ri-file-list-3-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        {ordersWithReceipts.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-file-search-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Receipts Found</h3>
            <p className="text-gray-600">Orders with uploaded payment receipts will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersWithReceipts.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {formatStatus(order.paymentStatus)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Customer:</span> {order.user.name}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ₹{order.totalPrice}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Items:</span> {order.items.map(item => 
                        `${item.name} (${item.quantity})`
                      ).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {order.paymentStatus === 'pending_verification' && (
                      <>
                        <button
                          onClick={() => updatePaymentStatus(order._id, 'paid')}
                          disabled={updatingStatus === order._id}
                          className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {updatingStatus === order._id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(order._id, 'failed')}
                          disabled={updatingStatus === order._id}
                          className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => viewReceiptDetails(order)}
                      className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Detail Modal */}
      {showReceiptModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Payment Receipt Details</h3>
                  <p className="text-blue-100 mt-1">Order #{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Order Number:</span>
                          <p className="font-semibold">{selectedOrder.orderNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Order Date:</span>
                          <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Payment Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.paymentStatus)}`}>
                            {formatStatus(selectedOrder.paymentStatus)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Order Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(selectedOrder.status)}`}>
                            {formatStatus(selectedOrder.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div><span className="text-gray-600">Name:</span> <span className="font-semibold">{selectedOrder.user.name}</span></div>
                      <div><span className="text-gray-600">Email:</span> <span className="font-semibold">{selectedOrder.user.email}</span></div>
                      <div><span className="text-gray-600">Phone:</span> <span className="font-semibold">{selectedOrder.shippingAddress.phone}</span></div>
                      <div>
                        <span className="text-gray-600">Address:</span> 
                        <span className="font-semibold">
                          {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, 
                          {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pincode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Items Total:</span>
                          <span className="font-semibold">₹{selectedOrder.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-semibold">₹{selectedOrder.taxPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-semibold">₹{selectedOrder.shippingPrice}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between text-lg font-bold">
                          <span>Total Amount:</span>
                          <span className="text-green-600">₹{selectedOrder.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Receipt */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Receipt</h4>
                    {selectedOrder.paymentReceipt ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <img
                          src={selectedOrder.paymentReceipt}
                          alt="Payment Receipt"
                          className="w-full h-auto rounded-lg border-2 border-gray-200 shadow-md"
                        />
                        <div className="mt-4 text-center">
                          <a
                            href={selectedOrder.paymentReceipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <i className="ri-external-link-line"></i>
                            <span>View Full Size</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <i className="ri-file-image-line text-4xl text-gray-400 mb-2"></i>
                        <p className="text-gray-600">No payment receipt uploaded</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {selectedOrder.paymentStatus === 'pending_verification' && (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-900">Verify Payment</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => updatePaymentStatus(selectedOrder._id, 'paid')}
                          disabled={updatingStatus === selectedOrder._id}
                          className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {updatingStatus === selectedOrder._id ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <i className="ri-check-line"></i>
                              <span>Approve Payment</span>
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => updatePaymentStatus(selectedOrder._id, 'failed')}
                          disabled={updatingStatus === selectedOrder._id}
                          className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <i className="ri-close-line"></i>
                            <span>Reject Payment</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}