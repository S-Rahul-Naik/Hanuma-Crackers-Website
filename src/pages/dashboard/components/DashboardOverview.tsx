
interface DashboardOverviewProps {
  user: any; // initial user object (basic auth info only)
}

interface RecentOrder {
  id: string;
  date: string;
  items: string;
  amount: number; // store as number (in rupees)
  status: string;
  tracking?: string;
}

interface DashboardData {
  orderCount: number;
  totalSpent: number; // rupees
  wishlistCount: number;
  loyaltyPoints: number;
  recentOrders: RecentOrder[];
}

import { useEffect, useState } from 'react';

export default function DashboardOverview({ user }: DashboardOverviewProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dashboard/overview', { signal: controller.signal, credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load dashboard');
        const json = await res.json();
        if (isMounted && json && json.success !== false) {
          const payload = json.data || json; // allow either shape
          const normalized: DashboardData = {
            orderCount: Number(payload.orderCount) || 0,
            totalSpent: Number(payload.totalSpent) || 0,
            wishlistCount: Number(payload.wishlistCount) || 0,
            loyaltyPoints: Number(payload.loyaltyPoints) || 0,
            recentOrders: Array.isArray(payload.recentOrders)
              ? payload.recentOrders.slice(0, 10).map((o: any) => ({
                  id: o.id || o._id || 'ORD',
                  date: o.date || o.createdAt || '',
                  items: o.items || (Array.isArray(o.products) ? o.products.map((p: any) => p.name).join(', ') : ''),
                  amount: Number(o.amount || o.total || 0),
                  status: o.status || 'Processing',
                  tracking: o.tracking || o.trackingNumber || undefined
                }))
              : []
          };
          setData(normalized);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Error loading dashboard');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; controller.abort(); };
  }, []);

  const orderCount = data?.orderCount || 0;
  const totalSpent = data?.totalSpent || 0;
  const wishlistCount = data?.wishlistCount || 0;
  const loyaltyPoints = data?.loyaltyPoints || 0;
  const orders: RecentOrder[] = data?.recentOrders || [];

  const stats = [
    {
      title: 'Total Orders',
      value: orderCount.toString(),
      icon: 'ri-shopping-bag-line',
      color: 'bg-blue-500',
      change: orderCount > 0 ? '' : 'No orders yet'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      icon: 'ri-money-rupee-circle-line',
      color: 'bg-green-500',
      change: totalSpent > 0 ? '' : '—'
    },
    {
      title: 'Wishlist Items',
      value: wishlistCount.toString(),
      icon: 'ri-heart-line',
      color: 'bg-red-500',
      change: wishlistCount > 0 ? '' : 'Add items'
    },
    {
      title: 'Loyalty Points',
      value: loyaltyPoints.toString(),
      icon: 'ri-star-line',
      color: 'bg-yellow-500',
      change: loyaltyPoints > 0 ? '' : 'Start earning'
    }
  ];

  const recentOrders = orders.slice(0,3); // limit display

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
            <p className="mt-2 opacity-90">
              Ready to light up your celebrations? Explore our latest crackers collection.
            </p>
          </div>
          <div className="hidden md:block">
            <img
              src="https://readdy.ai/api/search-image?query=happy%20customer%20celebrating%20with%20colorful%20fireworks%20and%20crackers%20in%20background%2C%20festive%20celebration%20scene%20with%20bright%20lights%20and%20sparkles&width=200&height=150&seq=welcome&orientation=landscape"
              alt="Celebration"
              className="w-48 h-32 object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="mt-6">
          <a
            href="/"
            className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Continue Shopping
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${stat.icon} text-white text-xl`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              View All Orders
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No orders yet. <a href="/" className="text-orange-600 hover:underline">Start shopping</a>.</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{order.items}</p>
                        {order.tracking && (
                          <p className="text-sm text-gray-500">Tracking: {order.tracking}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700">
                      <i className="ri-eye-line text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && !loading && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-shopping-cart-line text-orange-600 text-2xl"></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Shop Now</h3>
            <p className="text-gray-600 text-sm mb-4">Explore our latest collection of premium crackers</p>
            <a
              href="/"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Browse Products
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-truck-line text-blue-600 text-2xl"></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Orders</h3>
            <p className="text-gray-600 text-sm mb-4">Monitor your order status and delivery updates</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
              Track Now
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-customer-service-line text-green-600 text-2xl"></i>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-gray-600 text-sm mb-4">Get help with your orders or product questions</p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
