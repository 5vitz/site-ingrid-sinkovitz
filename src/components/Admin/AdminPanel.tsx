import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, MessageSquare, Mail, Play, Menu, 
  ShieldCheck, Plus 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ProjectManager } from './ProjectManager';
import { MediaLibrary } from './MediaLibrary';
import { ServiceManager } from './ServiceManager';
import { TestimonialManager } from './TestimonialManager';
import { AboutManager } from './AboutManager';
import { GlobalSettingsManager } from './GlobalSettingsManager';
import { UserManagement } from './UserManagement';
import { DatabaseControlCenter } from './DatabaseControlCenter';
import { seedAll } from '../../seed';

const AdminNavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[8px] font-semibold transition ${active ? 'bg-accent text-black shadow-lg shadow-accent/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

export const AdminPanel: React.FC = () => {
  const { logout, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'testimonials' | 'about' | 'users' | 'settings' | 'media'>('projects');

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-zinc-900 border-r border-white/5 p-8 flex flex-col gap-12 shrink-0">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tighter">Ingrid <span className="text-accent">Sinkovitz</span></Link>
          <div className="text-[10px] tracking-widest text-zinc-500 mt-1 font-bold">Admin Dashboard</div>
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
