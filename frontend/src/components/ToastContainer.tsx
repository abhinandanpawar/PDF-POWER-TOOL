import React from 'react';
import { useToasts } from '../hooks/useToasts';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts } = useToasts();

  return (
    <div aria-live="assertive" className="fixed top-5 right-5 z-50 space-y-3 w-full max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;