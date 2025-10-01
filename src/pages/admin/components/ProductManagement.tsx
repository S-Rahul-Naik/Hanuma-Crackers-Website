import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;

interface Product {
  id: string; // MongoDB _id stored as string
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  status: 'active' | 'inactive';
}

export default function ProductManagement() {
  // Start with an empty list so placeholder products do not flash before real data loads
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    image: '',
    imagePublicId: '',
    imageFile: null as File | null,
    uploading: false
  });
  const [imageError, setImageError] = useState<string>('');

  const categories = ['Flower Pots', 'Rockets', 'Ground Spinners', 'Sparklers', 'Chakras', 'Aerial Shots', 'Bombs'];

  useEffect(() => {
    const controller = new AbortController();
  const token = localStorage.getItem('auth_token');
  fetch(`${API_URL}/api/products?limit=100`, {
    credentials: 'include',
    signal: controller.signal,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          const mapped = data.products.map((p: any) => ({
            id: p._id,
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock,
            image: p.images && p.images.length > 0 ? p.images[0].url : '',
            description: p.description,
            status: p.isActive ? 'active' : 'inactive'
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleAddProduct = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      status: 'active',
      image: '',
      imagePublicId: '',
      imageFile: null,
      uploading: false
    });
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      status: product.status,
      image: product.image,
      imagePublicId: '',
      imageFile: null,
      uploading: false
    });
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setImageError('Please upload an image for the product.');
      return;
    }
    setImageError('');
    const productData: any = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description,
      isActive: formData.status === 'active'
    };
    if (formData.image) {
      productData.image = formData.image;
    }
    if (formData.imagePublicId) {
      productData.imagePublicId = formData.imagePublicId;
    }
    // Persist to backend
    const token = localStorage.getItem('auth_token');
    await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    // Refresh products from backend
    fetch(`${API_URL}/api/products`, {
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(
            data.products.map((p: any) => ({
              id: p._id,
              name: p.name,
              category: p.category,
              price: p.price,
              stock: p.stock,
              image: p.images && p.images.length > 0 ? p.images[0].url : '',
              description: p.description,
              status: p.isActive ? 'active' : 'inactive'
            }))
          );
        }
      });
    setShowAddModal(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setDeletingId(id);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success !== false) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert('Error deleting product.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 150 * 1024) {
      setImageError('Image size must be less than 150KB.');
      return;
    }
    setImageError('');
    setFormData(prev => ({ ...prev, uploading: true }));
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formDataUpload,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.url, imagePublicId: data.publicId, uploading: false }));
      } else {
        setImageError(data.message || 'Upload failed');
        setFormData(prev => ({ ...prev, uploading: false }));
      }
    } catch (err) {
      setImageError('Upload error');
      setFormData(prev => ({ ...prev, uploading: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600 mt-1">Manage your cracker inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gradient-to-r from-orange-100 to-red-100" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          No products yet. Click <span className="font-medium text-orange-600">Add Product</span> to create one.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold text-orange-600">₹{product.price}</div>
                <div className="text-sm text-gray-500">Stock: {product.stock}</div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className={`flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed`}
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id ? (
                    <span className="flex items-center justify-center gap-1"><i className="ri-loader-4-line animate-spin" /> Deleting...</span>
                  ) : (
                    <>
                      <i className="ri-delete-bin-line mr-1"></i>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {formData.uploading && (
                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2"><i className="ri-loader-4-line animate-spin"></i> Uploading...</p>
                  )}
                  {formData.image && !formData.uploading && (
                    <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                  {imageError && (
                    <p className="text-red-500 text-sm mt-2">{imageError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-8"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-8"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors whitespace-nowrap"
                  >
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
