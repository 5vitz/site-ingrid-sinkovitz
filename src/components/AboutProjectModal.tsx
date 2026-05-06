import React from 'react';
import { motion } from 'motion/react';
import { X, Play, Lock } from 'lucide-react';
import { Project } from '../types';

interface AboutProjectModalProps {
  project: Project;
  onClose: () => void;
  onStart: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({ project, onClose, onStart }) => {
  const aboutConfig = project.aboutConfig || {
    title: project.title || '',
    description: project.description || 'Este projeto está sendo preparado e em breve estará disponível para visualização completa.',
    width: 'max-w-md'
  };
  const theme = project.theme;

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full ${aboutConfig.width || 'max-w-md'} bg-zinc-900 border border-white/10 rounded-[12px] shadow-2xl flex flex-col z-10 overflow-hidden`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Botão Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[100] w-12 h-12 bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl active:scale-95 cursor-pointer"
          title="Fechar"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* Conteúdo com Scroll */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <div className="w-full flex flex-col items-center justify-center text-center p-8 md:p-12">
            {project.status === 'draft' ? (
              <div className="w-full max-w-sm flex flex-col items-center py-8">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-white/5 p-8 rounded-full mb-8 border border-white/10 shadow-xl"
                >
                  <Lock size={64} className="text-white" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-12">
                  Em Construção
                </h2>
                
                {/* Atalho administrativo */}
                <div className="pt-8 border-t border-white/5 w-full">
                  <button 
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('open-admin-login'));
                      }, 200);
                    }}
                    className="group flex flex-col items-center gap-4 transition-all opacity-40 hover:opacity-100 w-full"
                  >
                    <div className="p-4 rounded-full bg-zinc-800 border border-white/5 group-hover:border-white/20 group-hover:text-white transition-all group-hover:scale-110">
                      <Lock size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">
                      Acesso Administrativo
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-12 w-full max-w-lg py-8">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-4 text-white">
                    {aboutConfig.title || project.title}
                  </h2>
                  {aboutConfig.subtitle && (
                    <p className="text-zinc-500 text-sm md:text-base font-bold tracking-tight">
                      {aboutConfig.subtitle}
                    </p>
                  )}
                </div>

                <div className="text-zinc-300 text-sm md:text-base leading-relaxed font-normal whitespace-pre-line text-justify px-2 md:px-6">
                  {aboutConfig.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer com CTA - Apenas para projetos não rascunho */}
        {project.status !== 'draft' && (
          <div className="p-8 pt-4 bg-zinc-950/40 border-t border-white/5">
            <button
              onClick={onStart}
              className="w-full py-5 px-8 rounded-[8px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.98] group shadow-xl"
              style={{ 
                backgroundColor: aboutConfig.ctaColor || theme?.accentColor || 'white',
                color: aboutConfig.ctaTextColor || 'black'
              }}
            >
              <Play size={18} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
              {aboutConfig.ctaText || 'Explorar Projeto'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
