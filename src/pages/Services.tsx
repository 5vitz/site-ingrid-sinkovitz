import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { ServiceItem } from '../types';
import { servicesData } from '../data/servicesData';
import { Check, Loader2 } from 'lucide-react';

export const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const list: ServiceItem[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as ServiceItem;
          if (data.version === 3) {
            list.push(data);
          }
        });
        
        if (list.length > 0) {
          setServices(list);
        } else {
          setServices(servicesData);
        }
      } catch (err) {
        console.error('Failed to fetch services from Firestore, falling back to static:', err);
        setServices(servicesData);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="animate-fade-in px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto">
      {/* PAGE HEADER */}
      <section className="mb-16 md:mb-24">
        <span className="text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase">Expertise</span>
        <h1 className="font-serif text-4xl md:text-7xl tracking-[0.05em] uppercase text-black leading-none mt-2 mb-6 whitespace-normal lg:whitespace-nowrap">
          SERVIÇOS & ENTREGAS
        </h1>
        <p className="font-sans text-brand-charcoal text-base md:text-lg leading-relaxed max-w-3xl">
          Atuação estratégica em conteúdo, narrativa e gestão de processos, conectando posicionamento, execução e otimização contínua da comunicação.
        </p>
      </section>

      {/* SERVICES GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-brand-blue" size={32} />
          <span className="text-xs uppercase font-bold tracking-widest text-brand-charcoal/40">Carregando Serviços...</span>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 border-t border-black/10 pt-12">
          {services.map((service, index) => (
            <div 
              key={service.title} 
              className="flex flex-col border border-black/5 hover:border-black/10 bg-white/30 hover:bg-white/60 p-6 md:p-8 transition-all duration-300 rounded-lg"
            >
              {/* Number Indicator */}
              <span className="font-serif text-3xl md:text-4xl text-brand-blue/30 font-medium mb-4">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Title & Description */}
              <h2 className="font-serif text-2xl md:text-3xl text-black font-semibold mb-3">
                {service.title}
              </h2>
              <p className="font-sans text-brand-charcoal text-sm leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Bullet Points */}
              {service.bullets && Array.isArray(service.bullets) && (
                <ul className="space-y-3 mt-auto border-t border-black/5 pt-6">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-xs md:text-sm text-brand-charcoal/90 leading-normal">
                      <span className="mt-1 flex-shrink-0 text-brand-blue">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default Services;
