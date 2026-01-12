import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const init = () => {
  const container = document.getElementById('root');
  if (container) {
    try {
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log("App mounted successfully on React 18.2.0");
    } catch (error) {
      console.error("Mounting error:", error);
      container.innerHTML = `<div style="padding: 20px; color: red;">Failed to load app. Check console for details.</div>`;
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}