import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-base-100 p-8 rounded-2xl shadow-lg transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;