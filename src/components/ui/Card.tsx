import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;
