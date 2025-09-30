import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  images: Array<{
    url: string;
    publicId?: string;
    altText?: string;
  }>;
  price: number;
}

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  applicableProducts: Product[];
  isActive: boolean;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string | null;
  description: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: '',
    applicableProducts: [] as string[],
    usageLimit: '',
    validUntil: '',
    description: '',
    isActive: true
  });

  // Helper function to get product image with fallback
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0 && product.images[0]?.url) {
      return product.images[0].url;
    }
    // Create a simple colored placeholder based on product name
    const colors = ['f97316', '3b82f6', '10b981', 'ef4444', '8b5cf6', 'f59e0b'];
    const colorIndex = product.name.length % colors.length;
    const color = colors[colorIndex];
    const initials = product.name.substring(0, 2).toUpperCase();
    return `https://via.placeholder.com/40x40/${color}/ffffff?text=${initials}`;
  };

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        discountPercentage: parseInt(formData.discountPercentage),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        validUntil: formData.validUntil || null
      };

      const url = editingCoupon 
        ? `/api/admin/coupons/${editingCoupon._id}`
        : '/api/admin/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        await fetchCoupons();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message || 'Error saving coupon');
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Error saving coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage.toString(),
      applicableProducts: coupon.applicableProducts.map(p => p._id),
      usageLimit: coupon.usageLimit?.toString() || '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
      description: coupon.description || '',
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        await fetchCoupons();
      } else {
        alert(data.message || 'Error deleting coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Error deleting coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountPercentage: '',
      applicableProducts: [],
      usageLimit: '',
      validUntil: '',
      description: '',
      isActive: true
    });
    setEditingCoupon(null);
  };

  const createPredefinedCoupons = async () => {
    const predefinedCoupons = [
      { code: 'SAVE5', discountPercentage: 5, description: '5% discount on all products' },
      { code: 'SAVE10', discountPercentage: 10, description: '10% discount on all products' },
      { code: 'SAVE20', discountPercentage: 20, description: '20% discount on all products' },
      { code: 'SAVE25', discountPercentage: 25, description: '25% discount on all products' }
    ];

    for (const coupon of predefinedCoupons) {
      try {
        await fetch('/api/admin/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(coupon)
        });
      } catch (error) {
        console.error('Error creating predefined coupon:', error);
      }
    }

    await fetchCoupons();
  };

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        applicableProducts: [...formData.applicableProducts, productId]
      });
    } else {
      setFormData({
        ...formData,
        applicableProducts: formData.applicableProducts.filter(id => id !== productId)
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading coupons...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Coupon Management</h2>
            <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
          </div>
          <div className="flex items-center space-x-3">
            {coupons.length === 0 && (
              <button
                onClick={createPredefinedCoupons}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Default Coupons
              </button>
            )}
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add New Coupon
            </button>
          </div>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-coupon-3-line text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Coupons Found</h3>
            <p className="text-gray-600 mb-4">Create your first coupon to offer discounts to customers</p>
            <button
              onClick={createPredefinedCoupons}
              className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Create Default Coupons (5%, 10%, 20%, 25%)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-100 text-orange-800 text-sm font-bold px-3 py-1 rounded-full">
                      {coupon.code}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${coupon.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{coupon.discountPercentage}% OFF</span>
                </div>

                {coupon.description && (
                  <p className="text-gray-600 text-sm mb-3">{coupon.description}</p>
                )}

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Usage:</span>
                    <span>{coupon.usedCount}/{coupon.usageLimit || '∞'}</span>
                  </div>
                  
                  {coupon.validUntil && (
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{new Date(coupon.validUntil).toLocaleDateString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Products:</span>
                    <span>
                      {coupon.applicableProducts.length === 0 
                        ? 'All Products' 
                        : `${coupon.applicableProducts.length} Products`}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., SAVE20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Percentage *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Brief description of the coupon"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Applicable Products (Leave empty for all products)
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-3">
                    {products.map((product) => (
                      <label key={product._id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.applicableProducts.includes(product._id)}
                          onChange={(e) => handleProductSelection(product._id, e.target.checked)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <img
                          src={product.images?.[0]?.url || 'https://via.placeholder.com/40x40/f97316/ffffff?text=IMG'}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/40x40/f97316/ffffff?text=IMG';
                          }}
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                          <span className="text-sm text-gray-500 ml-2">₹{product.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    editingCoupon ? 'Update Coupon' : 'Create Coupon'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}