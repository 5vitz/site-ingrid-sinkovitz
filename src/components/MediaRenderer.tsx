import React from 'react';
import { ExternalLink, FileText, Smartphone, LayoutGrid } from 'lucide-react';
import { MediaItem } from '../types';

import { PDFViewer } from './PDFViewer';

interface MediaRendererProps {
  media?: MediaItem;
  isActive: boolean;
  isMuted?: boolean;
  isPlaying?: boolean;
  theme: any;
  projectId?: string;
  feedIndex?: number;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  media, 
  isActive, 
  isMuted = true, 
  isPlaying = true,
  theme, 
  projectId,
  feedIndex
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

  // Determinar tipo e propriedades locais para evitar mutar o objeto original (prop)
  let renderType = media.type;
  let renderUrl = media.url;
  
  // Override para projeto Auddar (cards 1, 2 e 3 são documentos longos)
  const isAuddarProject = projectId?.toLowerCase() === 'projeto-auddar' || projectId?.toLowerCase() === 'auddar';
  
  // Detecção por índice (Card 1, 2 e 3) ou por características do objeto (ID ou Título)
  const isFirstThreeCards = typeof feedIndex === 'number' && feedIndex <= 2;
  const isAuddarDocument = isAuddarProject && (
    isFirstThreeCards || 
    media.allowScroll === true || 
    media.id?.includes('auddar-03') || 
    media.id?.includes('auddar-04') || 
    media.id?.includes('auddar-05') ||
    media.title?.toLowerCase().includes('apresentação') ||
    media.title?.toLowerCase().includes('parceria') ||
    media.title?.toLowerCase().includes('email')
  );

  // Garantia ABSOLUTA de URL e TIPO para Auddar Card 1
  if (isAuddarProject && (feedIndex === 0 || media.id === 'auddar-03' || media.title?.toLowerCase().includes('apresentação'))) {
    renderType = 'image' as any;
    // Se a URL estiver vazia ou for de um PDF antigo, forçamos o JPG
    if (!renderUrl || renderUrl === '' || renderUrl.toLowerCase().includes('.pdf')) {
      renderUrl = 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Projetos%2Fprojeto5%2F03-Apresentacao_page-0001.jpg?alt=media&token=a6f10c92-e431-45b3-9c51-42d3391cbe67';
    }
  }

  if (isAuddarDocument) {
    renderType = 'image' as any;
  }
  
  const allowScroll = media.allowScroll || isAuddarDocument;

  if (renderType === 'video') {
    if (!renderUrl) return (
      <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-2 border border-white/5">
        <Smartphone size={24} className="text-zinc-800" />
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-800">Vídeo não selecionado</span>
      </div>
    );
    return (
      <div className="w-full h-full relative bg-zinc-950">
        <video
          ref={videoRef}
          key={renderUrl}
          src={renderUrl}
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

  if (renderType === 'pdf') {
    return (
      <PDFViewer 
        url={renderUrl || ''} 
        title={media.title} 
      />
    );
  }

  if (renderType === 'image') {
    if (media.images && media.images.length > 0) {
      return (
        <div className={`w-full h-full ${theme.playerBg || 'bg-zinc-950'} overflow-y-auto custom-scrollbar flex flex-col m-0 p-0`}>
          <div className="relative w-full flex flex-col m-0 p-0">
            {media.images.map((url, i) => {
              if (!url) return null;
              return (
                <img 
                  key={i}
                  src={url} 
                  className="w-full h-auto block m-0 p-0"
                  style={{ 
                    transform: media.zoom ? `scale(${media.zoom})` : 'scale(1)',
                    transformOrigin: 'top center',
                    display: 'block'
                  }}
                  alt=""
                  referrerPolicy="no-referrer"
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
    
    if (!renderUrl) return (
      <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center gap-3 border border-white/5 opacity-20">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Conteúdo em breve</span>
      </div>
    );
    
    // For Auddar project, if not scrolling, use object-contain to avoid cutting images that aren't perfectly square
    const objectFitClass = isAuddarProject && !allowScroll ? 'object-contain' : (media.objectFit === 'contain' ? 'object-contain' : 'object-cover');

    // Prioridade máxima para o projeto Auddar
    const loadingStrategy = isAuddarProject || isFirstThreeCards ? "eager" : "lazy";

    return (
      <div className={`w-full h-full relative ${allowScroll ? 'overflow-y-scroll bg-zinc-950 custom-scrollbar m-0 p-0' : 'overflow-hidden m-0 p-0'}`}>
        <div className={`${allowScroll ? 'w-full block relative m-0 p-0' : 'w-full h-full flex items-center justify-center bg-zinc-950 m-0 p-0'}`}>
          <img 
            key={renderUrl}
            src={renderUrl} 
            className={`w-full block object-top m-0 p-0 ${allowScroll ? 'h-auto min-h-full' : `h-full ${objectFitClass}`}`}
            style={{ 
              transformBasis: 'auto',
              flexShrink: 0,
              display: 'block'
            }}
            alt={media.title || ''}
            referrerPolicy="no-referrer"
            loading={loadingStrategy}
            fetchPriority={isAuddarProject ? "high" : "auto"}
          />
        </div>
      </div>
    );
  }

  if (renderType === 'iframe') {
    return (
      <div className={`w-full h-full ${theme.playerBg || 'bg-black'} relative overflow-hidden`}>
        <iframe 
          src={renderUrl}
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

  if (renderType === 'text') {
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
        {renderUrl && (
          <img 
            src={renderUrl} 
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
