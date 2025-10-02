export default function NotFound() {
  // Debug logging
  console.log('NotFound component loaded');
  console.log('Current URL:', window.location.href);
  console.log('Pathname:', window.location.pathname);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      {/* DEBUG SECTION */}
      <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-2 z-50">
        <strong>❌ DEBUG: NotFound Component Loaded!</strong><br/>
        URL: {window.location.pathname}
      </div>
      
      <h1 className="text-5xl md:text-5xl font-semibold text-gray-100">404</h1>
      <h1 className="text-2xl md:text-3xl font-semibold mt-6">This page has not been generated</h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-500">Tell me what you would like on this page</p>
    </div>
  );
}