'use client';

import React from 'react';
import { TbLoader3 } from 'react-icons/tb';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  text?: string;
  className?: string;
}

/**
 * Enhanced reusable Loader component with multiple size options
 * Backward compatible with existing usage
 */
const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullPage = false,
  text,
  className = '',
}) => {
  const sizeMap = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <TbLoader3 className="animate-spin text-blue-600" size={sizeMap[size]} />
        {text && <p className="text-gray-600 font-medium">{text}</p>}
      </div>
    </div>
  );
};

// Backward compatibility export
export const LoaderComponent = Loader;

export default Loader;
