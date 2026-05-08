import React, { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { Project, MediaItem, LayoutType, MediaType, FeedItem } from '../../types';
import { addProject, updateProject, deleteProject } from '../../services/dataService';
import { 
  Lock, Globe, LockKeyhole, Share2,
  Plus, Trash2, Edit2, MoveUp, MoveDown, 
  Video, FileText, Link as LinkIcon, Save, X, 
  LayoutGrid, ChevronRight, ChevronDown, 
  Layers, Settings2, Palette, Search, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaLibrary } from './MediaLibrary';

import { FlowConstructor } from './FlowConstructor';

export const ProjectManager = () => {
  const { data: projects, loading } = useCollection<Project>('projects');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showFlowConstructor, setShowFlowConstructor] = useState(false);

  // Garantir que ao editar, campos novos existam
  const startEditing = (p: Project) => {
    setEditingProject({
      ...p,
      layoutType: p.layoutType || 'vertical',
      status: p.status || 'published',
      feed: p.feed || [],
      mediaItems: p.mediaItems || []
    });
  };

  const handleSave = async () => {
    if (!editingProject?.title || !editingProject?.layoutType) return;

    try {
      const occupiedSlots = new Map(projects.map(p => [p.order || 0, p.id]));
      const requestedOrder = editingProject.order || 1;

      if (editingProject.id) {
        // Se mudou para um slot que já tem dono, avisar ou trocar?
        // Vamos permitir salvar, mas o ideal seria o sistema de "swap" da lista
        await updateProject(editingProject.id, editingProject);
      } else {
        // Encontra o primeiro slot vago se não especificado
        let finalOrder = editingProject.order;
        if (!finalOrder) {
          finalOrder = 1;
          while (occupiedSlots.has(finalOrder)) {
            finalOrder++;
          }
        }

        await addProject({
          ...editingProject as Omit<Project, 'id'>,
          order: finalOrder,
          feed: editingProject.feed || [],
          mediaItems: editingProject.mediaItems || []
        });
      }
      setEditingProject(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      alert("Erro ao salvar projeto. Verifique o console.");
    }
  };

  if (loading && projects.length === 0) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4 min-h-[400px]">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">Sincronizando Projetos...</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[8px] border border-white/5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Portfólio de Projetos</h2>
          <p className="text-zinc-500 text-sm">Gerencie o conteúdo visível na galeria e os detalhes de cada projeto.</p>
        </div>
        <button 
          onClick={() => setShowFlowConstructor(true)}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-[8px] hover:bg-accent/80 transition shadow-lg shadow-accent/10"
        >
          <Plus size={20} /> Novo Projeto
        </button>
      </div>

      {showFlowConstructor && (
        <FlowConstructor 
          initialData={editingProject ? { 
            nodes: editingProject.flowData?.nodes || [], 
            edges: editingProject.flowData?.edges || [],
            projectName: editingProject.title 
          } : undefined}
          onCancel={() => setShowFlowConstructor(false)} 
          onSave={async (flowResult) => {
            // Conversão inteligente: Nós do Flow -> Tópicos do Feed
            const newFeed: FeedItem[] = flowResult.nodes.map((node: any) => ({
              id: node.id,
              title: node.data.label || 'Sem Título',
              media: {
                type: node.data.type || 'image',
                url: node.data.thumbnail || '',
                order: 1
              },
              aspectRatio: node.data.type === 'video' ? 0.56 : 1,
              stories: []
            }));

            const projectData = {
              ...editingProject,
              flowData: { nodes: flowResult.nodes, edges: flowResult.edges },
              feed: editingProject?.feed && editingProject.feed.length > 0 ? editingProject.feed : newFeed,
              title: flowResult.projectName || editingProject?.title || 'Novo Projeto via Flow',
              layoutType: editingProject?.layoutType || '2d',
              status: editingProject?.status || 'draft'
            };

            if (editingProject?.id) {
              try {
                await updateProject(editingProject.id, projectData);
                alert("Estrutura e projeto salvos com sucesso!");
                setEditingProject(null);
                setShowFlowConstructor(false);
              } catch (err) {
                console.error("Erro ao salvar flow:", err);
                alert("Erro ao salvar no banco de dados. Verifique o console.");
              }
            } else {
              // Se for um projeto totalmente novo (sem ID ainda), apenas preparamos os dados e abrimos o form final
              setEditingProject(projectData);
              setShowFlowConstructor(false);
              setIsAdding(true);
            }
          }} 
        />
      )}

      <AnimatePresence>
        {(isAdding || editingProject) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md p-4 md:p-10 flex items-center justify-center overflow-y-auto"
          >
            <div className="w-full max-w-6xl">
              <ProjectForm 
                project={editingProject!} 
                onSave={handleSave} 
                onCancel={() => { setEditingProject(null); setIsAdding(false); }} 
                onChange={setEditingProject}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {(() => {
          // Lógica para mostrar slots (ocupados e vazios)
          const maxSlot = Math.max(10, projects.reduce((max, p) => Math.max(max, p.order || 0), 0));
          const slotMap = new Map(projects.map(p => [p.order || 0, p]));
          const rows = [];

          for (let i = 1; i <= maxSlot; i++) {
            const p = slotMap.get(i);
            if (p) {
              const idxInProjects = projects.findIndex(proj => proj.id === p.id);
              rows.push(
                <div key={p.id} className="bg-zinc-900/40 p-4 rounded-[8px] flex items-center justify-between group border border-white/5 hover:border-accent/20 transition-all">
                  <div className="flex items-center gap-6">
                    {/* Indicador de Slot */}
                    <div className="flex flex-col items-center gap-1 min-w-[40px]">
                      <button 
                        onClick={() => {
                          const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
                          const currentIdx = sortedProjects.findIndex(proj => proj.id === p.id);
                          if (currentIdx > 0) {
                            const prev = sortedProjects[currentIdx-1];
                            const tempOrder = p.order;
                            updateProject(p.id, { order: prev.order });
                            updateProject(prev.id, { order: tempOrder });
                          }
                        }}
                        className="text-zinc-600 hover:text-accent disabled:opacity-0 transition-colors"
                      >
                        <MoveUp size={16} />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-accent text-zinc-950 text-[10px] font-black flex items-center justify-center">
                        {i}
                      </div>
                      <button 
                        onClick={() => {
                          const sortedProjects = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
                          const currentIdx = sortedProjects.findIndex(proj => proj.id === p.id);
                          if (currentIdx < sortedProjects.length - 1) {
                            const next = sortedProjects[currentIdx+1];
                            const tempOrder = p.order;
                            updateProject(p.id, { order: next.order });
                            updateProject(next.id, { order: tempOrder });
                          }
                        }}
                        className="text-zinc-600 hover:text-accent disabled:opacity-0 transition-colors"
                      >
                        <MoveDown size={16} />
                      </button>
                    </div>

                    <div className="w-16 h-20 bg-zinc-800 rounded-[8px] overflow-hidden border border-white/10 shrink-0 shadow-xl group-hover:scale-105 transition-transform">
                      {p.galleryThumbnail ? (
                        <img src={p.galleryThumbnail} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <LayoutGrid size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">Slot {i}</span>
                        <h3 className="font-bold text-lg leading-tight">{p.title}</h3>
                        {p.status === 'draft' && (
                          <span className="flex items-center gap-1 text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter border border-amber-500/20">
                            <LockKeyhole size={10} /> Em Construção
                          </span>
                        )}
                        {p.isLocked && (
                          <span className="flex items-center gap-1 text-[8px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter border border-red-500/20">
                            <Lock size={10} /> Trancado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] uppercase font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full">{p.layoutType}</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                          {p.feed?.length || 0} Tópicos • {p.feed?.reduce((acc, curr) => acc + (curr.stories?.length || 0), 0) || 0} Stories
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => { setEditingProject(p); setShowFlowConstructor(true); }}
                      className="p-3 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-[8px] transition-all"
                      title="Abrir Construtor de Flow"
                    >
                      <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => startEditing(p)} 
                      className="p-3 bg-white/5 hover:bg-zinc-700 rounded-[8px] transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-zinc-300"
                    >
                      <Edit2 size={16} /> <span className="hidden md:inline">Editar</span>
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm(`Excluir permanentemente o projeto "${p.title}"?`)) deleteProject(p.id);
                      }} 
                      className="p-3 bg-red-600/5 hover:bg-red-600 hover:text-white rounded-[8px] transition-all text-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            } else {
              rows.push(
                <div key={`empty-${i}`} className="bg-zinc-900/10 p-4 rounded-[8px] flex items-center justify-between border border-dashed border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-6">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 text-[10px] font-black">
                      {i}
                    </div>
                    <div className="w-16 h-20 bg-zinc-800/30 rounded-[8px] border border-dashed border-white/5 shrink-0 flex items-center justify-center text-zinc-700">
                      <Plus size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-zinc-700 tracking-tighter">Slot {i}</span>
                      <h3 className="font-bold text-lg text-zinc-700">Slot Vazio</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingProject({ order: i, title: '', layoutType: '2d', status: 'draft' });
                      setIsAdding(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white rounded-[8px] text-[10px] font-black uppercase tracking-widest transition"
                  >
                    Ocupar Slot
                  </button>
                </div>
              );
            }
          }
          return rows;
        })()}
      </div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onCancel, onChange }: { 
  project: Partial<Project>, 
  onSave: () => void, 
  onCancel: () => void,
  onChange: (p: Partial<Project>) => void
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'design' | 'content'>('info');
  const [pickerConfig, setPickerConfig] = useState<{ isOpen: boolean, onSelect: (url: string) => void } | null>(null);

  const openPicker = (setter: (url: string) => void) => {
    setPickerConfig({ isOpen: true, onSelect: setter });
  };

  const addFeedItem = () => {
    const newItem: FeedItem = {
      id: `topic-${Date.now()}`,
      title: 'Novo Tópico',
      aspectRatio: 1,
      media: { type: 'image', url: '', order: 1 },
      stories: []
    };
    onChange({ ...project, feed: [...(project.feed || []), newItem] });
  };

  const removeFeedItem = (id: string) => {
    onChange({ ...project, feed: project.feed?.filter(f => f.id !== id) });
  };

  const updateFeedItem = (id: string, updates: Partial<FeedItem>) => {
    onChange({
      ...project,
      feed: project.feed?.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-[12px] shadow-2xl flex flex-col max-h-[90vh]">
      {/* Header do Modal */}
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 p-2 rounded-full text-accent">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{project.id ? 'Editar Projeto' : 'Configurar Novo Projeto'}</h2>
            <p className="text-zinc-500 text-xs uppercase font-bold tracking-widest">{project.title || 'Sem Título'}</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-full transition">
          <X size={24} />
        </button>
      </div>

      {/* Navegação de Abas do Form */}
      <div className="flex border-b border-white/5 px-6">
        <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} icon={<FileText size={16}/>} label="Informações" />
        <TabButton active={activeTab === 'design'} onClick={() => setActiveTab('design')} icon={<Palette size={16}/>} label="Visual & Design" />
        <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<Layers size={16}/>} label="Conteúdo (Feed)" />
        <button 
          onClick={() => {
            // Salva antes de sair para o Flow para não perder dados do form
            // Mas aqui apenas abrimos o flow constructor configurado acima
            const manager = (window as any).projectManagerContext; // Fake or just use the parent state
            // No caso já temos o sehowFlowConstructor via parent, basta fechar o form
            onSave(); // Salva estado atual
            // A lógica de abrir o flow já está no botão da lista
          }}
          className="flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest text-blue-500 hover:text-blue-400"
        >
          <Share2 size={16}/> Abrir Construtor de Flow
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <FormField label="Título do Projeto" description="Como ele aparece na galeria e cabeçalho">
                <input 
                  className="admin-input"
                  value={project.title}
                  onChange={e => onChange({ ...project, title: e.target.value })}
                  placeholder="Ex: Auddar - Estratégia"
                />
              </FormField>

              <FormField label="Tipo de Layout" description="Formato da grade e navegação">
                <select 
                  className="admin-input"
                  value={project.layoutType}
                  onChange={e => onChange({ ...project, layoutType: e.target.value as LayoutType })}
                >
                  <option value="2d">2D (Temas Novos - Feed + Stories)</option>
                  <option value="vertical">Vertical (Estilo Reel Antigo)</option>
                  <option value="horizontal">Horizontal (Carrossel Simples)</option>
                </select>
              </FormField>

              <FormField label="Slot na Galeria (Ordem)" description="Defina a posição do projeto na tela principal">
                <input 
                  type="number"
                  className="admin-input"
                  value={project.order || ''}
                  onChange={e => onChange({ ...project, order: parseInt(e.target.value) || 0 })}
                  placeholder="Ex: 6"
                />
              </FormField>

              <FormField label="Status do Projeto" description="Selecione se o projeto já está visível para o público">
                <div className="flex gap-2">
                   <button 
                    type="button"
                    onClick={() => onChange({ ...project, status: 'published' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[8px] font-bold text-[10px] uppercase transition ${project.status !== 'draft' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                   >
                     <Globe size={14} /> Público
                   </button>
                   <button 
                    type="button"
                    onClick={() => onChange({ ...project, status: 'draft' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[8px] font-bold text-[10px] uppercase transition ${project.status === 'draft' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                   >
                     <Lock size={14} /> Em Construção
                   </button>
                </div>
              </FormField>

              <FormField label="Acesso Restrito (Senha)" description="Proteja este projeto com uma senha individual">
                <div className="space-y-4 pt-2">
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => onChange({ ...project, isLocked: false })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[8px] font-bold text-[10px] uppercase transition ${!project.isLocked ? 'bg-zinc-700 text-white shadow-lg' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                      Aberto
                    </button>
                    <button 
                      type="button"
                      onClick={() => onChange({ ...project, isLocked: true })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[8px] font-bold text-[10px] uppercase transition ${project.isLocked ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                      Trancado
                    </button>
                  </div>
                  {project.isLocked && (
                    <input 
                      className="admin-input"
                      value={project.password || ''}
                      onChange={e => onChange({ ...project, password: e.target.value })}
                      placeholder="Defina a senha do projeto..."
                    />
                  )}
                </div>
              </FormField>

              <FormField label="Descrição Curta (Quick View)" description="Resumo que aparece ao abrir o projeto">
                <textarea 
                  className="admin-input h-32 resize-none"
                  value={project.description || ''}
                  onChange={e => onChange({ ...project, description: e.target.value })}
                  placeholder="Ex: Estratégia de posicionamento e tom de voz..."
                />
              </FormField>
            </div>

            <div className="space-y-6">
              <FormField label="Thumbnail da Galeria (Link)" description="A imagem quadrada da tela principal">
                <div className="flex gap-2">
                  <input 
                    className="admin-input flex-1"
                    value={project.galleryThumbnail || ''}
                    onChange={e => onChange({ ...project, galleryThumbnail: e.target.value })}
                    placeholder="https://..."
                  />
                  <button 
                    type="button"
                    onClick={() => openPicker((url) => onChange({ ...project, galleryThumbnail: url }))}
                    className="bg-accent/10 border border-accent/20 text-accent p-3 rounded-[8px] hover:bg-accent/20 transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {project.galleryThumbnail && (
                  <div className="mt-2 w-32 h-40 rounded-[8px] overflow-hidden border border-white/10 bg-black">
                     <img src={project.galleryThumbnail} className="w-full h-full object-cover" alt="Preview"/>
                  </div>
                )}
              </FormField>

              <FormField label="Trilha Sonora (Link MP3)" description="Música de fundo ao abrir o projeto">
                <div className="flex gap-2">
                  <input 
                    className="admin-input flex-1"
                    value={project.audioUrl || ''}
                    onChange={e => onChange({ ...project, audioUrl: e.target.value })}
                    placeholder="https://.../audio.mp3"
                  />
                  <button 
                    type="button"
                    onClick={() => openPicker((url) => onChange({ ...project, audioUrl: url }))}
                    className="bg-accent/10 border border-accent/20 text-accent p-3 rounded-[8px] hover:bg-accent/20 transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </FormField>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
               <h4 className="text-lg font-bold text-accent flex items-center gap-2"><Palette size={20}/> Cores e Estilos</h4>
               
               <FormField label="Cor de Destaque (Accent)" description="Botões, ícones e detalhes">
                 <div className="flex gap-4 items-center">
                    <input 
                      type="color"
                      className="w-12 h-12 rounded-full border-none cursor-pointer bg-transparent"
                      value={project.theme?.accentColor || '#0066FF'}
                      onChange={e => onChange({ ...project, theme: { ...project.theme, accentColor: e.target.value } })}
                    />
                    <input 
                      className="admin-input flex-1 font-mono uppercase"
                      value={project.theme?.accentColor || '#0066FF'}
                      onChange={e => onChange({ ...project, theme: { ...project.theme, accentColor: e.target.value } })}
                    />
                 </div>
               </FormField>

               <FormField label="Cor do Fundo (Modal)" description="Sugestão: bg-black ou bg-zinc-950">
                 <input 
                  className="admin-input font-mono"
                  value={project.theme?.playerBg || 'bg-black'}
                  onChange={e => onChange({ ...project, theme: { ...project.theme, playerBg: e.target.value } })}
                />
               </FormField>
            </div>

            <div className="bg-zinc-900/20 p-8 rounded-[8px] border border-white/5 flex flex-col items-center justify-center text-center">
               <div className="w-10 h-10 rounded-full mb-4" style={{ backgroundColor: project.theme?.accentColor || '#0066FF' }} />
               <h5 className="font-bold mb-2">Amostra Visual</h5>
               <p className="text-xs text-zinc-500">Estas configurações definem a atmosfera visual do projeto ao ser visualizado pelo usuário.</p>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold">Estrutura de Tópicos e Stories</h4>
              <button 
                onClick={addFeedItem}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-[8px] text-xs hover:bg-zinc-200"
              >
                <Plus size={16}/> Adicionar Tópico
              </button>
            </div>

            <div className="space-y-4">
              {project.feed?.length === 0 ? (
                <div className="p-10 text-center bg-zinc-900/20 rounded-[8px] border border-dashed border-white/10">
                  <p className="text-zinc-600 text-sm">Nenhum tópico adicionado. Clique no botão acima para começar.</p>
                </div>
              ) : (
                project.feed?.map((item, idx) => (
                  <FeedItemEditor 
                    key={item.id} 
                    item={item} 
                    index={idx}
                    onUpdate={(up) => updateFeedItem(item.id, up)}
                    onRemove={() => removeFeedItem(item.id)}
                    onOpenPicker={openPicker}
                    totalItems={project.feed?.length || 0}
                    onMove={(dir) => {
                       const newFeed = [...(project.feed || [])];
                       const target = dir === 'up' ? idx - 1 : idx + 1;
                       if (target >= 0 && target < newFeed.length) {
                         [newFeed[idx], newFeed[target]] = [newFeed[target], newFeed[idx]];
                         onChange({ ...project, feed: newFeed });
                       }
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* Media Picker Modal */}
      {pickerConfig?.isOpen && (
        <MediaLibrary 
          standalone={false} 
          onClose={() => setPickerConfig(null)}
          onSelect={(url) => {
            pickerConfig.onSelect(url);
            setPickerConfig(null);
          }}
        />
      )}

      {/* Footer do Modal */}
      <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-zinc-900/20">
        <button onClick={onCancel} className="px-6 py-3 font-bold text-zinc-500 hover:text-white transition">Cancelar</button>
        <button 
          onClick={onSave}
          className="px-10 py-3 bg-accent text-black font-bold rounded-[8px] flex items-center gap-2 hover:bg-accent/80 transition shadow-xl shadow-accent/20"
        >
          <Save size={20} /> Salvar Tudo
        </button>
      </div>
    </div>
  );
};

const FeedItemEditor = ({ item, onUpdate, onRemove, index, totalItems, onMove, onOpenPicker }: { 
  item: FeedItem, 
  onUpdate: (up: Partial<FeedItem>) => void, 
  onRemove: () => void,
  index: number,
  totalItems: number,
  onMove: (dir: 'up' | 'down') => void,
  onOpenPicker: (setter: (url: string) => void) => void,
  key?: any
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const addStory = () => {
    const newStory: MediaItem = {
      type: 'image',
      url: '',
      order: (item.stories?.length || 0) + 1
    };
    onUpdate({ stories: [...(item.stories || []), newStory] });
  };

  const updateStory = (sIdx: number, updates: Partial<MediaItem>) => {
    const newStories = [...(item.stories || [])];
    newStories[sIdx] = { ...newStories[sIdx], ...updates };
    onUpdate({ stories: newStories });
  };

  const removeStory = (sIdx: number) => {
    onUpdate({ stories: item.stories?.filter((_, i) => i !== sIdx) });
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-[8px] overflow-hidden">
      <div className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4 flex-1">
          <div className="flex flex-col gap-1">
             <button onClick={(e) => { e.stopPropagation(); onMove('up'); }} disabled={index === 0} className="text-zinc-600 hover:text-white disabled:opacity-0"><MoveUp size={14}/></button>
             <button onClick={(e) => { e.stopPropagation(); onMove('down'); }} disabled={index === totalItems - 1} className="text-zinc-600 hover:text-white disabled:opacity-0"><MoveDown size={14}/></button>
          </div>
          <div className="bg-white/5 w-10 h-10 rounded-full flex items-center justify-center font-bold text-accent">
            {index + 1}
          </div>
          <div className="flex-1">
             <input 
               className="bg-transparent border-none p-0 text-lg font-bold focus:ring-0 w-full placeholder:opacity-20"
               value={item.title}
               onClick={(e) => e.stopPropagation()}
               onChange={(e) => onUpdate({ title: e.target.value })}
               placeholder="Título do Tópico..."
             />
             <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{item.stories?.length || 0} Stories adicionais</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-2 text-zinc-600 hover:text-red-500 transition"><Trash2 size={16}/></button>
          {isOpen ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 p-6 space-y-6"
          >
            {/* Mídia Principal do Tópico */}
            <div className="bg-white/[0.02] p-4 rounded-[8px] border border-white/5">
               <h5 className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-4">Capa do Tópico (Primeira Página)</h5>
               <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <select 
                      className="admin-input-small text-xs"
                      value={item.media.type}
                      onChange={(e) => onUpdate({ media: { ...item.media, type: e.target.value as MediaType } })}
                    >
                      <option value="image">Imagem</option>
                      <option value="video">Vídeo</option>
                      <option value="text">Texto</option>
                    </select>
                  </div>
                  <div className="col-span-3 flex gap-2">
                     <input 
                      className="admin-input-small text-xs flex-1"
                      value={item.media.type === 'text' ? item.media.content : item.media.url}
                      onChange={(e) => onUpdate({ media: { ...item.media, [item.media.type === 'text' ? 'content' : 'url']: e.target.value } })}
                      placeholder={item.media.type === 'text' ? "Texto do conteúdo..." : "URL da mídia..."}
                    />
                    {item.media.type !== 'text' && (
                      <button 
                        type="button"
                        onClick={() => onOpenPicker((url) => onUpdate({ media: { ...item.media, url } }))}
                        className="bg-accent/10 border border-accent/20 text-accent px-2 rounded-[4px] hover:bg-accent/20 transition"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
               </div>
            </div>

            {/* Lista de Stories */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Páginas Adicionais (Stories)</h5>
                <button onClick={addStory} className="text-accent hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Plus size={14}/> Add Página
                </button>
              </div>

              {item.stories?.length === 0 ? (
                <div className="p-4 text-center text-zinc-700 text-xs italic">Nenhuma página adicional</div>
              ) : (
                <div className="space-y-3">
                  {item.stories?.map((story, si) => (
                    <div key={si} className="flex gap-2 items-center">
                       <select 
                          className="admin-input-small !py-1 text-[10px] w-24 shrink-0"
                          value={story.type}
                          onChange={(e) => updateStory(si, { type: e.target.value as MediaType })}
                        >
                          <option value="image">Foto</option>
                          <option value="video">Vídeo</option>
                          <option value="text">Texto</option>
                        </select>
                        <input 
                          className="admin-input-small !py-1 text-[10px] flex-1"
                          value={story.type === 'text' ? story.content : story.url}
                          onChange={(e) => updateStory(si, { [story.type === 'text' ? 'content' : 'url']: e.target.value })}
                          placeholder={story.type === 'text' ? "Conteúdo..." : "URL..."}
                        />
                        {story.type !== 'text' && (
                          <button 
                            type="button"
                            onClick={() => onOpenPicker((url) => updateStory(si, { url }))}
                            className="bg-accent/10 border border-accent/20 text-accent px-2 rounded-[4px] hover:bg-accent/20 transition"
                          >
                            <Plus size={12} />
                          </button>
                        )}
                        <button onClick={() => removeStory(si)} className="p-1 text-zinc-600 hover:text-red-500"><X size={14}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helpers de Estilo Locais
const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, key?: any }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition border-b-2 ${active ? 'border-accent text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
  >
    {icon} {label}
  </button>
);

const FormField = ({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) => (
  <div className="space-y-2">
    <div>
      <label className="block text-sm font-bold text-white leading-tight">{label}</label>
      {description && <p className="text-[10px] text-zinc-500 font-medium">{description}</p>}
    </div>
    {children}
  </div>
);

