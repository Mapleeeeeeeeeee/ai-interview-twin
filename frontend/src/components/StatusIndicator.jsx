import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const StatusIndicator = ({ 
  status = 'online', 
  showText = true, 
  size = 'sm' 
}) => {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      text: '可進行面試',
      icon: Wifi,
      textColor: 'text-green-600'
    },
    offline: {
      color: 'bg-gray-400',
      text: '離線',
      icon: WifiOff,
      textColor: 'text-gray-500'
    },
    busy: {
      color: 'bg-red-500',
      text: '忙碌中',
      icon: null,
      textColor: 'text-red-600'
    },
    typing: {
      color: 'bg-blue-500',
      text: '正在輸入...',
      icon: null,
      textColor: 'text-blue-600'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center">
      <div className={`
        ${sizeClasses[size]} ${config.color} rounded-full
        ${status === 'typing' ? 'animate-pulse' : ''}
        ${status === 'online' ? 'animate-pulse' : ''}
      `} />
      
      {showText && (
        <div className="ml-2 flex items-center">
          {Icon && <Icon className="w-4 h-4 mr-1" />}
          <span className={`text-sm ${config.textColor}`}>
            {config.text}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
