
import React from 'react';

interface PixelIconProps {
  type: 'gift' | 'camera' | 'castle' | 'music' | 'heart';
  size?: number;
}

const PixelIcon: React.FC<PixelIconProps> = ({ type, size = 80 }) => {
  const getPixelArt = () => {
    switch (type) {
      case 'gift':
        return (
          <svg width={size} height={size} viewBox="0 0 16 16" className="pixelated">
            <rect x="2" y="6" width="12" height="8" fill="#FF69B4"/>
            <rect x="3" y="7" width="10" height="6" fill="#FFB6C1"/>
            <rect x="7" y="2" width="2" height="12" fill="#FF1493"/>
            <rect x="5" y="4" width="6" height="2" fill="#FF1493"/>
            <rect x="6" y="3" width="4" height="1" fill="#FF1493"/>
          </svg>
        );
      case 'camera':
        return (
          <svg width={size} height={size} viewBox="0 0 16 16" className="pixelated">
            <rect x="2" y="5" width="12" height="8" fill="#FF69B4"/>
            <rect x="3" y="6" width="10" height="6" fill="#FFB6C1"/>
            <rect x="6" y="8" width="4" height="2" fill="#333"/>
            <rect x="2" y="3" width="4" height="2" fill="#FF1493"/>
            <rect x="10" y="3" width="4" height="2" fill="#FF1493"/>
          </svg>
        );
      case 'castle':
        return (
          <svg width={size} height={size} viewBox="0 0 16 16" className="pixelated">
            <rect x="3" y="8" width="10" height="6" fill="#FF69B4"/>
            <rect x="4" y="9" width="8" height="4" fill="#FFB6C1"/>
            <rect x="2" y="4" width="2" height="4" fill="#FF1493"/>
            <rect x="12" y="4" width="2" height="4" fill="#FF1493"/>
            <rect x="7" y="6" width="2" height="6" fill="#FF1493"/>
            <rect x="6" y="11" width="4" height="2" fill="#333"/>
          </svg>
        );
      case 'music':
        return (
          <svg width={size} height={size} viewBox="0 0 16 16" className="pixelated">
            <rect x="3" y="10" width="4" height="4" fill="#FF69B4"/>
            <rect x="9" y="8" width="4" height="4" fill="#FF69B4"/>
            <rect x="6" y="2" width="2" height="10" fill="#FF1493"/>
            <rect x="8" y="2" width="4" height="2" fill="#FF1493"/>
          </svg>
        );
      case 'heart':
        return (
          <svg width={size} height={size} viewBox="0 0 16 16" className="pixelated">
            <rect x="3" y="4" width="2" height="2" fill="#FF1493"/>
            <rect x="11" y="4" width="2" height="2" fill="#FF1493"/>
            <rect x="2" y="6" width="4" height="2" fill="#FF69B4"/>
            <rect x="10" y="6" width="4" height="2" fill="#FF69B4"/>
            <rect x="3" y="8" width="10" height="2" fill="#FF69B4"/>
            <rect x="5" y="10" width="6" height="2" fill="#FF69B4"/>
            <rect x="7" y="12" width="2" height="2" fill="#FF69B4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getPixelArt()}
    </div>
  );
};

export default PixelIcon;
