import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';
import { ProjectCard } from './ProjectCard';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects } = useCollection<Project>('projects');

  const displayProjects = React.useMemo(() => {
    const base = Array.isArray(STATIC_PROJECTS) ? STATIC_PROJECTS : [];
    if (!dbProjects || dbProjects.length === 0) return base;

    try {
      const dbMap = new Map(dbProjects.map(p => [p.id, p]));
      const merged = base.map(sp => ({ ...sp, ...(dbMap.get(sp.id) || {}) }));
      const staticIds = new Set(base.map(p => p.id));
      const extras = dbProjects.filter(p => p?.id && !staticIds.has(p.id));
      return [...merged, ...extras].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    } catch (e) {
      return base;
    }
  }, [dbProjects]);

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-16 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">
              Galeria de Projetos
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
