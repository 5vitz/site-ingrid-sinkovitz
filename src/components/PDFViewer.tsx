import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Necessário para o react-pdf funcionar
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  React.useEffect(() => {
    if (!containerRef) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width - 40);
      }
    });
    observer.observe(containerRef);
    return () => observer.disconnect();
  }, [containerRef]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const next = prevPageNumber + offset;
      if (numPages && next >= 1 && next <= numPages) {
        return next;
      }
      return prevPageNumber;
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1a1a1a] relative overflow-hidden">
      <div ref={setContainerRef} className="flex-grow overflow-auto custom-scrollbar flex items-center justify-center p-4">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center gap-4 text-zinc-400">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest">Carregando Documento...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center gap-4 text-red-500 p-8 text-center max-w-xs">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                <Loader2 className="w-8 h-8 text-red-500" style={{ animation: 'none' }} />
              </div>
              <p className="font-bold text-white uppercase tracking-widest text-[10px]">Não foi possível carregar o PDF</p>
              <p className="text-zinc-500 text-[11px] leading-relaxed">Isso pode ocorrer devido a restrições de segurança ou conexão.</p>
              <div className="flex flex-col gap-3 w-full mt-4">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-6 py-3 bg-white text-black text-[10px] font-black rounded-full uppercase tracking-widest hover:scale-105 transition-all"
                >
                  Abrir PDF Original
                </a>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-zinc-800 text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-zinc-700 transition-all"
                >
                  Recarregar Site
                </button>
              </div>
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={Math.min(containerWidth, 800)}
            className="shadow-2xl"
          />
        </Document>
      </div>

      {numPages && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full z-50 shadow-2xl">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            className="text-white disabled:opacity-30 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center min-w-[60px]">
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Página</p>
             <p className="text-sm text-white font-black">{pageNumber} <span className="text-zinc-600">/</span> {numPages}</p>
          </div>

          <button
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            className="text-white disabled:opacity-30 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
