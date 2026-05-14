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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10 w-full mb-12">
          {/* Lado Esquerdo: Branding & Social */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[12px] border border-white/5 flex flex-col justify-between space-y-12">
            <div className="flex flex-col items-start space-y-6">
              <Link to="/" className="text-2xl font-bold tracking-tighter uppercase not-italic">
                INGRID <span className="text-accent">SINKOVITZ</span>
              </Link>
              <div className="text-[10px] tracking-[0.5em] text-white/40 font-bold flex gap-4 uppercase">
                <span>Estratégia</span>
                <span className="opacity-20">•</span>
                <span>Planejamento</span>
                <span className="opacity-20">•</span>
                <span>Gestão</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {socialLinks.filter(s => s.icon).map((social, i) => (
                <a 
                  key={i} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 rounded-full bg-white/5 hover:bg-accent hover:text-black transition-all duration-300 group"
                  title={social.label}
                >
                  <div className="scale-110 group-hover:scale-125 transition-transform">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Lado Direito: Navegação & Email */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[12px] border border-white/5 flex flex-col justify-between space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 block">Navegação</span>
              <nav className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm font-medium tracking-widest uppercase">
                <a href="#sobre" className="hover:text-accent transition-colors">Sobre</a>
                <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
                <a href="#projetos" className="hover:text-accent transition-colors">Projetos</a>
                <a href="#depoimentos" className="hover:text-accent transition-colors">Depoimentos</a>
              </nav>
            </div>

            <div className="pt-8 border-t border-white/5">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 block mb-4">E-mail Direto</span>
              <a 
                href={socialLinks.find(s => !s.icon)?.link} 
                className="text-lg md:text-xl font-light tracking-tighter text-zinc-300 hover:text-accent transition-colors break-all"
              >
                {socialLinks.find(s => !s.icon)?.label}
              </a>
            </div>
          </div>
        </div>

        {/* Watermark sutil ao fundo do card principal */}
        <div className="text-[12rem] md:text-[20rem] font-black opacity-[0.015] absolute -bottom-10 -right-10 pointer-events-none select-none leading-none">INK</div>
      </div>
    </footer>
  );
};
