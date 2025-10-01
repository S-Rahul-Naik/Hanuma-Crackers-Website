import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;

interface Product {
  id: string; // MongoDB _id stored as string
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
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
    originalPrice: '',
    stock: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    image: '',
    imagePublicId: '',
    imageFile: null as File | null,
    uploading: false
  });
  const [imageError, setImageError] = useState<string>('');

  // State for existing categories and autocomplete
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    
    // Fetch products and extract categories
    fetch(`${API_URL}/api/products?limit=100`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products)) {
          const mapped = data.products.map((p: any) => ({
            id: p._id,
            name: p.name,
            category: p.category,
            price: p.price,
            originalPrice: p.originalPrice,
            stock: p.stock,
            image: p.images && p.images.length > 0 ? p.images[0].url : '',
            description: p.description,
            status: p.isActive ? 'active' : 'inactive'
          }));
          setProducts(mapped);
          
          // Extract unique categories for autocomplete
          const uniqueCategories = Array.from(new Set(mapped.map((p: any) => p.category).filter(Boolean))) as string[];
          setExistingCategories(uniqueCategories.sort());
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
      originalPrice: '',
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
      originalPrice: (product as any).originalPrice?.toString() || (product.price * 1.2).toString(),
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
    
    const price = parseFloat(formData.price);
    const originalPrice = parseFloat(formData.originalPrice);
    
    // Calculate discount percentage
    const discountPercentage = originalPrice > price ? 
      Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    
    const productData: any = {
      name: formData.name,
      category: formData.category,
      price: price,
      originalPrice: originalPrice,
      discountPercentage: discountPercentage,
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
    await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    
    // Refresh products from backend
    fetch(`${API_URL}/api/products`, {
      credentials: 'include',
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
              originalPrice: p.originalPrice,
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
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
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
    
    // Handle category autocomplete
    if (name === 'category') {
      if (value.trim()) {
        const filtered = existingCategories.filter(cat => 
          cat.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
        setFilteredSuggestions([]);
      }
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({ ...prev, category }));
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  // Calculate discount percentage in real-time
  const calculateDiscountPercentage = () => {
    const price = parseFloat(formData.price) || 0;
    const originalPrice = parseFloat(formData.originalPrice) || 0;
    
    if (originalPrice > 0 && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
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
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include',
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
                <div>
                  <div className="text-xl font-bold text-orange-600">₹{product.price}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
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

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    onFocus={() => {
                      if (formData.category.trim()) {
                        const filtered = existingCategories.filter(cat => 
                          cat.toLowerCase().startsWith(formData.category.toLowerCase())
                        );
                        setFilteredSuggestions(filtered);
                        setShowSuggestions(filtered.length > 0);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicking on them
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    placeholder="Enter category (e.g., Sparklers, Bombs, Rockets)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  
                  {/* Autocomplete suggestions */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredSuggestions.map((category, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          className="w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <span className="flex items-center">
                            <i className="ri-tag-line mr-2 text-orange-500"></i>
                            {category}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {existingCategories.length > 0 
                      ? `Type to see suggestions from ${existingCategories.length} existing categories, or create a new one`
                      : 'Create a new category or use existing ones'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                      min="0"
                      step="0.01"
                      placeholder="MRP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price (₹)
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
                      placeholder="Selling price"
                    />
                  </div>
                </div>

                {/* Auto-calculated discount display */}
                {formData.originalPrice && formData.price && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">
                        Auto-calculated Discount:
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {calculateDiscountPercentage()}% OFF
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Savings: ₹{Math.max(0, parseFloat(formData.originalPrice) - parseFloat(formData.price)).toFixed(2)}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
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
