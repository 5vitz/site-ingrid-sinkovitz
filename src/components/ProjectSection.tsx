import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';
import { ProjectCard } from './ProjectCard';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects } = useCollection<Project>('projects');

  const displayProjects = React.useMemo(() => {
    const base = Array.isArray(STATIC_PROJECTS) ? [...STATIC_PROJECTS] : [];
    if (!dbProjects || dbProjects.length === 0) return base;

    try {
      const dbMap = new Map();
      dbProjects.forEach(p => { if (p?.id) dbMap.set(p.id, p); });

      const merged = base.map(sp => {
        const dbP = dbMap.get(sp.id);
        return dbP ? { ...sp, ...dbP } : sp;
      });

      const staticIds = new Set(base.map(p => p.id));
      const extras = dbProjects.filter(p => p?.id && !staticIds.has(p.id));

      const final = [...merged, ...extras].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      return final.length > 0 ? final : base;
    } catch (e) {
      return base;
    }
  }, [dbProjects]);

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-10 text-center">
            <h2 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40 not-italic">
              Galeria de Projetos
            </h2>
        </div>

        <div className="w-full max-w-[1000px] mb-12">
          <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-[8px] shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
              {displayProjects.map((project, idx) => (
                <ProjectCard 
                  key={project.id || `proj-${idx}`}
                  project={project}
                  onClick={() => onSelectProject(project)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
