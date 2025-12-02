import React from 'react';
import { Home, BookOpen, MessageCircleHeart, PenTool, User, BarChart2 } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'bible', icon: BookOpen, label: 'Bíblia', tourId: 'nav-bible' },
    { id: 'mentor', icon: MessageCircleHeart, label: 'Mentor', tourId: 'nav-mentor' },
    { id: 'stats', icon: BarChart2, label: 'Evolução', tourId: 'stats-card' }, // New 6th Section
    { id: 'journal', icon: PenTool, label: 'Diário', tourId: 'nav-journal' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-beige-200 pb-safe pt-2 px-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-40 rounded-t-[30px]">
      <div className="flex justify-between items-center h-16">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={item.tourId}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 h-12 transition-all duration-300 ${
                isActive ? 'text-gold-500 -translate-y-2' : 'text-gray-400'
              }`}
            >
              <div className={`p-2 rounded-2xl ${isActive ? 'bg-beige-100 shadow-sm' : ''}`}>
                <item.icon size={isActive ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {isActive && (
                <span className="text-[9px] font-bold mt-1 tracking-wide">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};