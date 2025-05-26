
import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';

interface LoveLetterProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoveLetter: React.FC<LoveLetterProps> = ({ isOpen, onClose }) => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  const handleEnvelopeClick = () => {
    setIsEnvelopeOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {!isEnvelopeOpen ? (
          // Floating Envelope
          <div 
            className="cursor-pointer transform transition-all duration-500 hover:scale-110 animate-float"
            onClick={handleEnvelopeClick}
          >
            <div className="relative bg-white rounded-lg shadow-2xl p-8 border-4 border-kitty-pink">
              {/* Envelope Body */}
              <div className="w-80 h-56 bg-gradient-to-br from-kitty-lightPink to-kitty-softPink rounded-lg relative overflow-hidden">
                {/* Envelope Flap */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-kitty-pink transform origin-top transition-transform duration-300">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    {/* Heart Seal */}
                    <div className="bg-kitty-red rounded-full p-3 shadow-lg border-2 border-white">
                      <Heart className="text-white" size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>
                
                {/* Envelope Content Hint */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-kitty-red font-cute text-lg font-semibold">
                    💕 Click to open! 💕
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Opened Letter
          <div className="transform transition-all duration-700 animate-scale-in">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-kitty-pink max-w-2xl relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-kitty-lightPink hover:bg-kitty-pink transition-colors"
              >
                <X className="text-kitty-red" size={20} />
              </button>

              {/* Letter Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Heart className="text-kitty-red animate-heart-beat" size={24} fill="currentColor" />
                  <h2 className="text-3xl font-cute font-bold text-kitty-pink">Love Letter</h2>
                  <Heart className="text-kitty-red animate-heart-beat" size={24} fill="currentColor" />
                </div>
                <div className="w-20 h-1 bg-kitty-pink mx-auto rounded-full"></div>
              </div>

              {/* Letter Content */}
              <div className="space-y-6 text-kitty-red font-cute text-lg leading-relaxed">
                <p className="text-center text-xl font-semibold">
                  My Dearest Jiya 💖
                </p>
                
                <p>
                  Every day with you feels like a magical adventure in our own kawaii world! 
                  Your smile brightens my days like the prettiest cherry blossoms in spring. 🌸
                </p>
                
                <p>
                  You make my heart go *doki doki* just like in our favorite anime! 
                  When you laugh, it sounds like the sweetest melody that even Hello Kitty would be jealous of! 
                </p>
                
                <p>
                  I love how we can be silly together, share our dreams, and create the most 
                  adorable memories. You're my favorite person in this whole wide world! 💕
                </p>
                
                <p className="text-center font-bold text-xl">
                  You're absolutely perfect, and I love you more than all the stars in the sky! ✨
                </p>
                
                <div className="text-center mt-8">
                  <p className="text-kitty-pink font-semibold">
                    Forever yours,
                  </p>
                  <p className="text-2xl font-bold text-kitty-red mt-2">
                    Your Loving Partner 💝
                  </p>
                </div>
                
                {/* Decorative Hearts */}
                <div className="flex justify-center gap-4 mt-6">
                  <Heart className="text-kitty-pink animate-pulse" size={16} fill="currentColor" />
                  <Heart className="text-kitty-red animate-pulse" size={20} fill="currentColor" style={{ animationDelay: '0.5s' }} />
                  <Heart className="text-kitty-lightPink animate-pulse" size={16} fill="currentColor" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveLetter;
