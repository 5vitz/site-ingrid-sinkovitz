import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';
import { ProjectCard } from './ProjectCard';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects, loading } = useCollection<Project>('projects');

  // Mesclar projetos estáticos com os do banco, garantindo que os estáticos sejam a base
  const displayProjects = React.useMemo(() => {
    try {
      const finalMap = new Map<string, Project>();
      
      // 1. Base estática - clonamos para evitar mutações acidentais
      if (Array.isArray(STATIC_PROJECTS)) {
        STATIC_PROJECTS.forEach(p => {
          if (p && p.id) {
            finalMap.set(p.id, { ...p });
          }
        });
      }
      
      // 2. Mesclagem inteligente com dados do banco
      if (Array.isArray(dbProjects) && dbProjects.length > 0) {
        dbProjects.forEach(dbProj => {
          if (!dbProj || !dbProj.id) return;

          // Regra para Galeria Pública: 
          const isOfficialId = dbProj.id.startsWith('projeto-');
          if (dbProj.status === 'draft' && !isOfficialId) return;

          if (finalMap.has(dbProj.id)) {
             // Mescla dados do banco sobre o oficial estático
             const existing = finalMap.get(dbProj.id)!;
             finalMap.set(dbProj.id, { ...existing, ...dbProj });
          } else {
             // Novo projeto criado pelo usuário
             finalMap.set(dbProj.id, dbProj);
          }
        });
      }

      const result = Array.from(finalMap.values())
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        
      return result.length > 0 ? result : STATIC_PROJECTS;
    } catch (error) {
      console.error("Erro ao processar lista de projetos:", error);
      return STATIC_PROJECTS;
    }
  }, [dbProjects]);

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-20 text-center">
            <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">
              Galeria de Projetos
            </h3>
            {loading && (
              <p className="text-[10px] uppercase tracking-widest text-accent/50 mt-4 animate-pulse">Sincronizando Portfólio...</p>
            )}
        </div>

        <div className="w-full max-w-[1200px] mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
            {displayProjects.map((project: Project, idx) => (
              <ProjectCard 
                key={project.id || idx}
                project={project}
                onClick={() => onSelectProject(project)}
                hasRight={idx < displayProjects.length - 1}
                hasDown={idx < displayProjects.length - 3}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
