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
  const [feedIndex, setFeedIndex] = useState(0); // Horizontal (Topic)
  const [storyIndex, setStoryIndex] = useState(0); // Vertical (Sub-item)
  const [showPlayer, setShowPlayer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldDuck, setShouldDuck] = useState(false);
  
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const isScrollingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Zera o estado ao trocar de projeto
  useEffect(() => {
    setFeedIndex(0);
    setStoryIndex(0);
    setShowPlayer(false);
    setIsMuted(true);
    setShouldDuck(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [project?.id]);

  // Carrega o áudio assim que o projeto é selecionado (mas não dá play ainda)
  useEffect(() => {
    if (project?.audioUrl && audioRef.current) {
      audioRef.current.src = project.audioUrl;
      audioRef.current.load();
    }
  }, [project?.audioUrl]);

  // Controla o volume (ducking) e o estado de mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
    audio.volume = shouldDuck ? 0.15 : 0.8; // Reduzi um pouco o volume base e o ducking

    if (!isMuted && showPlayer) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio: Auto-play was prevented by the browser. Waiting for interaction.", error);
        });
      }
    } else {
      audio.pause();
    }
  }, [isMuted, shouldDuck, showPlayer]);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [project]);

  useEffect(() => {
    const handleHashChange = () => onClose();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onClose]);

  const currentFeed = project?.feed?.[feedIndex];
  const totalFeed = project?.feed?.length || 0;
  const currentStories = currentFeed?.stories || [];
  const totalStories = currentStories.length + 1;

  // Dimensões do Player dinâmicas - Ajustadas para maior flexibilidade
  const playerHeight = 540;
  const playerWidth = currentFeed ? Math.round(playerHeight * currentFeed.aspectRatio) : 960;

  const navigateFeed = useCallback((direction: 1 | -1) => {
    if (isScrollingRef.current) return;
    const next = feedIndex + direction;
    if (next >= 0 && next < totalFeed) {
      isScrollingRef.current = true;
      setFeedIndex(next);
      setStoryIndex(0); // Sempre volta para o primeiro card ao trocar de capítulo
      setTimeout(() => { isScrollingRef.current = false; }, 500);
    }
  }, [feedIndex, totalFeed]);

  const navigateStory = useCallback((direction: 1 | -1) => {
    if (isScrollingRef.current) return;
    const next = storyIndex + direction;
    if (next >= 0 && next < totalStories) {
      isScrollingRef.current = true;
      setStoryIndex(next);
      setTimeout(() => { isScrollingRef.current = false; }, 400);
    }
  }, [storyIndex, totalStories]);

  useEffect(() => {
    if (!project || !showPlayer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const isVertical = project.layoutType === 'vertical';

      if (isVertical) {
        if (e.key === 'ArrowDown') navigateFeed(1);
        if (e.key === 'ArrowUp') navigateFeed(-1);
        if (e.key === 'ArrowRight') navigateStory(1);
        if (e.key === 'ArrowLeft') navigateStory(-1);
      } else {
        if (e.key === 'ArrowRight') navigateFeed(1);
        if (e.key === 'ArrowLeft') navigateFeed(-1);
        if (e.key === 'ArrowDown') navigateStory(1);
        if (e.key === 'ArrowUp') navigateStory(-1);
      }
      
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, showPlayer, navigateFeed, navigateStory, onClose]);

  const currentMedia = storyIndex === 0 
    ? currentFeed?.media 
    : currentStories[storyIndex - 1];

  // Controla o "ducking" do áudio se a mídia atual for vídeo
  useEffect(() => {
    const isVideo = currentMedia?.type === 'video';
    setShouldDuck(isVideo);
    onVideoStateChange(isVideo);
  }, [currentMedia, onVideoStateChange]);

  // Navegação via Scroll do Mouse
  useEffect(() => {
    if (!project || !showPlayer) return;

    let scrollCooldown = false;
    const handleWheel = (e: WheelEvent) => {
      // Se a mídia atual permitir scroll, não interceptamos o wheel para navegação de cards
      // Deixamos o scroll nativo do navegador agir sobre o container com overflow-y-auto
      if (currentMedia?.allowScroll || (currentMedia?.images && currentMedia.images.length > 0)) {
        return;
      }

      if (scrollCooldown) return;
      const isVertical = project.layoutType === 'vertical';
      
      if (Math.abs(e.deltaY) > 30) { 
        scrollCooldown = true;
        if (e.deltaY > 0) {
          if (isVertical) navigateFeed(1);
          else navigateStory(1);
        } else {
          if (isVertical) navigateFeed(-1);
          else navigateStory(-1);
        }
        
        setTimeout(() => {
          scrollCooldown = false;
        }, 600);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [project, showPlayer, navigateFeed, navigateStory, currentMedia]);

  // Navegação via Touch (Swipe)
  useEffect(() => {
    if (!project || !showPlayer) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };

      const dx = touchEnd.x - touchStartRef.current.x;
      const dy = touchEnd.y - touchStartRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Se a mídia atual permitir scroll vertical interno, ignoramos o swipe vertical se o usuário estiver scrollando o texto
      const target = e.target as HTMLElement;
      const isInsideScrollable = target.closest('.overflow-y-auto');
      
      if (absDx > 40 || absDy > 40) {
        const isVerticalLayout = project.layoutType === 'vertical';

        if (absDx > absDy) {
          // Horizontal Swipe
          if (dx > 0) {
            if (isVerticalLayout) navigateStory(-1);
            else navigateFeed(-1);
          } else {
            if (isVerticalLayout) navigateStory(1);
            else navigateFeed(1);
          }
        } else {
          // Vertical Swipe
          // Só interceptamos o swipe vertical se não estivermos dentro de um elemento de scroll ou se o scroll estiver nos limites
          if (!isInsideScrollable) {
            if (dy > 0) {
              if (isVerticalLayout) navigateFeed(-1);
              else navigateStory(-1);
            } else {
              if (isVerticalLayout) navigateFeed(1);
              else navigateStory(1);
            }
          }
        }
      }
      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [project, showPlayer, navigateFeed, navigateStory, currentMedia]);

  if (!project) return null;

  const handleStartTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Iniciando tour e áudio para:", project.title);
    setShowPlayer(true);
    setIsMuted(false); 
    
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.8;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Erro ao tocar áudio no clique:", err);
          setTimeout(() => audioRef.current?.play(), 100);
        });
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
    setIsMuted(!isMuted);
  };

  return (
    <>
      {project && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#050510]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 select-none overflow-hidden"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* Fundo para fechar ao clicar fora */}
          <div className="absolute inset-0 z-0 bg-transparent" onClick={onClose} />

          <div 
            className="relative z-[10000] w-full max-w-7xl h-full flex items-center justify-center" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-full h-full relative">
              {!showPlayer ? (
                <div className="flex flex-col items-center text-center max-w-lg bg-zinc-900 p-12 rounded-[8px] border border-white/10 shadow-2xl">
                  {project.coverImage && (
                    <img 
                      src={project.coverImage} 
                      className="w-32 h-32 md:w-40 md:h-40 rounded-[8px] object-cover mb-10 shadow-2xl border border-accent/30"
                      alt=""
                    />
                  )}
                  <h2 className="text-3xl md:text-5xl font-black mb-6 italic uppercase tracking-tighter text-white">{project.title}</h2>
                  <p className="text-zinc-400 font-medium mb-12 text-sm leading-relaxed max-w-xs">{project.description}</p>
                  <button
                    onClick={handleStartTour}
                    className="px-14 py-5 bg-accent text-white font-black uppercase tracking-[0.2em] text-xs rounded-full hover:scale-105 transition-all shadow-2xl pointer-events-auto"
                  >
                    Iniciar Tour
                  </button>
                </div>
              ) : (
                <div className="relative flex items-center justify-center" style={{ perspective: '2000px' }}>
                  {/* Player Principal Container - Agora sem animação para corte seco */}
                  <div 
                    className="relative z-10"
                    style={{ 
                      maxWidth: '98vw', 
                      maxHeight: 'calc(100svh - 60px)', 
                      width: playerWidth,
                      height: playerHeight
                    }}
                  >
                    {/* O Player propriamente dito */}
                    <div 
                      className={`w-full h-full bg-black rounded-[8px] overflow-hidden relative shadow-2xl ${project.id === 'projeto-lion-jump' ? 'border-[#FEF200]/40 border shadow-[0_0_8px_rgba(254,242,0,0.3),0_0_15px_rgba(254,242,0,0.1),0_0_2px_rgba(254,242,0,0.4)_inset]' : 'border border-white/10'}`}
                    >
                      {/* Conteúdo interno com corte seco */}
                      <div className="w-full h-full overflow-hidden">
                        {/* Media Renderer */}
                        <MediaRenderer media={currentMedia} isActive={showPlayer} isMuted={isMuted} />
                      </div>
                    </div>

                    {/* Setas de Navegação interna (Stories) - FORA do overflow-hidden */}
                    <div className="hidden md:block">
                      {totalStories > 1 && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigateStory(-1); }}
                            className={`absolute -left-10 top-1/2 -translate-y-1/2 w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#00D154]/35 text-black z-[10020] transition-all ${storyIndex === 0 ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 hover:bg-accent hover:scale-110 active:scale-95 pointer-events-auto'}`}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigateStory(1); }}
                            className={`absolute -right-10 top-1/2 -translate-y-1/2 w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#00D154]/35 text-black z-[10020] transition-all ${storyIndex === totalStories - 1 ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 hover:bg-accent hover:scale-110 active:scale-95 pointer-events-auto'}`}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Botão Fechar (X) */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onClose(); }}
                      className="absolute -top-3 -right-3 z-[10020] w-8 h-8 bg-zinc-900 border border-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>

                    {/* Controles do Feed (Horizontal ou Vertical) - Acoplado aos lados do player */}
                    <div className={`hidden md:flex absolute ${project.layoutType === 'vertical' ? 'inset-x-0 -top-10 -bottom-10 flex-col' : 'inset-y-0 -left-10 -right-10 flex-row'} items-center justify-between pointer-events-none z-[10010]`}>
                      <button 
                        disabled={feedIndex === 0}
                        onClick={(e) => { e.stopPropagation(); navigateFeed(-1); }}
                        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center bg-[#00D154]/35 text-black pointer-events-auto transition-all ${feedIndex === 0 ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 hover:bg-accent hover:scale-110 active:scale-95'}`}
                      >
                        <ChevronUp size={16} />
                      </button>
                      
                      <button 
                        disabled={feedIndex === totalFeed - 1}
                        onClick={(e) => { e.stopPropagation(); navigateFeed(1); }}
                        className={`w-[30px] h-[30px] rounded-full flex items-center justify-center bg-[#00D154]/35 text-black pointer-events-auto transition-all ${feedIndex === totalFeed - 1 ? 'opacity-0 pointer-events-none scale-50' : 'opacity-100 hover:bg-accent hover:scale-110 active:scale-95'}`}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>


                  {/* Mobile navigation controls removed for minimalism */}
                </div>
              )}
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
                crossOrigin="anonymous"
              />
              <AudioPlayer 
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

