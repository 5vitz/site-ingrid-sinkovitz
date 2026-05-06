import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';
import { ProjectCard } from './ProjectCard';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects } = useCollection<Project>('projects');

  const displayProjects = React.useMemo(() => {
    // 1. Garantir que temos a base estática corretamente
    const base = Array.isArray(STATIC_PROJECTS) ? [...STATIC_PROJECTS] : [];
    
    // Se o banco ainda não respondeu, retorna a base estática para não ficar vazio
    if (!dbProjects || dbProjects.length === 0) {
      return base;
    }

    try {
      const dbMap = new Map();
      dbProjects.forEach(p => {
        if (p && p.id) dbMap.set(p.id, p);
      });

      // Mesclar dados do banco sobre os estáticos (mantém ordem e IDs da base se existirem)
      const merged = base.map(sp => {
        const dbP = dbMap.get(sp.id);
        if (!dbP) return sp;
        return { ...sp, ...dbP };
      });

      // Adicionar projetos que existem apenas no banco
      const staticIds = new Set(base.map(p => p.id));
      const extras = dbProjects.filter(p => p && p.id && !staticIds.has(p.id));

      const final = [...merged, ...extras].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      
      // Fallback final: se por algum milagre der vazio, retorna a base original
      return final.length > 0 ? final : base;
    } catch (e) {
      console.error("Erro ao processar projetos:", e);
      return base;
    }
  }, [dbProjects]);

  // Se mesmo assim não houver projetos, algo está errado com o import ou base
  if (!displayProjects || displayProjects.length === 0) {
    return null; // Ou uma mensagem de erro discreta
  }

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-8 mb-16 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight opacity-40">
              Projetos selecionados
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[1000px] mb-12">
          {displayProjects.map((project, idx) => (
            <ProjectCard 
              key={project.id || `proj-${idx}`}
              project={project}
              onClick={() => onSelectProject(project)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
