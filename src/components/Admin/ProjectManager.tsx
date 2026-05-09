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

export const ProjectManager = ({ initialProjectId, onClose, isStartingNew }: { initialProjectId?: string | null, onClose?: () => void, isStartingNew?: boolean }) => {
  const { data: projects, loading } = useCollection<Project>('projects');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(isStartingNew || false);
  const [showFlowConstructor, setShowFlowConstructor] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Efeito para abrir o editor se um ID for passado ou se for um novo projeto
  React.useEffect(() => {
    if (isStartingNew) {
      setEditingProject({ title: '', layoutType: '2d', status: 'draft' });
      setIsAdding(true);
    } else if (initialProjectId && projects.length > 0) {
      const p = projects.find(proj => proj.id === initialProjectId);
      if (p) startEditing(p);
    }
  }, [initialProjectId, projects, isStartingNew]);

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
        console.log("Projeto atualizado com sucesso:", editingProject.id);
        alert(`Projeto "${editingProject.title}" atualizado com sucesso!`);
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
        alert(`Novo projeto "${editingProject.title}" criado com sucesso!`);
      }
      setEditingProject(null);
      setIsAdding(false);
      if (onClose) onClose(); // Notifica fechamento após salvar
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      alert("Erro ao salvar projeto. Verifique o console.");
    }
  };

  const handleDelete = async (p: Project) => {
    setProjectToDelete(p);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    const p = projectToDelete;
    
    console.log("Executando exclusão confirmada:", p.title, p.id);
    try {
      await deleteProject(p.id);
      console.log("Projeto deletado com sucesso:", p.id);
      setProjectToDelete(null);
    } catch (err) {
      console.error("Erro ao deletar projeto:", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Falha ao excluir: ${msg}`);
      setProjectToDelete(null);
    }
  };

  // Função para resolver conflitos de slots automaticamente
  const resolveConflicts = async () => {
    // Ordenar por slot atual, depois por ID para consistência
    const sorted = [...projects].sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id.localeCompare(b.id);
    });

    try {
      // Reatribui ordens sequenciais de 1 a N
      for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i];
        const newOrder = i + 1;
        // Só atualiza se realmente mudou
        if (p.order !== newOrder) {
          await updateProject(p.id, { order: newOrder });
        }
      }
      alert("Slots reordenados e conflitos resolvidos!");
    } catch (err) {
      console.error("Erro ao resolver conflitos:", err);
      alert("Erro ao reordenar slots.");
    }
  };

  const hasConflicts = (() => {
    const seen = new Set<number>();
    for (const p of projects) {
      const o = p.order || 0;
      if (o <= 0) return true; // Órfãos contam como conflito/pendência
      if (seen.has(o)) return true; // Duplicados
      seen.add(o);
    }
    return false;
  })();

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
        <div className="flex items-center gap-3">
          {hasConflicts && (
            <button 
              onClick={resolveConflicts}
              className="flex items-center gap-2 px-4 py-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold rounded-[8px] hover:bg-amber-500 hover:text-black transition text-xs uppercase"
            >
              <Settings2 size={16} /> Resolver Conflitos
            </button>
          )}
          <button 
            onClick={() => setShowFlowConstructor(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-[8px] hover:bg-accent/80 transition shadow-lg shadow-accent/10"
          >
            <Plus size={20} /> Novo Projeto
          </button>
        </div>
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
                onCancel={() => { 
                  setEditingProject(null); 
                  setIsAdding(false); 
                  if (onClose) onClose(); // Volta para a central ao cancelar
                }} 
                onChange={setEditingProject}
                onFlowOpen={async () => {
                  // Salva o rascunho atual sem fechar o estado de edição
                  try {
                    if (editingProject?.id) {
                      await updateProject(editingProject.id, editingProject);
                    }
                    setShowFlowConstructor(true);
                  } catch (err) {
                    console.error("Erro ao salvar antes de abrir flow:", err);
                    alert("Erro ao salvar rascunho. Tente novamente.");
                  }
                }}
              />
            </div>
          </motion.div>
        )}

        {projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-zinc-950 border border-white/10 p-8 rounded-[12px] max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Excluir Projeto?</h3>
              <p className="text-zinc-400 text-center text-sm mb-8">
                Deseja realmente excluir <span className="text-white font-bold">"{projectToDelete.title}"</span>? 
                Esta ação é permanente e removerá todos os dados do banco de dados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 rounded-[8px] font-bold text-xs uppercase tracking-widest transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-[8px] font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-red-600/20"
                >
                  Excluir Agora
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {(() => {
          // 1. Preparar lista única e ordenada para renderização
          const displayList: { type: 'project' | 'empty'; project?: Project; slot?: number; isDuplicate?: boolean }[] = [];
          const slotGroups = new Map<number, Project[]>();
          projects.forEach(p => {
            const o = p.order || 0;
            const current = slotGroups.get(o) || [];
            slotGroups.set(o, [...current, p]);
          });

          const maxSlot = Math.max(10, projects.reduce((max, p) => Math.max(max, p.order || 0), 0));

          for (let i = 1; i <= maxSlot; i++) {
            const projectsInSlot = slotGroups.get(i) || [];
            if (projectsInSlot.length > 0) {
              projectsInSlot.forEach(p => {
                displayList.push({ type: 'project', project: p, slot: i, isDuplicate: projectsInSlot.length > 1 });
              });
            } else {
              displayList.push({ type: 'empty', slot: i });
            }
          }

          // 2. Renderizar baseado na displayList
          let visualCounter = 0;
          return displayList.map((item) => {
            if (item.type === 'project' && item.project) {
              const p = item.project;
              visualCounter++;
              return (
                <ProjectRow 
                  key={p.id} 
                  project={p} 
                  projects={projects} 
                  visualNumber={visualCounter}
                  slotNumber={item.slot} 
                  isDuplicate={item.isDuplicate} 
                  onEdit={startEditing} 
                  onDelete={() => handleDelete(p)}
                  onFlowEdit={() => { setEditingProject(p); setShowFlowConstructor(true); }}
                />
              );
            } else if (item.type === 'empty') {
              return (
                <div key={`empty-${item.slot}`} className="bg-zinc-900/10 p-4 rounded-[8px] flex items-center justify-between border border-dashed border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-6 text-zinc-500">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black">
                      -
                    </div>
                    <div className="w-16 h-20 bg-zinc-800/30 rounded-[8px] border border-dashed border-white/5 shrink-0 flex items-center justify-center">
                      <Plus size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-tighter">Slot {item.slot}</span>
                      <h3 className="font-bold text-lg">Disponível</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingProject({ order: item.slot, title: '', layoutType: '2d', status: 'draft' });
                      setIsAdding(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white rounded-[8px] text-[10px] font-black uppercase tracking-widest transition"
                  >
                    Ocupar Slot
                  </button>
                </div>
              );
            }
            return null;
          });
        })()}
      </div>
    </div>
  );
};

// Sub-componente para a linha do projeto para deixar o código limpo
const ProjectRow = ({ 
  project: p, 
  projects, 
  visualNumber,
  slotNumber, 
  isOrphan, 
  isDuplicate, 
  onEdit, 
  onDelete,
  onFlowEdit 
}: { 
  project: Project, 
  projects: Project[], 
  visualNumber: number,
  slotNumber?: number, 
  isOrphan?: boolean, 
  isDuplicate?: boolean,
  onEdit: (p: Project) => void,
  onDelete: () => void,
  onFlowEdit: () => void
}) => {
  return (
    <div className={`bg-zinc-900/40 p-4 rounded-[8px] flex items-center justify-between group border transition-all ${isDuplicate ? 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-white/5 hover:border-accent/20'}`}>
      <div className="flex items-center gap-6">
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
          <div className={`w-10 h-10 rounded-full ${isOrphan ? 'bg-zinc-700' : 'bg-accent'} text-zinc-950 text-[11px] font-black flex items-center justify-center shadow-lg`}>
            {visualNumber}
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
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-tighter">
              {isOrphan ? 'Sem Slot' : `Slot ${slotNumber}`}
            </span>
            <span className="text-[10px] font-mono text-zinc-700">ID: ...{p.id?.slice(-4)}</span>
            <h3 className="font-bold text-lg leading-tight">{p.title}</h3>
            {isDuplicate && (
              <span className="text-[8px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter animate-pulse">
                Conflito de Slot
              </span>
            )}
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
          onClick={onFlowEdit}
          className="p-3 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-[8px] transition-all"
          title="Abrir Construtor de Flow"
        >
          <Share2 size={16} />
        </button>
        <button 
          onClick={() => onEdit(p)} 
          className="p-3 bg-white/5 hover:bg-zinc-700 rounded-[8px] transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-zinc-300"
        >
          <Edit2 size={16} /> <span className="hidden md:inline">Editar</span>
        </button>
        <button 
          onClick={onDelete} 
          className="p-3 bg-red-600/5 hover:bg-red-600 hover:text-white rounded-[8px] transition-all text-red-500 hover:text-white"
          title="Excluir Projeto"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const PALETTE = [
  '#FEF200', // Nosso Amarelo
  '#FFFFFF', // Branco
  '#FF3B30', // Vermelho
  '#FF9500', // Laranja
  '#4CD964', // Verde
  '#00D2FF', // Ciano
  '#007AFF', // Azul
  '#5856D6', // Indigo
  '#AF52DE', // Roxo
  '#FF2D55', // Rosa
  '#8E8E93', // Cinza
  '#000000', // Preto
];

const ColorSelector = ({ value, onChange }: { value: string, onChange: (color: string) => void }) => {
  const isCustom = !PALETTE.includes(value.toUpperCase());
  
  return (
    <div className="space-y-3 pt-1">
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${value.toUpperCase() === color ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent shadow-md'}`}
            style={{ backgroundColor: color }}
          />
        ))}
        {/* Slot para mostrar a cor customizada se não estiver na paleta */}
        {isCustom && (
           <div 
            className="w-6 h-6 rounded-full border-2 border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
            style={{ backgroundColor: value }}
           />
        )}
      </div>
      <div className="flex items-center gap-2">
        <input 
          type="color"
          className="w-8 h-8 rounded bg-transparent border-none cursor-pointer shrink-0"
          value={value.startsWith('#') ? value : '#000000'}
          onChange={e => onChange(e.target.value)}
        />
        <input 
          className="admin-input-small flex-1 font-mono uppercase text-[10px]"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="#HEX..."
        />
      </div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onCancel, onChange, onFlowOpen }: { 
  project: Partial<Project>, 
  onSave: () => void, 
  onCancel: () => void,
  onChange: (p: Partial<Project>) => void,
  onFlowOpen?: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'design'>('info');
  const [pickerConfig, setPickerConfig] = useState<{ isOpen: boolean, onSelect: (url: string) => void } | null>(null);

  const openPicker = (setter: (url: string) => void) => {
    setPickerConfig({ isOpen: true, onSelect: setter });
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
        {project.id && (
          <button 
            onClick={onFlowOpen}
            className="flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest text-[#FEF200] hover:text-white transition-colors"
          >
            <Share2 size={16}/> Abrir Construtor de Flow
          </button>
        )}
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
            <div className="space-y-8">
               <h4 className="text-lg font-bold text-accent flex items-center gap-2 border-b border-white/5 pb-2"><Palette size={20}/> Player & Estilos</h4>
               
               <div className="space-y-6">
                 {/* 1 - Espessura da borda */}
                 <FormField label="Espessura da Borda" description="Ex: 1px, 2px, 0px">
                   <input 
                    className="admin-input"
                    placeholder="1px"
                    value={project.theme?.borderWidth || ''}
                    onChange={e => onChange({ ...project, theme: { ...project.theme, borderWidth: e.target.value } })}
                   />
                 </FormField>

                 {/* 2 - Cor da borda */}
                 <FormField label="Cor da Borda" description="Tom da moldura do player">
                   <ColorSelector 
                     value={project.theme?.playerBorderColor || '#ffffff20'}
                     onChange={color => onChange({ ...project, theme: { ...project.theme, playerBorderColor: color } })}
                   />
                 </FormField>

                 {/* 3 - Cor de Destaque */}
                 <FormField label="Cor de Destaque (Accent)" description="Selecione na paleta ou defina um tom customizado">
                   <ColorSelector 
                     value={project.theme?.accentColor || '#FEF200'}
                     onChange={color => onChange({ ...project, theme: { ...project.theme, accentColor: color } })}
                   />
                 </FormField>

                 {/* 4 - Arredondamento (Radius) */}
                 <FormField label="Arredondamento (Radius)" description="Ex: 16px, 0px">
                   <input 
                    className="admin-input"
                    placeholder="16px"
                    value={project.theme?.borderRadius || ''}
                    onChange={e => onChange({ ...project, theme: { ...project.theme, borderRadius: e.target.value } })}
                   />
                 </FormField>

                 {/* 5 - Intensidade da Sombra */}
                 <FormField label="Intensidade da Sombra" description="Arraste para ajustar o brilho e profundidade">
                   <div className="flex items-center gap-4 pt-2">
                     <input 
                       type="range"
                       min="0"
                       max="100"
                       className="flex-1 accent-accent h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                       value={parseInt(project.theme?.boxShadow?.match(/(\d+)px/)?.[1] || '0')}
                       onChange={e => {
                         const val = e.target.value;
                         const color = project.theme?.accentColor || '#FEF200';
                         onChange({ ...project, theme: { ...project.theme, boxShadow: `0 0 ${val}px ${color}66` } });
                       }}
                     />
                     <span className="text-[10px] font-mono text-accent w-10 text-right">{project.theme?.boxShadow?.match(/(\d+)px/)?.[1] || '0'}px</span>
                   </div>
                 </FormField>

                 {/* 6 - Cor do fundo */}
                 <FormField label="Cor do Fundo (Borda/Modal)" description="Ex: #000000 ou bg-zinc-950">
                   <input 
                    className="admin-input font-mono"
                    value={project.theme?.playerBg || 'bg-black'}
                    onChange={e => onChange({ ...project, theme: { ...project.theme, playerBg: e.target.value } })}
                   />
                 </FormField>
               </div>
            </div>

            <div className="space-y-6">
              <div className="bg-black/60 p-12 rounded-[12px] border border-white/5 flex flex-col items-center justify-center text-center sticky top-0">
                 <div 
                   className="mb-6 transition-all duration-500" 
                   style={{ 
                     width: '180px', 
                     aspectRatio: '0.8',
                     maxHeight: '260px',
                     backgroundColor: project.theme?.playerBg?.startsWith('#') ? project.theme.playerBg : '#111',
                     border: `${project.theme?.borderWidth || '1px'} solid ${project.theme?.playerBorderColor || 'rgba(255,255,255,0.1)'}`,
                     borderRadius: project.theme?.borderRadius || '16px',
                     boxShadow: project.theme?.boxShadow || `0 0 30px ${(project.theme?.accentColor || '#FEF200')}44`
                   }}
                 >
                   <div className="w-full h-full flex items-center justify-center p-4">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: project.theme?.accentColor || '#FEF200' }} />
                   </div>
                 </div>
                 <h5 className="font-bold mb-2 uppercase tracking-widest text-xs">Preview do Player</h5>
                 <p className="text-[10px] text-zinc-500 leading-relaxed max-w-[240px]">
                   Ajuste as propriedades ao lado para ver como o player se comportará no site. 
                   A altura máxima é limitada a 540px e a largura será proporcional ao aspect ratio de cada card.
                 </p>
              </div>
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
          <Save size={20} /> Salvar Configurações
        </button>
      </div>
    </div>
  );
};

// Helpers de Estilo Locais
const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, key?: any }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${active ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const FormField = ({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex flex-col">
       <label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">{label}</label>
       {description && <p className="text-[9px] text-zinc-600 font-medium leading-tight">{description}</p>}
    </div>
    {children}
  </div>
);
