import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingSpinner = ({ message = '載入中...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-white animate-spin`} />
        <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <p className={`text-white/80 mt-4 ${textSizeClasses[size]} font-medium`}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
