import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalItems: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{orderId: string, updating: boolean}>({ orderId: '', updating: false });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: '50',
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/admin/orders?${queryParams}`, {
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Orders data:', data);
        setOrders(data.orders || []);
      } else {
        const errorData = await response.text();
        console.error('API Error:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdateStatus({ orderId, updating: true });
      
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await response.json(); // Parse response but don't need to use it
        
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        ));
        
        // If the order details modal is open for this order, update it too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        // Show success message
        console.log('Order status updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to update order status:', errorData);
        alert(`Failed to update order status: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please check your connection and try again.');
    } finally {
      setUpdateStatus({ orderId: '', updating: false });
    }
  };

  const generateOrderPDF = (order: Order) => {
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
    doc.text(' Hanuma Crackers', 20, yPosition);
    
    yPosition += 8;
    doc.setFontSize(smallFontSize);
    doc.setTextColor(100, 100, 100); // Gray color
    doc.text('Premium Quality Fireworks', 20, yPosition);
    
    yPosition += 15;
    doc.setFontSize(subHeaderFontSize);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont('helvetica', 'bold');
    doc.text('ORDER INVOICE', 20, yPosition);
    
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
    doc.text(`Total Items: ${order.totalItems}`, 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ₹${order.totalPrice.toLocaleString()}`, 20, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    
    // Status badges
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
    doc.text(`Name: ${order.customer.name}`, 115, yPosition);
    yPosition += 6;
    doc.text(`Email: ${order.customer.email}`, 115, yPosition);
    yPosition += 6;
    doc.text(`Phone: ${order.customer.phone}`, 115, yPosition);
    
    yPosition = 110; // Move to items section
    
    // Order Items Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(bodyFontSize);
    doc.text('Order Items', 20, yPosition);
    yPosition += 10;
    
    // Table headers with background
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
    doc.save(`Hanuma-Crackers-Order-${order.orderNumber}.pdf`);
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-200">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-gray-500 text-sm">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{order.totalItems} items</td>
                  <td className="px-6 py-4 font-medium">₹{order.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updateStatus.updating && updateStatus.orderId === order._id}
                        className={`px-3 py-1 pr-8 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-colors ${getStatusColor(order.status)} ${updateStatus.updating && updateStatus.orderId === order._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
                        style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 5\'><path fill=\'%23666\' d=\'M2 0L0 2h4zm0 5L0 3h4z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '6px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updateStatus.updating && updateStatus.orderId === order._id && (
                        <div className="absolute inset-y-0 right-1 flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500"></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-orange-600 hover:text-orange-900 transition-colors"
                        title="View Order Details"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => generateOrderPDF(order)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Download PDF"
                      >
                        <i className="ri-download-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => generateOrderPDF(selectedOrder)}
                  className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center space-x-2 text-sm"
                >
                  <i className="ri-download-line"></i>
                  <span>Download PDF</span>
                </button>
                <button 
                  onClick={closeOrderDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Order Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Order Number:</span> {selectedOrder.orderNumber}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                    <p><span className="font-medium">Total Items:</span> {selectedOrder.totalItems}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{selectedOrder.totalPrice.toLocaleString()}</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                        disabled={updateStatus.updating && updateStatus.orderId === selectedOrder._id}
                        className={`ml-2 px-2 py-1 rounded-full text-xs border-0 focus:ring-2 focus:ring-orange-500 ${getStatusColor(selectedOrder.status)} ${updateStatus.updating && updateStatus.orderId === selectedOrder._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 4 5\'><path fill=\'%23666\' d=\'M2 0L0 2h4zm0 5L0 3h4z\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center', backgroundSize: '8px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updateStatus.updating && updateStatus.orderId === selectedOrder._id && (
                        <div className="inline-flex items-center ml-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500"></div>
                        </div>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Payment Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-3 text-gray-700">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {['processing', 'shipped', 'delivered'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                        disabled={selectedOrder.status === status || (updateStatus.updating && updateStatus.orderId === selectedOrder._id)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedOrder.status === status
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white border-gray-300 hover:bg-orange-50 hover:border-orange-300 text-gray-700'
                        }`}
                      >
                        Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Order Items</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">₹{item.price.toLocaleString()}</td>
                        <td className="px-4 py-2">₹{(item.quantity * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => generateOrderPDF(selectedOrder)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
              >
                <i className="ri-download-line"></i>
                <span>Download PDF</span>
              </button>
              <button 
                onClick={closeOrderDetails}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
