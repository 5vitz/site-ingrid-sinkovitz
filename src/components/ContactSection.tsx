import React, { useEffect, useState } from 'react';
import { Mail, Instagram, Linkedin, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSettings } from '../services/dataService';
import { SiteSettings } from '../types';

export const ContactSection: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSettings().then(data => {
      if (data.global) setSettings(data.global);
    });
  }, []);

  const socialLinks = [
    { 
      icon: <MessageCircle size={20} />, 
      label: "WhatsApp", 
      link: settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : "https://wa.me/5527999193525" 
    },
    { 
      icon: <Linkedin size={20} />, 
      label: "LinkedIn", 
      link: settings?.linkedinUrl || "https://www.linkedin.com/in/ingridsinkovitz/" 
    },
    { 
      icon: <Instagram size={20} />, 
      label: "Instagram", 
      link: settings?.instagramUrl || "#" 
    },
    { 
      icon: null, 
      label: settings?.emailContact || "ingridsinkovitz@gmail.com", 
      link: `mailto:${settings?.emailContact || "ingridsinkovitz@gmail.com"}` 
    }
  ];

  return (
    <footer id="contato" className="section-container scroll-mt-20 !pt-0">
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40 not-italic">
            Contato
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch relative z-10 w-full mb-12">
          {/* Card 1: Identidade */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col items-center text-center justify-start space-y-8">
            <Link to="/" className="text-xl font-bold tracking-tighter uppercase not-italic">
              INGRID <span className="text-accent">SINKOVITZ</span>
            </Link>
            <div className="text-[11px] tracking-[0.4em] text-white/60 font-bold flex flex-col gap-3 uppercase">
              <span>Estratégia</span>
              <span>Planejamento</span>
              <span>Gestão</span>
            </div>
          </div>

          {/* Card 2: Conecte-se */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col items-center md:items-start justify-start space-y-8">
            <span className="text-white/20 font-sans tracking-widest text-xs font-bold uppercase">Conecte-se</span>
            <div className="flex flex-col gap-5 items-center md:items-start w-full">
              {socialLinks.filter(s => s.link && s.link !== '#').map((social, i) => (
                <a 
                  key={i} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-sm font-medium text-zinc-400 hover:text-white transition group w-full"
                >
                  {social.icon && (
                    <span className="p-3 rounded-full bg-white/5 group-hover:bg-accent group-hover:text-black transition-all duration-300">
                      {social.icon}
                    </span>
                  )}
                  <span className={`tracking-widest text-xs transition-colors duration-300 ${!social.icon ? 'lowercase text-zinc-300 mt-1 group-hover:text-accent break-all text-center md:text-left' : 'font-bold'}`}>
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Card 3: Links */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 block mb-8">Navegação</span>
              <nav className="flex flex-col gap-4 text-sm font-medium tracking-widest">
                <a href="#sobre" className="hover:text-accent transition-colors">Sobre</a>
                <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
                <a href="#projetos" className="hover:text-accent transition-colors">Projetos</a>
                <a href="#depoimentos" className="hover:text-accent transition-colors">Depoimentos</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Watermark sutil ao fundo do card principal */}
        <div className="text-[12rem] md:text-[20rem] font-black opacity-[0.015] absolute -bottom-10 -right-10 pointer-events-none select-none leading-none">INK</div>
      </div>
    </footer>
  );
};
