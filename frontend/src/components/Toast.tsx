import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { useToasts } from '../hooks/useToasts';

interface ToastProps {
  toast: ToastMessage;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToasts();
  const { id, type, message } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [id, removeToast]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  }[type];

  const Icon = () => {
    switch(type) {
      case 'success':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case 'error':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'info':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
    return null;
  };

  return (
    <div className={`flex items-center text-white p-4 rounded-lg shadow-lg ${bgColor} animate-fade-in-right`}>
      <div className="flex-shrink-0">
        <Icon />
      </div>
      <div className="ml-3 text-sm font-medium">
        {message}
      </div>
      <button onClick={() => removeToast(id)} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full inline-flex hover:bg-white/20 transition-colors">
        <span className="sr-only">Dismiss</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default Toast;