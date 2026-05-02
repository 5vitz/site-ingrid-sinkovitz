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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1008px] mb-12">
          {displayProjects.map((project: any) => (
            <div
              key={project.id}
              className={`relative group h-full ${project.isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !project.isPlaceholder ? onSelectProject(project as Project) : null}
            >
              <div 
                className="aspect-square w-full bg-zinc-900 border border-white/10 rounded-[8px] flex flex-col items-center justify-center transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden relative p-8"
              >
                {/* Background Image - REMOVIDO TEMPORARIAMENTE A PEDIDO DO USUÁRIO */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 z-0" />

                <span className="relative z-10 font-black text-white text-base md:text-lg tracking-tighter uppercase group-hover:text-accent transition-colors duration-300 text-center leading-tight">
                  {project.title}
                </span>
                
                {/* Accent line on hover */}
                <div className="w-0 h-[3px] bg-accent mt-3 relative z-10 group-hover:w-16 transition-all duration-500 rounded-full" />

                {/* Mirror effect / Gloss */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
