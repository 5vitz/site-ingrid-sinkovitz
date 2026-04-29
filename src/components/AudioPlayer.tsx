import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  isMuted: boolean;
  onToggleMute: (e: React.MouseEvent) => void;
}

/**
 * Este componente é apenas a interface visual do botão de áudio.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isMuted, onToggleMute }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[10002] flex items-center gap-4 pointer-events-auto">
      <button 
        onClick={onToggleMute}
        className="w-10 h-10 bg-zinc-950/60 backdrop-blur-md rounded-full flex items-center justify-center text-accent border border-white/5 hover:bg-accent hover:text-black shadow-2xl active:scale-90 transition-all outline-none"
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
};
