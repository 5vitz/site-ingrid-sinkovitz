import React from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import { ArrowUpRight } from 'lucide-react';

export const Home: React.FC = () => {
  // Sort projects by order
  const sortedProjects = [...projectsData].sort((a, b) => a.order - b.order);

  return (
    <div className="animate-fade-in px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto">
      {/* HERO SECTION */}
      <section className="mb-20 md:mb-32 max-w-4xl">
        <h1 className="font-serif text-5xl md:text-8xl tracking-[0.05em] uppercase text-black leading-none mb-6">
          CREATIVE DIRECTOR & BRAND STRATEGIST
        </h1>
        <p className="font-serif italic text-2xl md:text-3xl text-brand-charcoal font-light leading-relaxed max-w-3xl border-l-[3px] border-brand-blue pl-6 md:pl-8 py-2">
          Conecto ideias, narrativas e estratégia para construir marcas com significado e relevância.
        </p>
      </section>

      {/* PROJECTS GRID TITLE */}
      <section id="projects-grid" className="pt-8 border-t border-black/10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase">Projetos</span>
            <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[0.05em] text-black mt-2">
              Trabalhos Selecionados
            </h2>
          </div>
          <span className="hidden sm:inline text-xs text-brand-charcoal/60 tracking-wider">
            {sortedProjects.length} PROJETOS
          </span>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {sortedProjects.map((project) => (
            <div 
              key={project.id} 
              className="group flex flex-col justify-between border border-black/5 hover:border-black/20 p-4 transition-all duration-500 rounded-lg hover:shadow-[0_10px_30px_rgba(53,41,29,0.03)] bg-white/40"
            >
              {/* Media Wrapper */}
              <Link 
                to={`/projeto/${project.id}`} 
                onClick={() => window.scrollTo({ top: 0 })}
                className="block aspect-[16/10] overflow-hidden rounded mb-6 relative bg-brand-cream"
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>

              {/* Text Info */}
              <div className="flex flex-col flex-grow">
                <span className="text-xs font-semibold tracking-[0.2em] text-brand-charcoal/60 uppercase mb-2">
                  {project.category}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-black font-medium mb-3 group-hover:text-brand-blue transition-colors">
                  {project.title}
                </h3>
                <p className="font-sans text-brand-charcoal text-sm leading-relaxed mb-6 line-clamp-2">
                  {project.description}
                </p>

                {/* Info Link */}
                <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
                  <span className="text-xs text-brand-charcoal/50 font-medium tracking-wider">
                    {project.client}
                  </span>
                  <Link
                    to={`/projeto/${project.id}`}
                    onClick={() => window.scrollTo({ top: 0 })}
                    className="inline-flex items-center gap-1 text-xs font-bold tracking-[0.2em] text-brand-blue group-hover:translate-x-1 transition-transform duration-300 uppercase"
                  >
                    INFO <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
