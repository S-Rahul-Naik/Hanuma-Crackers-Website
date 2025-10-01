import { useState, useEffect } from 'react';

interface OutOfStockProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: Array<{ url: string }>;
  createdAt: string;
}

interface OutOfStockData {
  count: number;
  products: OutOfStockProduct[];
}

const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;

export default function OutOfStockPanel() {
  const [outOfStockData, setOutOfStockData] = useState<OutOfStockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchOutOfStockProducts();
  }, []);

  const fetchOutOfStockProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/api/admin/out-of-stock`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setOutOfStockData(data);
      } else {
        setError('Failed to fetch out-of-stock products');
      }
    } catch (error) {
      console.error('Error fetching out-of-stock products:', error);
      setError('Network error occurred');
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-red-600">
          <i className="ri-error-warning-line text-2xl mb-2"></i>
          <p>{error}</p>
          <button 
            onClick={fetchOutOfStockProducts}
            className="mt-2 text-sm text-orange-600 hover:text-orange-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <i className="ri-error-warning-line text-white text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Out of Stock Products</h3>
              <p className="text-sm text-gray-500">Products that need restocking</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">{outOfStockData?.count || 0}</div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {outOfStockData && outOfStockData.products.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {outOfStockData.products.map((product) => (
              <div key={product._id} className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex-shrink-0">
                  <img
                    src={product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/48x48?text=No+Image'}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{product.category}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs font-medium text-green-600">₹{product.price}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-red-600 font-medium">
                          Stock: {product.stock}
                        </span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          Added: {formatDate(product.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-green-600 text-2xl"></i>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">All Products in Stock!</h4>
            <p className="text-gray-500">No products are currently out of stock.</p>
          </div>
        )}
      </div>

      {outOfStockData && outOfStockData.products.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Showing {outOfStockData.products.length} out of stock products
            </span>
            <button
              onClick={fetchOutOfStockProducts}
              className="text-orange-600 hover:text-orange-700 font-medium flex items-center space-x-1"
            >
              <i className="ri-refresh-line"></i>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}