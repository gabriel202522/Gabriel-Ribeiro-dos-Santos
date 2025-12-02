import React, { useState } from 'react';
import { generateRestorationPlan } from '../../services/geminiService';
import { RestorationPlan as PlanType, UserProfile } from '../../types';
import { ArrowLeft, CheckCircle, Circle, Loader2, Sparkles, Trophy, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RestorationPlanProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onClose: () => void;
}

export const RestorationPlan: React.FC<RestorationPlanProps> = ({ user, onUpdateUser, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  const availableAreas = [
    'Ansiedade', 'Vício', 'Vida de Oração', 'Casamento', 
    'Identidade', 'Perdão', 'Esperança'
  ];

  const handleGenerate = async () => {
    if (selectedAreas.length === 0) return;
    setLoading(true);
    const data = await generateRestorationPlan(selectedAreas);
    
    // Set start date to today
    const newPlan: PlanType = {
      active: true,
      startDate: new Date().toISOString(),
      areas: selectedAreas,
      days: data.days.map((d: any) => ({ ...d, completed: false }))
    };

    onUpdateUser({ ...user, restorationPlan: newPlan });
    setLoading(false);
  };

  const toggleDay = (dayIndex: number) => {
    if (!user.restorationPlan) return;
    
    const updatedDays = [...user.restorationPlan.days];
    const isCompleting = !updatedDays[dayIndex].completed;
    updatedDays[dayIndex].completed = isCompleting;

    const allDone = updatedDays.every(d => d.completed);

    onUpdateUser({ 
      ...user, 
      restorationPlan: { ...user.restorationPlan, days: updatedDays } 
    });

    if (isCompleting) {
        confetti({ particleCount: 50, origin: { y: 0.7 } });
    }
    if (allDone && isCompleting) {
        setTimeout(() => {
            confetti({ particleCount: 200, spread: 100 });
        }, 500);
    }
  };

  const getProgress = () => {
    if (!user.restorationPlan) return 0;
    const completed = user.restorationPlan.days.filter(d => d.completed).length;
    return Math.round((completed / user.restorationPlan.days.length) * 100);
  };

  // View: Selection
  if (!user.restorationPlan) {
    return (
      <div className="fixed inset-0 bg-[#F8F3EA] z-50 p-6 overflow-y-auto">
        <button onClick={onClose} className="mb-6"><ArrowLeft size={24} /></button>
        <h2 className="font-serif text-3xl font-bold text-beige-900 mb-2">Plano de Restauração</h2>
        <p className="text-gray-600 mb-8">Selecione as áreas que você deseja que Deus restaure nesta semana.</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {availableAreas.map(area => (
            <button
              key={area}
              onClick={() => {
                setSelectedAreas(prev => 
                  prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
                );
              }}
              className={`p-4 rounded-2xl border text-left font-medium transition-all ${
                selectedAreas.includes(area)
                  ? 'bg-gold-500 text-white border-gold-500 shadow-md'
                  : 'bg-white border-beige-200 text-gray-600'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || selectedAreas.length === 0}
          className="w-full bg-beige-900 text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>Gerar Meu Plano <Sparkles size={18} /></>}
        </button>
      </div>
    );
  }

  // View: Dashboard
  const plan = user.restorationPlan;
  const progress = getProgress();

  // Calculate days passed since start
  const startDate = new Date(plan.startDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const daysPassed = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  // e.g., if started today, daysPassed = 1. If started yesterday, 2.

  return (
    <div className="fixed inset-0 bg-[#F8F3EA] z-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
         <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm"><ArrowLeft size={20} /></button>
         <div className="text-sm font-bold text-gold-600 bg-gold-100 px-3 py-1 rounded-full">{progress}% Concluído</div>
      </div>

      <h2 className="font-serif text-2xl font-bold text-beige-900 mb-1">Seu Caminho de Cura</h2>
      <p className="text-xs text-gray-500 mb-6">Foco: {plan.areas.join(", ")}</p>

      {/* Progress Bar */}
      <div className="h-2 bg-beige-200 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      {progress === 100 && (
        <div className="bg-gold-500 text-white p-6 rounded-3xl mb-8 text-center animate-in zoom-in">
           <Trophy size={48} className="mx-auto mb-2" />
           <h3 className="font-bold text-xl">Plano Concluído!</h3>
           <p className="text-sm opacity-90">Você completou 7 dias de fidelidade.</p>
        </div>
      )}

      <div className="space-y-4 pb-20">
        {plan.days.map((day, idx) => {
            // Determine if locked. Locked if the day index (1-based) is greater than days passed.
            const isLocked = day.day > daysPassed;
            
            return (
            <div 
              key={day.day} 
              className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
                  day.completed ? 'bg-white border-green-200 opacity-60' : 'bg-white border-beige-200 shadow-sm'
              } ${isLocked ? 'pointer-events-none' : ''}`}
            >
                {isLocked && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="bg-beige-100 p-2 rounded-full shadow-sm">
                            <Lock size={20} className="text-gray-400" />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-3">
                   <div>
                       <span className="text-xs font-bold text-gold-500 uppercase tracking-wider">Dia {day.day}</span>
                       <h3 className="font-serif text-lg font-bold text-beige-900">{day.title}</h3>
                   </div>
                   <button onClick={() => toggleDay(idx)} className="text-gray-300 hover:text-green-500 transition" disabled={isLocked}>
                       {day.completed ? <CheckCircle size={28} className="text-green-500" /> : <Circle size={28} />}
                   </button>
                </div>
                
                <p className={`text-gray-600 text-sm mb-4 leading-relaxed ${isLocked ? 'blur-sm select-none' : ''}`}>
                    {day.content}
                </p>
                
                <div className={`bg-beige-50 p-3 rounded-xl border border-beige-100 ${isLocked ? 'blur-sm select-none' : ''}`}>
                    <p className="text-xs font-bold text-beige-900 mb-1">Tarefa Simples:</p>
                    <p className="text-xs text-gray-600">{day.task}</p>
                </div>
            </div>
        )})}
      </div>
    </div>
  );
};
