import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'border-[#872657]',
  className = '',
}) => {
  const sizeClass = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }[size];

  return (
    <div
      className={`animate-spin rounded-full ${sizeClass} border-b-${color} ${className}`}
      role="status"
      aria-label="Loading"
    ></div>
  );
};

interface LoadingOverlayProps {
  message?: string;
  isFullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  isFullScreen = false 
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-white bg-opacity-80 z-50 ${isFullScreen ? 'fixed inset-0' : 'absolute inset-0'}`}
    >
      <LoadingSpinner size="lg" />
      {message && <p className="mt-4 text-gray-700 font-medium">{message}</p>}
    </div>
  );
};

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry, 
  className = '' 
}) => {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-md text-red-800 ${className}`}>
      <p className="mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`p-4 bg-green-50 border border-green-200 rounded-md text-green-800 ${className}`}>
      <p>{message}</p>
    </div>
  );
};
