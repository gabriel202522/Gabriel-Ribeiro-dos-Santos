import React, { useState, useEffect } from 'react';
import { generateJournalReflection } from '../../services/geminiService';
import { JournalEntry } from '../../types';
import { Save, Plus, Book, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [reflection, setReflection] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    // Load simulated data
    const saved = localStorage.getItem('journal_entries');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const handleSave = async () => {
    if (!newEntry.trim()) return;

    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      content: newEntry,
      type: 'prayer'
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('journal_entries', JSON.stringify(updated));
    setNewEntry('');
    setIsWriting(false);
    
    // Reward
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6A46A', '#F8F3EA', '#5A4D3B']
    });
    setShowReward(true);
    setTimeout(() => setShowReward(false), 3000);

    // AI Insight
    const aiReflect = await generateJournalReflection(entry.content);
    if(aiReflect) setReflection(aiReflect);
  };

  return (
    <div className="min-h-screen bg-beige-100 p-6 pb-24 pt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-3xl font-bold text-beige-900">Diário Espiritual</h2>
        <button 
          onClick={() => setIsWriting(true)}
          className="w-12 h-12 bg-beige-900 text-white rounded-full flex items-center justify-center shadow-md hover:bg-black transition"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Intro / Explanation Header */}
      {!isWriting && (
        <div className="bg-white p-4 rounded-2xl mb-8 border border-beige-200 shadow-sm">
          <p className="text-beige-900 text-sm leading-relaxed font-medium">
            O diário é uma ferramenta de memória e gratidão. Registre o que Deus tem falado, seus pedidos e o que você aprendeu hoje.
          </p>
        </div>
      )}

      {showReward && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce border border-gold-200">
           <span className="font-bold text-gold-600 flex items-center gap-2">Registro salvo com sucesso! 🎉</span>
        </div>
      )}

      {isWriting ? (
        <div className="bg-white p-6 rounded-[32px] shadow-lg animate-in fade-in zoom-in duration-300 border border-beige-200">
           <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
             {['Gratidão', 'Pedido', 'Leitura', 'Reflexão'].map(tag => (
               <span key={tag} className="px-3 py-1 bg-beige-100 text-beige-900 rounded-full text-xs font-bold border border-beige-200">{tag}</span>
             ))}
           </div>
           <textarea
             className="w-full h-64 resize-none outline-none text-lg text-beige-900 placeholder:text-gray-400 leading-relaxed font-serif bg-transparent"
             placeholder="Escreva aqui..."
             value={newEntry}
             onChange={(e) => setNewEntry(e.target.value)}
             autoFocus
           />
           <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-beige-100">
             <button onClick={() => setIsWriting(false)} className="text-gray-500 font-medium px-4">Cancelar</button>
             <button 
               onClick={handleSave}
               className="bg-beige-900 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition shadow-lg"
             >
               Salvar <Save size={18} />
             </button>
           </div>
        </div>
      ) : (
        <>
          {reflection && (
             <div className="bg-white border-l-4 border-gold-400 p-6 rounded-2xl mb-8 flex flex-col gap-3 shadow-sm animate-in slide-in-from-top-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gold-100 p-2 rounded-full"><Sparkles size={16} className="text-gold-600" /></div>
                  <p className="text-xs font-bold text-gold-600 uppercase">Insight</p>
                </div>
                <p className="text-base text-beige-900 font-medium leading-relaxed">{reflection}</p>
                <button onClick={() => setReflection('')} className="self-end text-gray-400 text-xs mt-2 underline">Fechar</button>
             </div>
          )}

          <div className="space-y-4">
             {entries.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                   <Book size={48} className="mx-auto mb-4 text-beige-300" />
                   <p className="text-gray-500 font-medium">Seu diário está vazio.</p>
                </div>
             )}
             {entries.map(entry => (
               <div key={entry.id} className="bg-white p-6 rounded-[28px] shadow-sm border border-transparent hover:border-gold-200 transition group">
                 <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400">{entry.date}</span>
                 </div>
                 <p className="text-beige-900 leading-relaxed font-serif whitespace-pre-wrap">{entry.content}</p>
               </div>
             ))}
          </div>
        </>
      )}
    </div>
  );
};
