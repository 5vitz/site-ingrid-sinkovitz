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
        className="absolute inset-0 bg-black/98 backdrop-blur-2xl"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full ${aboutConfig.width || 'max-w-md'} bg-zinc-900 border border-white/10 rounded-[12px] shadow-2xl flex flex-col overflow-hidden z-20`}
        style={{ maxHeight: aboutConfig.height || '85vh' }}
      >
        {/* Botão Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[11050] w-12 h-12 bg-zinc-800/80 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl active:scale-95 cursor-pointer"
          title="Fechar"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* Conteúdo com Scroll */}
        <div className="overflow-y-auto custom-scrollbar flex-1 flex flex-col">
          <div className="min-h-full w-full py-16 px-8 flex flex-col items-center justify-center text-center">
            {project.status === 'draft' ? (
              <div className="w-full flex flex-col items-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.1 }}
                  className="bg-accent/10 p-10 rounded-full mb-10 border border-accent/20 shadow-lg"
                >
                  <Lock size={80} className="text-accent" />
                </motion.div>
                
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-16">Em Construção</h2>
                
                {/* Atalho administrativo */}
                <div className="pt-10 border-t border-white/5 w-full max-w-[200px]">
                  <button 
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('open-admin-login'));
                      }, 300);
                    }}
                    className="group flex flex-col items-center gap-4 transition-all opacity-40 hover:opacity-100 w-full"
                  >
                    <div className="p-4 rounded-full bg-zinc-800 border border-white/5 group-hover:border-accent/30 group-hover:text-accent transition-all group-hover:scale-110">
                      <Lock size={20} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-accent transition-colors">Acesso Administrativo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-12 w-full max-w-lg">
                <div>
                  <h2 
                    className="text-2xl md:text-3xl font-black tracking-tighter leading-tight mb-4 text-white"
                  >
                    {aboutConfig.title || project.title}
                  </h2>
                  {aboutConfig.subtitle && (
                    <p className="text-zinc-500 text-sm md:text-base font-bold tracking-tight">
                      {aboutConfig.subtitle}
                    </p>
                  )}
                </div>

                <div className="text-zinc-300 text-sm md:text-base leading-relaxed font-normal whitespace-pre-line text-justify">
                  {aboutConfig.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer com CTA */}
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
