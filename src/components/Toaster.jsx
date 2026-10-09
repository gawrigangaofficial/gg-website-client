import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

// Toast Context
const ToastContext = createContext(null);

// Fast Refresh boundary - component exports

// Toast Provider Component
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const success = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="pointer-events-none fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-50 flex w-full max-w-md flex-col-reverse gap-3 px-4 sm:w-auto sm:px-0 md:bottom-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

// Individual Toast Item
const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id]);

  const getToastStyles = () => {
    const baseStyles = 'pointer-events-auto bg-white rounded-lg shadow-2xl border-2 p-4 sm:p-5 flex items-start gap-3 transition-all duration-300 transform backdrop-blur-sm';
    
    const typeStyles = {
      success: 'border-primary bg-primary/10 shadow-primary/20',
      error: 'border-red-500 bg-red-50 shadow-red-500/20',
      warning: 'border-yellow-500 bg-yellow-50 shadow-yellow-500/20',
      info: 'border-primary bg-primary/10 shadow-primary/20'
    };

    const animationStyles = isExiting 
      ? 'opacity-0 translate-y-full translate-x-full scale-95' 
      : 'opacity-100 translate-y-0 translate-x-0 scale-100';

    return `${baseStyles} ${typeStyles[toast.type] || typeStyles.info} ${animationStyles}`;
  };

  const getIcon = () => {
    const iconClass = 'text-xl sm:text-2xl shrink-0 mt-0.5';
    switch (toast.type) {
      case 'success':
        return <FaCheckCircle className={`${iconClass} text-primary`} />;
      case 'error':
        return <FaExclamationCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <FaExclamationTriangle className={`${iconClass} text-yellow-600`} />;
      case 'info':
      default:
        return <FaInfoCircle className={`${iconClass} text-primary`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="flex-1 min-w-0">
        <p className={`text-sm sm:text-base font-semibold ${
          toast.type === 'success' || toast.type === 'info' 
            ? 'text-primary' 
            : toast.type === 'error'
            ? 'text-red-700'
            : 'text-yellow-700'
        }`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={handleRemove}
        className={`shrink-0 transition-colors p-1 rounded hover:bg-black/5 ${
          toast.type === 'success' || toast.type === 'info'
            ? 'text-primary hover:text-primary/80'
            : toast.type === 'error'
            ? 'text-red-600 hover:text-red-700'
            : 'text-yellow-600 hover:text-yellow-700'
        }`}
        aria-label="Close toast"
      >
        <FaTimes className="text-base sm:text-lg" />
      </button>
    </div>
  );
};

// Export for Fast Refresh compatibility
export { ToastProvider, useToast };
export default ToastProvider;
