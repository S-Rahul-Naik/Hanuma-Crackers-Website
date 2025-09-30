
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { NotificationProvider } from '../../hooks/useNotifications';
import AdminHeader from './components/AdminHeader';
import DashboardStats from './components/DashboardStats';
import ProductManagement from './components/ProductManagement';
import OrderManagement from './components/OrderManagement';
import RevenueAnalytics from './components/RevenueAnalytics';
import CustomerManagement from './components/CustomerManagement';
import PaymentSettings from './components/PaymentSettings';
import ReceiptManagement from './components/ReceiptManagement';
import CouponManagement from './components/CouponManagement';
import RefundManagement from './components/RefundManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  if (user && user.role !== 'admin') navigate('/signin');

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <RevenueAnalytics />
          </div>
        );
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'refunds':
        return <RefundManagement />;
      case 'payments':
        return <PaymentSettings />;
      case 'receipts':
        return <ReceiptManagement />;
      case 'coupons':
        return <CouponManagement />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </NotificationProvider>
  );
}
