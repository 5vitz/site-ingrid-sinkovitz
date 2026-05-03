import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project, FeedItem, MediaItem } from '../types';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioPlayer } from './AudioPlayer';

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
  const [isMuted, setIsMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.8);
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

  const navigateStory = useCallback((direction: 1 | -1) => {
    if (isScrollingRef.current) return;
    const next = storyIndex + direction;
    if (next >= 0 && next < totalStoriesForNav) {
      isScrollingRef.current = true;
      setStoryIndex(next);
      setTimeout(() => { isScrollingRef.current = false; }, 400);
    }
  }, [storyIndex, totalStoriesForNav]);

  useEffect(() => {
    if (project) {
      setFeedIndex(0);
      setStoryIndex(0);
      setShowPlayer(true);
      setIsMuted(false);
      setShouldDuck(false);

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
    
    // Always update src when audioUrl of the specific project changes
    audio.src = project.audioUrl;
    audio.load();
    audio.muted = isMuted;
    audio.volume = shouldDuck ? audioVolume * 0.2 : audioVolume;

    const attemptPlay = () => {
      // Browsers often block autoplay without interaction. 
      // Since clicking the project is an interaction, this should work.
      if (!isMuted && showPlayer) {
        audio.play().catch(err => {
          console.warn("Autoplay blocked/failed.", err);
        });
      }
    };

    audio.addEventListener('canplaythrough', attemptPlay);
    // Try to play immediately if cached or already ready
    attemptPlay();

    return () => {
      audio.removeEventListener('canplaythrough', attemptPlay);
      audio.pause();
    };
  }, [project?.audioUrl]); // Removing project.id to avoid unnecessary resets if URL is same

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = isMuted;
    audio.volume = shouldDuck ? audioVolume * 0.2 : audioVolume;

    const shouldPlay = !isMuted && showPlayer;

    if (shouldPlay) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isMuted, shouldDuck, showPlayer, audioVolume]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showPlayer) return;
      
      const isHorizontalLayout = project?.layoutType === 'horizontal';
      
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
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPlayer, navigateStory, navigateFeed, onClose, project?.layoutType, storyIndex, totalStoriesForNav]);

  // Bloqueio de scroll do body
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

  if (!project) return null;

  const handleStartTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlayer(true);
    setIsMuted(false); 
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
    }
  };

  const isLionJump = project?.id === 'projeto-lion-jump';
  const isEloBike = project?.id === 'projeto-elobike';
  const isAuddar = project?.id === 'projeto-auddar';

  const theme = project?.theme || {
    playerBg: 'bg-black',
    accentColor: '#00D154',
    playerBorder: 'border-white/10',
    navButtonBg: 'bg-[#00D154]/35',
    navButtonColor: 'text-black'
  };

  const currentMedia = storyIndex === 0 ? currentFeed?.media : currentStories[storyIndex - 1];

  const viewportHeight = windowSize.height;
  const viewportWidth = windowSize.width;
  const isDesktop = viewportWidth > 1024;
  
  const baseHeight = (isEloBike || isAuddar) ? 540 : (currentMedia?.playerHeight || theme.playerHeight || 540);
  const currentAspectRatio = currentMedia?.aspectRatio || currentFeed?.aspectRatio || 1;
  const isHorizontal = currentAspectRatio > 1.2;
  const baseWidth = isEloBike ? 432 : (isAuddar ? 540 : (currentMedia?.playerWidth || theme.playerWidth || (isHorizontal ? 960 : 540)));
  
  const playerWidth = isDesktop ? baseWidth : Math.min(baseWidth, viewportWidth * 0.95);
  let playerHeight = playerWidth / (baseWidth / baseHeight);
  const maxAllowedHeight = viewportHeight * 0.88;

  if (playerHeight > maxAllowedHeight) {
    playerHeight = maxAllowedHeight;
  }

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-[#050510]/98 backdrop-blur-3xl flex items-center justify-center select-none overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-transparent" onClick={onClose} />

      <div 
        className="relative z-[10000] w-full max-w-7xl h-full flex items-center justify-center p-4 md:p-0" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-full h-full relative">
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
                  className={`w-full h-full ${theme.playerBg || 'bg-black'} overflow-hidden relative border ${isLionJump ? (theme.playerBorder || 'border-white/10') : 'border-zinc-500/20'} ${theme.playerShadow || ''}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    borderWidth: '1px',
                  } as React.CSSProperties}
                >
                  <div className="w-full h-full">
                    <MediaRenderer media={currentMedia} isActive={true} isMuted={isMuted} theme={theme} projectId={project?.id} />
                  </div>
                </div>

                <div className="hidden md:block">
                  {/* Story Navigation (Sides) */}
                  {totalStories > 1 && (
                    <>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigateStory(-1);
                        }}
                        className={`absolute -left-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020]
                          ${isLionJump 
                            ? 'bg-[#0c9347] text-white hover:bg-[#0c9347]/80'
                            : 'bg-white/40 backdrop-blur-md text-black border border-white/10'
                          } 
                          ${storyIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                      >
                        <ChevronLeft size={18} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigateStory(1);
                        }}
                        className={`absolute -right-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020]
                          ${isLionJump 
                            ? 'bg-[#0c9347] text-white hover:bg-[#0c9347]/80'
                            : 'bg-white/40 backdrop-blur-md text-black border border-white/10'
                          }
                          ${storyIndex === totalStories - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                      >
                        <ChevronRight size={18} strokeWidth={3} />
                      </button>
                    </>
                  )}
                </div>

                {/* Feed Navigation (Vertical) */}
                {totalFeed > 1 && (
                  <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 -top-[47px] -bottom-[47px] flex-col items-center justify-between pointer-events-none z-[10010]">
                    <button 
                      disabled={feedIndex === 0}
                      onClick={(e) => { e.stopPropagation(); navigateFeed(-1); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-auto transition-all
                        ${isLionJump 
                          ? 'bg-[#0c9347] text-white hover:bg-[#0c9347]/80'
                          : 'bg-white/40 backdrop-blur-md text-black border border-white/10'
                        }
                        ${feedIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
                    >
                      <ChevronUp size={18} strokeWidth={3} />
                    </button>
                    
                    <button 
                      disabled={feedIndex === totalFeed - 1}
                      onClick={(e) => { e.stopPropagation(); navigateFeed(1); }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-auto transition-all
                        ${isLionJump 
                          ? 'bg-[#0c9347] text-white hover:bg-[#0c9347]/80'
                          : 'bg-white/40 backdrop-blur-md text-black border border-white/10'
                        }
                        ${feedIndex === totalFeed - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
                    >
                      <ChevronDown size={18} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          {/* Botão Fechar (X) Sempre Visível */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className={`absolute top-4 right-4 md:-top-4 md:-right-4 z-[10025] w-10 h-10 bg-zinc-900 border border-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl`}
          >
            <X size={18} strokeWidth={3} />
          </button>
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

interface MediaRendererProps {
  media?: MediaItem;
  isActive: boolean;
  isMuted?: boolean;
  theme: any;
  projectId?: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ media, isActive, isMuted = true, theme, projectId }) => {
  if (!media) return null;
  
  if (media.type === 'video') {
    if (!media.url) return <div className="w-full h-full bg-zinc-900 animate-pulse" />;
    return (
      <div className="w-full h-full relative bg-black">
        <video
          key={media.url}
          src={media.url}
          className={`w-full h-full ${media.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
          style={{ 
            transform: `scale(${media.zoom || 1}) translateX(${media.xOffset || 0}px) translateY(${media.yOffset || 0}px)`,
            transformOrigin: 'center center'
          }}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
        />
      </div>
    );
  }

  if (media.type === 'image' || media.type === 'pdf') {
    const isPDF = media.type === 'pdf' || media.url?.toLowerCase().includes('.pdf');
    if (isPDF) {
      const pdfUrl = media.url || '';
      // Wrapper do Google Docs para embutir PDF sem erros de CORS ou Frame
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
      
      return (
        <div className="w-full h-full bg-[#0a0a0a] overflow-hidden relative">
          <iframe 
            src={viewerUrl}
            className="absolute inset-0 w-full h-full border-none pointer-events-auto"
            title={media.title || 'PDF Document'}
          />
        </div>
      );
    }

    if (media.images && media.images.length > 0) {
      return (
        <div className="w-full h-full bg-black overflow-y-auto custom-scrollbar flex flex-col">
          <div className="relative w-full">
            {media.images.map((url, i) => {
              if (!url) return null;
              return (
                <img 
                  key={i}
                  src={url} 
                  className="w-full h-auto block"
                  style={{ 
                    transform: media.zoom ? `scale(${media.zoom})` : 'scale(1)',
                    transformOrigin: 'top center'
                  }}
                  alt=""
                />
              );
            })}
            
            {/* Camadas (Overlays) para imagens empilhadas */}
            {media.overlays?.map((overlay) => (
              <div 
                key={overlay.id}
                className="absolute pointer-events-auto overflow-hidden"
                style={{
                  top: overlay.top,
                  left: overlay.left,
                  width: overlay.width,
                  height: overlay.height,
                  backgroundColor: overlay.type === 'color' ? overlay.color : undefined,
                  zIndex: 20,
                  transform: media.zoom ? `scale(${media.zoom})` : 'scale(1)',
                  transformOrigin: 'top center'
                }}
              >
                {overlay.type === 'image' && overlay.url && (
                  <img src={overlay.url} className="w-full h-full object-cover" alt="" />
                )}
                {overlay.type === 'video' && overlay.url && (
                  <video 
                    src={overlay.url} 
                    className="w-full h-full object-cover" 
                    controls 
                    playsInline
                    loop
                    muted
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (!media.url) return <div className="w-full h-full bg-zinc-900 animate-pulse" />;
    return (
      <div className={`w-full h-full relative ${media.allowScroll ? 'overflow-y-scroll overflow-x-hidden custom-scrollbar pr-1' : 'overflow-hidden'}`}>
        <img 
          src={media.url} 
          className={`w-full ${media.allowScroll ? 'h-auto block min-h-0' : `h-full ${media.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}`}
          style={{ 
            transform: `scale(${media.zoom || 1}) translateX(${media.xOffset || 0}px) translateY(${media.yOffset || 0}px)`,
            transformOrigin: media.allowScroll ? 'top center' : 'center center',
            objectPosition: media.objectPosition || 'center center',
            display: 'block',
            width: '100%',
          }}
          alt={media.title || ''}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (media.type === 'iframe') {
    return (
      <div className={`w-full h-full ${theme.playerBg || 'bg-black'} relative overflow-hidden`}>
        <iframe 
          src={media.url}
          className="w-full h-full border-none"
          style={{ 
            transform: media.zoom ? `scale(${media.zoom})` : undefined,
            transformOrigin: 'top left',
            width: media.zoom ? `${100 / media.zoom}%` : '100%',
            height: media.zoom ? `${100 / media.zoom}%` : '100%',
          }}
          title={media.title || 'External Content'}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (media.type === 'text') {
    const content = typeof media.content === 'string' ? media.content : '';
    const title = typeof media.title === 'string' ? media.title : '';
    const subtitle = typeof media.subtitle === 'string' ? media.subtitle : '';

    if (media.layout === 'gshow') {
      return (
        <div className="w-full h-full bg-white relative flex flex-col font-sans text-black">
          {/* Header Gshow */}
          <div className="bg-[#ff4e00] text-white px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter">gshow</span>
              <div className="h-4 w-[1px] bg-white/30 mx-1" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">SuperStar</span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-6 py-8 custom-scrollbar">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-zinc-900 font-sans tracking-tight">
                {title}
              </h1>
              
              {subtitle && (
                <p className="text-zinc-500 text-lg md:text-xl leading-snug mb-6 font-medium">
                  {subtitle}
                </p>
              )}

              {media.credits && (
                <div className="flex flex-col mb-8 text-[11px] text-zinc-400 font-sans border-b border-zinc-100 pb-4">
                  {media.credits.split('\n').map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </div>
              )}

              <div className="space-y-6 text-zinc-800 text-[16px] leading-[1.6]">
                {content?.split('\n\n').map((paragraph, idx) => {
                  // Se houver placeholders de imagem [IMAGE:0], [IMAGE:1], etc.
                  const imageRegex = /\[IMAGE:(\d+)\]/g;
                  if (imageRegex.test(paragraph)) {
                    const match = paragraph.match(/\[IMAGE:(\d+)\]/);
                    const imgIndex = match ? parseInt(match[1]) : 0;
                    const imageUrl = media.images?.[imgIndex];
                    
                    return (
                      <div key={idx} className="my-8">
                        {imageUrl && (
                          <div className="relative aspect-video bg-zinc-100 rounded-sm overflow-hidden mb-2">
                            <img src={imageUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                        )}
                        {/* Se houver legenda logo após o placeholder na mesma linha */}
                        <p className="text-zinc-400 text-xs italic">
                          {paragraph.replace(/\[IMAGE:\d+\]/, '').trim()}
                        </p>
                      </div>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full relative flex flex-col overflow-hidden bg-white group">
        {media.url && (
          <img 
            src={media.url} 
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125 transition-transform duration-1000 group-hover:scale-110" 
            alt="" 
          />
        )}
        
        {/* Subtle texture/gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-50/50 via-white to-zinc-100/30" />

        <div className="relative z-10 flex flex-col h-full w-full">
            <div className={`flex-grow overflow-y-scroll overflow-x-hidden custom-scrollbar flex flex-col ${media.content && media.content.length > 300 ? 'justify-start' : 'justify-center'} items-center`}>
              <div className="w-full px-8 md:px-12 py-12 flex flex-col items-center text-center">
                {media.title && (
                  <>
                    <h3 className="text-xl md:text-2xl font-black text-zinc-900 mb-4 leading-tight uppercase tracking-tighter italic shrink-0">
                      {media.title}
                    </h3>
                    <div className="w-12 h-1 bg-accent mb-6 shrink-0" />
                  </>
                )}
                
                {media.subtitle && (
                  <p className="text-zinc-700 text-xs md:text-sm font-bold tracking-wider uppercase leading-relaxed max-w-[90%] mb-6 shrink-0">
                    {media.subtitle}
                  </p>
                )}
                
                {media.content && (
                  <div className="text-zinc-600 text-[13px] md:text-[15px] leading-relaxed text-center space-y-4 font-normal font-sans tracking-tight">
                    {media.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {(media.credits || media.label) && (
             <div className="w-full px-8 md:px-12 pb-8 pt-4 mt-auto border-t border-zinc-200/60 shrink-0">
               {media.credits && (
                 <pre className="text-zinc-400 text-[9px] uppercase tracking-[0.15em] font-sans whitespace-pre-wrap leading-relaxed mb-2">
                   {media.credits}
                 </pre>
               )}
               {media.label && (
                 <p className="text-zinc-400 text-[8px] italic tracking-tight font-serif">
                   {media.label}
                 </p>
               )}
             </div>
           )}
        </div>
      </div>
    );
  }

  return null;
};
