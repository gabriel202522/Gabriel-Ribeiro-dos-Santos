import React, { useState, useEffect } from 'react';
import { HelpCircle, X, ChevronRight } from 'lucide-react';

interface GuideStep {
  target: string; // ID of the element to highlight
  title: string;
  text: string;
}

const steps: GuideStep[] = [
  { target: 'nav-devotional', title: 'Devocional Diário', text: 'Comece seu dia aqui com uma palavra inspirada para você.' },
  { target: 'nav-bible', title: 'Bíblia Explicada', text: 'Cole versículos difíceis e entenda profundamente o que Deus diz.' },
  { target: 'nav-mentor', title: 'Mentor IA', text: 'Converse, tire dúvidas e peça oração 24h por dia.' },
  { target: 'nav-journal', title: 'Diário', text: 'Registre sua gratidão e o que Deus tem falado ao seu coração.' },
  { target: 'stats-card', title: 'Seu Progresso', text: 'Acompanhe seu crescimento espiritual e constância.' },
];

interface GuideBubbleProps {
  onStartGuide: () => void;
  isActive: boolean;
  onClose: () => void;
}

export const GuideBubble: React.FC<GuideBubbleProps> = ({ onStartGuide, isActive, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
    }
  }, [isActive]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  // Render the actual bubble button if guide is NOT active
  if (!isActive) {
    return (
      <button
        onClick={onStartGuide}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gold-500 rounded-full shadow-lg flex items-center justify-center text-white z-50 animate-bounce hover:bg-gold-600 transition-colors"
        aria-label="Guia do App"
      >
        <HelpCircle size={28} />
      </button>
    );
  }

  // Render the overlay and tooltip if guide IS active
  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[60] flex flex-col pointer-events-auto">
      {/* Dark overlay with hole effect simulated by z-index */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Tooltip Card */}
      <div className="absolute bottom-32 left-6 right-6 bg-white p-6 rounded-3xl shadow-2xl z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl text-beige-900 font-semibold">{step.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-400">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6 font-sans leading-relaxed">{step.text}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gold-500 tracking-widest uppercase">
            Passo {currentStep + 1} de {steps.length}
          </span>
          <button 
            onClick={handleNext}
            className="bg-beige-900 text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-black transition"
          >
            {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Highlight Target Indicator (Simplified visuals as we can't easily do true distinct holes without a library) */}
      <div className="absolute top-10 left-0 w-full text-center z-[70] text-white/80 px-10">
        Toque na área destacada para aprender mais.
      </div>
    </div>
  );
};
