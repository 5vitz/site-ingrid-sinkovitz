import React, { useEffect, useState } from 'react';
import { Mail, Linkedin, MessageCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSettings } from '../services/dataService';
import { SiteSettings } from '../types';

export const ContactSection: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getSettings().then(data => {
      if (data.global) setSettings(data.global);
    });
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = settings?.emailContact || "ingridsinkovitz@gmail.com";
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contato" className="section-container scroll-mt-20 !pt-0" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="section-card p-5 md:p-10 flex flex-col items-center">
        <div className="mt-4 mb-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40 not-italic">
            Contato
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10 w-full mb-12">
          
          {/* Coluna 1: CONECTE-SE */}
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 md:p-10 rounded-[12px] border border-white/5 flex flex-col items-center justify-center">
            
            {/* Card Interno */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-accent/10 rounded-[8px] p-8 md:p-10 w-full h-full max-w-[320px] flex flex-col items-start space-y-8 shadow-inner">
              <h4 className="text-lg md:text-xl font-light tracking-widest uppercase text-accent w-full text-left">
                CONECTE-SE
              </h4>
              <div className="flex flex-col gap-6 w-full">
                
                <a 
                  href={settings?.linkedinUrl || "https://www.linkedin.com/in/ingridsinkovitz/"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-zinc-400 hover:text-accent transition-colors duration-300 group w-full text-left"
                >
                  <span className="group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-accent">
                    <Linkedin size={24} className="mr-4" />
                  </span>
                  <span className="text-base font-light tracking-wide">LinkedIn</span>
                </a>

                <a 
                  href={settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : "https://wa.me/5527999193525"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-zinc-400 hover:text-accent transition-colors duration-300 group w-full text-left"
                >
                  <span className="group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-accent">
                    <MessageCircle size={24} className="mr-4" />
                  </span>
                  <span className="text-base font-light tracking-wide">WhatsApp</span>
                </a>

                <button 
                  onClick={handleCopyEmail}
                  className="flex items-center text-zinc-400 hover:text-accent transition-colors duration-300 group cursor-pointer w-full text-left"
                >
                  <span className="group-hover:scale-110 transition-transform text-zinc-400 group-hover:text-accent">
                    {copied ? <Check size={24} className="mr-4 text-green-500" /> : <Mail size={24} className="mr-4" />}
                  </span>
                  <span className={`text-base tracking-wide transition-colors ${copied ? 'text-green-500 font-medium' : 'font-light'}`}>
                    {copied ? 'Copiado!' : 'Email'}
                  </span>
                </button>

              </div>
            </div>

          </div>

          {/* Coluna 2: MENU */}
          <div className="bg-zinc-900/40 backdrop-blur-md p-6 md:p-10 rounded-[12px] border border-white/5 flex flex-col items-center justify-center">
            
            {/* Card Interno */}
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-accent/10 rounded-[8px] p-8 md:p-10 w-full h-full max-w-[320px] flex flex-col items-start space-y-8 shadow-inner">
              <h4 className="text-lg md:text-xl font-light tracking-widest uppercase text-accent w-full text-left">
                MENU
              </h4>
              <nav className="flex flex-col gap-6 text-base font-light tracking-wide w-full">
                <a href="#sobre" className="text-zinc-400 hover:text-accent transition-colors text-left w-full">Sobre</a>
                <a href="#servicos" className="text-zinc-400 hover:text-accent transition-colors text-left w-full">Serviços</a>
                <a href="#projetos" className="text-zinc-400 hover:text-accent transition-colors text-left w-full">Projetos</a>
                <a href="#depoimentos" className="text-zinc-400 hover:text-accent transition-colors text-left w-full">Depoimentos</a>
              </nav>
            </div>

          </div>
          
        </div>
      </div>
    </footer>
  );
};
