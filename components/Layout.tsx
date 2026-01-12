import React from 'react';
import { Zap, Home, LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Zap className="h-6 w-6 text-yellow-300" />
            <span className="font-bold text-xl tracking-tight">PowerBill</span>
          </div>
          
          {!isHome && (
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-blue-700 rounded-full transition-colors"
              aria-label="Go Home"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} PowerBill Manager. Helps you manage utility bills effortlessly.</p>
      </footer>
    </div>
  );
};

export default Layout;
