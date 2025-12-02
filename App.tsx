import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { GuideBubble } from './components/GuideBubble';
import { AiMentor } from './components/features/AiMentor';
import { BibleExplain } from './components/features/BibleExplain';
import { Journal } from './components/features/Journal';
import { SilenceMode } from './components/features/SilenceMode';
import { StatsView } from './components/features/StatsView'; // Updated import
import { UserProfile, Habit } from './types';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [isGuideActive, setIsGuideActive] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Ler o Salmo 23 em voz alta', completed: false, type: 'reading' },
    { id: '2', title: 'Orar 2 min por sua família', completed: false, type: 'prayer' },
    { id: '3', title: 'Agradecer por 3 coisas simples', completed: false, type: 'other' },
  ]);

  useEffect(() => {
    // Check local storage for user profile
    const savedUser = localStorage.getItem('user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('user_profile', JSON.stringify(updatedUser));
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    handleUpdateUser(profile);
    // Trigger guide on first login
    setTimeout(() => setIsGuideActive(true), 1000);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
    if (user) {
        // Add minimal points for habit completion
        const newScore = user.stats.intimacy + 2; // slightly increased for dopamine
        handleUpdateUser({...user, stats: {...user.stats, intimacy: newScore}});
    }
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Calculate descriptive level
  const getLevelTitle = (intimacy: number) => {
    if (intimacy < 300) return "Semente";
    if (intimacy < 600) return "Raíz Fortalecida";
    return "Árvore Frutífera";
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return <Dashboard user={user} habits={habits} onToggleHabit={handleToggleHabit} setTab={setCurrentTab} onUpdateUser={handleUpdateUser} />;
      case 'mentor':
        return <AiMentor />;
      case 'bible':
        return <BibleExplain />;
      case 'journal':
        return <Journal />;
      case 'stats': // New Tab Case
        return <StatsView user={user} />;
      case 'silence':
        // Now accessible as a tab, but uses the same full-screen overlay component
        return <SilenceMode onClose={() => setCurrentTab('home')} />;
      case 'profile':
        return (
          <div className="p-8 pt-12">
            <h2 className="font-serif text-3xl font-bold text-beige-900 mb-6">Perfil</h2>
            <div className="bg-white p-6 rounded-3xl shadow-sm mb-6">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-beige-200 rounded-full flex items-center justify-center text-2xl font-serif text-beige-900 font-bold">
                   {user.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-beige-900">{user.name}</h3>
                   <p className="text-sm text-gray-500">Membro desde 2024</p>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="bg-beige-50 p-3 rounded-xl">
                   <p className="text-2xl font-bold text-gold-500">{user.stats.streak}</p>
                   <p className="text-xs text-gray-500 font-medium">Dias Seguidos</p>
                 </div>
                 <div className="bg-beige-50 p-3 rounded-xl">
                    <p className="text-sm font-bold text-gold-500 pt-2">{getLevelTitle(user.stats.intimacy)}</p>
                    <p className="text-xs text-gray-500 font-medium">Jornada Atual</p>
                 </div>
               </div>
            </div>
            
            <button 
              onClick={() => setCurrentTab('silence')}
              className="w-full bg-beige-900 text-white p-4 rounded-2xl mb-4 shadow-md font-bold"
            >
              Modo Silêncio
            </button>
            
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full text-red-400 p-4 font-medium"
            >
              Sair / Resetar App
            </button>
          </div>
        );
      default:
        return <Dashboard user={user} habits={habits} onToggleHabit={handleToggleHabit} setTab={setCurrentTab} onUpdateUser={handleUpdateUser} />;
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-beige-900 bg-[#F8F3EA] max-w-md mx-auto shadow-2xl overflow-hidden sm:border-x border-beige-300">
      {renderContent()}
      
      {currentTab !== 'silence' && (
        <>
          <Navigation currentTab={currentTab} setTab={setCurrentTab} />
          <GuideBubble 
            onStartGuide={() => setIsGuideActive(true)}
            isActive={isGuideActive}
            onClose={() => setIsGuideActive(false)}
          />
        </>
      )}
    </div>
  );
}

export default App;