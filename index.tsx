import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './hooks/useToasts';
import { LoadingProvider } from './hooks/useLoading';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element with id 'root'");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </ToastProvider>
  </React.StrictMode>
);