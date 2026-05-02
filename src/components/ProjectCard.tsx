import React from 'react';
import { Project } from '../types';
import { Play, ArrowUpRight, ChevronRight, ChevronDown } from 'lucide-react';
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

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={onClick}
      className={`${cardClass} cursor-pointer group rounded-[8px] snap-center ${project.cardBg || 'bg-zinc-900'} shadow-2xl overflow-hidden relative flex items-center justify-center`}
    >
      {project.galleryThumbnail ? (
        <img 
          src={project.galleryThumbnail} 
          alt={project.title}
          className={`absolute inset-0 w-full h-full transition-all duration-700 ${
            project.title.includes('Metavix') 
              ? 'p-10 object-contain scale-[0.5] group-hover:scale-[0.55]' 
              : 'group-hover:scale-105 ' + (project.thumbnailFit === 'contain' ? 'object-contain' : 'object-cover')
          }`}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center p-6 border border-white/5">
          <div className="text-center opacity-40 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 block mb-2 text-center w-full">Projeto</span>
            <h3 className="text-xl font-black text-white uppercase tracking-tight text-center">{project.title}</h3>
          </div>
        </div>
      )}
      
      {/* Overlay status (only shown if there is an image, otherwise it's redundant) */}
      {project.galleryThumbnail && (
        <div className={`absolute inset-0 bg-gradient-to-t ${project.cardBg === 'bg-white' ? 'from-white/40 via-transparent' : 'from-black/80 via-transparent/20'} to-transparent flex flex-col justify-end p-8`}>
          <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
             <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight">
               {project.title}
             </h3>
             
             <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
               <span className={`px-3 py-1 ${project.cardBg === 'bg-white' ? 'bg-black text-white' : 'bg-accent text-black'} text-[10px] font-bold uppercase rounded-full tracking-widest`}>
                  Explorar
               </span>
               <ArrowUpRight size={20} className="text-accent" />
             </div>
          </div>
        </div>
      )}
      
      {/* Navigation Arrows (Instagram Style) */}
      {hasRight && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden md:flex">
          <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <ChevronRight size={18} className="text-white" />
          </div>
        </div>
      )}

      {hasDownMobile && (
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex ${!hasDown ? 'md:hidden' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <ChevronDown size={18} className="text-white" />
          </div>
        </div>
      )}

      {/* Hover decoration (Play Button) */}
      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
        <Play size={20} className="text-white fill-white" />
      </div>
    </motion.div>
  );
};
