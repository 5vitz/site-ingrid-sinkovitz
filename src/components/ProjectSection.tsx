import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';
import { ProjectCard } from './ProjectCard';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects } = useCollection<Project>('projects');

  const displayProjects = React.useMemo(() => {
    const base = Array.isArray(STATIC_PROJECTS) ? [...STATIC_PROJECTS] : [];
    
    // Se o hook ainda não carregou ou o DB está vazio, retorna a base estática imediatamente
    if (!dbProjects || dbProjects.length === 0) {
      return base;
    }

    try {
      // Mapear projetos do banco para acesso rápido
      const dbMap = new Map();
      dbProjects.forEach(p => {
        if (p && p.id) dbMap.set(p.id, p);
      });

      // 1. Atualizar projetos estáticos com dados do banco (se houver)
      const merged = base.map(sp => {
        const dbProject = dbMap.get(sp.id);
        if (!dbProject) return sp;
        return { ...sp, ...dbProject };
      });

      // 2. Identificar novos projetos que só existem no banco
      const staticIds = new Set(base.map(p => p.id));
      const extras = dbProjects.filter(p => p && p.id && !staticIds.has(p.id));

      // 3. Unir e ordenar. Rascunhos são exibidos (a lógica de acesso é tratada no clique)
      const result = [...merged, ...extras].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      
      return result.length > 0 ? result : base;
    } catch (error) {
      console.error("Erro na mesclagem de projetos:", error);
      return base;
    }
  }, [dbProjects]);

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-16 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight opacity-40">
              Projetos selecionados
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1100px] mb-12">
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
