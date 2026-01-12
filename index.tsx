import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  console.error("Critical Error: Root element #root not found.");
} else {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("PowerBill Pro: Successfully initialized on React 18.2.0");
  } catch (err) {
    console.error("Fatal: Failed to render the application.", err);
    container.innerHTML = `<div style="padding: 2rem; color: #ef4444; font-family: sans-serif;">
      <h1 style="font-size: 1.25rem; font-weight: bold;">Application Error</h1>
      <p style="margin-top: 0.5rem; color: #64748b;">The application failed to start. This might be due to a script loading error or an incompatible browser.</p>
    </div>`;
  }
}