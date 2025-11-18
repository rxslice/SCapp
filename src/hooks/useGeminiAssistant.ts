import React, { useEffect } from 'react';
import { ExclamationIcon, CloseIcon } from './Icons';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const style = {
    error: {
      bg: 'bg-error',
      iconColor: 'text-white',
    },
    success: {
      bg: 'bg-success',
      iconColor: 'text-white',
    }
  };

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

export default Toast;