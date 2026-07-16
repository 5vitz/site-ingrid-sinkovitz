import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { 
  Database, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Settings, 
  FileText, 
  Upload, 
  Check, 
  AlertCircle, 
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

import { Project, ServiceItem, SiteSettings } from '../types';
import { projectsData } from '../data/projectsData';
import { servicesData } from '../data/servicesData';
import { aboutData } from '../data/aboutData';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Auth Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active Tab states
  const [activeTab, setActiveTab] = useState<'projects' | 'seed' | 'settings'>('projects');

  // Seeding states
  const [seedingLog, setSeedingLog] = useState<string[]>([]);
  const [seedingInProgress, setSeedingInProgress] = useState(false);

  // Projects states
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const navigate = useNavigate();

  // Watch Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const emailLower = currentUser.email?.toLowerCase();
        const authorized = [
          'sinkando@gmail.com', 
          'ingridsinkovitz@gmail.com', 
          'ingridsinkovitz@gmail.com.br'
        ];
        
        if (authorized.includes(emailLower || '')) {
          setUser(currentUser);
        } else {
          // If logged in user is not authorized, sign them out immediately
          signOut(auth);
          setAuthError('Este e-mail não possui permissões administrativas.');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch projects when tab is projects
  useEffect(() => {
    if (user && activeTab === 'projects') {
      fetchProjects();
    }
  }, [user, activeTab]);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const list: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Project;
        if (data.version === 3) {
          list.push(data);
        }
      });
      setProjects(list.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setProjectsLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthSubmitting(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao autenticar com o Google.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Email/Password Login & Register
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Credenciais inválidas.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('ingrid_access_token');
    localStorage.removeItem('ingrid_user_email');
    navigate('/manutencao');
  };

  // WebP Compressor on Client-Side
  const compressToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Falha na conversão para blob'));
            }, 'image/webp', 0.85); // 85% quality
          } else {
            reject(new Error('Erro ao criar contexto 2D'));
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Upload file to storage with compressor
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | number) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedProject) return;
    
    const file = e.target.files[0];
    setImageUploading(true);

    try {
      let uploadBlob: Blob = file;
      let extension = '.webp';
      
      // Auto-convert to WebP client-side if it's an image
      if (file.type.startsWith('image/')) {
        console.log(`Compressing ${file.name} to WebP client-side...`);
        uploadBlob = await compressToWebP(file);
      } else {
        const lastDot = file.name.lastIndexOf('.');
        extension = file.name.substring(lastDot);
      }

      const fileName = `${Date.now()}${extension}`;
      const storageRef = ref(storage, `v3/projects/${selectedProject.id}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, uploadBlob, {
        contentType: file.type.startsWith('image/') ? 'image/webp' : file.type,
        cacheControl: 'public,max-age=31536000'
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);

      if (field === 'cover') {
        setSelectedProject({
          ...selectedProject,
          coverImage: downloadUrl
        });
      } else {
        const updatedMedia = [...selectedProject.media];
        updatedMedia[field] = {
          ...updatedMedia[field],
          url: downloadUrl
        };
        setSelectedProject({
          ...selectedProject,
          media: updatedMedia
        });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Falha ao fazer upload da imagem.');
    } finally {
      setImageUploading(false);
    }
  };

  // Database Seeding
  const handleSeedDatabase = async () => {
    if (!window.confirm('Isso irá substituir os dados atuais do Firestore pelos dados locais dos arquivos de configuração. Deseja continuar?')) {
      return;
    }

    setSeedingInProgress(true);
    setSeedingLog([]);
    const log = (msg: string) => setSeedingLog(prev => [...prev, msg]);

    try {
      log('🚀 Iniciando sincronização (Seeding) do Banco de Dados...');
      
      // 1. Seed Projects
      log('📂 Sincronizando Projetos...');
      for (const project of projectsData) {
        log(`🔹 Gravando projeto: ${project.title} (${project.id})...`);
        await setDoc(doc(db, 'projects', project.id), project);
      }
      log('✅ Todos os projetos sincronizados.');

      // 2. Seed Services
      log('📂 Sincronizando Serviços...');
      for (let i = 0; i < servicesData.length; i++) {
        const service = servicesData[i];
        const serviceId = `servico-${i + 1}`;
        log(`🔹 Gravando serviço: ${service.title}...`);
        await setDoc(doc(db, 'services', serviceId), service);
      }
      log('✅ Todos os serviços sincronizados.');

      // 3. Seed Settings
      log('📂 Sincronizando Configurações Gerais...');
      const settings = {
        name: aboutData.name,
        role: aboutData.role,
        tagline: aboutData.tagline,
        email: 'ingridsinkovitz@gmail.com',
        linkedin: 'https://www.linkedin.com/in/ingridsinkovitz/',
        whatsapp: 'https://wa.me/5527999193525',
        version: 3
      };
      
      await setDoc(doc(db, 'settings', 'mainSettings'), {
        ...settings,
        paragraphs: aboutData.paragraphs
      });
      log('✅ Configurações e Bio da Ingrid sincronizadas.');

      log('🎉 Sincronização concluída com sucesso!');
    } catch (err: any) {
      log(`❌ Erro no Seeding: ${err.message || err}`);
    } finally {
      setSeedingInProgress(false);
    }
  };

  // Create or Update Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setProjectSubmitting(true);
    try {
      await setDoc(doc(db, 'projects', selectedProject.id), selectedProject);
      alert('Projeto salvo com sucesso!');
      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Erro ao salvar projeto.');
    } finally {
      setProjectSubmitting(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto permanentemente do banco?')) return;
    
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      alert('Projeto excluído com sucesso.');
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Erro ao excluir projeto.');
    }
  };

  // Initialize new project object
  const startNewProject = () => {
    const id = `projeto-${Date.now()}`;
    const newProj: Project = {
      id,
      title: 'Novo Case',
      category: 'ESTRATÉGIA',
      client: 'Nome do Cliente',
      campaign: 'Campanha',
      description: 'Breve descrição.',
      challenge: 'Desafio estratégico.',
      strategy: 'Estratégia adotada.',
      metrics: [
        { label: 'Exemplo de Métrica', value: '10%' }
      ],
      coverImage: '',
      media: [],
      order: projects.length + 1,
      version: 3
    };
    setSelectedProject(newProj);
  };

  // Render Login Form
  if (!user && !loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-cream text-brand-charcoal px-6 py-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="bg-white/80 backdrop-blur-md border border-black/10 rounded-lg max-w-md w-full p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-brand-blue/5 rounded-full flex items-center justify-center">
              <Lock className="text-brand-blue" size={24} />
            </div>
            <h1 className="font-serif text-3xl text-black uppercase tracking-wider mb-2">
              PAINEL INGRID
            </h1>
            <p className="font-sans text-[10px] text-brand-charcoal/60 uppercase tracking-widest">
              Identifique-se para gerenciar o conteúdo
            </p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authError && (
              <div className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/20 text-red-700 text-xs p-3 rounded">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold tracking-wider uppercase">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/5 border border-black/10 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:bg-white text-black"
                placeholder="exemplo@gmail.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold tracking-wider uppercase">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/5 border border-black/10 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue focus:bg-white text-black"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full bg-black text-brand-cream py-3 rounded text-xs font-semibold tracking-[0.15em] hover:bg-brand-blue transition-colors disabled:opacity-50 uppercase cursor-pointer"
            >
              {authSubmitting ? 'Processando...' : isSignUp ? 'Registrar E-mail' : 'Entrar'}
            </button>
          </form>

          {/* Google Login Button */}
          <div className="mt-4 border-t border-black/10 pt-4">
            <button
              onClick={handleGoogleLogin}
              disabled={authSubmitting}
              className="w-full flex items-center justify-center gap-2 border border-black/20 bg-white hover:bg-black/5 py-3 rounded text-xs font-semibold tracking-wider text-black transition-colors disabled:opacity-50 uppercase cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.64 14.99 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.87 3C6.35 7.57 8.94 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.72-4.92 3.72-8.58z"/>
                <path fill="#FBBC05" d="M5.37 14.5c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.5 6.9C.54 8.82 0 10.97 0 13.2s.54 4.38 1.5 6.3l3.87-3z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.06 0-5.65-2.53-6.63-5.46L1.5 15.86C3.39 19.7 7.35 22.31 12 23z"/>
              </svg>
              Login com Google
            </button>
          </div>

          <div className="mt-6 text-center text-xs">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-brand-blue hover:underline uppercase tracking-wider text-[9px] font-bold"
            >
              {isSignUp ? 'Já tem conta? Entrar' : 'Precisa de conta? Cadastrar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Loader during state initialization
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-cream text-brand-charcoal">
        <Loader2 className="animate-spin text-brand-blue" size={32} />
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen w-full bg-brand-cream text-brand-charcoal font-sans flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-black/10 px-6 py-4 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Database className="text-brand-blue" size={20} />
          <h1 className="font-serif text-lg tracking-[0.15em] font-medium text-black uppercase">
            Ingrid Portfolio &bull; Painel Admin
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-brand-charcoal/60 hidden sm:inline">
            Acessando como: <b>{user?.email}</b>
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-black/10 hover:border-black text-black px-4 py-2 text-xs tracking-wider font-semibold rounded transition-colors uppercase cursor-pointer"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-r border-black/5 p-6 flex flex-col gap-2 shrink-0">
          <button
            onClick={() => { setActiveTab('projects'); setSelectedProject(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left text-xs font-semibold tracking-wider transition-colors uppercase ${
              activeTab === 'projects' 
                ? 'bg-black text-brand-cream' 
                : 'hover:bg-black/5 text-brand-charcoal/70 hover:text-black'
            }`}
          >
            <FileText size={16} /> Projetos / Cases
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left text-xs font-semibold tracking-wider transition-colors uppercase ${
              activeTab === 'settings' 
                ? 'bg-black text-brand-cream' 
                : 'hover:bg-black/5 text-brand-charcoal/70 hover:text-black'
            }`}
          >
            <Settings size={16} /> Configurações Gerais
          </button>

          <button
            onClick={() => setActiveTab('seed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left text-xs font-semibold tracking-wider transition-colors uppercase ${
              activeTab === 'seed' 
                ? 'bg-black text-brand-cream' 
                : 'hover:bg-black/5 text-brand-charcoal/70 hover:text-black'
            }`}
          >
            <Sparkles size={16} /> Banco (Seeding)
          </button>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
          {/* Tab: PROJECTS */}
          {activeTab === 'projects' && !selectedProject && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-black/10 pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-black uppercase tracking-wider">
                    Cases de Projetos
                  </h2>
                  <p className="text-xs text-brand-charcoal/60 uppercase tracking-widest mt-1">
                    Crie, modifique ou organize a ordem dos cases no site
                  </p>
                </div>
                <button
                  onClick={startNewProject}
                  className="inline-flex items-center gap-2 bg-brand-blue text-white px-5 py-2.5 rounded text-xs font-semibold tracking-wider hover:bg-brand-blue/95 transition-all shadow-md shadow-brand-blue/15 uppercase cursor-pointer"
                >
                  <Plus size={16} /> Novo Projeto
                </button>
              </div>

              {projectsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-brand-blue" size={32} />
                  <span className="text-xs uppercase font-bold tracking-widest text-brand-charcoal/40">Carregando Banco...</span>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-20 bg-white border border-dashed border-black/10 rounded-lg p-12 flex flex-col items-center gap-4">
                  <p className="text-sm text-brand-charcoal/60 font-semibold uppercase">Nenhum projeto no banco de dados.</p>
                  <p className="text-xs text-brand-charcoal/40 max-w-sm">Você precisa inicializar os dados usando o botão de importação na aba "Banco (Seeding)" para popular a base pela primeira vez.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white border border-black/10 p-5 rounded-lg flex flex-col justify-between shadow-sm">
                      <div className="flex gap-4">
                        {proj.coverImage && (
                          <img src={proj.coverImage} alt={proj.title} className="w-20 h-16 object-cover rounded bg-black/5 shrink-0" />
                        )}
                        <div>
                          <span className="text-[9px] font-bold tracking-widest text-brand-charcoal/50 uppercase">{proj.category}</span>
                          <h3 className="font-serif text-lg text-black font-semibold mt-1 leading-tight">{proj.title}</h3>
                          <p className="text-xs text-brand-charcoal/60 line-clamp-2 mt-1.5">{proj.description}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-center">
                        <span className="text-xs text-brand-charcoal/40">Ordem: <b>{proj.order}</b></span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProject(proj)}
                            className="bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase text-brand-charcoal transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="bg-red-500/5 hover:bg-red-500/10 text-red-600 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: PROJECTS - EDIT MODE */}
          {activeTab === 'projects' && selectedProject && (
            <div className="bg-white border border-black/10 p-6 md:p-10 rounded-lg max-w-4xl mx-auto shadow-sm">
              <div className="flex justify-between items-center border-b border-black/10 pb-6 mb-8">
                <div>
                  <h2 className="font-serif text-2xl text-black uppercase tracking-wider">
                    {selectedProject.title === 'Novo Case' ? 'Criar Novo Case' : `Editar Case: ${selectedProject.title}`}
                  </h2>
                  <span className="text-[10px] text-brand-charcoal/40 uppercase tracking-widest font-mono">ID: {selectedProject.id}</span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-xs font-semibold tracking-wider text-brand-charcoal/60 hover:text-black uppercase cursor-pointer"
                >
                  Voltar para lista
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-6">
                {/* 2-col Form row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">Título do Case</label>
                    <input
                      type="text"
                      required
                      value={selectedProject.title}
                      onChange={(e) => setSelectedProject({...selectedProject, title: e.target.value})}
                      className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">Categoria</label>
                    <input
                      type="text"
                      required
                      value={selectedProject.category}
                      onChange={(e) => setSelectedProject({...selectedProject, category: e.target.value})}
                      className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">Cliente</label>
                    <input
                      type="text"
                      required
                      value={selectedProject.client}
                      onChange={(e) => setSelectedProject({...selectedProject, client: e.target.value})}
                      className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">Campanha</label>
                    <input
                      type="text"
                      required
                      value={selectedProject.campaign}
                      onChange={(e) => setSelectedProject({...selectedProject, campaign: e.target.value})}
                      className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>
                </div>

                {/* Textareas */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">Descrição (Geral)</label>
                  <textarea
                    rows={3}
                    required
                    value={selectedProject.description}
                    onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">O Desafio (Challenge)</label>
                  <textarea
                    rows={3}
                    required
                    value={selectedProject.challenge}
                    onChange={(e) => setSelectedProject({...selectedProject, challenge: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">A Estratégia (Strategy)</label>
                  <textarea
                    rows={3}
                    required
                    value={selectedProject.strategy}
                    onChange={(e) => setSelectedProject({...selectedProject, strategy: e.target.value})}
                    className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white resize-none"
                  />
                </div>

                {/* Order & Cover Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">Ordem de Exibição</label>
                    <input
                      type="number"
                      required
                      value={selectedProject.order}
                      onChange={(e) => setSelectedProject({...selectedProject, order: parseInt(e.target.value) || 1})}
                      className="w-full bg-black/5 border border-black/10 rounded px-4 py-2 text-sm text-black focus:outline-none focus:border-brand-blue focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">Imagem de Capa (Auto-WebP)</label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="text"
                        required
                        value={selectedProject.coverImage}
                        onChange={(e) => setSelectedProject({...selectedProject, coverImage: e.target.value})}
                        className="flex-1 bg-black/5 border border-black/10 rounded px-4 py-2 text-xs text-black focus:outline-none focus:border-brand-blue"
                        placeholder="Insira URL ou selecione arquivo ao lado"
                      />
                      <label className="inline-flex items-center gap-1.5 bg-black text-brand-cream px-4 py-2.5 rounded text-xs font-semibold tracking-wider hover:bg-brand-blue hover:text-white transition-colors cursor-pointer shrink-0">
                        {imageUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'cover')}
                          disabled={imageUploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4 border-t border-black/10 pt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-lg text-black uppercase tracking-wider">Métricas e Resultados</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedMetrics = [...selectedProject.metrics, { label: 'Métrica', value: '10%' }];
                        setSelectedProject({...selectedProject, metrics: updatedMetrics});
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue uppercase cursor-pointer"
                    >
                      <Plus size={14} /> Métrica
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedProject.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex gap-4 items-center bg-black/5 p-3 rounded">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            required
                            placeholder="Métrica (ex: Crescimento)"
                            value={metric.label}
                            onChange={(e) => {
                              const updatedMetrics = [...selectedProject.metrics];
                              updatedMetrics[mIdx].label = e.target.value;
                              setSelectedProject({...selectedProject, metrics: updatedMetrics});
                            }}
                            className="bg-white border border-black/10 rounded px-3 py-1.5 text-xs text-black"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Resultado (ex: +45%)"
                            value={metric.value}
                            onChange={(e) => {
                              const updatedMetrics = [...selectedProject.metrics];
                              updatedMetrics[mIdx].value = e.target.value;
                              setSelectedProject({...selectedProject, metrics: updatedMetrics});
                            }}
                            className="bg-white border border-black/10 rounded px-3 py-1.5 text-xs text-black"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedMetrics = selectedProject.metrics.filter((_, i) => i !== mIdx);
                            setSelectedProject({...selectedProject, metrics: updatedMetrics});
                          }}
                          className="text-red-500 hover:text-red-700 shrink-0 p-1 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Gallery */}
                <div className="space-y-4 border-t border-black/10 pt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-lg text-black uppercase tracking-wider">Galeria de Mídias (Imagens/Vídeos)</h4>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const updatedMedia = [...selectedProject.media, { type: 'image', url: '', caption: '' }];
                          setSelectedProject({...selectedProject, media: updatedMedia});
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue uppercase cursor-pointer"
                      >
                        <Plus size={14} /> Imagem
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedMedia = [...selectedProject.media, { type: 'video', url: '', caption: '' }];
                          setSelectedProject({...selectedProject, media: updatedMedia});
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue uppercase cursor-pointer"
                      >
                        <Plus size={14} /> Vídeo
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedProject.media.map((med, mIdx) => (
                      <div key={mIdx} className="bg-black/5 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center border-b border-black/5 pb-2">
                          <span className="text-[10px] font-bold tracking-widest text-brand-blue uppercase">{med.type === 'image' ? 'Imagem' : 'Vídeo'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedMedia = selectedProject.media.filter((_, i) => i !== mIdx);
                              setSelectedProject({...selectedProject, media: updatedMedia});
                            }}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={14} /> Remover Mídia
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold tracking-wider uppercase text-brand-charcoal/60">Legenda (Caption)</label>
                            <input
                              type="text"
                              value={med.caption || ''}
                              onChange={(e) => {
                                const updatedMedia = [...selectedProject.media];
                                updatedMedia[mIdx].caption = e.target.value;
                                setSelectedProject({...selectedProject, media: updatedMedia});
                              }}
                              placeholder="Legenda explicativa da mídia"
                              className="w-full bg-white border border-black/10 rounded px-3 py-2 text-xs text-black"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] font-bold tracking-wider uppercase text-brand-charcoal/60">Caminho da Mídia (Auto-WebP)</label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                required
                                value={med.url}
                                onChange={(e) => {
                                  const updatedMedia = [...selectedProject.media];
                                  updatedMedia[mIdx].url = e.target.value;
                                  setSelectedProject({...selectedProject, media: updatedMedia});
                                }}
                                className="flex-1 bg-white border border-black/10 rounded px-3 py-2 text-xs text-black focus:outline-none focus:border-brand-blue"
                                placeholder="URL pública da mídia"
                              />
                              <label className="inline-flex items-center gap-1.5 bg-black text-brand-cream px-3 py-2 rounded text-xs font-semibold tracking-wider hover:bg-brand-blue hover:text-white transition-colors cursor-pointer shrink-0">
                                {imageUploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
                                Upload
                                <input
                                  type="file"
                                  accept={med.type === 'image' ? 'image/*' : 'video/*'}
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, mIdx)}
                                  disabled={imageUploading}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t border-black/10 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="bg-black/5 hover:bg-black/10 text-brand-charcoal px-6 py-3 rounded text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={projectSubmitting || imageUploading}
                    className="bg-brand-blue text-white px-8 py-3 rounded text-xs font-semibold tracking-[0.15em] hover:bg-brand-blue/95 transition-all shadow-md shadow-brand-blue/10 uppercase inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {projectSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab: DATABASE SEEDING */}
          {activeTab === 'seed' && (
            <div className="bg-white border border-black/10 p-6 md:p-10 rounded-lg max-w-2xl mx-auto shadow-sm">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4 mb-6">
                <Sparkles className="text-brand-blue" size={24} />
                <h2 className="font-serif text-2xl text-black uppercase tracking-wider">
                  Sincronizar Banco de Dados
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-brand-blue/5 border-l-4 border-brand-blue p-5 rounded-r">
                  <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                    Esta ferramenta importa os dados estáticos locais (arquivos <code>projectsData.ts</code>, <code>servicesData.ts</code> e <code>aboutData.ts</code>) e os escreve diretamente no banco de dados Cloud Firestore do Firebase.
                  </p>
                  <p className="text-xs text-brand-charcoal/60 mt-2 font-semibold">
                    ⚠️ Atenção: Isso irá sobrescrever quaisquer dados com as mesmas chaves que já existam no Firestore.
                  </p>
                </div>

                <div className="flex justify-center py-4">
                  <button
                    onClick={handleSeedDatabase}
                    disabled={seedingInProgress}
                    className="inline-flex items-center gap-2 bg-black text-brand-cream hover:bg-brand-blue hover:text-white px-8 py-4 rounded text-xs font-semibold tracking-[0.15em] transition-all disabled:opacity-50 uppercase cursor-pointer"
                  >
                    {seedingInProgress ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Importando Dados...
                      </>
                    ) : (
                      <>
                        <Database size={16} />
                        Inicializar Banco (Seeding)
                      </>
                    )}
                  </button>
                </div>

                {seedingLog.length > 0 && (
                  <div className="bg-black/5 p-4 rounded border border-black/5 font-mono text-xs space-y-1.5 max-h-60 overflow-y-auto">
                    <p className="text-[10px] font-bold text-brand-charcoal/50 uppercase border-b border-black/5 pb-1 mb-2">Logs do Seeding</p>
                    {seedingLog.map((log, index) => (
                      <div key={index} className="flex gap-2">
                        <ChevronRight className="text-brand-blue/50 shrink-0 mt-0.5" size={12} />
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-black/10 p-6 md:p-10 rounded-lg max-w-2xl mx-auto shadow-sm">
              <div className="flex items-center gap-3 border-b border-black/10 pb-4 mb-6">
                <Settings className="text-brand-blue" size={24} />
                <h2 className="font-serif text-2xl text-black uppercase tracking-wider">
                  Configurações Gerais do Site
                </h2>
              </div>
              
              <div className="p-8 text-center text-xs text-brand-charcoal/50 border border-dashed border-black/10 rounded">
                As configurações adicionais de textos e do perfil da Ingrid serão carregadas diretamente do documento <code>mainSettings</code> do Firestore após rodar o Seeding. A edição direta deste documento via formulário será disponibilizada na próxima versão da ferramenta.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
