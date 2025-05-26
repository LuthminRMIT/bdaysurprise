import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionCard from '../components/SectionCard';
import PixelIcon from '../components/PixelIcon';
import FloatingHearts from '../components/FloatingHearts';
import LoveLetter from '../components/LoveLetter';
import GiftGarden from '../components/GiftGarden';
import { Heart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isLoveLetterOpen, setIsLoveLetterOpen] = useState(false);
  const [isGiftGardenOpen, setIsGiftGardenOpen] = useState(false);

  const sections = [
    {
      id: 'gift',
      title: 'Gift Garden',
      icon: 'gift' as const,
      delay: '0s'
    },
    {
      id: 'photo',
      title: 'Our Photo Album',
      icon: 'camera' as const,
      delay: '0.2s'
    },
    {
      id: 'date',
      title: 'Sweet Date Plan',
      icon: 'castle' as const,
      delay: '0.4s'
    },
    {
      id: 'playlist',
      title: 'Our Playlist',
      icon: 'music' as const,
      delay: '0.6s'
    },
    {
      id: 'love',
      title: 'Love Letter',
      icon: 'heart' as const,
      delay: '0.8s'
    }
  ];

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    console.log(`Opening ${sectionId} section! ✨`);
    
    if (sectionId === 'love') {
      setIsLoveLetterOpen(true);
    } else if (sectionId === 'gift') {
      setIsGiftGardenOpen(true);
    } else if (sectionId === 'playlist') {
      navigate('/playlist');
    }
  };

  const handleCloseLoveLetter = () => {
    setIsLoveLetterOpen(false);
    setSelectedSection(null);
  };

  const handleCloseGiftGarden = () => {
    setIsGiftGardenOpen(false);
    setSelectedSection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitty-lightPink via-kitty-softPink to-kitty-white relative overflow-hidden flex flex-col items-center">
      <FloatingHearts />
      
      {/* Waving Hello Kitty in corner */}
      <div className="absolute top-10 right-10 animate-wiggle">
        <div className="text-6xl">👋🐱</div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 animate-heart-beat">
        <Heart className="text-kitty-red opacity-40" size={30} />
      </div>
      <div className="absolute top-20 right-32 animate-pulse-pink">
        <Heart className="text-kitty-pink opacity-30" size={25} />
      </div>
      
      {/* Header */}
      <div className="text-center pt-16 pb-12">
        <h1 className="text-6xl font-bold font-cute text-kitty-pink mb-4">HELLO JIYA!</h1>
        <div className="flex justify-center items-center gap-2">
          <Heart className="text-kitty-red animate-heart-beat" size={20} />
          <p className="text-2xl font-cute text-kitty-red">You're So Sexyyy</p>
          <Heart className="text-kitty-red animate-heart-beat" size={20} />
        </div>
        <div className="mt-4 flex justify-center">
          <div className="bg-white rounded-full px-6 py-2 shadow-lg border-2 border-kitty-pink">
            <span className="text-kitty-pink font-cute font-semibold">✨ Welcome to our cute world! ✨</span>
          </div>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
          {sections.map(section => (
            <SectionCard
              key={section.id}
              title={section.title}
              icon={<PixelIcon type={section.icon} />}
              onClick={() => handleSectionClick(section.id)}
              delay={section.delay}
            />
          ))}
        </div>

        {/* Fun interactive message */}
        {selectedSection && selectedSection !== 'love' && selectedSection !== 'gift' && selectedSection !== 'playlist' && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-kitty-pink inline-block">
              <p className="text-kitty-pink font-cute text-xl font-bold">
                🌸 You clicked on {sections.find(s => s.id === selectedSection)?.title}! 🌸
              </p>
              <p className="text-kitty-red font-cute mt-2">
                Coming soon with lots of kawaii content! ✨
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-kitty-pink to-transparent opacity-20"></div>
      
      {/* Bottom decoration */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="text-6xl">🎀</div>
      </div>

      {/* Love Letter Modal */}
      <LoveLetter isOpen={isLoveLetterOpen} onClose={handleCloseLoveLetter} />
      
      {/* Gift Garden Modal */}
      <GiftGarden isOpen={isGiftGardenOpen} onClose={handleCloseGiftGarden} />
    </div>
  );
};

export default Index;
