import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Plus, Minus } from 'lucide-react';
import { useCollection } from '../hooks/useCollection';
import { Service } from '../types';

const AccordionItem = ({ title, items }: { title: string, items: string[], key?: React.Key }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-8 bg-zinc-900/40 backdrop-blur-md rounded-[8px] border border-white/5 hover:bg-white/5 transition-all group"
      >
        <span className="text-base md:text-lg font-light tracking-tight text-left">{title}</span>
        <div className="bg-accent/10 p-1.5 rounded-full group-hover:bg-accent/20 transition-colors">
          {isOpen ? <Minus size={16} className="text-accent" /> : <Plus size={16} className="text-accent" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="py-6 px-8 space-y-4">
              <ul className="grid md:grid-cols-2 gap-4">
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-zinc-400 font-light"
                  >
                    <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ServicesSection: React.FC = () => {
  const { data: services } = useCollection<Service>('services');

  return (
    <section id="servicos" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 flex flex-col items-center">
        <div className="mt-8 mb-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40 not-italic">
            Serviços
          </h3>
        </div>

        <div className="w-full space-y-4">
          {services && services.length > 0 ? (
            services.map((service, idx) => (
              <AccordionItem key={service.id || idx} title={service.title} items={service.items} />
            ))
          ) : (
            <div className="text-center text-zinc-500 py-10">Carregando serviços...</div>
          )}
        </div>
      </div>
    </section>
  );
};
