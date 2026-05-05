import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Lock } from 'lucide-react';
import { Project } from '../types';

interface AboutProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStart: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({ project, onClose, onStart }) => {
  if (!project) return null;

  const aboutConfig = project.aboutConfig || {
    title: project.title,
    description: project.description || 'Este projeto está sendo preparado e em breve estará disponível para visualização completa.',
    width: 'max-w-md'
  };
  const { theme } = project;

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${aboutConfig.width || 'max-w-md'} bg-zinc-900 border border-white/10 rounded-[12px] shadow-2xl flex flex-col overflow-hidden`}
            style={{ maxHeight: aboutConfig.height || '85vh' }}
          >
            {/* Botão Fechar (X) - Estilo Círculo para Pop-up */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-[11050] w-10 h-10 bg-zinc-950/60 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"
              title="Fechar"
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* Conteúdo com Scroll */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              <div className="min-h-full p-8 flex flex-col items-center justify-center text-center">
                {project.status === 'draft' ? (
                  <div className="w-full flex flex-col items-center py-10">
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="bg-accent/10 p-10 rounded-full mb-8 border border-accent/20 shadow-[0_0_50px_-12px_rgba(var(--accent-rgb),0.3)]"
                    >
                      <Lock size={80} className="text-accent" />
                    </motion.div>
                    
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-12">Em Construção</h2>
                    
                    {/* Atalho administrativo */}
                    <div className="pt-8 border-t border-white/5 w-full max-w-[200px]">
                      <button 
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('open-admin-login'));
                          }, 300);
                        }}
                        className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-100 opacity-20 w-full mx-auto"
                      >
                        <div className="p-3 rounded-full bg-zinc-800 border border-white/5 group-hover:border-accent/30 group-hover:text-accent transition-all">
                          <Lock size={18} />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-accent transition-colors text-center w-full">Acesso Administrativo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10 w-full py-10">
                    <div>
                      <h2 
                        className="text-lg md:text-xl font-black tracking-tighter leading-tight mb-2 text-zinc-500"
                      >
                        {aboutConfig.title || project.title}
                      </h2>
                      {aboutConfig.subtitle && (
                        <p className="text-zinc-500 text-xs md:text-sm font-bold tracking-tight mb-10">
                          {aboutConfig.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="text-zinc-300 text-sm md:text-base leading-relaxed font-light whitespace-pre-line text-justify">
                      {aboutConfig.description}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer com CTA */}
            {project.status !== 'draft' && (
              <div className="p-8 pt-4 bg-zinc-900/50 border-t border-white/5">
                <button
                  onClick={onStart}
                  className="w-full py-4 px-6 rounded-[8px] font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                  style={{ 
                    backgroundColor: aboutConfig.ctaColor || theme?.accentColor || 'white',
                    color: aboutConfig.ctaTextColor || 'black'
                  }}
                >
                  <Play size={16} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
                  {aboutConfig.ctaText || 'Iniciar Tour'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
