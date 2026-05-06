import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';
import { ProjectCard } from './ProjectCard';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects, loading } = useCollection<Project>('projects');

  const displayProjects = React.useMemo(() => {
    try {
      const dbMap = new Map<string, Project>();
      if (Array.isArray(dbProjects)) {
        dbProjects.forEach(p => {
          if (p && p.id) dbMap.set(p.id, p);
        });
      }

      const staticBase = Array.isArray(STATIC_PROJECTS) ? STATIC_PROJECTS : [];
      
      const merged = staticBase.map(sp => {
        const dbCopy = dbMap.get(sp.id);
        if (!dbCopy) return sp;
        // Merge DB data over static base
        return { ...sp, ...dbCopy };
      });

      // Show new projects from DB as well
      const staticIds = new Set(staticBase.map(p => p.id));
      const onlyInDb = Array.isArray(dbProjects) 
        ? dbProjects.filter(p => p && p.id && !staticIds.has(p.id) && p.status !== 'draft')
        : [];

      const result = [...merged, ...onlyInDb].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      return result.length > 0 ? result : staticBase;
    } catch (error) {
      console.error("Erro ao processar lista de projetos:", error);
      return Array.isArray(STATIC_PROJECTS) ? STATIC_PROJECTS : [];
    }
  }, [dbProjects]);

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-16 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">
              Galeria de Projetos
            </h2>
            {loading && (
              <p className="text-[10px] uppercase tracking-widest text-accent/50 mt-4 animate-pulse">Sincronizando Portfólio...</p>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1000px] mb-12">
          {displayProjects.map((project: Project, idx: number) => (
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
