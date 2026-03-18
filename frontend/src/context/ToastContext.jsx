import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: '', type: '' });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        duration={toast.duration || 3000}
        onClose={closeToast}
      />
    </ToastContext.Provider>
  );
};
