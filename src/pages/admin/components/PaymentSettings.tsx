import { useState, useEffect } from 'react';

interface PaymentSettings {
  primaryUpi: string;
  alternativeUpi: string;
  qrCodeImage: string;
  whatsappNumber: string;
  phoneNumber: string;
}

export default function PaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>({
    primaryUpi: 'hanuma@paytm',
    alternativeUpi: '8688556898@ybl',
    qrCodeImage: 'https://readdy.ai/api/search-image?query=UPI%20QR%20code%20payment%20scanner%20for%20Indian%20digital%20payments%2C%20clean%20white%20background%20with%20QR%20code%20pattern%2C%20professional%20payment%20gateway%20design%2C%20mobile%20payment%20interface%20style%2C%20simple%20and%20clear%20QR%20code%20for%20scanning&width=200&height=200&seq=upi-qr-001&orientation=squarish',
    whatsappNumber: '918688556898',
    phoneNumber: '+918688556898'
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingQR, setUploadingQR] = useState(false);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch('/api/admin/payment-settings', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (error) {
      console.log('Payment settings not found, using defaults');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch('/api/admin/payment-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: 'Payment settings updated successfully!' });
      } else {
        throw new Error(data.message || 'Failed to update settings');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update payment settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleQRUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ type: 'error', text: 'File size should be less than 5MB' });
      return;
    }

    setUploadingQR(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      formData.append('qr-code', file);
      
      const response = await fetch('/api/admin/upload-qr', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSettings(prev => ({ ...prev, qrCodeImage: data.imageUrl }));
        setMessage({ type: 'success', text: 'QR code uploaded successfully!' });
      } else {
        throw new Error(data.message || 'Failed to upload QR code');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to upload QR code' });
    } finally {
      setUploadingQR(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
          <p className="text-gray-600 mt-1">Manage UPI IDs, QR code, and contact information for payments</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <i className="ri-secure-payment-line text-2xl text-green-600"></i>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-700' 
            : 'bg-red-50 border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            <i className={`mr-3 ${
              message.type === 'success' ? 'ri-check-circle-line' : 'ri-error-warning-line'
            }`}></i>
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* UPI Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <i className="ri-smartphone-line mr-2 text-blue-500"></i>
            UPI Payment Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary UPI ID *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="yourname@paytm"
              value={settings.primaryUpi}
              onChange={(e) => setSettings(prev => ({ ...prev, primaryUpi: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">Main UPI ID for receiving payments</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alternative UPI ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="9876543210@ybl"
              value={settings.alternativeUpi}
              onChange={(e) => setSettings(prev => ({ ...prev, alternativeUpi: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">Backup UPI ID (optional)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="918688556898"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">WhatsApp number for customer support (with country code)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+91 86885 56898"
              value={settings.phoneNumber}
              onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">Phone number for customer calls</p>
          </div>
        </div>

        {/* QR Code Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <i className="ri-qr-code-line mr-2 text-purple-500"></i>
            QR Code Management
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Current QR Code
            </label>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              {settings.qrCodeImage ? (
                <div>
                  <img
                    src={settings.qrCodeImage}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto object-cover rounded-lg border-2 border-gray-200"
                  />
                  <p className="text-sm text-gray-600 mt-2">Current QR Code</p>
                </div>
              ) : (
                <div className="py-8">
                  <i className="ri-qr-code-line text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">No QR code uploaded</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New QR Code
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                id="qr-upload"
                className="hidden"
                accept="image/*"
                onChange={handleQRUpload}
                disabled={uploadingQR}
              />
              <label
                htmlFor="qr-upload"
                className={`cursor-pointer ${uploadingQR ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {uploadingQR ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <i className="ri-upload-cloud-line text-3xl text-purple-500 mb-2"></i>
                    <span className="text-gray-700 font-medium">Click to upload QR code</span>
                    <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <i className="ri-information-line text-blue-500 mt-1 mr-3"></i>
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">QR Code Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Generate QR from your UPI app</li>
                  <li>• Ensure it's clear and scannable</li>
                  <li>• Test before uploading</li>
                  <li>• Square format works best</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-8 pt-6 border-t">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <i className="ri-save-line"></i>
              <span>Save Payment Settings</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}