import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose, autoClose = true }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info
  };

  const Icon = icons[type];

  return (
    <div className={`
      fixed top-4 right-4 z-50 apple-card max-w-sm
      ${typeStyles[type]}
      transition-all duration-300 transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
