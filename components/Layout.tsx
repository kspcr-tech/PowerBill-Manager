import React, { useState } from 'react';
import { Zap, Settings, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SettingsModal } from './SettingsModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isHome && (
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                PowerBill <span className="text-slate-400 font-light">Pro</span>
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full p-4">
        {children}
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs border-t bg-white/50">
        <p>© 2024 PowerBill Manager Pro • Secure Local Storage Only</p>
      </footer>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};