export default function TestResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          🎯 TEST: Reset Password Route Working!
        </h1>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">
            ✅ If you see this page, the routing is working correctly!
          </p>
          <p className="text-xs mt-2">
            URL Token: {window.location.pathname.split('/').pop()}
          </p>
        </div>
        <p className="text-center text-gray-600">
          This confirms that the React Router is properly handling the reset-password route.
        </p>
      </div>
    </div>
  );
}