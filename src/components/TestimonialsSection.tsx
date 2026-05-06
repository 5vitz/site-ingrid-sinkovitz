import React, { useState } from 'react';
import { Star, MessageSquare, Plus, Minus } from 'lucide-react';

interface TestimonialData {
  author: string;
  role: string;
  text: string;
  photoUrl: string;
}

const TestimonialCard = ({ t, isWide }: { t: TestimonialData, isWide: boolean, key?: React.Key }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`bg-zinc-900/40 backdrop-blur-md p-8 md:p-10 rounded-[8px] border border-white/5 flex flex-col ${isWide ? 'md:col-span-2 md:flex-row md:items-center gap-10' : 'justify-between'}`}
    >
      <div className={isWide ? 'flex-1' : ''}>
        <p className={`text-base text-zinc-400 font-light leading-relaxed text-justify transition-all duration-300 ${!isExpanded ? 'line-clamp-6 overflow-hidden' : ''}`}>
          "{t.text}"
        </p>
        
        {t.text.length > 250 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 mb-6 flex items-center gap-2 text-accent font-bold tracking-widest text-[10px] hover:text-white transition-colors group"
          >
            <span className="border-b border-accent/20 group-hover:border-white transition-colors pb-0.5">
              {isExpanded ? "Ver menos" : "Saiba mais"}
            </span>
            {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
          </button>
        )}
      </div>
      
      <div className={`flex items-center gap-4 ${isWide ? 'md:shrink-0 md:border-l md:border-white/5 md:pl-10' : ''}`}>
        <div className="relative">
          <img 
            src={t.photoUrl} 
            alt={t.author}
            className="w-12 h-12 rounded-full border border-accent/20 object-cover" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full ring-4 ring-accent/5" />
        </div>
        <div>
          <h4 className="font-medium text-white">{t.author}</h4>
          <span className="text-[10px] text-accent font-bold tracking-widest uppercase">{t.role}</span>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const originalTestimonials = [
    {
      author: "Paulo Buzzo",
      role: "Gestor Comercial | Growth | IA",
      text: "Tive a honra de ter a Ingrid na equipe comercial da Auddar. Ela muito além do esperado, cuidando da comunicação interna, eventos e transformando as redes sociais, criando um planejamento estratégico de brilhar os olhos. Sempre proativa e cheia de ideias, destaco sua energia e dedicação inspiraram a todos ao redor. Ela é contagiante! Foi um privilégio ter Ingrid no time, e sei que onde ela estiver, trará sempre excelentes resultados e boas vibrações!",
      photoUrl: "https://lh3.googleusercontent.com/d/1gOBdoaCX4zcS1xfMYbi-LTtZ_2WFeIva"
    },
    {
      author: "Karina Redivo",
      role: "Coordinadora de Marketing",
      text: "A Ingrid é uma profissional multifuncional, muito dedicada, organizada e com senso de resolução incrível. Durante o time em que atuou como Social Media em nosso time de marketing, ela trouxe ideias fantásticas, ajudou a aprimorar processos de rotina conforme as necessidades do setor e estava sempre disposta a realizar tudo com responsabilidade e empenho. Linda, alegre, cativante, serena, cuidadosa com as entregas e resultados! Foi um prazer ter a Ingrid em nosso time. Simplesmente maravilhosa!",
      photoUrl: "https://lh3.googleusercontent.com/d/1BkSIA3AFFHwMutkS8FVjOnImhIkPq92A"
    },
    {
      author: "Guilherme Bressan",
      role: "Creative Director at Estoriah",
      text: "Tive o prazer de trabalhar com a Guigui em minha Produtora de Narrativas em 2022 e 2023. Uma pessoa muito carismática e de excelente comunicação que se destacava sempre por sua versatilidade e habilidade multitask. Além de Produtora Executiva, atuou como Assistente de Direção, acompanhando todas as etapas de produção de conteúdo sempre com uma postura proativa, pontualidade e uma capacidade impressionante de coordenação de equipe. Ela foi essencial em todas as etapas do processo: desde a gestão de produção, atendimento, visita técnica, até a coordenação da equipe envolvida.",
      photoUrl: "https://lh3.googleusercontent.com/d/1rmHzyu5fdTHMGj6a30KQxElstZ78UGDS"
    }
  ];

  return (
    <section id="depoimentos" className="section-container !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
          <div className="mt-4 mb-12 text-center">
             <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40 not-italic">Depoimentos</h3>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {originalTestimonials.map((t, idx) => (
              <TestimonialCard key={idx} t={t} isWide={idx === 2} />
            ))}
          </div>
      </div>
    </section>
  );
};
