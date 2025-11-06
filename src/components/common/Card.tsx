'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
