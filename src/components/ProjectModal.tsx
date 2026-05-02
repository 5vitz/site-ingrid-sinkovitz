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
  // 1. Definição de todos os Hooks (Sempre no topo, nunca pulados)
  const [feedIndex, setFeedIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldDuck, setShouldDuck] = useState(false);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200, 
    height: typeof window !== 'undefined' ? window.innerHeight : 800 
  });
  
  const touchStartRef = useRef<{ x: number, y: number } | null>(null);
  const isScrollingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 2. Callbacks e Efeitos (Todos antes de qualquer return condicional)
  
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

  // Calculamos o totalStories dentro do storyIndex para manter o hook estável
  const currentFeedForNav = Array.isArray(project?.feed) ? project?.feed[feedIndex] : null;
  const currentStoriesForNav = Array.isArray(currentFeedForNav?.stories) ? currentFeedForNav?.stories : [];
  const totalStoriesForNav = currentStoriesForNav.length + (currentFeedForNav ? 1 : 0);

  const navigateStory = useCallback((direction: 1 | -1) => {
    if (isScrollingRef.current) return;
    const next = storyIndex + direction;
    if (next >= 0 && next < totalStoriesForNav) {
      isScrollingRef.current = true;
      setStoryIndex(next);
      setTimeout(() => { isScrollingRef.current = false; }, 400);
    }
  }, [storyIndex, totalStoriesForNav]);

  // Zera o estado ao trocar de projeto
  useEffect(() => {
    if (project) {
      setFeedIndex(0);
      setStoryIndex(0);
      setShowPlayer(false);
      setIsMuted(true);
      setShouldDuck(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [project?.id]);

  // Carrega o áudio
  useEffect(() => {
    if (project?.audioUrl && audioRef.current) {
      audioRef.current.src = project.audioUrl;
      audioRef.current.load();
    }
  }, [project?.audioUrl]);

  // Audio mute/volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    audio.volume = shouldDuck ? 0.15 : 0.8;

    if (!isMuted && showPlayer) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isMuted, shouldDuck, showPlayer]);

  // Bloqueio de scroll do body
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [project]);

  // Resize listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Verificações de Dados e Renderização
  if (!project) return null;

  const theme = project.theme || {
    playerBg: 'bg-black',
    accentColor: '#00D154',
    playerBorder: 'border-white/10',
    navButtonBg: 'bg-[#00D154]/35',
    navButtonColor: 'text-black'
  };

  const totalFeed = Array.isArray(project.feed) ? project.feed.length : 0;
  const currentFeed = totalFeed > 0 ? project.feed[feedIndex] : null;
  const currentStories = Array.isArray(currentFeed?.stories) ? currentFeed.stories : [];
  const totalStories = currentStories.length + (currentFeed ? 1 : 0);
  const currentMedia = storyIndex === 0 ? currentFeed?.media : currentStories[storyIndex - 1];

  const viewportHeight = windowSize.height;
  const viewportWidth = windowSize.width;
  const isDesktop = viewportWidth > 1024;
  
  // Ajuste de dimensões: Altura fixa em 540px como base absoluta
  const baseHeight = theme.playerHeight || 540;
  
  // Largura definida no tema ou calculada pela proporção (mantedo fallback seguro)
  const currentAspectRatio = currentMedia?.aspectRatio || currentFeed?.aspectRatio || 1;
  const isHorizontal = currentAspectRatio > 1.2;
  
  // Se houver playerWidth no tema, usamos ele. Caso contrário, fallback baseado no tipo de layout
  const baseWidth = theme.playerWidth || (isHorizontal ? 960 : 540);
  
  const playerWidth = isDesktop ? baseWidth : Math.min(baseWidth, viewportWidth * 0.95);
  
  // Altura baseada na largura final para manter proporção se redimensionado no mobile
  let playerHeight = playerWidth / (baseWidth / baseHeight);
  
  const maxAllowedHeight = viewportHeight * 0.88;

  // Se a altura calculada for muito grande para a tela, reduzimos proporcionalmente
  if (playerHeight > maxAllowedHeight) {
    const ratio = maxAllowedHeight / playerHeight;
    playerHeight = maxAllowedHeight;
    // No mobile, se a altura for o limite, ajustamos a largura para manter o aspect ratio se necessário
    // Mas no desktop, preferimos manter a largura e permitir o crop se for PDF/Imagem scrollable
  }

  const handleStartTour = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlayer(true);
    setIsMuted(false); 
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isMuted) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-[#050510]/98 backdrop-blur-3xl flex items-center justify-center select-none overflow-hidden"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Fundo para fechar ao clicar fora */}
      <div className="absolute inset-0 z-0 bg-transparent" onClick={onClose} />

      <div 
        className="relative z-[10000] w-full max-w-7xl h-full flex items-center justify-center p-4 md:p-0" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-full h-full relative">
          {!showPlayer ? (
            <div className="flex flex-col items-center text-center max-w-lg bg-zinc-900 p-12 rounded-[12px] border border-white/10 shadow-2xl">
              {project.coverImage && (
                <img 
                  src={project.coverImage} 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[8px] object-cover mb-10 shadow-2xl border border-accent/30"
                  alt=""
                />
              )}
              <h2 className="text-3xl md:text-5xl font-black mb-6 italic uppercase tracking-tighter text-white leading-none">{project.title}</h2>
              <p className="text-zinc-400 font-medium mb-12 text-sm leading-relaxed max-w-xs">{project.description}</p>
              <button
                onClick={handleStartTour}
                className="px-14 py-5 bg-accent text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-105 transition-all shadow-2xl pointer-events-auto"
              >
                Iniciar Tour
              </button>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
            {/* Player Principal Container */}
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
                {/* O Player propriamente dito */}
                <div 
                  className={`w-full h-full ${theme.playerBg || 'bg-black'} overflow-hidden relative border ${theme.playerBorder || 'border-white/10'} ${theme.playerShadow || ''}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: theme.borderRadius || '12px',
                    borderWidth: theme.borderWidth || '1px',
                    boxShadow: theme.playerShadow ? undefined : `0 0 15px ${theme.accentColor}03`,
                    '--glow-color': theme.accentColor ? `${theme.accentColor}33` : undefined,
                    '--border-color': theme.accentColor ? `${theme.accentColor}11` : undefined,
                  } as React.CSSProperties}
                >
                  {/* Conteúdo interno */}
                  <div className="w-full h-full">
                    <MediaRenderer media={currentMedia} isActive={showPlayer} isMuted={isMuted} theme={theme} projectId={project.id} />
                  </div>
                </div>

                {/* Botões de Navegação Horizontais (Cards/Stories) */}
                <div className="hidden md:block">
                  {totalStories > 1 && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigateStory(-1); }}
                        className={`absolute -left-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full ${theme.navButtonBg || 'bg-accent/40'} ${theme.navButtonColor || 'text-white'} shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020] transition-all hover:scale-110 active:scale-95 ${storyIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        title="Anterior"
                      >
                        <ChevronLeft size={18} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigateStory(1); }}
                        className={`absolute -right-[47px] top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full ${theme.navButtonBg || 'bg-accent/40'} ${theme.navButtonColor || 'text-white'} shadow-[0_0_10px_rgba(0,0,0,0.5)] z-[10020] transition-all hover:scale-110 active:scale-95 ${storyIndex === totalStories - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        title="Próximo"
                      >
                        <ChevronRight size={18} strokeWidth={3} />
                      </button>
                    </>
                  )}
                </div>

                {/* Botão Fechar (X) */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  className={`absolute -top-4 -right-4 z-[10025] w-10 h-10 ${theme.closeButtonBg || 'bg-zinc-900'} border border-white/10 ${theme.closeButtonColor || 'text-white'} rounded-full flex items-center justify-center hover:scale-110 hover:border-accent/40 hover:text-accent transition-all shadow-2xl`}
                >
                  <X size={18} strokeWidth={3} />
                </button>

                {/* Botões de Navegação Verticais (Capítulos/Feeds) */}
                <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 -top-[47px] -bottom-[47px] flex-col items-center justify-between pointer-events-none z-[10010]">
                  <button 
                    disabled={feedIndex === 0}
                    onClick={(e) => { e.stopPropagation(); navigateFeed(-1); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.navButtonBg || 'bg-accent/40'} ${theme.navButtonColor || 'text-white'} shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-auto transition-all ${feedIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
                    title="Capítulo Anterior"
                  >
                    <ChevronUp size={18} strokeWidth={3} />
                  </button>
                  
                  <button 
                    disabled={feedIndex === totalFeed - 1}
                    onClick={(e) => { e.stopPropagation(); navigateFeed(1); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.navButtonBg || 'bg-accent/40'} ${theme.navButtonColor || 'text-white'} shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-auto transition-all ${feedIndex === totalFeed - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 active:scale-95'}`}
                    title="Próximo Capítulo"
                  >
                    <ChevronDown size={18} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
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
      // Usando o visualizador nativo, mas garantindo que o URL seja tratado corretamente
      // Para o style Mozilla (nativo), apenas o link direto funciona melhor
      const pdfUrl = media.url || '';
      
      return (
        <div className="w-full h-full bg-[#0a0a0a] overflow-hidden relative">
          <iframe 
            src={pdfUrl}
            className="absolute border-none pointer-events-auto block"
            style={{ 
              width: '100%',
              height: '100%',
              backgroundColor: '#333'
            }}
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
          className={`w-full ${media.allowScroll ? 'h-auto block min-h-0' : 'h-full object-cover'}`}
          style={{ 
            transform: `scale(${media.zoom || 1}) translateX(${media.xOffset || 0}px) translateY(${media.yOffset || 0}px)`,
            transformOrigin: media.allowScroll ? 'top center' : 'center center',
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
