
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import NotificationBell from './NotificationBell';

interface AdminHeaderProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminHeader({ user, activeTab, setActiveTab }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { notifications } = useNotifications();

  // Count unread receipt notifications
  const unreadReceiptCount = notifications.filter(n => !n.read && n.type === 'receipt').length;

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { id: 'products', label: 'Products', icon: 'ri-box-3-line' },
    { id: 'orders', label: 'Orders', icon: 'ri-shopping-bag-line' },
    { id: 'customers', label: 'Customers', icon: 'ri-user-line' },
    { id: 'refunds', label: 'Refund Management', icon: 'ri-refund-2-line' },
    { id: 'receipts', label: 'Receipt Verification', icon: 'ri-file-list-3-line' },
    { id: 'coupons', label: 'Coupons', icon: 'ri-coupon-3-line' },
    { id: 'payments', label: 'Payment Settings', icon: 'ri-secure-payment-line' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-orange-600 mr-4 sm:mr-8" style={{ fontFamily: '"Pacifico", serif' }}>
                Hanuma Crackers
              </h1>
            </Link>
            <span className="text-gray-500 text-xs sm:text-sm hidden md:inline">Admin Panel</span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notification Bell */}
            <NotificationBell />
            
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <i className="ri-user-fill text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium text-sm sm:text-base hidden sm:inline max-w-20 sm:max-w-none truncate">
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              title="Logout"
            >
              <i className="ri-logout-box-line text-xl"></i>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="relative overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 sm:space-x-8 -mb-px min-w-max px-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.label === 'Refund Management' ? 'Refunds' : 
                   tab.label === 'Receipt Verification' ? 'Receipts' : 
                   tab.label === 'Payment Settings' ? 'Payments' : 
                   tab.label.split(' ').slice(-1)[0]}
                </span>
                {tab.id === 'receipts' && unreadReceiptCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadReceiptCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Fade indicators for mobile */}
          <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden"></div>
        </div>
      </div>
    </header>
  );
}
