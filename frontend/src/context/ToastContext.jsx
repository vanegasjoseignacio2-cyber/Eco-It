import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message:  '',
    type:     '',
    duration: 3000,
    action:   null, // { label: string, onClick: () => void }
  });

  /**
   * showToast(message, type?, duration?, action?)
   *  - type     : 'success' | 'info' | 'warning' | 'error'
   *  - duration : ms; 0 = no se cierra automáticamente
   *  - action   : { label: string, onClick: () => void }
   */
  const showToast = useCallback((message, type = 'success', duration = 3000, action = null) => {
    setToast({ message, type, duration, action });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: '', type: '', duration: 3000, action: null });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        action={toast.action}
        onClose={closeToast}
      />
    </ToastContext.Provider>
  );
};