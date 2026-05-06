import React from 'react';
import { Mail, Instagram, Linkedin, Send, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactSection: React.FC = () => {
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
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col items-center md:items-start text-center md:text-left justify-start space-y-8">
            <Link to="/" className="text-xl font-bold tracking-tighter uppercase not-italic">
              INGRID <span className="text-accent">SINKOVITZ</span>
            </Link>
            <p className="text-[11px] tracking-[0.4em] opacity-30 font-bold">
              Estratégia Planejamento Gestão
            </p>
            <div className="flex gap-6">
              <a href="https://www.instagram.com/ingridsinkovitz/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-accent transition-colors"><Instagram size={20} /></a>
              <a href="https://www.linkedin.com/in/ingridsinkovitz/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-accent transition-colors"><Linkedin size={20} /></a>
              <a href="mailto:ingridsinkovitz@gmail.com" className="text-zinc-500 hover:text-accent transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          {/* Card 2: Links */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 block mb-8">Navegação</span>
              <nav className="flex flex-col gap-4 text-sm font-medium tracking-widest uppercase">
                <a href="#sobre" className="hover:text-accent transition-colors">Sobre</a>
                <a href="#servicos" className="hover:text-accent transition-colors">Serviços</a>
                <a href="#projetos" className="hover:text-accent transition-colors">Projetos</a>
                <a href="#depoimentos" className="hover:text-accent transition-colors">Depoimentos</a>
              </nav>
            </div>
          </div>

          {/* Card 3: Conecte-se */}
          <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col items-center md:items-start justify-start space-y-8">
            <span className="text-white/20 font-sans tracking-widest text-xs font-bold">Conecte-se</span>
            <div className="flex flex-col gap-5 items-center md:items-start">
              {[
                { icon: <MessageCircle size={20} />, label: "WhatsApp", link: "https://wa.me/5527999193525" },
                { icon: <Linkedin size={20} />, label: "LinkedIn", link: "https://www.linkedin.com/in/ingridsinkovitz/" },
                { icon: null, label: "ingridsinkovitz@gmail.com", link: "mailto:ingridsinkovitz@gmail.com" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-sm font-medium text-zinc-400 hover:text-white transition group"
                >
                  {social.icon && (
                    <span className="p-3 rounded-full bg-white/5 group-hover:bg-accent group-hover:text-black transition-all duration-300">
                      {social.icon}
                    </span>
                  )}
                  <span className={`tracking-widest text-xs transition-colors duration-300 ${!social.icon ? 'lowercase text-zinc-500 mt-1 group-hover:text-accent' : 'font-bold'}`}>
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Watermark sutil ao fundo do card principal */}
        <div className="text-[12rem] md:text-[20rem] font-black opacity-[0.015] absolute -bottom-10 -right-10 pointer-events-none select-none leading-none">INK</div>
      </div>
    </footer>
  );
};
