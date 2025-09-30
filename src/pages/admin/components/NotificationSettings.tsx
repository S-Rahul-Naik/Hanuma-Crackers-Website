import { useState, useEffect } from 'react';

export default function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      console.log('Notification permission result:', result);
    }
  };

  const testNotification = () => {
    console.log('Testing notification...');
    if (Notification.permission === 'granted') {
      const notification = new Notification('Test Notification', {
        body: 'This is a test notification from Hanuma Crackers Admin Panel',
        icon: '/favicon.ico',
        requireInteraction: true
      });
      
      notification.onclick = () => {
        console.log('Notification clicked');
        notification.close();
      };
      
      setTimeout(() => {
        notification.close();
      }, 5000);
    } else {
      console.log('Notification permission not granted:', Notification.permission);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
      
      <div className="space-y-4">
        {/* Browser Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Browser Notifications</p>
            <p className="text-sm text-gray-600">Get desktop notifications for new payment receipts</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              permission === 'granted' ? 'bg-green-100 text-green-700' :
              permission === 'denied' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {permission === 'granted' ? 'Enabled' :
               permission === 'denied' ? 'Blocked' : 'Not Set'}
            </span>
            {permission !== 'granted' && (
              <button
                onClick={requestPermission}
                className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
              >
                Enable
              </button>
            )}
            {permission === 'granted' && (
              <button
                onClick={testNotification}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Test
              </button>
            )}
          </div>
        </div>

        {/* Sound Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Sound Notifications</p>
            <p className="text-sm text-gray-600">Play a sound when new notifications arrive</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {/* Auto-refresh */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Auto-refresh</p>
            <p className="text-sm text-gray-600">Automatically check for new receipts every 10 seconds</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Active
          </span>
        </div>

        {/* Debug Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Debug Mode</p>
            <p className="text-sm text-gray-600">Show debug information in console</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={debugMode}
              onChange={(e) => setDebugMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        {/* Debug Information */}
        {debugMode && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-900 mb-2">Debug Information:</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Browser supports notifications: {'Notification' in window ? 'Yes' : 'No'}</p>
              <p>• Current permission: {permission}</p>
              <p>• Sound enabled: {soundEnabled ? 'Yes' : 'No'}</p>
              <p>• Last receipt count: {localStorage.getItem('lastReceiptCount') || 'Not set'}</p>
              <p>• Auto-refresh interval: 10 seconds</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}