
import React from 'react';
import { Heart } from 'lucide-react';

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <Heart 
        className="absolute top-20 left-10 text-kitty-pink animate-float opacity-30" 
        size={20}
        style={{ animationDelay: '0s' }}
      />
      <Heart 
        className="absolute top-40 right-20 text-kitty-red animate-float opacity-20" 
        size={16}
        style={{ animationDelay: '1s' }}
      />
      <Heart 
        className="absolute bottom-32 left-1/4 text-kitty-lightPink animate-float opacity-25" 
        size={18}
        style={{ animationDelay: '2s' }}
      />
      <Heart 
        className="absolute top-60 right-1/3 text-kitty-pink animate-float opacity-30" 
        size={14}
        style={{ animationDelay: '3s' }}
      />
      <Heart 
        className="absolute bottom-20 right-10 text-kitty-red animate-float opacity-20" 
        size={22}
        style={{ animationDelay: '4s' }}
      />
    </div>
  );
};

export default FloatingHearts;
