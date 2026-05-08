import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCollection } from '../hooks/useCollection';
import { Testimonial } from '../types';

const TestimonialCard = ({ t, isWide }: { t: Testimonial, isWide: boolean, key?: React.Key }) => {
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
  const { data: testimonials } = useCollection<Testimonial>('testimonials');

  return (
    <section id="depoimentos" className="section-container !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
          <div className="mt-4 mb-12 text-center">
             <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40 not-italic">Depoimentos</h3>
          </div>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {testimonials && testimonials.length > 0 ? (
              testimonials.map((t, idx) => (
                <TestimonialCard key={t.id || idx} t={t} isWide={idx === 2} />
              ))
            ) : (
              <div className="md:col-span-2 text-center text-zinc-500 py-10">Carregando depoimentos...</div>
            )}
          </div>
      </div>
    </section>
  );
};
