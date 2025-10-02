import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  // Debug logging
  console.log('ResetPassword component loaded');
  console.log('Token from useParams:', token);
  console.log('Current URL:', window.location.href);
  console.log('Pathname:', window.location.pathname);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'https://hanuma-crackers.onrender.com';
      const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: formData.password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('Password reset successful! You can now sign in with your new password.');
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* DEBUG SECTION - Remove in production */}
      <div className="fixed top-0 left-0 w-full bg-green-500 text-white p-2 z-50">
        <strong>🎯 DEBUG: Reset Password Component Loaded!</strong><br/>
        Token: {token || 'NO TOKEN'} | URL: {window.location.pathname}
      </div>
      
      <div className="max-w-md w-full space-y-8 mt-16">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-orange-600 mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
              Hanuma Crackers
            </h1>
          </Link>
          <p className="text-gray-600">Reset your password</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-center">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <i className="ri-lock-password-line text-2xl text-orange-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-orange-100">
              Enter your new password below
            </p>
          </div>

          {/* Card Body */}
          <div className="px-6 py-8">
            {status === 'success' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="ri-check-line text-2xl text-green-600"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
                <p className="text-gray-600 mb-4">{message}</p>
                <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`ri-eye${showPassword ? '-off' : ''}-line text-gray-400 hover:text-gray-600`}></i>
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`ri-eye${showConfirmPassword ? '-off' : ''}-line text-gray-400 hover:text-gray-600`}></i>
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-center">
                      <i className={`ri-check-line mr-2 ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}></i>
                      At least 6 characters long
                    </li>
                    <li className="flex items-center">
                      <i className={`ri-check-line mr-2 ${formData.password === formData.confirmPassword && formData.password ? 'text-green-600' : 'text-gray-400'}`}></i>
                      Passwords match
                    </li>
                  </ul>
                </div>

                {/* Error/Success Message */}
                {message && (
                  <div className={`p-4 rounded-lg ${
                    status === 'error' 
                      ? 'bg-red-50 border border-red-200 text-red-700' 
                      : 'bg-green-50 border border-green-200 text-green-700'
                  }`}>
                    <div className="flex items-center">
                      <i className={`ri-${status === 'error' ? 'error-warning' : 'check-circle'}-line mr-2`}></i>
                      <span className="text-sm font-medium">{message}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.password || !formData.confirmPassword}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <i className="ri-lock-password-line mr-2"></i>
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Back to Sign In */}
            <div className="mt-6 text-center">
              <Link 
                to="/signin" 
                className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="tel:+918688556898" className="text-orange-600 hover:text-orange-700">
              +91 86885 56898
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}