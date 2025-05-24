
import React, { useState } from 'react';
import SectionCard from '../components/SectionCard';
import PixelIcon from '../components/PixelIcon';
import FloatingHearts from '../components/FloatingHearts';
import { Heart } from 'lucide-react';

const Index = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections = [
    { id: 'gift', title: 'Gift Garden', icon: 'gift' as const, delay: '0s' },
    { id: 'photo', title: 'Our Photo Album', icon: 'camera' as const, delay: '0.2s' },
    { id: 'date', title: 'Sweet Date Plan', icon: 'castle' as const, delay: '0.4s' },
    { id: 'playlist', title: 'Our Playlist', icon: 'music' as const, delay: '0.6s' },
    { id: 'love', title: 'Love Letter', icon: 'heart' as const, delay: '0.8s' },
  ];

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    // Add a cute notification
    console.log(`Opening ${sectionId} section! ✨`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kitty-lightPink via-kitty-softPink to-kitty-white relative overflow-hidden">
      <FloatingHearts />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 animate-heart-beat">
        <Heart className="text-kitty-red opacity-40" size={30} />
      </div>
      <div className="absolute top-20 right-20 animate-pulse-pink">
        <Heart className="text-kitty-pink opacity-30" size={25} />
      </div>
      
      {/* Header */}
      <div className="text-center pt-16 pb-12">
        <h1 className="text-6xl font-bold font-cute text-kitty-pink animate-bounce-gentle mb-4">
          Hello Kitty
        </h1>
        <div className="flex justify-center items-center gap-2">
          <Heart className="text-kitty-red animate-heart-beat" size={20} />
          <p className="text-2xl font-cute text-kitty-red">Kawaii Website</p>
          <Heart className="text-kitty-red animate-heart-beat" size={20} />
        </div>
        <div className="mt-4 flex justify-center">
          <div className="bg-white rounded-full px-6 py-2 shadow-lg border-2 border-kitty-pink">
            <span className="text-kitty-pink font-cute font-semibold">✨ Welcome to our cute world! ✨</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {sections.map((section) => (
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
        {selectedSection && (
          <div className="mt-12 text-center animate-bounce-gentle">
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
      
      {/* More floating decorations */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="text-6xl">🎀</div>
      </div>
    </div>
  );
};

export default Index;
