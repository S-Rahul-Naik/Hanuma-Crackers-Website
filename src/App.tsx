import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { AuthProvider } from './auth/AuthContext'
import { useEffect } from 'react';


function App() {
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;
    fetch(`${API_URL}/api/products?limit=1`).catch(() => {});
  }, []);
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App