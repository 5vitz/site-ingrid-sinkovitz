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
      className="fixed bottom-8 right-8 z-[10002] flex flex-col items-center gap-2 pointer-events-auto"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      {showSlider && (
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-full py-4 px-3 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="h-28 w-1.5 cursor-pointer accent-[#f2bb32]"
            style={{ 
              WebkitAppearance: 'slider-vertical',
              appearance: 'slider-vertical'
            } as any}
          />
        </div>
      )}
      <button 
        onClick={onToggleMute}
        className="w-10 h-10 bg-zinc-950/60 backdrop-blur-md rounded-full flex items-center justify-center text-[#f2bb32] border border-white/5 hover:bg-[#f2bb32] hover:text-black shadow-2xl active:scale-90 transition-all outline-none"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
};
