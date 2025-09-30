
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';

interface UserHeaderProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartItems?: { [key: string]: number };
  cartItems?: { [key: string]: number };
}

export default function UserHeader({ user, activeTab, setActiveTab, cartItems }: UserHeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'orders', label: 'My Orders', icon: 'ri-shopping-bag-line' },
    { id: 'wishlist', label: 'Wishlist', icon: 'ri-heart-line' },
    { id: 'profile', label: 'Profile', icon: 'ri-user-line' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-orange-600 mr-4 sm:mr-8" style={{ fontFamily: '"Pacifico", serif' }}>
                <span className="hidden sm:inline">Hanuma Crackers</span>
                <span className="sm:hidden">Hanuma Crackers</span>
              </h1>
            </Link>
            <span className="text-gray-500 text-xs sm:text-sm hidden md:inline">My Dashboard</span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors relative"
              title="View Cart"
              onClick={() => typeof window.dashboardCartOpen === 'function' ? window.dashboardCartOpen() : null}
            >
              <i className="ri-shopping-cart-line text-xl"></i>
              {cartItems && Object.values(cartItems).reduce((a, b) => a + b, 0) > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                  {Object.values(cartItems).reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
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
              className="text-gray-500 hover:text-gray-700 transition-colors"
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
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ').slice(-1)[0]}</span>
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
