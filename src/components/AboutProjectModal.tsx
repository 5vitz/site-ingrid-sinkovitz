import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';
import { Project } from '../types';

interface AboutProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStart: () => void;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({ project, onClose, onStart }) => {
  if (!project || !project.aboutConfig) return null;

  const { aboutConfig, theme } = project;

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
              className="absolute top-6 right-6 z-[11050] w-10 h-10 bg-zinc-950/60 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-xl"
              title="Fechar"
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* Conteúdo com Scroll */}
            <div className="p-8 pt-12 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-10 text-center">
                <div>
                  <h2 
                    className="text-lg md:text-xl font-black tracking-tighter leading-tight mb-2"
                    style={{ color: theme?.accentColor || 'white' }}
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
            </div>

            {/* Footer com CTA */}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
