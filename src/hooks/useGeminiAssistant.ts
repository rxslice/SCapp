import React, { useState, useCallback, useMemo } from 'react';
// Assuming Icons are imported from the same directory or a common Icons file
import { ExclamationIcon, CloseIcon } from '../components/Icons'; 

// --- Toast Component (Moved and Renamed for clarity) ---

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
  isVisible: boolean;
}

const NotificationToastComponent: React.FC<ToastProps> = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const style = useMemo(() => ({
    error: {
      bg: 'bg-red-600', // Using standard Tailwind class for error
      iconColor: 'text-white',
    },
    success: {
      bg: 'bg-green-600', // Using standard Tailwind class for success
      iconColor: 'text-white',
    }
  }), []);

  return (
    <div className={`fixed bottom-24 right-8 z-50 flex items-center gap-4 p-6 rounded-xl shadow-2xl text-white text-2xl ${style[type].bg} transform transition-all duration-300 animate-slide-in`}>
      <span className={`w-8 h-8 ${style[type].iconColor}`}><ExclamationIcon /></span>
      <span>{message}</span>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20" aria-label="Close notification">
        <span className="w-6 h-6 block"><CloseIcon /></span>
      </button>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s forwards;
        }
      `}</style>
    </div>
  );
};


// --- Custom Hook ---

export const useGeminiAssistant = () => {
  const [notification, setNotification] = useState<Omit<ToastProps, 'isVisible' | 'onClose'> & { isVisible: boolean }>({
    message: '',
    type: 'info', // Using info as a default type here
    isVisible: false,
  });

  const showNotification = useCallback((message: string, type: ToastProps['type'] = 'success') => {
    setNotification({ message, type, isVisible: true });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  // This is the component that the hook returns, which is used in the main App.tsx
  const ToastComponent = useCallback(() => (
    <NotificationToastComponent
      message={notification.message}
      type={notification.type as 'error' | 'success'} // Cast to known types
      onClose={clearNotification}
      isVisible={notification.isVisible}
    />
  ), [notification.message, notification.type, notification.isVisible, clearNotification]);


  // IMPORTANT: The hook returns functions and the component renderer.
  return { showNotification, ToastComponent }; 
};