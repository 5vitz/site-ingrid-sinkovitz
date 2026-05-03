import React from 'react';
import { Project, FeedItem, MediaItem } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

export const HorizontalLayout: React.FC<LayoutProps> = ({
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
          className={`w-full h-full ${theme.playerBg || 'bg-black'} overflow-hidden relative border ${theme.playerBorder || 'border-white/10'} ${theme.playerShadow || ''}`}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            borderWidth: '1px',
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
            />
          </div>
        </div>

        {/* Navegação de Stories (Horizontal) */}
        <div className="hidden md:block">
          {totalStories > 1 && (
            <>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigateStory(-1);
                }}
                className={`absolute -left-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020] bg-white/20 text-white
                  ${storyIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  navigateStory(1);
                }}
                className={`absolute -right-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020] bg-white/20 text-white
                  ${storyIndex === totalStories - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <ChevronRight size={18} strokeWidth={3} />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
