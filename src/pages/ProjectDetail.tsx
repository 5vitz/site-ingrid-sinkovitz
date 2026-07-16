import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types';
import { projectsData } from '../data/projectsData';
import { MediaRenderer } from '../components/MediaRenderer';
import { ArrowLeft, ArrowRight, CornerDownLeft, BarChart2, Loader2 } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const list: Project[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Project;
          if (data.version === 3) {
            list.push(data);
          }
        });
        
        if (list.length > 0) {
          setProjects(list.sort((a, b) => a.order - b.order));
        } else {
          setProjects([...projectsData].sort((a, b) => a.order - b.order));
        }
      } catch (err) {
        console.error('Failed to fetch from Firestore, falling back to static:', err);
        setProjects([...projectsData].sort((a, b) => a.order - b.order));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [id]);

  // Find current project
  const projectIndex = projects.findIndex((p) => p.id === id);
  const project = projects[projectIndex];

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-cream text-brand-charcoal">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
        <span className="text-xs uppercase font-bold tracking-widest text-brand-charcoal/40 mt-4">Carregando Detalhes...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="px-6 py-24 text-center min-h-screen flex flex-col justify-center items-center">
        <h2 className="font-serif text-3xl mb-4">Projeto não encontrado</h2>
        <Link to="/" className="text-brand-blue font-semibold tracking-wider hover:underline uppercase text-xs">
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Next & Prev projects
  const prevProject = projects[projectIndex === 0 ? projects.length - 1 : projectIndex - 1];
  const nextProject = projects[projectIndex === projects.length - 1 ? 0 : projectIndex + 1];

  return (
    <div className="animate-fade-in px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto">
      {/* BACK LINK */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-brand-charcoal hover:text-brand-blue mb-12 transition-colors uppercase"
      >
        <CornerDownLeft size={14} /> Voltar aos Projetos
      </Link>

      {/* CASE STUDY TITLE */}
      <section className="mb-16">
        <span className="text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase">{project.category}</span>
        <h1 className="font-serif text-4xl md:text-7xl uppercase tracking-[0.05em] text-black mt-2 leading-none">
          {project.title}
        </h1>
        <p className="font-sans text-brand-charcoal/80 text-sm md:text-xs tracking-wider uppercase mt-4">
          Campanha: {project.campaign}
        </p>
      </section>

      {/* SPLIT LAYOUT: SPECS & DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-black/10 pt-12">
        
        {/* LEFT COLUMN: Ficha Técnica (Sidebar, 4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8 bg-white/40 p-6 md:p-8 rounded-lg border border-black/5">
          <div>
            <h4 className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-2">Cliente</h4>
            <p className="text-sm font-sans text-brand-charcoal">{project.client}</p>
          </div>
          <div className="border-t border-black/5 pt-6">
            <h4 className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-2">Desafio</h4>
            <p className="text-sm font-sans text-brand-charcoal leading-relaxed">{project.challenge}</p>
          </div>
          <div className="border-t border-black/5 pt-6">
            <h4 className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-2">Estratégia</h4>
            <p className="text-sm font-sans text-brand-charcoal leading-relaxed">{project.strategy}</p>
          </div>
        </div>

        {/* RIGHT COLUMN: Description, Metrics & Media (8 cols) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Main Description */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl md:text-3xl text-black font-semibold">O Projeto</h3>
            <p className="font-sans text-brand-charcoal text-base md:text-lg leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Metrics Section */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="border-y border-black/10 py-10">
              <div className="flex items-center gap-2 mb-6">
                <BarChart2 size={16} className="text-brand-blue" />
                <h3 className="text-xs font-bold tracking-widest text-brand-blue uppercase">Métricas de Sucesso</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="border border-black/5 bg-white/30 p-5 rounded">
                    <span className="font-serif text-3xl md:text-4xl text-black font-bold block mb-1">
                      {metric.value}
                    </span>
                    <span className="text-xs text-brand-charcoal/80 tracking-wide uppercase font-medium">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Showcase */}
          {project.media && project.media.length > 0 && (
            <div className="space-y-10">
              <h3 className="font-serif text-2xl md:text-3xl text-black font-semibold">Galeria de Peças</h3>
              <div className="space-y-8">
                {project.media.map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <MediaRenderer 
                      type={item.type} 
                      url={item.url} 
                      caption={item.caption}
                      className="w-full rounded-lg shadow-sm"
                    />
                    {item.caption && (
                      <p className="text-xs italic text-brand-charcoal/70 tracking-wide">
                        &bull; {item.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER NAV: PREV / NEXT */}
      <section className="flex justify-between items-center border-t border-black/10 mt-20 pt-12">
        <Link 
          to={`/projeto/${prevProject.id}`}
          onClick={() => window.scrollTo({ top: 0 })}
          className="group flex flex-col items-start text-left max-w-[45%]"
        >
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-brand-charcoal/60 uppercase group-hover:text-brand-blue transition-colors">
            <ArrowLeft size={12} /> Anterior
          </span>
          <span className="font-serif text-base md:text-xl text-black font-medium mt-1 group-hover:underline truncate w-full">
            {prevProject.title}
          </span>
        </Link>

        <Link 
          to={`/projeto/${nextProject.id}`}
          onClick={() => window.scrollTo({ top: 0 })}
          className="group flex flex-col items-end text-right max-w-[45%]"
        >
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-brand-charcoal/60 uppercase group-hover:text-brand-blue transition-colors">
            Próximo <ArrowRight size={12} />
          </span>
          <span className="font-serif text-base md:text-xl text-black font-medium mt-1 group-hover:underline truncate w-full">
            {nextProject.title}
          </span>
        </Link>
      </section>
    </div>
  );
};

export default ProjectDetail;
