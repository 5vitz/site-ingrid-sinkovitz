import React from 'react';
import { ExternalLink, FileText, Smartphone } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaRendererProps {
  media?: MediaItem;
  isActive: boolean;
  isMuted?: boolean;
  isPlaying?: boolean;
  theme: any;
  projectId?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  media, 
  isActive, 
  isMuted = true, 
  isPlaying = true,
  theme, 
  projectId 
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying && isActive) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silently fail if autoplay is blocked
          });
        }
      } else {
        video.pause();
      }
    }
  }, [isPlaying, isActive]);

  if (!media) return null;
  
  // Fallback for Auddar project if specific media items need scroll but aren't flagged in DB
  const forceScroll = projectId === 'projeto-auddar' && 
    (media.id === 'auddar-04' || media.id === 'auddar-05' || media.url?.includes('04-Parceria.png') || media.url?.includes('05-Email.png'));
  const allowScroll = media.allowScroll || forceScroll;

  if (media.type === 'video') {
    if (!media.url) return <div className="w-full h-full bg-zinc-900 animate-pulse" />;
    return (
      <div className="w-full h-full relative bg-black">
        <video
          ref={videoRef}
          key={media.url}
          src={media.url}
          className={`w-full h-full ${media.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}
          style={{ 
            transform: `scale(${media.zoom || 1}) translateX(${media.xOffset || 0}px) translateY(${media.yOffset || 0}px)`,
            transformOrigin: 'center center'
          }}
          autoPlay={isActive && isPlaying}
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
      // Usando o viewer do Google para evitar bloqueios de X-Frame-Options
      const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
      
      return (
        <div className="w-full h-full bg-[#0a0a0a] overflow-hidden relative group">
          <iframe 
            src={viewerUrl}
            className="absolute inset-0 w-full h-full border-none pointer-events-auto"
            title={media.title || 'PDF Document'}
            scrolling="yes"
          />
          {/* Instrução visual na base */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl">
              <p className="text-[10px] text-white/90 font-bold uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={12} className="text-blue-400" />
                Interaja com o PDF ou use as setas
              </p>
            </div>
          </div>
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
      <div className={`w-full h-full relative ${allowScroll ? 'overflow-y-auto bg-black custom-scrollbar' : 'overflow-hidden'}`}>
        <div className={`${allowScroll ? 'w-full block relative' : 'w-full h-full flex items-center justify-center'}`}>
          <img 
            src={media.url} 
            className={`w-full block ${allowScroll ? 'h-auto !min-h-[101%]' : `h-full ${media.objectFit === 'contain' ? 'object-contain' : 'object-cover'}`}`}
            style={{ 
              transformBasis: 'auto',
              flexShrink: 0,
              display: 'block'
            }}
            alt={media.title || ''}
            referrerPolicy="no-referrer"
          />
          {allowScroll && <div className="h-64 w-full" />} 
        </div>
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
