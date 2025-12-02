import React, { useEffect, useState } from 'react';
import { generateDailyDevotional } from '../../services/geminiService';
import { X, CheckCircle, Share2, Heart, Info, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyDevotionalViewProps {
  theme: string[];
  onClose: () => void;
  onComplete: () => void;
}

export const DailyDevotionalView: React.FC<DailyDevotionalViewProps> = ({ theme, onClose, onComplete }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await generateDailyDevotional(theme);
      setContent(data);
      setLoading(false);
    };
    load();
  }, [theme]);

  const handleComplete = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6A46A', '#F8F3EA', '#FFD700']
    });
    onComplete();
    setTimeout(onClose, 2500);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F8F3EA] z-50 flex flex-col items-center justify-center p-6">
        <div className="animate-spin text-gold-500 mb-4">
          <BookOpen size={32} />
        </div>
        <p className="text-beige-900 font-serif animate-pulse">Preparando um estudo profundo para você...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F8F3EA] z-50 overflow-y-auto">
      <div className="min-h-full p-6 flex flex-col relative pb-20">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-sm">
          <X size={24} className="text-gray-400" />
        </button>

        <div className="mt-12 mb-8">
           <span className="bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">Devocional Diário</span>
           <h1 className="font-serif text-3xl text-beige-900 font-bold mt-4 leading-tight">{content.title}</h1>
        </div>

        {/* Importance Section */}
        <div className="bg-beige-200 p-6 rounded-[24px] mb-8">
          <h3 className="font-bold text-beige-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
            <Info size={16} /> Por que isso é importante?
          </h3>
          <p className="text-beige-900/80 text-sm leading-relaxed">
            {content.importance || "Entender este princípio é fundamental para construir uma fé inabalável e viver o propósito de Deus."}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm mb-8 border-l-4 border-gold-500">
           <p className="font-serif text-xl italic text-gray-700 leading-relaxed">"{content.verse}"</p>
        </div>

        <div className="prose prose-lg prose-beige text-gray-800 leading-relaxed mb-10 font-serif">
           {content.content.split('\n').map((p: string, i: number) => (
             <p key={i} className="mb-4 indent-4 text-justify">{p}</p>
           ))}
        </div>

        <div className="bg-white border border-beige-200 p-6 rounded-3xl mb-8">
           <h3 className="font-bold text-beige-900 mb-3 flex items-center gap-2">
             <Heart size={18} className="text-gold-600" fill="currentColor" /> Oração do Dia
           </h3>
           <p className="italic text-gray-700 text-lg leading-relaxed">"{content.prayer}"</p>
        </div>

        <button 
          onClick={handleComplete}
          className="w-full bg-gold-500 text-white py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 hover:bg-gold-600 transition-transform active:scale-95 mb-8"
        >
          <CheckCircle size={24} /> Concluído
        </button>
      </div>
    </div>
  );
};
