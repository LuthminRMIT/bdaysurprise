
import React from 'react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, onClick, delay = '0s' }) => {
  return (
    <div 
      className="group cursor-pointer transform transition-all duration-300 hover:scale-110 animate-bounce-gentle"
      style={{ animationDelay: delay }}
      onClick={onClick}
    >
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center border-4 border-kitty-lightPink hover:border-kitty-pink hover:shadow-2xl transition-all duration-300">
        <div className="mb-6 flex justify-center group-hover:animate-wiggle">
          {icon}
        </div>
        <h3 className="text-xl font-bold font-cute text-kitty-pink group-hover:text-kitty-red transition-colors duration-300">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default SectionCard;
