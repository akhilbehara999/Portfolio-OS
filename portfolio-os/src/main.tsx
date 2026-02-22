import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { enableMapSet } from 'immer';

// Import Global Styles
import './styles/globals.css';

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

  // Service Worker Registration
  // Handled by vite-plugin-pwa automatically, but we can add custom logic here if needed.
}
