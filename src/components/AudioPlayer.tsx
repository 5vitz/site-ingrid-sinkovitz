import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  isMuted: boolean;
  onToggleMute: (e: React.MouseEvent) => void;
  volume: number;
  onVolumeChange: (value: number) => void;
}

/**
 * Este componente é apenas a interface visual do botão de áudio.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  isMuted, 
  onToggleMute,
  volume,
  onVolumeChange
}) => {
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div 
      className="fixed bottom-8 right-8 z-[10002] flex flex-col items-center gap-3 pointer-events-auto"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      {showSlider && (
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-full py-4 px-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="relative h-24 w-1.5 flex items-center justify-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="absolute h-24 w-6 -rotate-90 appearance-none bg-transparent cursor-pointer vertical-slider-fix"
              style={{ 
                width: '96px', // Largura do slider (que vira altura ao rotacionar)
                margin: 0,
                padding: 0
              } as any}
            />
            {/* Track customizado para melhor visualização */}
            <div className="absolute inset-y-0 w-1.5 bg-white/10 rounded-full overflow-hidden pointer-events-none">
              <div 
                className="absolute bottom-0 w-full bg-[#f2bb32] rounded-full transition-all duration-75"
                style={{ height: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={onToggleMute}
        className="w-10 h-10 bg-zinc-950/60 backdrop-blur-md rounded-full flex items-center justify-center text-[#f2bb32] border border-white/5 hover:bg-[#f2bb32] hover:text-black shadow-2xl active:scale-90 transition-all outline-none"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <style>{`
        .vertical-slider-fix::-webkit-slider-runnable-track {
          background: transparent;
          border: none;
        }
        .vertical-slider-fix::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #f2bb32;
          cursor: pointer;
          border: 2px solid #18181b;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
          margin-top: -6px; /* Não necessário aqui devido à rotação, mas mantemos para segurança */
        }
        .vertical-slider-fix::-moz-range-thumb {
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: #f2bb32;
          cursor: pointer;
          border: 2px solid #18181b;
        }
        .vertical-slider-fix::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};