interface MediaRendererProps {
  media?: MediaItem;
  isActive: boolean;
  isMuted?: boolean;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ media, isActive, isMuted = true }) => {
  if (!media) return null;

  if (media.type === 'video') {
    return (
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
    );
  }

  if (media.type === 'image') {
    if (media.images && media.images.length > 0) {
      return (
        <div className="w-full h-full bg-black overflow-y-auto custom-scrollbar flex flex-col">
          <div className="relative w-full">
            {media.images.map((url, i) => (
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
            ))}
            
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
    return (
      <div className={`w-full h-full bg-black flex items-center justify-center ${media.allowScroll ? 'overflow-y-auto custom-scrollbar items-start' : 'overflow-hidden'}`}>
        <img 
          src={media.url} 
          className={`w-full ${media.allowScroll ? 'h-auto block min-h-full' : 'h-full object-contain'}`}
          style={{ 
            transform: `scale(${media.zoom || 1}) translateX(${media.xOffset || 0}px) translateY(${media.yOffset || 0}px)`,
            transformOrigin: 'center center'
          }}
          alt={media.title || ''}
        />
      </div>
    );
  }

  if (media.type === 'iframe') {
    return (
      <div className="w-full h-full bg-white relative overflow-hidden">
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
                {media.title}
              </h1>
              
              {media.subtitle && (
                <p className="text-zinc-500 text-lg md:text-xl leading-snug mb-6 font-medium">
                  {media.subtitle}
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
                {media.content?.split('\n\n').map((paragraph, idx) => {
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
      <div className="w-full h-full relative flex flex-col p-8 md:p-12 overflow-hidden bg-white group">
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
           <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar flex flex-col items-center justify-center text-center">
             {media.title && (
               <>
                 <h3 className="text-xl md:text-2xl font-black text-zinc-900 mb-4 leading-tight uppercase tracking-tighter italic">
                   {media.title}
                 </h3>
                 <div className="w-12 h-1 bg-accent mb-6" />
               </>
             )}
             
             {media.subtitle && (
               <p className="text-zinc-700 text-xs md:text-sm font-bold tracking-wider uppercase leading-relaxed max-w-[90%] mb-6">
                 {media.subtitle}
               </p>
             )}

             {media.content && (
               <div className="text-zinc-600 text-[13px] md:text-[15px] leading-relaxed text-justify space-y-4 font-normal font-sans tracking-tight">
                 {media.content.split('\n\n').map((paragraph, idx) => (
                   <p key={idx}>{paragraph}</p>
                 ))}
               </div>
             )}
           </div>

           {(media.credits || media.label) && (
             <div className="w-full pt-6 mt-4 border-t border-zinc-200/60 shrink-0">
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

  return (
    <img 
      src={media.url} 
      className={`w-full h-full ${media.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
      style={{ transform: media.zoom ? `scale(${media.zoom})` : undefined }}
      alt=""
      referrerPolicy="no-referrer"
    />
  );
};
