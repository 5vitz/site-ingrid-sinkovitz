import React, { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { Project, MediaItem, LayoutType, MediaType, FeedItem } from '../../types';
import { addProject, updateProject, deleteProject } from '../../services/dataService';
import { 
  Plus, Trash2, Edit2, MoveUp, MoveDown, 
  Video, FileText, Link as LinkIcon, Save, X, 
  LayoutGrid, ChevronRight, ChevronDown, 
  Layers, Settings2, Palette, Search, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaLibrary } from './MediaLibrary';

export const ProjectManager = () => {
  const { data: projects, loading } = useCollection<Project>('projects');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Garantir que ao editar, campos novos existam
  const startEditing = (p: Project) => {
    setEditingProject({
      ...p,
      layoutType: p.layoutType || 'vertical',
      feed: p.feed || [],
      mediaItems: p.mediaItems || []
    });
  };

  const handleSave = async () => {
    if (!editingProject?.title || !editingProject?.layoutType) return;

    try {
      if (editingProject.id) {
        await updateProject(editingProject.id, editingProject);
      } else {
        await addProject({
          ...editingProject as Omit<Project, 'id'>,
          order: projects.length + 1,
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Carregando Projetos...</span>
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
          onClick={() => {
            setIsAdding(true);
            setEditingProject({ 
              title: '', 
              layoutType: '2d', 
              feed: [], 
              mediaItems: [],
              theme: { accentColor: '#0066FF' } 
            });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-[8px] hover:bg-accent/80 transition shadow-lg shadow-accent/10"
        >
          <Plus size={20} /> Novo Projeto
        </button>
      </div>

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
        {projects.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[8px]">
            <span className="text-zinc-600">Nenhum projeto cadastrado ainda.</span>
          </div>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="bg-zinc-900/40 p-4 rounded-[8px] flex items-center justify-between group border border-white/5 hover:border-accent/20 transition-all">
              <div className="flex items-center gap-6">
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
                  <h3 className="font-bold text-lg leading-tight">{p.title}</h3>
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
                  onClick={() => startEditing(p)} 
                  className="p-3 bg-white/5 hover:bg-accent hover:text-black rounded-[8px] transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
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
          ))
        )}
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

