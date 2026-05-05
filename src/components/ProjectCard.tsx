import React from 'react';
import { Project } from '../types';
import { Play, ArrowUpRight, ChevronRight, ChevronDown, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  hasRight?: boolean;
  hasDown?: boolean;
  hasDownMobile?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, hasRight, hasDown, hasDownMobile }) => {
  const isVertical = project.layoutType === 'vertical';
  const cardClass = isVertical ? 'card-vertical' : 'card-horizontal';
  const isDraft = project.status === 'draft';

  // Fallback para thumbnail se estiver faltando
  const thumbnail = project.galleryThumbnail || (project.coverImage && (project.coverImage.match(/\.(jpg|jpeg|png|webp|gif|avif)/i) ? project.coverImage : ''));

  return (
    <motion.div 
      whileHover={{ y: isDraft ? 0 : -5 }}
      onClick={() => !isDraft && onClick()}
      className={`${cardClass} ${isDraft ? 'cursor-not-allowed opacity-80' : 'cursor-pointer group'} rounded-[8px] snap-center bg-zinc-900/40 backdrop-blur-sm shadow-2xl overflow-hidden relative flex items-center justify-center border border-white/5`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-600 block opacity-50 group-hover:opacity-100 transition-opacity">
            Projeto
          </span>
          <h3 className="text-xl md:text-2xl font-light text-accent tracking-tighter transition-all duration-300 group-hover:scale-105 group-hover:brightness-110">
            {project.title}
          </h3>
        </div>
      </div>

      {isDraft && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center z-50">
          <div className="bg-amber-500/20 p-4 rounded-full mb-4 border border-amber-500/30">
            <Lock size={32} className="text-amber-500" />
          </div>
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-amber-500 mb-1">Status</span>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">Em Construção</h3>
        </div>
      )}
      
      {/* Botão sutil de explorar no hover */}
      {!isDraft && (
        <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span>Explorar</span>
            <ArrowUpRight size={14} className="text-accent" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
