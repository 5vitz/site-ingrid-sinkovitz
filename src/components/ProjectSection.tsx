import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { PROJECTS_LIST } from '../constants/projects';
import { Project } from '../types';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const handleVideoStateChange = React.useCallback((isPlaying: boolean) => {
    // Implementação futura
  }, []);

  // Usar a lista real de projetos e completar com placeholders apenas se necessário para o grid
  const displayProjects = [
    ...PROJECTS_LIST,
    ...Array.from({ length: Math.max(0, 6 - PROJECTS_LIST.length) }).map((_, i) => ({
      id: `placeholder-${i}`,
      title: `Projeto ${PROJECTS_LIST.length + i + 1}`,
      galleryThumbnail: '',
      isPlaceholder: true
    }))
  ];

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-20 text-center">
            <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">
              Galeria de Projetos
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1008px] mb-12">
          {displayProjects.map((project: any, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${project.isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !project.isPlaceholder ? onSelectProject(project as Project) : null}
            >
              <div 
                className="aspect-square w-full bg-zinc-900 border border-white/10 rounded-[8px] flex items-center justify-center transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] overflow-hidden relative"
              >
                <span className="relative z-10 font-poppins text-white text-sm tracking-widest uppercase group-hover:text-accent transition-colors duration-300 text-center px-4">
                  {project.title}
                </span>
                
                {/* Mirror effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
