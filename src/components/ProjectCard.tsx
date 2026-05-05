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

  // Limpar título de forma mais agressiva e padronizar
  const displayTitle = (project.title || '')
    .replace(/^(Projeto|projeto)\s+/i, '')
    .trim();

  return (
    <motion.div 
      whileHover={{ y: isDraft ? 0 : -8, scale: 1.01 }}
      onClick={() => !isDraft && onClick && onClick()}
      className={`${cardClass} ${isDraft ? 'cursor-not-allowed opacity-80' : 'cursor-pointer group'} rounded-[12px] snap-center bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative flex items-center justify-center border border-white/5 transition-all duration-500`}
    >
      {/* Camada de Imagem de Fundo (Sutil) */}
      {thumbnail && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src={thumbnail} 
            alt=""
            className="w-full h-full object-cover opacity-15 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-25 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        </div>
      )}

      {/* Camada de Degradê e Efeito Visual */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/40 via-transparent to-black z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1] pointer-events-none" />
      
      <div className="relative flex flex-col items-center justify-center p-8 text-center z-10 pointer-events-none">
        <div className="space-y-2">
          <h3 className="text-sm md:text-base font-light text-accent tracking-[0.2em] transition-all duration-500 group-hover:scale-105 group-hover:brightness-125 uppercase">
            {displayTitle}
          </h3>
          <div className="w-8 group-hover:w-16 h-[1px] bg-accent/40 mx-auto transition-all duration-700" />
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
