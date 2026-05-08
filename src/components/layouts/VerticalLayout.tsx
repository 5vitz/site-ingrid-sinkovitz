import React from 'react';
import { Project, FeedItem, MediaItem } from '../../types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaRenderer } from '../MediaRenderer';

interface LayoutProps {
  project: Project;
  feedIndex: number;
  storyIndex: number;
  navigateFeed: (direction: 1 | -1) => void;
  navigateStory: (direction: 1 | -1) => void;
  isMuted: boolean;
  isPlaying: boolean;
  theme: any;
  playerWidth: number;
  playerHeight: number;
}

export const VerticalLayout: React.FC<LayoutProps> = ({
  project,
  feedIndex,
  storyIndex,
  navigateFeed,
  navigateStory,
  isMuted,
  isPlaying,
  theme,
  playerWidth,
  playerHeight
}) => {
  const totalFeed = Array.isArray(project.feed) ? project.feed.length : 0;
  const currentFeed = totalFeed > 0 ? project.feed![feedIndex] : null;
  const currentStories = Array.isArray(currentFeed?.stories) ? currentFeed!.stories : [];
  const totalStories = currentStories.length + (currentFeed ? 1 : 0);
  const currentMedia = storyIndex === 0 ? currentFeed?.media : currentStories![storyIndex - 1];

  return (
    <div className="relative flex items-center justify-center">
      <motion.div 
        key={`${feedIndex}-${storyIndex}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: 'linear' }}
        className="relative z-10"
        style={{ 
          width: `${playerWidth}px`,
          height: `${playerHeight}px`,
          minWidth: `${playerWidth}px`,
          maxWidth: `${playerWidth}px`,
        }}
      >
        <div 
          className={`w-full h-full bg-[#000000] overflow-hidden relative ${theme.playerShadow || ''}`}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '0px',
            borderWidth: '0px',
          } as React.CSSProperties}
        >
          <div className="w-full h-full">
            <MediaRenderer 
              media={currentMedia} 
              isActive={true} 
              isMuted={isMuted} 
              isPlaying={isPlaying}
              theme={theme} 
              projectId={project.id} 
              feedIndex={feedIndex}
            />
          </div>
        </div>

        {/* Pagination Dots (Carousel Indicator) - Visível em mobile e desktop */}
        {totalStories > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-[10020] px-3 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/5 shadow-2xl transition-all hover:bg-black/40">
            {Array.from({ length: totalStories }).map((_, idx) => (
              <button
                key={`dot-${idx}`}
                onClick={(e) => { e.stopPropagation(); navigateStory(idx - storyIndex); }}
                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                  idx === storyIndex 
                    ? 'bg-white w-6 shadow-[0_0_12px_rgba(255,255,255,0.6)]' 
                    : 'bg-white/40 w-1.5 hover:bg-white/60'
                }`}
                aria-label={`Ir para slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Story Navigation (Sides) - Restaurado para navegação via mouse */}
        {totalStories > 1 && (
          <div className="hidden md:block">
            <button 
              onClick={(e) => { e.stopPropagation(); navigateStory(-1); }}
              className={`absolute -left-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020] bg-white/20 text-white
                ${storyIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft size={18} strokeWidth={3} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); navigateStory(1); }}
              className={`absolute -right-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020] bg-white/20 text-white
                ${storyIndex === totalStories - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        )}

        {/* Feed Navigation (Vertical) */}
        {totalFeed > 1 && (
          <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 -top-[47px] -bottom-[47px] flex-col items-center justify-between pointer-events-none z-[10010]">
            <button 
              disabled={feedIndex === 0}
              onClick={(e) => { e.stopPropagation(); navigateFeed(-1); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-auto transition-all bg-white/20 text-white
                ${feedIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
            >
              <ChevronUp size={18} strokeWidth={3} />
            </button>
            
            <button 
              disabled={feedIndex === totalFeed - 1}
              onClick={(e) => { e.stopPropagation(); navigateFeed(1); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-auto transition-all bg-white/20 text-white
                ${feedIndex === totalFeed - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
            >
              <ChevronDown size={18} strokeWidth={3} />
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
