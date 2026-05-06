import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // O visualizador da Mozilla (PDF.js) via GitHub Pages é excelente para Desktop.
  // Passamos o arquivo via 'file' parameter.
  const mozillaViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`;

  const handleReload = () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
  };

  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col relative overflow-hidden group">
      {/* Header do Visualizador - Mais sutil */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-accent" />
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest truncate max-w-[200px]">
            {title || 'Documento PDF'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); handleReload(); }}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors group/btn"
          >
            <RefreshCw size={14} className={`text-white/40 group-hover/btn:text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors group/btn"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} className="text-white/40 group-hover/btn:text-white" />
          </a>
        </div>
      </div>

      {/* Frame do Visualizador */}
      <div className="flex-grow mt-0 relative bg-[#0a0a0a]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-10">
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Renderizando Documento...</p>
          </div>
        )}

        <iframe 
          key={`${url}-${retryCount}`}
          src={mozillaViewerUrl}
          className="w-full h-full border-none pointer-events-auto"
          onLoad={() => setLoading(false)}
          title={title || 'PDF Document'}
          allowFullScreen
        />

        {/* 
          ZONAS DE NAVEGAÇÃO (SWIPE GATES):
          Garantem que o usuário nunca fique "preso" no PDF no desktop/tablet.
        */}
        <div className="absolute inset-y-0 left-0 w-12 z-20 pointer-events-auto bg-transparent cursor-pointer" />
        <div className="absolute inset-y-0 right-0 w-12 z-20 pointer-events-auto bg-transparent cursor-pointer" />
      </div>

      {/* Dica visual na base */}
      {!loading && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-40 pointer-events-none">
          <div className="bg-black/90 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-2xl">
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              Bordas para navegar • Centro para interagir
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
