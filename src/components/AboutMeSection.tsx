import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Plus, Minus } from 'lucide-react';
import { AboutMe } from '../types';

interface AboutMeSectionProps {
  settings: { sobre: AboutMe | null };
}

const ingridBioDefault = `Eu sou a Ingrid, e minha trajetória na comunicação nunca foi linear.
Comecei na rádio, passei pela televisão, mergulhei na produção audiovisual, vivi projetos que chegaram à TV Globo e até uma turnê internacional. Mais tarde, empreendi no setor gastronômico, onde, além de gerir um negócio, também fui responsável por construir e posicionar a marca.
Cada uma dessas experiências me colocou em lugares diferentes da comunicação: na frente das câmeras, nos bastidores, na operação, na estratégia.
E foi exatamente isso que moldou a forma como eu enxergo o que faço hoje.
Eu não vejo conteúdo como uma peça isolada. Nem estratégia como algo que existe só no planejamento.
Pra mim, comunicação é um sistema. É entender contexto, intenção, público, narrativa e fazer tudo isso se conectar de forma coerente, consistente e sustentável ao longo do tempo.
Por isso, o meu trabalho não se limita à criação.
Eu entro nos projetos para organizar, estruturar e dar direção. Trago clareza para marcas que muitas vezes já têm presença, mas não têm consistência. Transformo ideias soltas em uma narrativa sólida. E acompanho de perto a execução para garantir que aquilo que foi pensado realmente aconteça com qualidade e alinhamento.
Hoje, atuo como gestora e estrategista de conteúdo, com uma visão ampla de todo o processo. Minha forma de trabalhar é atravessada por tudo o que eu já vivi: diferentes formatos, diferentes mercados, diferentes perspectivas.
E é justamente isso que me permite enxergar além do óbvio e construir algo que não seja só bonito ou bem planejado, mas que faça sentido.
Não é só produzir conteúdo, é construir percepção.`;

const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&"'>]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : "n7XttGodixg";
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`;
};

export const AboutMeSection: React.FC<AboutMeSectionProps> = ({ settings }) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const finalVideoUrl = settings.sobre?.videoUrl || 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/SobreMim%2FSobreMim.mp4?alt=media&token=ff5c966d-15e2-489f-bedf-f47a1426a7fd';
  const isDirectVideo = finalVideoUrl.includes('firebasestorage.googleapis.com') || finalVideoUrl.endsWith('.mp4');
  const finalEmbedUrl = !isDirectVideo ? getYouTubeEmbedUrl(finalVideoUrl) : '';
  
  const bioText = settings.sobre?.description || ingridBioDefault;

  return (
    <>
      {/* 1. SEÇÃO VÍDEO (HERO) */}
      <section id="sobre" className="section-container !pt-[85px] scroll-mt-20">
        <div className="section-card bg-zinc-900/40 backdrop-blur-lg border border-white/5 ring-0 relative overflow-hidden aspect-video md:aspect-auto md:h-[calc(85vh+16px)] rounded-[8px]">
          <div className="absolute inset-0 z-0 text-center flex items-center justify-center text-zinc-800 font-black">
            CARREGANDO VÍDEO...
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {isDirectVideo ? (
              <video
                src={finalVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover md:object-cover"
              />
            ) : (
              <iframe
                src={finalEmbedUrl}
                className="w-full h-full scale-[1.01] md:scale-100 object-cover opacity-100 pointer-events-none"
                title="Ingrid Sinkovitz - Professional Showcase"
                allow="autoplay; fullscreen"
                frameBorder="0"
              />
            )}
          </div>
          
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
        </div>
      </section>

      {/* 2. SEÇÃO TEXTO (BIO) */}
      <section id="bio" className="section-container scroll-mt-20">
        <div className="section-card flex items-center justify-center p-8 md:p-16 bg-zinc-900/40 backdrop-blur-lg relative overflow-hidden">
          <Quote className="absolute -top-10 -left-10 text-accent/5 w-40 h-40 md:w-60 md:h-60 -z-10" />
          <div className="max-w-4xl w-full">
            <div>
              <div className="flex flex-col gap-6 text-zinc-300 text-sm md:text-base leading-relaxed font-light">
                <div className="relative">
                  <p className={`whitespace-pre-line text-justify first-letter:text-5xl first-letter:font-black first-letter:text-accent first-letter:mr-4 first-letter:float-left transition-all duration-700 ${!isBioExpanded ? 'max-h-[320px] md:max-h-[220px] overflow-hidden' : 'max-h-[2000px]'}`}>
                    {!isBioExpanded ? (
                      <>
                        {bioText.split('na operação, na estratégia.')[0]}
                        {bioText.includes('na operação, na estratégia.') ? 'na operação, na estratégia...' : ''}
                      </>
                    ) : bioText}
                  </p>
                  
                  {!isBioExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-zinc-900/90 to-transparent pointer-events-none" />
                  )}
                </div>

                <button
                  onClick={() => setIsBioExpanded(!isBioExpanded)}
                  className="mt-4 flex items-center gap-2 text-accent font-bold tracking-widest text-[10px] hover:text-white transition-colors group w-fit"
                >
                  <span className="border-b border-accent/20 group-hover:border-white transition-colors pb-0.5">
                    {isBioExpanded ? "Ver menos" : "Saiba mais"}
                  </span>
                  {isBioExpanded ? <Minus size={14} /> : <Plus size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
