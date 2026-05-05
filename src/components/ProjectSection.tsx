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
             // Priorizar título das constantes se for o projeto elobike para evitar override do DB
             const finalTitle = dbProj.id === 'projeto-elobike' ? existing.title : (dbProj.title || existing.title);
             finalMap.set(dbProj.id, { ...existing, ...dbProj, title: finalTitle });
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

        <div className="w-full max-w-[1200px] mb-12 space-y-10">
          {(() => {
            const chunks = [];
            for (let i = 0; i < displayProjects.length; i += 3) {
              chunks.push(displayProjects.slice(i, i + 3));
            }
            return chunks.map((group, groupIdx) => (
              <div 
                key={groupIdx} 
                className="w-full p-6 md:p-10 bg-zinc-900/20 backdrop-blur-sm rounded-[16px] border border-white/5 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10"
              >
                {group.map((project: Project, idxInGroup) => {
                  const absoluteIdx = groupIdx * 3 + idxInGroup;
                  return (
                    <ProjectCard 
                      key={project.id || absoluteIdx}
                      project={project}
                      onClick={() => onSelectProject(project)}
                      hasRight={absoluteIdx < displayProjects.length - 1}
                      hasDown={absoluteIdx < displayProjects.length - 3}
                    />
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </div>
    </section>
  );
};
