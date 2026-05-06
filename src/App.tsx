import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { 
  Menu, LogIn, ShieldCheck, Mail, MessageSquare, 
  Play, LayoutGrid, ChevronDown, CheckCircle, 
  Plus, Minus, X,
  MessageCircle, Instagram, Linkedin, 
  Video, Save, FileText, Quote, User, Edit2, Trash2,
  CheckCircle2, RefreshCw, History, Database, Clock, Download, Upload, Zap,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, setDoc, serverTimestamp, collection, getDocs, query, limit } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { PROJECTS_LIST } from './constants/projects';

import { ProjectSection } from './components/ProjectSection';
import { ProjectModal } from './components/ProjectModal';
import { AboutProjectModal } from './components/AboutProjectModal';
import { ProjectPasswordModal } from './components/ProjectPasswordModal';
import { MaintenanceMode } from './components/MaintenanceMode';
import { useCollection } from './hooks/useCollection';
import { Project, Service, Testimonial, AboutMe, SiteSettings } from './types';
import { getSettings } from './services/dataService';

import { seedAll } from './seed';
import { 
  createBackup, 
  getBackups, 
  restoreBackup, 
  deleteBackup,
  exportToJson,
  validateBackupFile,
  Backup,
  BackupData 
} from './services/backupService';


import { ProjectManager } from './components/Admin/ProjectManager';
import { ServiceManager } from './components/Admin/ServiceManager';
import { AboutManager } from './components/Admin/AboutManager';
import { TestimonialManager } from './components/Admin/TestimonialManager';
import { GlobalSettingsManager } from './components/Admin/GlobalSettingsManager';
import { UserManagement } from './components/Admin/UserManagement';
import { MediaLibrary } from './components/Admin/MediaLibrary';

const ingridBio = `Eu sou a Ingrid, e minha trajetória na comunicação nunca foi linear.
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

// YouTube Link Parsing Logic moved out
const getYouTubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&"'>]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : "n7XttGodixg";
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`;
};

