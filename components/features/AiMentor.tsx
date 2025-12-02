import React, { useState, useEffect, useRef } from 'react';
import { getSpiritualMentorResponse } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';

export const AiMentor: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Oi! A paz do Senhor! 👋 \nEu sou seu amigo de jornada. Como você está se sentindo hoje? Pode me contar tudo! ☕', timestamp: Date.now() }
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const responseText = await getSpiritualMentorResponse(history, input);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || 'Ops, tive um pequeno problema. Pode repetir?',
        timestamp: Date.now()
      }]);
    } catch (e) {
      // Error handled in service
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-beige-100">
      <div className="px-6 py-6 bg-white shadow-sm z-10 sticky top-0 border-b border-beige-200">
        <h2 className="font-serif text-2xl font-bold text-beige-900">Mentor Espiritual</h2>
        <p className="text-xs text-gray-500">Seu amigo sábio disponível 24h</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white shadow-sm ${msg.role === 'user' ? 'bg-beige-300' : 'bg-gold-500 text-white'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                ? 'bg-white text-gray-800 rounded-tr-none' 
                : 'bg-white text-beige-900 rounded-tl-none border border-gold-200'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none ml-14 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-4 bg-white border-t border-beige-200 sticky bottom-0">
        <div className="flex gap-2 items-center bg-beige-50 p-2 rounded-full border border-beige-200 focus-within:border-gold-400 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Converse comigo..."
            className="flex-1 bg-transparent px-4 outline-none text-gray-700"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:bg-gold-600 transition shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};