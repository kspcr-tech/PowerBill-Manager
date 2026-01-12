import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const startApp = () => {
  const container = document.getElementById('root');
  if (!container) return;
  
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}