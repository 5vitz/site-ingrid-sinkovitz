import React from 'react';
import { Project } from '../types';
import { useCollection } from '../hooks/useCollection';
import { PROJECTS_LIST as STATIC_PROJECTS } from '../constants/projects';

export const ProjectSection: React.FC<{ onSelectProject: (p: Project) => void }> = ({ onSelectProject }) => {
  const { data: dbProjects, loading } = useCollection<Project>('projects');

  // Mesclar projetos estáticos com os do banco
  // Garantir que não haja duplicatas por ID OU por Título
  const projects = React.useMemo(() => {
    const combinedMap = new Map<string, Project>();
    
    // Primeiro, adicionamos os estáticos ao mapa (chave é o ID)
    STATIC_PROJECTS.forEach(p => combinedMap.set(p.id, p));
    
    // Depois, sobrescrevemos ou adicionamos os do banco
    dbProjects.forEach(dbProj => {
      // Tentamos encontrar pelo ID
      combinedMap.set(dbProj.id, dbProj);
    });

    // Converter de volta para array e garantir títulos únicos (opcional, para evitar confusão visual)
    const finalProjects: Project[] = [];
    const titlesSet = new Set<string>();

    Array.from(combinedMap.values())
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
      .forEach(p => {
        // Se o título já existe e é de um projeto estático, e o novo projeto é do banco, priorizamos o do banco
        if (!titlesSet.has(p.title)) {
          finalProjects.push(p);
          titlesSet.add(p.title);
        }
      });

    return finalProjects;
  }, [dbProjects]);

  const displayProjects = [
    ...projects,
    ...Array.from({ length: Math.max(0, 6 - projects.length) }).map((_, i) => ({
      id: `placeholder-${i}`,
      title: `Projeto ${projects.length + i + 1}`,
      galleryThumbnail: '',
      isPlaceholder: true
    }))
  ];

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
              className={`relative group ${project.isPlaceholder ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => !project.isPlaceholder ? onSelectProject(project as Project) : null}
            >
              <div 
                className="aspect-square w-full bg-zinc-900 border border-white/10 rounded-[8px] flex items-center justify-center transition-all duration-300 group-hover:border-accent/40 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] overflow-hidden relative"
              >
                <span className="relative z-10 font-poppins text-white text-sm tracking-widest uppercase group-hover:text-accent transition-colors duration-300 text-center px-4">
                  {project.title}
                </span>
                
                {/* Mirror effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
