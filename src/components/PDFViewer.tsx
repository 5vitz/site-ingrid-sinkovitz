import React from 'react';
import { FileText } from 'lucide-react';

interface PDFViewerProps {
  url: string;
  title?: string;
}

/**
 * PDFViewer Simplificado (Fallback)
 * Este componente será substituído pelo carrossel de imagens PNG conforme solicitado.
 */
export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title }) => {
  return (
    <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        <FileText size={32} className="text-white/20" />
      </div>
      <h3 className="text-white/30 font-bold text-xs uppercase tracking-[0.2em] mb-2 px-4 line-clamp-2">
        {title || 'Documento em Transição'}
      </h3>
      <p className="text-white/10 text-[9px] uppercase tracking-widest max-w-[240px] leading-relaxed">
        Estamos movendo este conteúdo para uma visualização de alta fidelidade baseada em imagens. Em breve!
      </p>
    </div>
  );
};
