import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project, FeedItem, MediaItem } from '../types';
import { X, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioPlayer } from './AudioPlayer';
import { MediaRenderer } from './MediaRenderer';
import { VerticalLayout } from './layouts/VerticalLayout';
import { HorizontalLayout } from './layouts/HorizontalLayout';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onVideoStateChange: (isPlaying: boolean) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  project, 
  onClose, 
  onVideoStateChange,
}) => {
  // 1. Definição de todos os Hooks
  const [feedIndex, setFeedIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [showPlayer, setShowPlayer] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayStateIcon, setShowPlayStateIcon] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_audio_volume');
      return saved ? parseFloat(saved) : 0.8;
    } catch (e) {
      return 0.8;
    }
  });
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [shouldDuck, setShouldDuck] = useState(false);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200, 
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });
  
  const totalFeed = project && Array.isArray(project.feed) ? project.feed.length : 0;
  const currentFeed = project && totalFeed > 0 ? project.feed[feedIndex] : null;
  const currentStories = currentFeed && Array.isArray(currentFeed.stories) ? currentFeed.stories : [];
  const totalStories = currentStories.length + (currentFeed ? 1 : 0);
  const totalStoriesForNav = totalStories;

  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const isScrollingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 2. Callbacks e Efeitos
  
  const navigateFeed = useCallback((direction: 1 | -1) => {
    if (isScrollingRef.current) return;
    const next = feedIndex + direction;
    if (project?.feed && Array.isArray(project.feed) && next >= 0 && next < project.feed.length) {
      isScrollingRef.current = true;
      setFeedIndex(next);
      setStoryIndex(0);
      setTimeout(() => { isScrollingRef.current = false; }, 500);
    }
  }, [feedIndex, project?.feed]);

  const navigateStory = useCallback((direction: number) => {
    if (isScrollingRef.current) return;
    const next = storyIndex + direction;
    if (next >= 0 && next < totalStoriesForNav) {
      isScrollingRef.current = true;
      setStoryIndex(next);
      setTimeout(() => { isScrollingRef.current = false; }, 400);
    }
  }, [storyIndex, totalStoriesForNav]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_audio_volume', audioVolume.toString());
    } catch (e) {
      // Silently fail if localStorage is blocked
    }
  }, [audioVolume]);

  const currentMedia = storyIndex === 0 ? currentFeed?.media : currentStories[storyIndex - 1];
  
  useEffect(() => {
    const isVideo = currentMedia?.type === 'video';
    setShouldDuck(isVideo && isPlaying && !isMuted);
  }, [currentMedia?.type, isPlaying, isMuted]);

  useEffect(() => {
    if (project) {
      setFeedIndex(0);
      setStoryIndex(0);
      setShowPlayer(true);
      setIsPlaying(true);
      setShowPlayStateIcon(null);
      setIsMuted(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [project?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !project?.audioUrl) {
      if (audio) audio.pause();
      return;
    }
    
    audio.src = project.audioUrl;
    audio.load();
    audio.muted = isMuted;
    audio.volume = shouldDuck ? audioVolume * 0.2 : audioVolume;

    const attemptPlay = () => {
      if (!isMuted && showPlayer) {
        audio.play().catch(err => {
          console.warn("Autoplay blocked/failed.", err);
        });
      }
    };

    audio.addEventListener('canplaythrough', attemptPlay);
    attemptPlay();

    return () => {
      audio.removeEventListener('canplaythrough', attemptPlay);
      audio.pause();
    };
  }, [project?.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = isMuted;
    audio.volume = shouldDuck ? audioVolume * 0.2 : audioVolume;

    const shouldPlay = !isMuted && showPlayer && isPlaying;

    if (shouldPlay) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isMuted, shouldDuck, showPlayer, audioVolume, isPlaying]);

  const togglePlay = useCallback(() => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    setShowPlayStateIcon(nextState);
    
    setTimeout(() => {
      setShowPlayStateIcon(null);
    }, 800);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showPlayer) return;
      
      switch (e.key) {
        case 'ArrowRight':
          navigateStory(1);
          break;
        case 'ArrowLeft':
          navigateStory(-1);
          break;
        case 'ArrowUp':
          navigateFeed(-1);
          break;
        case 'ArrowDown':
          navigateFeed(1);
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPlayer, navigateStory, navigateFeed, onClose, togglePlay]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!showPlayer || isScrollingRef.current) return;
      
      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) {
          navigateFeed(1);
        } else {
          navigateFeed(-1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [showPlayer, navigateFeed]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [project]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 40) {
        if (deltaX > 0) navigateStory(-1);
        else navigateStory(1);
      }
    } else {
      if (Math.abs(deltaY) > 40) {
        if (deltaY > 0) navigateFeed(-1);
        else navigateFeed(1);
      }
    }
  };

  if (!project) return null;

  const theme = project?.theme || {
    playerBg: 'bg-black',
    accentColor: '#00D154',
    playerBorder: 'border-white/10',
    navButtonBg: 'bg-[#00D154]/35',
    navButtonColor: 'text-black'
  };

  const viewportHeight = windowSize.height;
  const viewportWidth = windowSize.width;
  const isDesktop = viewportWidth > 1024;
  
  // Aspect Ratio: Prioriza o da mídia, depois o do feed, depois o padrão baseado em orientação
  let currentAspectRatio = currentMedia?.aspectRatio || currentFeed?.aspectRatio || 0.8;
  
  // Customização para projeto Auddar: 
  // Card 1, 2, 3 (feedIndex 0, 1, 2) -> 764:540 (~1.41)
  // Card 4+ (feedIndex >= 3) -> 1:1
  if (project?.id === 'projeto-auddar') {
    if (feedIndex <= 2) {
      currentAspectRatio = 764 / 540; 
    } else {
      currentAspectRatio = 1.0;
    }
  }
  
  const baseHeight = currentMedia?.playerHeight || theme.playerHeight || 540;
  const baseWidth = currentMedia?.playerWidth || (baseHeight * currentAspectRatio);
  const playerAspectRatio = baseWidth / baseHeight;
  
  let playerWidth = isDesktop ? baseWidth : Math.min(baseWidth, viewportWidth * 0.92);
  let playerHeight = playerWidth / playerAspectRatio;
  const maxAllowedHeight = viewportHeight * 0.88;

  if (playerHeight > maxAllowedHeight) {
    playerHeight = maxAllowedHeight;
    playerWidth = playerHeight * playerAspectRatio;
  }

  if (project?.id === 'projeto-auddar') {
    if (playerHeight > 540) {
      playerHeight = 540;
      playerWidth = playerHeight * currentAspectRatio;
    }
  }

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const renderLayout = () => {
    const layoutProps = {
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
    };

    if (project.layoutType === 'horizontal') {
      return <HorizontalLayout {...layoutProps} />;
    }

    return <VerticalLayout {...layoutProps} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 z-0 bg-transparent" onClick={onClose} />

      <div 
        className="relative z-[10000] w-full max-w-7xl h-full flex items-center justify-center p-4 md:p-0" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-full h-full relative">
          <div 
            className="relative flex items-center justify-center cursor-pointer group"
            style={{ width: playerWidth, height: playerHeight }}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          >
            {renderLayout()}

            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-[10030] pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md p-6 rounded-full">
                  <Pause size={48} className="text-white fill-white" />
                </div>
              </div>
            )}

            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onClose(); 
              }}
              className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-[10050] w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl"
              title="Fechar Projeto"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {project.audioUrl && (
        <>
          <audio 
            ref={audioRef} 
            src={project.audioUrl}
            loop 
            playsInline 
            preload="auto" 
          />
          <AudioPlayer 
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            volume={audioVolume}
            onVolumeChange={setAudioVolume}
          />
        </>
      )}
    </motion.div>
  );
};