const AccordionItem = ({ title, items }: { title: string, items: string[], key?: any }) => {
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

const TestimonialCard = ({ t, isWide }: { t: any, isWide: boolean, key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`bg-zinc-900/40 backdrop-blur-md p-8 md:p-10 rounded-[8px] border border-white/5 flex flex-col ${isWide ? 'md:col-span-2 md:flex-row md:items-center gap-10' : 'justify-between'}`}
    >
      <div className={isWide ? 'flex-1' : ''}>
        <p className={`text-base text-zinc-400 italic font-light leading-relaxed text-justify transition-all duration-300 ${!isExpanded ? 'line-clamp-6 overflow-hidden' : ''}`}>
          "{t.text}"
        </p>
        
        {/* Botão Saiba Mais se o texto for longo */}
        {t.text.length > 250 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 mb-6 flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors group"
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
          <span className="text-[10px] text-accent uppercase font-bold tracking-widest">{t.role}</span>
        </div>
      </div>
    </div>
  );
};

const Home = ({ onSelectProject, settings }: { onSelectProject: (project: Project) => void, settings: { global: SiteSettings | null, sobre: AboutMe | null } }) => {
  const { data: services, loading: servicesLoading } = useCollection<Service>('services');
  const { data: testimonials, loading: testimonialsLoading } = useCollection<Testimonial>('testimonials');
  
  const [activeTab, setActiveTab] = useState<'all' | 'branding' | 'arquitetura'>('all');
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const finalVideoUrl = settings.sobre?.videoUrl || 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/SobreMim%2FSobreMim.mp4?alt=media&token=ff5c966d-15e2-489f-bedf-f47a1426a7fd';
  const isDirectVideo = finalVideoUrl.includes('firebasestorage.googleapis.com') || finalVideoUrl.endsWith('.mp4');
  const finalEmbedUrl = !isDirectVideo ? getYouTubeEmbedUrl(finalVideoUrl) : '';
  
  const bioText = settings.sobre?.description || ingridBio;

  useEffect(() => {
    if (settings.global) {
      const g = settings.global;
      if (g.accentColor) document.documentElement.style.setProperty('--accent-color', g.accentColor);
      if (g.cor1) document.documentElement.style.setProperty('--cor1', g.cor1);
      if (g.cor2) document.documentElement.style.setProperty('--cor2', g.cor2);
      if (g.cor3) document.documentElement.style.setProperty('--cor3', g.cor3);
      if (g.cor4) document.documentElement.style.setProperty('--cor4', g.cor4);
      if (g.cor5) document.documentElement.style.setProperty('--cor5', g.cor5);
      if (g.cor6) document.documentElement.style.setProperty('--cor6', g.cor6);
      if (g.white) document.documentElement.style.setProperty('--white', g.white);
      if (g.grayLight) document.documentElement.style.setProperty('--gray-light', g.grayLight);
      if (g.textDark) document.documentElement.style.setProperty('--text-dark', g.textDark);
      if (g.shadow) document.documentElement.style.setProperty('--shadow', g.shadow);
      if (g.fontSizeH1) document.documentElement.style.setProperty('--font-size-h1', g.fontSizeH1);
      if (g.fontSizeH2) document.documentElement.style.setProperty('--font-size-h2', g.fontSizeH2);
      if (g.fontSizeH3) document.documentElement.style.setProperty('--font-size-h4', g.fontSizeH3);
      if (g.fontSizeH4) document.documentElement.style.setProperty('--font-size-h4', g.fontSizeH4);
    }
  }, [settings.global]);

  return (
    <div className="bg-zinc-950">
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
                  className="mt-4 flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors group w-fit"
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

      {/* 3. SEÇÃO SERVIÇOS */}
      <section id="servicos" className="section-container scroll-mt-20 !pt-0">
        <div className="section-card p-5 flex flex-col items-center">
          <div className="mt-8 mb-12 text-center">
            <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">
              Serviços
            </h3>
          </div>

          <div className="w-full space-y-4">
            {[
              {
                title: "Estratégia & Posicionamento",
                items: [
                  "Planejamento estratégico de conteúdo para redes sociais",
                  "Construção de narrativa, tom de voz e storytelling da marca",
                  "Desenvolvimento de linha editorial alinhada ao posicionamento",
                  "Pesquisa, benchmarking e análise de mercado"
                ]
              },
              {
                title: "Planejamento & Execução",
                items: [
                  "Planejamento e gestão de calendário editorial",
                  "Criação de pautas, roteiros e briefings para produção de conteúdo",
                  "Desenvolvimento e coordenação de campanhas digitais"
                ]
              },
              {
                title: "Gestão & Coordenação",
                items: [
                  "Coordenação, direcionamento e apoio a times de social media e criação",
                  "Organização de fluxos de trabalho e processos de produção de conteúdo",
                  "Monitoramento da qualidade das entregas, garantindo consistência e alinhamento estratégico",
                  "Gestão de múltiplos projetos e prazos simultaneamente"
                ]
              },
              {
                title: "Acompanhamento & Otimização",
                items: [
                  "Acompanhamento de métricas e performance de conteúdo",
                  "Análise de resultados e otimização estratégica contínua",
                  "Identificação de oportunidades de melhoria na comunicação"
                ]
              },
              {
                title: "Relacionamento & Gestão de Projetos",
                items: [
                  "Condução de reuniões, alinhamentos e apresentações estratégicas",
                  "Interface entre cliente e equipe criativa",
                  "Gestão de feedbacks e acompanhamento de demandas"
                ]
              }
            ].map((service, idx) => (
              <AccordionItem key={idx} title={service.title} items={service.items} />
            ))}
          </div>
        </div>
      </section>
      {/* 4. SEÇÃO PROJETOS (SHOWCASE) */}
      <ProjectSection onSelectProject={onSelectProject} />

      {/* 5. SEÇÃO DEPOIMENTOS */}
      <section id="depoimentos" className="section-container !pt-0">
        <div className="section-card p-5 md:p-10 flex flex-col items-center">
            <div className="mt-4 mb-12 text-center">
               <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">Depoimentos</h3>
            </div>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {(testimonials && testimonials.length > 0 ? testimonials.sort((a,b) => (a.order || 0) - (b.order || 0)) : [
                {
                  author: "Paulo Buzzo",
                  role: "Gestor Comercial | Growth | IA",
                  text: "Tive a honra de ter a Ingrid na equipe comercial da Auddar. Ela muito além do esperado, cuidando da comunicação interna, eventos e transformando as redes sociais, criando um planejamento estratégico de brilhar os olhos. Sempre proativa e cheia de ideias, destaco sua energia e dedicação inspiraram a todos ao redor.Ela é contagiante! Foi um privilégio ter Ingrid no time, e sei que onde ela estiver, trará sempre excelentes resultados e boas vibrações!",
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
              ]).map((t, idx) => (
                <TestimonialCard key={idx} t={t} isWide={idx === 2 || (testimonials?.length === 3 && idx === 2)} />
              ))}
            </div>
        </div>
      </section>

    </div>
  );
};

// Admin Protection
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Carregando permissões...</div>;
  if (!user) return <Navigate to="/admin/login" />;
  if (requiredRole === 'super' && role !== 'super') return <Navigate to="/" />;
  if (requiredRole === 'admin' && !['admin', 'super'].includes(role || '')) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const AdminPanel = () => {
  const { logout, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'testimonials' | 'about' | 'users' | 'settings' | 'media'>('projects');

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-zinc-900 border-r border-white/5 p-8 flex flex-col gap-12 shrink-0">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tighter">INGRID <span className="text-accent">SINKOVITZ</span></Link>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 font-bold">Admin Dashboard</div>
        </div>

        <nav className="flex-1 space-y-2">
          <AdminNavItem active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<LayoutGrid size={20}/>} label="Projetos" />
          <AdminNavItem active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<Plus size={20}/>} label="Mídias (Upload)" />
          <AdminNavItem active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<MessageSquare size={20}/>} label="Serviços" />
          <AdminNavItem active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} icon={<Mail size={20}/>} label="Depoimentos" />
          <AdminNavItem active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<Play size={20}/>} label="Sobre Mim" />
          <AdminNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Menu size={20}/>} label="Configurações" />
          {role === 'super' && <AdminNavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<ShieldCheck size={20}/>} label="ACL / Usuários" />}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-4">
          <DatabaseControlCenter seedAll={seedAll} />
          <button onClick={logout} className="w-full py-4 bg-red-600/10 text-red-500 font-bold rounded-[8px] hover:bg-red-600 hover:text-white transition">Sair da Conta</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-16 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'media' && <MediaLibrary />}
          {activeTab === 'services' && <ServiceManager />}
          {activeTab === 'testimonials' && <TestimonialManager />}
          {activeTab === 'about' && <AboutManager />}
          {activeTab === 'settings' && <GlobalSettingsManager />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </main>
    </div>
  );
};

const AdminNavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[8px] font-semibold transition ${active ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const AdminLogin = ({ onClose }: { onClose?: () => void }) => {
  const { login, user, role, loading, logout } = useAuth();
  
  // Se já estiver logado e for o login "tela cheia" (sem onClose), redireciona
  if (user && role && !onClose) return <Navigate to="/admin" />;
  
  return (
    <div className={`flex items-center justify-center p-4 ${onClose ? 'fixed inset-0 z-[15000] bg-black/98 backdrop-blur-2xl' : 'h-screen bg-zinc-950'}`}>
      <div className="glass-morphism p-12 rounded-[8px] max-w-md w-full text-center space-y-8 relative overflow-hidden">
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-all hover:rotate-90"
          >
            <X size={24} />
          </button>
        )}

        {/* Background Glow */}
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 bg-accent/20 text-accent mx-auto rounded-full flex items-center justify-center shadow-[0_0_40px_-10px_rgba(var(--accent-rgb),0.3)]">
            <ShieldCheck size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Painel Restrito</h2>
            <p className="text-zinc-500 text-sm font-medium">Acesso restrito para administradores e suporte técnico.</p>
          </div>

          {user && role ? (
            <div className="space-y-6">
              <div className="py-4 px-6 bg-accent/10 border border-accent/20 rounded-[8px] flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-accent font-black uppercase tracking-widest text-[10px]">Portal de Acesso Livre</span>
                </div>
                <span className="text-white/60 text-[11px] font-medium truncate w-full">{user.email}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/admin" 
                  className="py-4 bg-accent text-black font-black uppercase tracking-widest text-[9px] rounded-[8px] hover:bg-white transition-all text-center"
                >
                  Painel Admin
                </Link>
                <button 
                  onClick={logout}
                  className="py-4 bg-zinc-800 text-white font-black uppercase tracking-widest text-[9px] rounded-[8px] hover:bg-zinc-700 transition-all"
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={login}
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-[8px] flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={20} /> Entrar com Google</>
              )}
            </button>
          )}

          <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-[0.3em]">
            Ambiente Seguro Scalla Records
          </p>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ settings }: { settings: { global: SiteSettings | null, sobre: AboutMe | null } }) => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aboutProject, setAboutProject] = useState<Project | null>(null);
  const [lockedProject, setLockedProject] = useState<Project | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setIsAdminLoginOpen(true);
    window.addEventListener('open-admin-login', handleOpenLogin);
    return () => window.removeEventListener('open-admin-login', handleOpenLogin);
  }, []);

  const handleSelectProject = (project: Project) => {
    const isAdmin = !!user;

    // 1. Se for admin, pula tudo e abre o projeto
    if (isAdmin) {
      setSelectedProject(project);
      return;
    }

    // 2. Verificar se está trancado
    if (project.isLocked) {
      setLockedProject(project);
      return;
    }

    // 3. Verificar se tem pop-up de informações ou se é rascunho
    if (project.aboutConfig || project.status === 'draft') {
      setAboutProject(project);
    } else {
      setSelectedProject(project);
    }
  };

  const handleStartProject = () => {
    if (aboutProject) {
      const p = aboutProject;
      setAboutProject(null);
      
      // Se ao iniciar o tour o projeto estiver trancado
      if (p.isLocked) {
        setLockedProject(p);
      } else {
        setSelectedProject(p);
      }
    }
  };

  const handlePasswordSuccess = (project: Project) => {
    setLockedProject(null);
    if (project.aboutConfig) {
      setAboutProject(project);
    } else {
      setSelectedProject(project);
    }
  };

  const handleVideoStateChange = useCallback((isVideo: boolean) => {
    // Ducking logic removed from here as it will be local to modal
  }, []);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, []);

  const closeModalsDirectly = useCallback((e?: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsMenuOpen(false);
    setSelectedProject(null);
    setAboutProject(null);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-[300] glass-morphism border-b-0 pointer-events-auto">
        <div className="max-w-[1008px] mx-auto px-6 md:px-0 h-20 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter pl-[5px]">Ingrid <span className="text-accent">Sinkovitz</span></Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-12 font-medium text-sm tracking-widest uppercase">
            <a href="#sobre" onClick={() => closeModalsDirectly()} className="hover:text-accent transition">Sobre</a>
            <a href="#servicos" onClick={() => closeModalsDirectly()} className="hover:text-accent transition">Serviços</a>
            <a href="#projetos" onClick={() => closeModalsDirectly()} className="hover:text-accent transition">Projetos</a>
            <a href="#depoimentos" onClick={() => closeModalsDirectly()} className="hover:text-accent transition">Depoimentos</a>
            <a href="#contato" onClick={() => closeModalsDirectly()} className="hover:text-accent transition">Contato</a>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/admin" className="p-2 text-zinc-500 hover:text-white transition hidden md:block">
              <ShieldCheck size={20} />
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-accent transition z-[310] mr-[-8px]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[500] flex items-start justify-start p-6 pt-[60px] md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: -20, opacity: 0 }}
                className="w-full max-w-[280px] bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[8px] p-10 flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button inside card */}
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-5 right-5 text-zinc-500 hover:text-white p-2"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col gap-0 text-base font-medium text-white w-full">
                  <a href="#sobre" onClick={() => closeModalsDirectly()} className="w-full py-4 border-b border-white/5 hover:text-accent transition text-left">Sobre</a>
                  <a href="#servicos" onClick={() => closeModalsDirectly()} className="w-full py-4 border-b border-white/5 hover:text-accent transition text-left">Serviços</a>
                  <a href="#projetos" onClick={() => closeModalsDirectly()} className="w-full py-4 border-b border-white/5 hover:text-accent transition text-left">Projetos</a>
                  <a href="#depoimentos" onClick={() => closeModalsDirectly()} className="w-full py-4 border-b border-white/5 hover:text-accent transition text-left">Depoimentos</a>
                  <a href="#contato" onClick={() => closeModalsDirectly()} className="w-full py-4 border-b border-white/5 hover:text-accent transition text-left">Contato</a>
                  
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-zinc-500 mt-6 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest">
                    <ShieldCheck size={14} /> Admin
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <Home onSelectProject={handleSelectProject} settings={settings} />
      <footer id="contato" className="section-container scroll-mt-20 !pt-0">
        <div className="section-card p-5 md:p-10 flex flex-col items-center">
          <div className="mt-4 mb-12 text-center">
            <h3 className="text-xl md:text-2xl font-bold tracking-[0.3em] uppercase opacity-40">
              Contato
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch relative z-10 w-full mb-12">
            {/* Card 1: Identidade */}
            <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col items-center md:items-start text-center md:text-left justify-start space-y-8">
              <Link to="/" className="text-xl font-bold tracking-tighter uppercase">
                INGRID <span className="text-accent">SINKOVITZ</span>
              </Link>
              <p className="text-[11px] uppercase tracking-[0.4em] opacity-30 font-bold">
                Estratégia Planejamento Gestão
              </p>
            </div>

            {/* Card 2: Navegação */}
            <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col items-center md:items-start justify-start space-y-8 text-sm font-medium text-zinc-500">
              <span className="text-white/20 font-sans uppercase tracking-widest text-xs font-bold">Navegação</span>
              <div className="flex flex-col gap-4 items-center md:items-start">
                <a href="#sobre" onClick={() => closeModalsDirectly()} className="hover:text-accent transition capitalize">Sobre</a>
                <a href="#servicos" onClick={() => closeModalsDirectly()} className="hover:text-accent transition capitalize">Serviços</a>
                <a href="#projetos" onClick={() => closeModalsDirectly()} className="hover:text-accent transition capitalize">Projetos</a>
                <a href="#depoimentos" onClick={() => closeModalsDirectly()} className="hover:text-accent transition capitalize">Depoimentos</a>
                <a href="#contato" onClick={() => closeModalsDirectly()} className="hover:text-accent transition capitalize">Contato</a>
              </div>
            </div>

            {/* Card 3: Conecte-se */}
            <div className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[8px] border border-white/5 flex flex-col items-center md:items-start justify-start space-y-8">
              <span className="text-white/20 font-sans uppercase tracking-widest text-xs font-bold">Conecte-se</span>
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
                    <span className={`tracking-widest text-xs transition-colors duration-300 ${!social.icon ? 'lowercase text-zinc-500 mt-1 group-hover:text-accent' : 'uppercase font-bold'}`}>
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

      <div className="max-w-[1008px] mx-auto px-6 mb-12 text-center opacity-30">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">
          © 2026 Ingrid Sinkovitz. Todos os direitos reservados.
        </p>
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={closeProject}
        onVideoStateChange={handleVideoStateChange}
      />

      <AnimatePresence>
        {aboutProject && (
          <AboutProjectModal 
            project={aboutProject}
            onClose={() => setAboutProject(null)}
            onStart={handleStartProject}
          />
        )}
      </AnimatePresence>

      <ProjectPasswordModal
        project={lockedProject}
        onClose={() => setLockedProject(null)}
        onSuccess={handlePasswordSuccess}
      />

      <AnimatePresence>
        {isAdminLoginOpen && (
          <AdminLogin onClose={() => setIsAdminLoginOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

function DatabaseControlCenter({ seedAll }: { seedAll: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, 'idle' | 'syncing' | 'done' | 'error'>>({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [dbIdDisplay, setDbIdDisplay] = useState('...');

  useEffect(() => {
    // Pegar o ID do banco da config ou meta
    import('../firebase-applet-config.json').then(config => {
      setDbIdDisplay(config.default?.firestoreDatabaseId || '(default)');
    });
  }, []);

  const PROJECTS = [
    { id: 'projeto-metavix', name: 'Metavix' },
    { id: 'projeto-elobike', name: 'EloBike' },
    { id: 'projeto-good-storage', name: 'Good Storage' },
    { id: 'projeto-auddar', name: 'Auddar' },
    { id: 'projeto-lion-jump', name: 'Lion Jump' },
    { id: 'projeto-scalla-records', name: 'Scalla Records' },
    { id: 'config-global', name: 'Configurações Globais' }
  ];

  const [connStatus, setConnStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkConn = async () => {
      if (!db) {
        setConnStatus('offline');
        return;
      }
      try {
        const { getDocFromServer, doc } = await import('firebase/firestore');
        await getDocFromServer(doc(db, 'diagnostics', 'ping'));
        setConnStatus('online');
      } catch (e: any) {
        if (e.code === 'permission-denied' || e.code === 'unauthenticated') setConnStatus('online'); // Resposta recebida!
        else setConnStatus('offline');
      }
    };
    if (db) checkConn();
    else setConnStatus('offline');
  }, []);

  const handleSyncProject = async (projectId: string) => {
    setSyncStatus(prev => ({ ...prev, [projectId]: 'syncing' }));
    setError('');

    // Helper timeout
    async function withTimeout<T>(promise: Promise<T>, ms: number) {
      const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Tempo esgotado (Time-out)')), ms)
      );
      return Promise.race([promise, timeout]);
    }

    try {
      if (projectId === 'config-global') {
        const { seedGlobalSettings } = await import('./seed');
        await withTimeout(seedGlobalSettings(), 15000);
      } else {
        const projectData = PROJECTS_LIST.find(p => p.id === projectId);
        if (!projectData) throw new Error('Dados não encontrados no código');
        
        if (!db) throw new Error('Conexão Firebase não iniciada');
        
        console.log(`[SYNC] Iniciando gravação de ${projectId}...`);
        
        await withTimeout(setDoc(doc(db, 'projects', projectId), {
          ...projectData,
          updatedAt: serverTimestamp()
        }, { merge: true }), 20000);
        
        console.log(`[SYNC] ${projectId} gravado com sucesso.`);
      }
      setSyncStatus(prev => ({ ...prev, [projectId]: 'done' }));
    } catch (err: any) {
      console.error('[SYNC_ERROR]', err);
      setSyncStatus(prev => ({ ...prev, [projectId]: 'error' }));
      setError(`${projectId}: ${err.message || 'Erro desconhecido'}`);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-zinc-800 text-accent text-[10px] font-black uppercase tracking-widest rounded-[8px] hover:bg-accent hover:text-white transition flex items-center justify-center gap-2 shadow-xl"
      >
        <Database size={14} /> Sincronizar Firestore
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sync Firestore v2.5</span>
          <div className="flex flex-col gap-0.5 mt-0.5">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${connStatus === 'online' ? 'bg-green-500' : connStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[7px] font-bold uppercase text-zinc-600">{connStatus === 'online' ? 'Servidor Conectado' : 'Sem Conexão'}</span>
            </div>
            <span className="text-[6px] font-mono text-zinc-700 uppercase">DB: {dbIdDisplay}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setSyncStatus({});
              setError('');
            }}
            className="p-1 px-2 text-[8px] font-black uppercase text-zinc-600 border border-white/5 rounded hover:bg-white/5 hover:text-zinc-400"
            title="Resetar Status"
          >
            Limpar
          </button>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {PROJECTS.map(proj => (
          <div key={proj.id} className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5">
            <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[120px]">{proj.name}</span>
            <button 
              disabled={syncStatus[proj.id] === 'syncing'}
              onClick={() => handleSyncProject(proj.id)}
              className={`px-3 py-1.5 rounded text-[8px] font-black uppercase transition-all ${
                syncStatus[proj.id] === 'done' 
                ? 'bg-green-500/20 text-green-500' 
                : syncStatus[proj.id] === 'syncing'
                ? 'bg-accent/20 text-accent animate-pulse'
                : 'bg-white text-black hover:bg-accent hover:text-white'
              }`}
            >
              {syncStatus[proj.id] === 'done' ? 'SYNC OK' : syncStatus[proj.id] === 'syncing' ? '...' : 'SINCRONIZAR'}
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={async () => {
          if(!confirm('Sincronizar TODOS de uma vez?')) return;
          setLoading(true);
          try {
            await seedAll((msg: string) => setProgress(msg));
            alert('Sucesso completo!');
            window.location.reload();
          } catch(e: any) {
            setError(e.message);
            setLoading(false);
          }
        }}
        className="w-full py-2 bg-accent text-white text-[10px] font-black uppercase rounded mt-2 hover:brightness-110 flex items-center justify-center gap-2"
      >
        {loading ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
        {loading ? progress || 'Sincronizando...' : 'GERAL (6 PROJETOS)'}
      </button>

      {error && (
        <div className="p-2 bg-red-600/10 border border-red-600/20 rounded text-[9px] text-red-500 font-mono italic leading-tight">
          {error}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState<{ global: SiteSettings | null, sobre: AboutMe | null }>({
    global: null,
    sobre: null
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    // Carregamento ultra-rápido: se o banco demorar 1.5s, libera a tela
    const timeout = setTimeout(() => {
      if (loadingSettings) {
        console.warn('Configurações offline ou lentas. Usando padrões.');
        setLoadingSettings(false);
      }
    }, 1500); 

    getSettings().then(data => {
      clearTimeout(timeout);
      setSettings(data || { global: null, sobre: null });
      setLoadingSettings(false);
    }).catch((err) => {
      clearTimeout(timeout);
      console.error("Settings load error", err);
      setLoadingSettings(false);
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <MaintenanceGuard settings={settings?.global}>
              <Layout settings={settings} />
            </MaintenanceGuard>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const MaintenanceGuard = ({ children, settings }: { children: React.ReactNode, settings: SiteSettings | null }) => {
  const { role, loading } = useAuth();
  const isAdmin = ['super', 'admin'].includes(role || '');

  // Mantemos o bypassed no localStorage para persistir entre refreshes de projetos
  const [bypassed, setBypassed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('maintenance_bypassed') === 'true';
  });

  const handleBypass = () => {
    setBypassed(true);
    localStorage.setItem('maintenance_bypassed', 'true');
  };

  // Só ativa se o modo estiver explicitamente como true
  // DESCONECTADO TEMPORARIAMENTE PARA TESTES DA SEÇÃO DE PROJETOS
  const isMaintenanceActive = false;

  // Se estiver carregando auth
  if (loading) {
    return <MaintenanceMode title={settings?.maintenanceTitle} isLoading={true} />;
  }

  // Se o modo manutenção estiver ativo e NÃO estiver em bypass
  if (isMaintenanceActive && !bypassed) {
    // Se NÃO for admin, bloqueia direto com a mensagem
    if (!isAdmin) {
      return <MaintenanceMode title={settings?.maintenanceTitle} />;
    }
    
    // Se FOR admin, mostramos a tela com o botão de entrar
    return (
      <MaintenanceMode 
        title={settings?.maintenanceTitle} 
        isAdmin={true} 
        onBypass={handleBypass}
      />
    );
  }

  return <>{children}</>;
};

