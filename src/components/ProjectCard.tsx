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

  // Limpar título de forma mais agressiva e padronizar
  const displayTitle = (project.title || '')
    .replace(/^(Projeto|projeto)\s+/i, '')
    .trim();

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.01 }}
      onClick={onClick}
      className={`${cardClass} cursor-pointer group rounded-[8px] snap-center bg-zinc-900 shadow-xl overflow-hidden relative flex items-center justify-center border border-white/5 transition-all duration-300`}
    >
      {/* Fundo Simples com Degradê */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 z-0" />
      
      <div className="relative flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
        <div className="space-y-3">
          <h3 className="text-[13px] md:text-[14px] font-light text-accent tracking-[0.3em] transition-all duration-500 group-hover:brightness-125 uppercase">
            {displayTitle}
          </h3>
          <div className="w-0 group-hover:w-20 h-[1px] bg-accent/40 mx-auto transition-all duration-700 ease-out" />
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
