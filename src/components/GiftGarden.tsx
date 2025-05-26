
import React, { useState } from 'react';
import { X, Gift } from 'lucide-react';

interface GiftGardenProps {
  isOpen: boolean;
  onClose: () => void;
}

const GiftGarden: React.FC<GiftGardenProps> = ({ isOpen, onClose }) => {
  const [isPresentOpen, setIsPresentOpen] = useState(false);

  const handlePresentClick = () => {
    setIsPresentOpen(true);
  };

  if (!isOpen) return null;

  const tickets = [
    { id: 1, title: "Unlimited Kisses 💋", emoji: "💋", color: "from-pink-300 to-pink-500" },
    { id: 2, title: "Unlimited Hugs 🤗", emoji: "🤗", color: "from-purple-300 to-purple-500" },
    { id: 3, title: "Unlimited Snacks 🍿", emoji: "🍿", color: "from-yellow-300 to-yellow-500" },
    { id: 4, title: "Unlimited J's ✨", emoji: "✨", color: "from-blue-300 to-blue-500" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {!isPresentOpen ? (
          // Animated Present Box
          <div 
            className="cursor-pointer transform transition-all duration-500 hover:scale-110 animate-float"
            onClick={handlePresentClick}
          >
            <div className="relative bg-white rounded-lg shadow-2xl p-8 border-4 border-kitty-pink">
              {/* Present Box */}
              <div className="w-80 h-64 bg-gradient-to-br from-kitty-pink to-kitty-red rounded-lg relative overflow-hidden">
                {/* Present Body */}
                <div className="absolute inset-4 bg-kitty-lightPink rounded-lg">
                  {/* Ribbon Vertical */}
                  <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-8 bg-kitty-yellow"></div>
                  {/* Ribbon Horizontal */}
                  <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-8 bg-kitty-yellow"></div>
                  {/* Bow */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="text-4xl animate-pulse">🎀</div>
                  </div>
                </div>
                
                {/* Click instruction */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white font-cute text-lg font-semibold drop-shadow-lg">
                    🎁 Click to open your gifts! 🎁
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Opened Present with Tickets
          <div className="transform transition-all duration-700 animate-scale-in">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-kitty-pink max-w-4xl relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-kitty-lightPink hover:bg-kitty-pink transition-colors"
              >
                <X className="text-kitty-red" size={20} />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Gift className="text-kitty-red animate-heart-beat" size={32} />
                  <h2 className="text-4xl font-cute font-bold text-kitty-pink">Gift Garden</h2>
                  <Gift className="text-kitty-red animate-heart-beat" size={32} />
                </div>
                <p className="text-kitty-red font-cute text-xl">
                  🌸 Special tickets just for you, my love! 🌸
                </p>
                <div className="w-24 h-1 bg-kitty-pink mx-auto rounded-full mt-4"></div>
              </div>

              {/* Tickets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket, index) => (
                  <div 
                    key={ticket.id}
                    className="transform transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={`bg-gradient-to-r ${ticket.color} rounded-2xl p-6 shadow-lg border-2 border-white relative overflow-hidden`}>
                      {/* Ticket perforations */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white opacity-50 border-l-2 border-dashed border-white"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50 border-r-2 border-dashed border-white"></div>
                      
                      <div className="text-center">
                        <div className="text-4xl mb-3 animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
                          {ticket.emoji}
                        </div>
                        <h3 className="text-white font-cute font-bold text-lg mb-2">
                          {ticket.title}
                        </h3>
                        <div className="bg-white rounded-full px-4 py-1 inline-block">
                          <span className="text-gray-700 font-cute font-semibold text-sm">
                            Valid Forever ♾️
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom message */}
              <div className="text-center mt-8">
                <div className="bg-gradient-to-r from-kitty-lightPink to-kitty-softPink rounded-2xl p-4 border-2 border-kitty-pink">
                  <p className="text-kitty-red font-cute text-lg font-semibold">
                    💕 Redeem anytime with your favorite person! 💕
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftGarden;
