import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState(''); // Local state for input
  const [answers, setAnswers] = useState<Partial<UserProfile>>({
    stats: { intimacy: 50, reading: 0, comprehension: 10, peace: 20, consistency: 0, streak: 0 }
  });

  const questions = [
    {
      id: 'welcome',
      type: 'intro',
      title: 'Bem-vindo ao\nVida com O Senhor',
      subtitle: 'O único aplicativo criado para transformar de verdade sua relação com Deus.',
      action: 'Começar'
    },
    {
      id: 'name',
      type: 'input',
      title: 'Como você gostaria de ser chamado?',
      field: 'name',
      placeholder: 'Seu nome'
    },
    {
      id: 'challenge',
      type: 'multi',
      title: 'Quais seus principais desafios espirituais hoje?',
      field: 'spiritualChallenge',
      options: ['Ansiedade', 'Medo', 'Falta de disciplina', 'Compreensão bíblica', 'Culpa', 'Propósito', 'Cansaço']
    },
    {
      id: 'frequency',
      type: 'select',
      title: 'Com que frequência você lê a Bíblia?',
      field: 'bibleFrequency',
      options: ['Todos os dias', 'Algumas vezes na semana', 'Raramente', 'Nunca li']
    },
    {
      id: 'newBeliever',
      type: 'yesno',
      title: 'Você se considera novo na fé?',
      field: 'isNewBeliever',
    },
    {
      id: 'themes',
      type: 'multi',
      title: 'Quais temas mais falam ao seu coração?',
      field: 'interestThemes',
      options: ['Propósito', 'Identidade', 'Cura', 'Decisões', 'Família', 'Espírito Santo', 'Finanças']
    },
    {
      id: 'preference',
      type: 'select',
      title: 'Prefere devocionais curtos ou profundos?',
      field: 'devotionalPreference',
      options: ['Curtos e Diretos (2min)', 'Profundos e Teológicos (10min)']
    }
  ];

  const currentQ = questions[step];

  const handleNext = (val: any) => {
    // If val is empty string (from button click without typing), ignore or use input state
    const valueToSave = (currentQ.type === 'input' && typeof val !== 'string') ? inputValue : val;

    if (currentQ.type === 'input' && !valueToSave) return;

    const updated = { ...answers, [currentQ.field as string]: valueToSave };
    
    if (currentQ.field === 'devotionalPreference') {
       updated.devotionalPreference = valueToSave.includes('Curtos') ? 'short' : 'deep';
    }

    setAnswers(updated);
    setInputValue(''); // Reset local input
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Finalize
      const profile: UserProfile = {
        name: updated.name || 'Amado(a)',
        onboardingComplete: true,
        spiritualChallenge: Array.isArray(updated.spiritualChallenge) ? updated.spiritualChallenge : ['Crescimento'],
        bibleFrequency: updated.bibleFrequency || 'Raramente',
        isNewBeliever: updated.isNewBeliever || false,
        transformAreas: [], 
        devotionalPreference: updated.devotionalPreference as 'short'|'deep',
        interestThemes: updated.interestThemes || [],
        stats: { intimacy: 100, reading: 0, comprehension: 10, peace: 10, consistency: 0, streak: 0 }
      };
      onComplete(profile);
    }
  };

  if (currentQ.type === 'intro') {
    return (
      <div className="min-h-screen bg-beige-100 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        <div className="z-10 bg-white/80 backdrop-blur-md p-10 rounded-[40px] shadow-soft border border-white/50">
          <h1 className="font-serif text-4xl text-beige-900 mb-6 font-bold leading-tight whitespace-pre-line">{currentQ.title}</h1>
          <p className="font-sans text-gray-600 mb-10 text-lg leading-relaxed">{currentQ.subtitle}</p>
          <button 
            onClick={() => setStep(step + 1)}
            className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-full text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            {currentQ.action} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-100 flex flex-col p-6">
      <div className="w-full bg-beige-300 h-2 rounded-full mb-8 mt-4">
        <div 
          className="bg-gold-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${((step) / (questions.length - 1)) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="font-serif text-3xl text-beige-900 mb-8 font-semibold">{currentQ.title}</h2>
        
        <div className="space-y-4">
          {currentQ.type === 'input' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
               <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-5 rounded-2xl border-2 border-beige-300 focus:border-gold-500 outline-none text-lg bg-white shadow-sm"
                placeholder={(currentQ as any).placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNext(inputValue);
                }}
                autoFocus
               />
               <button
                  onClick={() => handleNext(inputValue)}
                  disabled={!inputValue.trim()}
                  className="w-full bg-beige-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar <ArrowRight size={18} />
               </button>
            </div>
          )}

          {currentQ.type === 'select' && (currentQ as any).options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => handleNext(opt)}
              className="w-full p-5 rounded-2xl bg-white shadow-sm hover:shadow-md border border-beige-200 text-left font-medium text-beige-900 transition-all active:scale-98 flex justify-between items-center group animate-in slide-in-from-bottom-2"
            >
              {opt}
              <div className="w-6 h-6 rounded-full border-2 border-beige-300 group-hover:border-gold-500"></div>
            </button>
          ))}

          {currentQ.type === 'yesno' && (
            <div className="flex gap-4 animate-in slide-in-from-bottom-2">
              <button 
                onClick={() => handleNext(true)}
                className="flex-1 p-6 rounded-2xl bg-white shadow-sm border border-beige-200 font-bold text-lg hover:border-gold-500 transition-colors"
              >
                Sim
              </button>
              <button 
                onClick={() => handleNext(false)}
                className="flex-1 p-6 rounded-2xl bg-white shadow-sm border border-beige-200 font-bold text-lg hover:border-gold-500 transition-colors"
              >
                Não
              </button>
            </div>
          )}
          
          {currentQ.type === 'multi' && (
             <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-2">
               {(currentQ as any).options.map((opt: string) => {
                 const currentArr = (answers[currentQ.field as keyof UserProfile] as string[]) || [];
                 const isSelected = currentArr.includes(opt);
                 return (
                   <button
                     key={opt}
                     onClick={() => {
                        const next = isSelected 
                          ? currentArr.filter((t: string) => t !== opt)
                          : [...currentArr, opt];
                        setAnswers({...answers, [currentQ.field as string]: next});
                     }}
                     className={`p-4 rounded-2xl border text-center transition-all ${
                        isSelected 
                        ? 'bg-gold-500 text-white border-gold-500 shadow-md transform scale-105' 
                        : 'bg-white border-beige-200 text-gray-600'
                     }`}
                   >
                     {opt}
                   </button>
                 );
               })}
             </div>
          )}
          {currentQ.type === 'multi' && (
            <button
              onClick={() => handleNext(answers[currentQ.field as keyof UserProfile])}
              className="w-full mt-6 bg-beige-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-colors"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
