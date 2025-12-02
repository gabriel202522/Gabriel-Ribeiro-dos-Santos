import React from 'react';
import { UserProfile } from '../../types';
import { TrendingUp, Book, Heart, Activity, Award, Star, Zap, Crown, Flame } from 'lucide-react';

interface StatsViewProps {
  user: UserProfile;
  onClose?: () => void; // Optional now as it can be a tab
}

export const StatsView: React.FC<StatsViewProps> = ({ user }) => {
  // Gamification Levels Logic
  const getLevelInfo = (points: number) => {
    if (points < 100) return { title: "Semente", icon: Star, color: "text-green-500", bg: "bg-green-100", next: 100 };
    if (points < 300) return { title: "Raíz Fortalecida", icon: Activity, color: "text-blue-500", bg: "bg-blue-100", next: 300 };
    if (points < 600) return { title: "Broto de Fé", icon: Zap, color: "text-gold-500", bg: "bg-gold-100", next: 600 };
    if (points < 1000) return { title: "Árvore Frutífera", icon: Award, color: "text-orange-500", bg: "bg-orange-100", next: 1000 };
    return { title: "Guerreiro de Oração", icon: Crown, color: "text-purple-500", bg: "bg-purple-100", next: 2000 };
  };

  const currentPoints = user.stats.intimacy;
  const level = getLevelInfo(currentPoints);
  const percentToNext = Math.min(100, (currentPoints / level.next) * 100);

  // Normalize stats to 100 scale for UI bars
  const consistencyPercent = Math.min(100, user.stats.streak * 5);
  const knowledgePercent = Math.min(100, user.stats.comprehension);

  return (
    <div className="min-h-screen bg-beige-100 p-6 pb-24 pt-8 animate-in fade-in">
      <h2 className="font-serif text-3xl font-bold text-beige-900 mb-6">Sua Evolução</h2>

      {/* Hero Level Card */}
      <div className="bg-white p-8 rounded-[40px] shadow-lg mb-8 relative overflow-hidden text-center border border-gold-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-300 to-gold-500"></div>
        
        <div className={`w-24 h-24 mx-auto ${level.bg} rounded-full flex items-center justify-center mb-4 shadow-inner`}>
           <level.icon size={48} className={level.color} />
        </div>
        
        <h3 className="font-serif text-2xl font-bold text-beige-900 mb-1">{level.title}</h3>
        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-6">Nível Atual</p>

        <div className="relative pt-2">
           <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
              <span>{currentPoints} XP</span>
              <span>{level.next} XP</span>
           </div>
           <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
             <div 
               className="h-full bg-gradient-to-r from-gold-400 to-gold-600 rounded-full transition-all duration-1000 relative" 
               style={{ width: `${percentToNext}%` }}
             >
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 animate-pulse"></div>
             </div>
           </div>
           <p className="text-xs text-gold-600 mt-2 font-medium">
             Faltam {level.next - currentPoints} pontos para o próximo nível!
           </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
         {/* Streak Badge */}
         <div className="bg-orange-50 p-5 rounded-[28px] border border-orange-100 flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-2">
               <Flame size={24} className="text-orange-500 fill-orange-500" />
            </div>
            <span className="text-3xl font-bold text-beige-900">{user.stats.streak}</span>
            <span className="text-xs text-orange-400 font-bold uppercase">Dias Seguidos</span>
         </div>

         {/* Badges Earned */}
         <div className="bg-blue-50 p-5 rounded-[28px] border border-blue-100 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
               <Award size={24} className="text-blue-500" />
            </div>
            <span className="text-3xl font-bold text-beige-900">{Math.floor(currentPoints / 50)}</span>
            <span className="text-xs text-blue-400 font-bold uppercase">Conquistas</span>
         </div>
      </div>

      <h3 className="font-serif text-xl font-bold text-beige-900 mb-4 px-2">Análise de Hábito</h3>
      
      <div className="space-y-4">
        {/* Metric Bars */}
        <div className="bg-white p-5 rounded-[24px] shadow-sm">
            <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-purple-100 rounded-xl text-purple-600"><Heart size={20} /></div>
                <div className="flex-1">
                    <span className="font-bold text-beige-900 block">Intimidade</span>
                    <span className="text-xs text-gray-500">Tempo de oração e conexão</span>
                </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, currentPoints / 10)}%` }}></div>
            </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm">
            <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-green-100 rounded-xl text-green-600"><Activity size={20} /></div>
                <div className="flex-1">
                    <span className="font-bold text-beige-900 block">Disciplina</span>
                    <span className="text-xs text-gray-500">Constância nos hábitos</span>
                </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${consistencyPercent}%` }}></div>
            </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm">
            <div className="flex items-center gap-4 mb-3">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Book size={20} /></div>
                <div className="flex-1">
                    <span className="font-bold text-beige-900 block">Sabedoria</span>
                    <span className="text-xs text-gray-500">Leitura e compreensão bíblica</span>
                </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${knowledgePercent}%` }}></div>
            </div>
        </div>
      </div>

      <div className="mt-8 bg-gold-50 p-6 rounded-[24px] border border-gold-100">
        <h4 className="font-bold text-beige-900 mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-gold-600" /> Próximo Passo
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
            Para alcançar o nível <strong>{level.title} Nível 2</strong>, tente completar o devocional por 3 dias seguidos. Você está indo muito bem!
        </p>
      </div>
    </div>
  );
};