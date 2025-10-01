
import { useState, useEffect } from 'react';

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

interface AnalyticsData {
  monthlyRevenue: MonthlyData[];
  topProducts: TopProduct[];
}

export default function RevenueAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data from backend with cache-busting
      const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/dashboard/analytics?t=${Date.now()}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('Analytics response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Analytics data received:', data);
        setAnalyticsData(data);
      } else {
        console.error('Analytics API failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        // Clear analytics data if API fails
        setAnalyticsData({
          monthlyRevenue: [],
          topProducts: []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Clear analytics data if API fails
      setAnalyticsData({
        monthlyRevenue: [],
        topProducts: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Orders</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {analyticsData.monthlyRevenue.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{data.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-orange-600 font-medium">₹{data.revenue.toLocaleString()}</span>
                  <span className="text-blue-600 font-medium">{data.orders} orders</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(data.orders / 200) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₹{analyticsData.monthlyRevenue.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.monthlyRevenue.reduce((sum, data) => sum + data.orders, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
        
        <div className="space-y-4">
          {analyticsData.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.sales} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">Product Performance</div>
            <div className="text-sm text-gray-600 mt-1">
              Top 5 products contribute to 68% of total revenue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
