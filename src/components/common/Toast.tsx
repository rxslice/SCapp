import React from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-base-100 rounded-2xl shadow-2xl p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'scale-in 0.3s forwards' }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-primary">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-base-200 text-neutral" aria-label="Close modal">
            <span className="w-8 h-8 block"><CloseIcon /></span>
          </button>
        </div>
        <div>{children}</div>
      </div>
       <style>{`
        @keyframes scale-in {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;