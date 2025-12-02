import React, { useState } from 'react';
import { explainBibleVerse } from '../../services/geminiService';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const BibleExplain: React.FC = () => {
  const [verse, setVerse] = useState('');
  const [explanation, setExplanation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!verse.trim()) return;
    setLoading(true);
    setExplanation(null);
    const result = await explainBibleVerse(verse);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-beige-100 p-6 pb-24 pt-8">
      <h2 className="font-serif text-3xl font-bold text-beige-900 mb-2">Bíblia Explicada</h2>
      <p className="text-gray-600 mb-8 text-sm">Cole um versículo difícil e receba uma explicação teológica simples.</p>

      <div className="bg-white p-2 rounded-[32px] shadow-soft mb-8 border border-beige-200">
        <textarea
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
          placeholder="Ex: Romanos 8:28 ou cole o texto aqui..."
          className="w-full p-4 h-32 resize-none rounded-3xl outline-none text-lg text-gray-700 placeholder:text-gray-300 bg-transparent"
        />
        <button
          onClick={handleExplain}
          disabled={loading || !verse}
          className="w-full bg-beige-900 text-white py-4 rounded-[24px] font-bold flex items-center justify-center gap-2 transition hover:bg-black disabled:opacity-70"
        >
          {loading ? (
             <span className="animate-pulse">Analisando...</span>
          ) : (
            <>
              Explicar Agora <Sparkles size={18} className="text-gold-400" />
            </>
          )}
        </button>
      </div>

      {explanation && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
          
          <div className="bg-white p-6 rounded-[32px] shadow-soft border border-gold-200 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-gold-500"></div>
             <h3 className="font-serif text-xl font-bold text-beige-900 mb-3 flex items-center gap-2">
               <BookOpen size={20} className="text-gold-500" /> O que isso significa?
             </h3>
             <p className="text-gray-700 leading-relaxed">{explanation.explanation}</p>
          </div>

          <div className="bg-[#E8DFD2] p-6 rounded-[32px] shadow-sm">
             <h3 className="font-serif text-lg font-bold text-beige-900 mb-2">Contexto Histórico</h3>
             <p className="text-beige-900/80 text-sm leading-relaxed">{explanation.context}</p>
          </div>

          <div className="bg-white p-6 rounded-[32px] shadow-soft">
             <h3 className="font-serif text-lg font-bold text-beige-900 mb-3">Aplicação Prática</h3>
             <div className="flex items-start gap-3">
               <div className="mt-1 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                 <ArrowRight size={14} />
               </div>
               <p className="text-gray-700 text-sm leading-relaxed">{explanation.application}</p>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};
