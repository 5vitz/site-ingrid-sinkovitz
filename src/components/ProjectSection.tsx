import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects, loading } = useCollection<Project>('projects');

  // Mesclar projetos estáticos com os do banco, RESTRITO aos IDs oficiais
  const displayProjects = React.useMemo(() => {
    // Usamos um Map baseado nos projetos oficiais
    const finalMap = new Map<string, Project>();
    
    // 1. Inicializamos com a lista estática
    STATIC_PROJECTS.forEach(p => finalMap.set(p.id, p));
    
    // 2. Mesclamos com o banco APENAS se o ID já existir no mapa oficial
    dbProjects.forEach(dbProj => {
      if (dbProj.id && finalMap.has(dbProj.id)) {
        const existing = finalMap.get(dbProj.id)!;
        finalMap.set(dbProj.id, { ...existing, ...dbProj });
      }
    });

    // 3. Retornamos a lista final (sempre os 6 oficiais)
    return Array.from(finalMap.values())
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .slice(0, 6);
  }, [dbProjects]);

  return (
    <section id="projetos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-20 text-center">
            <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">
              Galeria de Projetos
            </h3>
            {loading && dbProjects.length === 0 && (
              <p className="text-[10px] uppercase tracking-widest text-accent/50 mt-4 animate-pulse">Sincronizando com nuvem...</p>
            )}
        </div>

        <div className="flex flex-col gap-10 w-full max-w-[960px] mb-12">
          {/* Linha 1: Projetos 1 a 3 */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {displayProjects.slice(0, 3).map((project: any) => (
                <div
                  key={project.id}
                  className={`relative group ${project.isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={() => !project.isPlaceholder ? onSelectProject(project as Project) : null}
                >
                  <div 
                    className="aspect-square w-full bg-zinc-900/80 border border-white/10 rounded-[8px] flex flex-col items-center justify-center transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden relative p-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 z-0" />

                    <span className="relative z-10 text-accent text-sm md:text-base tracking-tighter transition-colors duration-300 text-center leading-tight">
                      {project.title}
                    </span>
                    
                    <div className="w-0 h-[2px] bg-accent mt-3 relative z-10 group-hover:w-12 transition-all duration-500 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Linha 2: Projetos 4 a 6 */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {displayProjects.slice(3, 6).map((project: any) => (
                <div
                  key={project.id}
                  className={`relative group ${project.isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
                  onClick={() => !project.isPlaceholder ? onSelectProject(project as Project) : null}
                >
                  <div 
                    className="aspect-square w-full bg-zinc-900/80 border border-white/10 rounded-[8px] flex flex-col items-center justify-center transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden relative p-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 z-0" />

                    <span className="relative z-10 text-accent text-sm md:text-base tracking-tighter transition-colors duration-300 text-center leading-tight">
                      {project.title}
                    </span>
                    
                    <div className="w-0 h-[2px] bg-accent mt-3 relative z-10 group-hover:w-12 transition-all duration-500 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
