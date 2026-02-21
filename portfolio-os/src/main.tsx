import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { enableMapSet } from 'immer';

// Import Global Styles
import './styles/globals.css';
import './styles/tailwind-extensions.css';

import App from './App.tsx';

// Initialize Immer MapSet support for Zustand stores
enableMapSet();

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  // Performance Monitoring (Placeholder for Web Vitals)
  const reportWebVitals = (onPerfEntry?: any) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
      }).catch((err) => {
        console.warn('Web Vitals not installed', err);
      });
    }
  };

  // Usage: reportWebVitals(console.log);

  // Service Worker Registration (Placeholder)
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      // navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registration skipped (not implemented)');
    });
  }
}
