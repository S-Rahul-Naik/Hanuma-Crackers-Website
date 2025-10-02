import { Link } from 'react-router-dom';

interface FooterPageLayoutProps {
  title: string;
  children: React.ReactNode;
  lastUpdated?: string;
}

export default function FooterPageLayout({ title, children, lastUpdated }: FooterPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Pacifico", serif' }}>
                Hanuma Crackers
              </h1>
            </Link>
            <h2 className="text-4xl font-bold mb-4">{title}</h2>
            <div className="w-24 h-1 bg-yellow-300 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {children}
          </div>
          
          {lastUpdated && (
            <div className="text-center mt-8">
              <p className="text-gray-600 text-sm">
                Last updated: {lastUpdated}
              </p>
            </div>
          )}
          
          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium"
            >
              <i className="ri-home-line mr-2"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}