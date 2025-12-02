import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RefreshCw, Volume2, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SilenceModeProps {
  onClose: () => void;
}

export const SilenceMode: React.FC<SilenceModeProps> = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute fixed
  const [isActive, setIsActive] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setShowEnd(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-[#F8F3EA] z-[100] flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
        <button onClick={onClose} className="absolute top-8 right-6 text-gray-400 p-2 hover:text-red-400"><X size={32} /></button>
        <div className="w-20 h-20 bg-beige-200 rounded-full flex items-center justify-center mb-6 shadow-sm">
           <Volume2 size={40} className="text-beige-900" />
        </div>
        <h2 className="font-serif text-3xl text-beige-900 font-bold mb-4">Silêncio com Deus</h2>
        <p className="text-gray-600 mb-8 leading-relaxed max-w-xs mx-auto">
          O mundo é barulhento, mas Deus fala no sussurro. 
          <br/><br/>
          Vamos tirar apenas <strong>1 minuto</strong> para acalmar sua mente e focar na presença dEle. Apenas ore ou escute.
        </p>
        <button 
          onClick={() => setShowIntro(false)}
          className="bg-gold-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gold-600 transition transform hover:scale-105"
        >
          Estou pronto
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F8F3EA] z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <button onClick={onClose} className="absolute top-8 right-6 text-gray-400 p-2 hover:text-red-400">
        <X size={32} />
      </button>

      <div className="text-center mb-12">
        <h2 className="font-serif text-2xl text-beige-900 mb-2">1 Minuto com o Pai</h2>
        <p className="text-gray-500 text-sm">Feche os olhos se preferir.</p>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center mb-12">
        {/* Breathing Animation Rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 border-2 border-gold-200 rounded-full animate-ping opacity-20 duration-[4000ms]"></div>
            <div className="absolute inset-8 border border-gold-300 rounded-full animate-pulse opacity-30 duration-[3000ms]"></div>
          </>
        )}
        
        <div className="w-64 h-64 bg-white rounded-full shadow-soft flex items-center justify-center relative z-10 border-4 border-white">
          <span className="font-serif text-6xl text-beige-900 tabular-nums tracking-wider font-light">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {!showEnd ? (
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => { setTimeLeft(60); setIsActive(false); }}
            className="w-14 h-14 bg-white text-gray-400 rounded-full flex items-center justify-center shadow-md hover:text-beige-900 transition"
          >
            <RefreshCw size={20} />
          </button>
          
          <button 
            onClick={() => setIsActive(!isActive)}
            className="w-20 h-20 bg-beige-900 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition"
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
        </div>
      ) : (
         <div className="text-center animate-in zoom-in w-full max-w-xs">
           <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
             <CheckCircle size={32} />
           </div>
           <p className="text-xl font-serif text-beige-900 mb-6 font-bold">"Aquietai-vos e sabei que eu sou Deus."</p>
           <button onClick={onClose} className="w-full bg-beige-900 text-white py-4 rounded-full font-bold shadow-lg hover:bg-black transition">
             Amém, Sair
           </button>
         </div>
      )}

      {isActive && (
        <p className="absolute bottom-12 text-sm text-gray-400 animate-pulse font-medium">
          Apenas esteja presente...
        </p>
      )}
    </div>
  );
};
