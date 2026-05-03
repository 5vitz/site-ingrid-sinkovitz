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
        <div className="bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full py-4 px-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="h-24 appearance-none bg-transparent cursor-pointer vertical-range"
            style={{ 
              writingMode: 'vertical-lr', 
              direction: 'rtl',
              width: '4px',
              WebkitAppearance: 'slider-vertical' 
            } as any}
          />
        </div>
      )}
      <button 
        onClick={onToggleMute}
        className="w-10 h-10 bg-zinc-950/60 backdrop-blur-md rounded-full flex items-center justify-center text-accent border border-white/5 hover:bg-accent hover:text-black shadow-2xl active:scale-90 transition-all outline-none"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      <style>{`
        .vertical-range {
          -webkit-appearance: none;
          background: transparent;
        }
        .vertical-range::-webkit-slider-runnable-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          width: 4px;
        }
        .vertical-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          background: #f2bb32;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          margin-left: -5px;
          box-shadow: 0 0 10px rgba(242, 187, 50, 0.3);
          cursor: pointer;
          border: none;
        }
        .vertical-range::-moz-range-thumb {
          background: #f2bb32;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
        .vertical-range::-moz-range-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          width: 4px;
        }
      `}</style>
    </div>
  );
};
