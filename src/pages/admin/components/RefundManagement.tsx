import { useState, useEffect } from 'react';
import { useNotifications } from '../../../hooks/useNotifications';

interface RefundRequest {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  totalAmount: number;
  refundReason: string;
  refundComment?: string;
  refundRequestedAt: string;
  refundStatus: 'requested' | 'approved' | 'rejected' | 'processed';
  adminRefundComment?: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
}

export default function RefundManagement() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      const response = await fetch('/api/orders/refund-requests', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setRefundRequests(data);
      } else {
        addNotification({
          title: 'Error',
          message: 'Failed to fetch refund requests',
          type: 'general'
        });
      }
    } catch (error) {
      console.error('Error fetching refund requests:', error);
      addNotification({
        title: 'Error',
        message: 'Failed to fetch refund requests',
        type: 'general'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (refundId: string, action: 'approve' | 'reject') => {
    if (!adminComment.trim()) {
      addNotification({
        title: 'Error',
        message: 'Please add an admin comment',
        type: 'general'
      });
      return;
    }

    setProcessingId(refundId);
    try {
      const response = await fetch(`/api/orders/${refundId}/process-refund`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          action,
          adminComment: adminComment.trim()
        })
      });

      if (response.ok) {
        addNotification({
          title: 'Success',
          message: `Refund ${action}d successfully`,
          type: 'order'
        });
        setShowModal(false);
        setSelectedRequest(null);
        setAdminComment('');
        fetchRefundRequests(); // Refresh the list
      } else {
        const error = await response.json();
        addNotification({
          title: 'Error',
          message: error.message || `Failed to ${action} refund`,
          type: 'general'
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing refund:`, error);
      addNotification({
        title: 'Error',
        message: `Failed to ${action} refund`,
        type: 'general'
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openProcessModal = (request: RefundRequest) => {
    setSelectedRequest(request);
    setAdminComment('');
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Refund Management</h2>
        <p className="text-gray-600 text-sm sm:text-base">Manage customer refund requests and process refunds</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="ri-time-line text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {refundRequests.filter(r => r.refundStatus === 'requested').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="ri-check-line text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {refundRequests.filter(r => r.refundStatus === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <i className="ri-close-line text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {refundRequests.filter(r => r.refundStatus === 'rejected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="ri-money-dollar-circle-line text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Processed</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {refundRequests.filter(r => r.refundStatus === 'processed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Refund Requests</h3>
        </div>

        {refundRequests.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-refund-2-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Refund Requests</h3>
            <p className="text-gray-500">There are no refund requests at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refund Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refundRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Order #{request.orderId.slice(-8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            ₹{request.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.user.name}</div>
                      <div className="text-sm text-gray-500">{request.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <strong>Reason:</strong> {request.refundReason}
                      </div>
                      {request.refundComment && (
                        <div className="text-sm text-gray-500 mt-1">
                          <strong>Comment:</strong> {request.refundComment}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        <strong>Requested:</strong> {formatDate(request.refundRequestedAt)}
                      </div>
                      {request.adminRefundComment && (
                        <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                          <strong>Admin Comment:</strong> {request.adminRefundComment}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.refundStatus)}`}>
                        {request.refundStatus.charAt(0).toUpperCase() + request.refundStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.refundStatus === 'requested' && (
                        <button
                          onClick={() => openProcessModal(request)}
                          className="text-orange-600 hover:text-orange-900 mr-3"
                        >
                          Process
                        </button>
                      )}
                      <button
                        onClick={() => openProcessModal(request)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Process Refund Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative min-h-screen flex items-center justify-center">
            <div className="relative w-full max-w-lg bg-white shadow-lg rounded-md p-4 m-4">
              <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Process Refund Request
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Order:</strong> #{selectedRequest.orderId.slice(-8)}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Customer:</strong> {selectedRequest.user.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Amount:</strong> ₹{selectedRequest.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Reason:</strong> {selectedRequest.refundReason}
                </p>
                {selectedRequest.refundComment && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Customer Comment:</strong> {selectedRequest.refundComment}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Comment *
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="Add your comment about this refund request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 resize-none"
                  rows={3}
                  required
                />
              </div>

              {selectedRequest.refundStatus === 'requested' ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleProcessRefund(selectedRequest._id, 'approve')}
                    disabled={processingId === selectedRequest._id || !adminComment.trim()}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    {processingId === selectedRequest._id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <i className="ri-check-line mr-2"></i>
                        Approve Refund
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleProcessRefund(selectedRequest._id, 'reject')}
                    disabled={processingId === selectedRequest._id || !adminComment.trim()}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                  >
                    {processingId === selectedRequest._id ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <i className="ri-close-line mr-2"></i>
                        Reject Request
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.refundStatus)}`}>
                    {selectedRequest.refundStatus.charAt(0).toUpperCase() + selectedRequest.refundStatus.slice(1)}
                  </span>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}