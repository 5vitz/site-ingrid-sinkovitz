import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { 
  Menu, ShieldCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectSection } from './components/ProjectSection';
import { AboutMeSection } from './components/AboutMeSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { ProjectModal } from './components/ProjectModal';
import { AboutProjectModal } from './components/AboutProjectModal';
import { ProjectPasswordModal } from './components/ProjectPasswordModal';
import { Project, AboutMe, SiteSettings } from './types';
import { getSettings } from './services/dataService';

import { Home } from './pages/Home';
import { AdminPanel } from './components/Admin/AdminPanel';
import { AdminLogin } from './components/Admin/AdminLogin';
import { MaintenanceGuard } from './components/MaintenanceGuard';

// Admin Protection
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Carregando permissões...</div>;
  if (!user) return <Navigate to="/admin/login" />;
  if (requiredRole === 'super' && role !== 'super') return <Navigate to="/" />;
  if (requiredRole === 'admin' && !['admin', 'super'].includes(role || '')) return <Navigate to="/" />;
  
  return <>{children}</>;
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
    if (project.isLocked && !user) {
      setLockedProject(project);
      return;
    }

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
        <div className="max-w-[1008px] mx-auto px-6 md:px-0 h-20 flex justify-between items-center text-white">
          <Link to="/" className="text-2xl font-bold tracking-tighter pl-[5px] not-italic uppercase">INGRID <span className="text-accent">SINKOVITZ</span></Link>
          
          <div className="hidden md:flex gap-12 font-medium text-sm tracking-widest uppercase not-italic">
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
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-accent transition z-[310] mr-[-8px]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

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
                  
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-zinc-500 mt-6 hover:text-white transition-colors text-[10px] font-bold tracking-widest uppercase">
                    <ShieldCheck size={14} /> Admin
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <Home onSelectProject={handleSelectProject} settings={settings} />
      <ContactSection />

      <div className="max-w-[1008px] mx-auto px-6 mb-12 text-center opacity-30">
        <p className="text-[10px] text-zinc-600 font-sans tracking-[0.3em] font-bold uppercase">
          © {new Date().getFullYear()} Ingrid Sinkovitz. Todos os direitos reservados.
        </p>
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={closeProject}
        onVideoStateChange={() => {}}
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


export default function App() {
  const [settings, setSettings] = useState<{ global: SiteSettings | null, sobre: AboutMe | null }>({
    global: null,
    sobre: null
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loadingSettings) {
        setLoadingSettings(false);
      }
    }, 1500); 

    getSettings().then(data => {
      clearTimeout(timeout);
      setSettings(data || { global: null, sobre: null });
      setLoadingSettings(false);
    }).catch(() => {
      clearTimeout(timeout);
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


