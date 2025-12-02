import React, { useState, useEffect } from 'react';
import { UserProfile, Habit } from '../types';
import { Sun, CheckCircle, Flame, Battery, TrendingUp, Bell, HelpCircle, X, ChevronRight, MessageCircle } from 'lucide-react';
import { DailyDevotionalView } from './features/DailyDevotionalView';
import { RestorationPlan } from './features/RestorationPlan';
import confetti from 'canvas-confetti';

interface DashboardProps {
  user: UserProfile;
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  setTab: (tab: string) => void;
  onUpdateUser: (u: UserProfile) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, habits, onToggleHabit, setTab, onUpdateUser }) => {
  const [showDevotional, setShowDevotional] = useState(false);
  const [showHabitHelp, setShowHabitHelp] = useState(false);
  const [showRestorationPlan, setShowRestorationPlan] = useState(false);
  
  // Persistence Logic: Check if devotional was done today
  const todayStr = new Date().toLocaleDateString('pt-BR');
  const isDevotionalDoneToday = user.lastDevotionalDate === todayStr;

  // Slower Growth Logic (0 to 1000 scale visually mapped to %)
  const currentGrowthPercent = Math.min(100, Math.floor(user.stats.intimacy / 10)); // 1000 points = 100%

  const handleDevotionalComplete = () => {
     // Save completion date and add points
     const newStats = { 
        ...user.stats, 
        intimacy: user.stats.intimacy + 5,
        comprehension: user.stats.comprehension + 2
     };
     onUpdateUser({ 
        ...user, 
        stats: newStats,
        lastDevotionalDate: todayStr 
     });
  };

  const handleHabitClick = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (habit && !habit.completed) {
      // Dopamine hit!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#C6A46A', '#F8F3EA', '#5A4D3B']
      });
    }
    onToggleHabit(id);
  };

  return (
    <div className="pb-24 pt-8 px-6 space-y-8 animate-in fade-in duration-500 relative">
      
      {showDevotional && (
        <DailyDevotionalView 
          theme={user.spiritualChallenge} 
          onClose={() => setShowDevotional(false)}
          onComplete={handleDevotionalComplete}
        />
      )}

      {showRestorationPlan && (
        <RestorationPlan 
           user={user} 
           onUpdateUser={onUpdateUser}
           onClose={() => setShowRestorationPlan(false)} 
        />
      )}

      {/* Habit Help Modal */}
      {showHabitHelp && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowHabitHelp(false)}>
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl font-bold text-beige-900">Por que metas?</h3>
                <button onClick={() => setShowHabitHelp(false)}><X size={20} className="text-gray-400" /></button>
             </div>
             <p className="text-gray-600 text-sm leading-relaxed mb-4">
               Pequenos passos criam grandes jornadas. Essas metas foram selecionadas especificamente para fortalecer sua fé de forma prática e constante.
             </p>
             <button onClick={() => setShowHabitHelp(false)} className="w-full bg-gold-500 text-white py-3 rounded-xl font-bold">Entendi</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gold-600 uppercase tracking-widest mb-1">Bem-vindo</p>
          <h1 className="font-serif text-3xl text-beige-900 font-bold">Paz, {user.name.split(' ')[0]}!</h1>
        </div>
        {/* Stats are now in the bottom navigation bar, removed redundant header button */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Daily Devotional Card (Hero) */}
      <div 
        id="nav-devotional"
        className="relative bg-beige-900 rounded-[32px] p-8 text-white shadow-soft overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4 text-gold-400">
            <Sun size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Devocional do Dia</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3 leading-snug">
            {user.spiritualChallenge.length > 0 ? `Vencendo ${user.spiritualChallenge[0].toLowerCase()} com fé` : "Fortalecendo sua fé"}
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-6 font-sans">
            Descubra como a paz de Deus excede todo entendimento e guarda seu coração hoje.
          </p>
          <button 
            onClick={() => setShowDevotional(true)}
            disabled={isDevotionalDoneToday}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-2 ${isDevotionalDoneToday ? 'bg-green-500 text-white opacity-90' : 'bg-gold-500 hover:bg-gold-600 text-white'}`}
          >
            {isDevotionalDoneToday ? (
              <>Concluído <CheckCircle size={16} /></>
            ) : (
              'Ler Agora'
            )}
          </button>
        </div>
      </div>

      {/* Daily Verse */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-beige-200">
        <h3 className="font-serif text-lg text-beige-900 mb-3 font-semibold">Versículo do Dia</h3>
        <p className="text-gray-600 italic font-serif leading-relaxed text-lg mb-3">
          "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus."
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gold-600 tracking-wide">FILIPENSES 4:7</span>
          <button onClick={() => setTab('bible')} className="text-xs text-beige-900 underline underline-offset-4">Explicação</button>
        </div>
      </div>

      {/* Progress & Stats Snapshot - Click navigates to Stats Tab */}
      <div id="stats-card" className="grid grid-cols-2 gap-4" onClick={() => setTab('stats')}>
        <div className="bg-white p-5 rounded-[28px] shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold-200 border border-transparent transition active:scale-95">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-1">
             <TrendingUp size={24} />
          </div>
          <span className="text-2xl font-serif font-bold text-black">{currentGrowthPercent}%</span>
          <span className="text-[10px] text-black font-bold text-center uppercase tracking-wide">Crescimento</span>
        </div>
        <div className="bg-white p-5 rounded-[28px] shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold-200 border border-transparent transition active:scale-95">
           <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-1">
             <Flame size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-serif font-bold text-black">{user.stats.streak} dias</span>
          <span className="text-[10px] text-black font-bold text-center uppercase tracking-wide">Sequência</span>
        </div>
      </div>

      {/* Habits / Goals */}
      <div>
        <div className="flex items-center gap-2 mb-4 px-2">
          <h3 className="font-serif text-xl text-beige-900 font-semibold">Separamos Suas Metas Hoje</h3>
          <button onClick={() => setShowHabitHelp(true)} className="text-gold-500 hover:text-gold-600">
            <HelpCircle size={18} />
          </button>
        </div>
        <div className="space-y-3">
          {habits.map(habit => (
            <div 
              key={habit.id}
              onClick={() => handleHabitClick(habit.id)}
              className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300 ${habit.completed ? 'bg-gold-500/10 border-gold-500 border' : 'bg-white border-transparent shadow-sm'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${habit.completed ? 'bg-gold-500 border-gold-500 text-white' : 'border-gray-300'}`}>
                {habit.completed && <CheckCircle size={14} />}
              </div>
              <span className={`flex-1 font-medium ${habit.completed ? 'text-gold-700 line-through' : 'text-gray-700'}`}>{habit.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp Group Link */}
      <a 
        href="https://chat.whatsapp.com/CjmBAs7u7KX69F30rF4xUM" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-green-500 text-white p-5 rounded-3xl shadow-lg hover:bg-green-600 transition flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
           <div className="bg-white/20 p-2 rounded-full"><MessageCircle size={24} /></div>
           <div>
              <p className="font-bold">Grupo de Comunhão</p>
              <p className="text-xs text-white/90">Entre na comunidade WhatsApp</p>
           </div>
        </div>
        <ChevronRight size={20} />
      </a>

      {/* Restoration Plan Entry */}
      <div className="bg-[#E8DFD2] p-6 rounded-[32px] relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-serif text-lg font-bold text-beige-900 mb-2">Plano de Restauração</h3>
          {user.restorationPlan?.active ? (
             <div className="mb-4">
               <p className="text-sm text-beige-900/80 mb-2">Você está no dia {user.restorationPlan.days.filter(d => d.completed).length} de 7</p>
               <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-600" style={{ width: `${(user.restorationPlan.days.filter(d => d.completed).length / 7) * 100}%` }}></div>
               </div>
             </div>
          ) : (
             <p className="text-sm text-beige-900/80 mb-4">Um plano de 7 dias criado especificamente para suas necessidades.</p>
          )}
          
          <button 
            onClick={() => setShowRestorationPlan(true)}
            className="bg-white text-beige-900 px-5 py-3 rounded-full text-xs font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-2"
          >
            {user.restorationPlan?.active ? 'Continuar Plano' : 'Começar Plano'} <ChevronRight size={14} />
          </button>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10 text-beige-900">
           <Battery size={120} />
        </div>
      </div>
    </div>
  );
};