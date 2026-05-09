import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, MessageSquare, Mail, Play, Menu, 
  ShieldCheck, Plus, Share2, Image as ImageIcon,
  ChevronRight, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { ProjectManager } from './ProjectManager';
import { MediaLibrary } from './MediaLibrary';
import { FlowConstructor } from './FlowConstructor';
import { ServiceManager } from './ServiceManager';
import { TestimonialManager } from './TestimonialManager';
import { AboutManager } from './AboutManager';
import { ContactManager } from './ContactManager';
import { GlobalSettingsManager } from './GlobalSettingsManager';
import { UserManagement } from './UserManagement';
import { DatabaseControlCenter } from './DatabaseControlCenter';
import { seedAll } from '../../seed';
import { updateProject } from '../../services/dataService';
import { useCollection } from '../../hooks/useCollection';
import { Project, FeedItem } from '../../types';

const AdminNavItem = ({ active, onClick, icon, label, className = "", isSubItem = false }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, className?: string, isSubItem?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[8px] font-semibold transition ${isSubItem ? 'pl-10' : ''} ${active ? 'bg-white/10 text-white shadow-lg shadow-white/5' : 'text-zinc-500 hover:text-white hover:bg-white/5'} ${className}`}
  >
    {icon} {label}
  </button>
);

export const AdminPanel: React.FC = () => {
  const { logout, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'testimonials' | 'about' | 'contact' | 'users' | 'settings' | 'media' | 'flow'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [frontendOpen, setFrontendOpen] = useState(false);

  // Resetar seleção ao trocar de aba para evitar estados inconsistentes
  useEffect(() => {
    if (activeTab !== 'projects' && activeTab !== 'flow' && activeTab !== 'media') {
      setSelectedProjectId(null);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-zinc-900 border-r border-white/5 p-8 flex flex-col gap-10 shrink-0">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tighter">Ingrid <span className="text-accent">Sinkovitz</span></Link>
          <div className="text-[10px] tracking-widest text-zinc-500 mt-1 font-bold">Painel Administrativo</div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
          {/* CATEGORIA: PROJETOS */}
          <div className="space-y-2">
            <div className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-4">Central de Projetos</div>
            <AdminNavItem 
              active={selectedProjectId === 'new'} 
              onClick={() => {
                setActiveTab('projects');
                setSelectedProjectId('new');
              }} 
              icon={<Plus size={20} />} 
              label="Novo Projeto"
              className={selectedProjectId === 'new' ? "!bg-accent !text-black shadow-xl shadow-accent/20 !opacity-100" : ""}
            />
            <AdminNavItem 
              active={activeTab === 'projects' && selectedProjectId !== 'new'} 
              onClick={() => {
                setActiveTab('projects');
                setSelectedProjectId(null);
              }} 
              icon={<LayoutGrid size={20}/>} 
              label="Editor de Projetos" 
            />
            <AdminNavItem active={activeTab === 'flow'} onClick={() => setActiveTab('flow')} icon={<Share2 size={20}/>} label="Construtor de Flow" />
            <AdminNavItem active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<ImageIcon size={20}/>} label="Biblioteca de Mídia" />
          </div>

          {/* SISTEMA (Sem Título agora) */}
          <div className="space-y-2 pt-4 border-t border-white/5">
            <AdminNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Menu size={20}/>} label="Configurações" />
            {role === 'super' && <AdminNavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<ShieldCheck size={20}/>} label="ACL / Usuários" />}
          </div>

          {/* CATEGORIA: FRONTEND (ÚLTIMO) */}
          <div className="space-y-1 pt-4 border-t border-white/5">
            <button 
              onMouseEnter={() => setFrontendOpen(true)}
              onClick={() => setFrontendOpen(!frontendOpen)}
              className="w-full flex items-center justify-between px-6 py-4 rounded-[8px] font-semibold text-zinc-500 hover:text-white hover:bg-white/5 transition group"
            >
              <div className="flex items-center gap-4">
                <Menu size={20} />
                <span>Frontend</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${frontendOpen ? 'rotate-180' : ''} text-zinc-600 group-hover:text-white`} />
            </button>
            <AnimatePresence>
              {frontendOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <AdminNavItem active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<MessageSquare size={18}/>} label="Serviços" isSubItem />
                  <AdminNavItem active={activeTab === 'testimonials'} onClick={() => setActiveTab('testimonials')} icon={<Mail size={18}/>} label="Depoimentos" isSubItem />
                  <AdminNavItem active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<Play size={18}/>} label="Sobre Mim" isSubItem />
                  <AdminNavItem active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={<Mail size={18}/>} label="Contato" isSubItem />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1" />
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-4">
          <DatabaseControlCenter seedAll={seedAll} />
          <button onClick={logout} className="w-full py-4 bg-red-600/10 text-red-500 font-bold rounded-[8px] hover:bg-red-600 hover:text-white transition text-xs uppercase tracking-widest">Sair da Conta</button>
        </div>
      </aside>

      <main className="flex-1 px-6 pt-4 pb-10 md:px-10 md:pt-8 md:pb-16 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'projects' && (
            <StructuralCenter 
              title={selectedProjectId === 'new' ? "Criar Novo Projeto" : "Central de Projetos"} 
              description={selectedProjectId === 'new' ? "Configure o nome e as definições básicas do seu novo projeto." : "Gerencie as configurações básicas, temas e estilos visuais do seu portfólio."}
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
              onNew={null}
              renderTool={() => (
                <ProjectManager 
                  initialProjectId={selectedProjectId === 'new' ? null : selectedProjectId} 
                  isStartingNew={selectedProjectId === 'new'}
                  onClose={() => setSelectedProjectId(null)} 
                />
              )}
            />
          )}
          {activeTab === 'flow' && (
            <StructuralCenter 
              title="Construtor de Flow" 
              description="Selecione um projeto para editar sua árvore lógica de tópicos e stories."
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
              renderTool={(project) => {
                // Lógica de Migração/Auto-Mapeamento:
                const initialNodes: any[] = [];
                const initialEdges: any[] = [];

                try {
                  const detectMediaType = (media: any) => {
                    const url = typeof media === 'string' ? media : (media?.url || media?.thumbnail || '');
                    const type = typeof media === 'object' ? media?.type : null;
                    if (type === 'video') return 'video';
                    if (type === 'image') return 'image';
                    if (url.match(/\.(mp4|webm|ogg|mov|m4v|m3u8|avi)/i)) return 'video';
                    return 'image';
                  };

                  const getMediaUrl = (media: any) => {
                    if (typeof media === 'string') return media;
                    if (media?.url) return media.url;
                    if (media?.thumbnail) return media.thumbnail;
                    if (media?.src) return media.src;
                    if (media?.preview) return media.preview;
                    if (media?.media?.url) return media.media.url; // Caso aninhado
                    return '';
                  };

                  const getStoryMedia = (story: any) => {
                    const url = getMediaUrl(story) || getMediaUrl(story?.media);
                    return url;
                  };

                  // Debug if Metavix
                  if (project.title?.toLowerCase().includes('metavix')) {
                    console.log('Metavix Feed Probe:', project.feed);
                  }

                   if (project.flowData?.nodes?.length) {
                    const repairedNodes = (project.flowData.nodes || []).filter(Boolean).map((node: any) => {
                      // Se o nó já tem thumbnail e tipo, apenas verificamos se estão válidos
                      if (node.data.thumbnail && node.data.type) return node;

                      // Tenta encontrar o item correspondente no feed para recuperar os dados
                      // 1. Busca direta por ID
                      let feedItem = project.feed?.find((f: any) => f.id === node.id) || 
                                     project.feed?.flatMap((f: any) => f.stories || []).find((s: any) => s.id === node.id);
                      
                      // 2. Busca por padrão de ID gerado (ex: metavix-item-0-story-1)
                      if (!feedItem) {
                        const storyMatches = node.id.match(/(.+)-story-(\d+)/);
                        if (storyMatches) {
                          const parentId = storyMatches[1];
                          const storyIdx = parseInt(storyMatches[2]);
                          // Tenta achar o pai pelo ID ou pelo índice se o parentId for genérico
                          const parentItem = project.feed?.find((f: any) => f.id === parentId) || 
                                           (parentId.includes('item-') ? project.feed?.[parseInt(parentId.split('-').pop() || '0')] : null);
                          
                          if (parentItem && parentItem.stories?.[storyIdx]) {
                            feedItem = parentItem.stories[storyIdx];
                          }
                        }
                      }

                      // 3. Busca por posição/contexto (Último recurso: se for STR-X-Y)
                      if (!feedItem && node.data.id?.startsWith('STR-')) {
                        const parts = node.data.id.split('-');
                        const itemIdx = parseInt(parts[1]) - 1;
                        const storyIdx = parseInt(parts[2]) - 1;
                        if (project.feed?.[itemIdx]?.stories?.[storyIdx]) {
                          feedItem = project.feed[itemIdx].stories[storyIdx];
                        }
                      }

                      if (feedItem) {
                        const url = getStoryMedia(feedItem);
                        const detectedType = detectMediaType(feedItem.media || feedItem);
                        
                        return {
                          ...node,
                          data: {
                            ...node.data,
                            type: node.data.type || detectedType,
                            thumbnail: node.data.thumbnail || url
                          }
                        };
                      }
                      
                      return node;
                    });
                    initialNodes.push(...repairedNodes);

                    // DEDUPLICAÇÃO DE ARESTAS: Limpeza profunda para evitar duplicidade visual
                    const seenEdgeKeys = new Set();
                    const cleanEdges = (project.flowData.edges || []).filter((edge: any) => {
                      if (!edge || !edge.source || !edge.target) return false;
                      // Criamos uma chave única baseada nos nós e handles (independente de quem é source ou target para evitar duplicidade invertida)
                      const nodes = [edge.source, edge.target].sort();
                      const edgeKey = `${nodes[0]}-${nodes[1]}-${edge.sourceHandle || ''}-${edge.targetHandle || ''}`;
                      
                      if (seenEdgeKeys.has(edgeKey)) return false;
                      seenEdgeKeys.add(edgeKey);
                      return true;
                    });
                    initialEdges.push(...cleanEdges);
                  } else if (project.feed?.length) {
                    project.feed.forEach((item, itemIdx) => {
                      if (!item) return;

                      const mainNodeId = item.id || `item-${itemIdx}`;
                      const baseY = 100 + (itemIdx * 600); // Ajustado para 600 para igualar o ritmo horizontal
                      const itemMediaType = detectMediaType(item.media);
                      const itemUrl = getMediaUrl(item.media);

                      initialNodes.push({
                        id: mainNodeId,
                        type: 'communication',
                        position: { x: 300, y: baseY },
                        data: { 
                          label: item.title || 'Sem título', 
                          type: itemMediaType,
                          thumbnail: itemUrl,
                          id: `IMT-${itemIdx + 1}`,
                          aspectRatio: item.aspectRatio || (itemMediaType === 'video' ? 0.56 : 1)
                        }
                      });

                      item.stories?.forEach((story, storyIdx) => {
                        if (!story) return;

                        const storyNodeId = story.id || `${mainNodeId}-story-${storyIdx}`;
                        const storyUrl = getStoryMedia(story);
                        const storyMediaType = detectMediaType(story);

                        initialNodes.push({
                          id: storyNodeId,
                          type: 'communication',
                          position: { x: 300 + (storyIdx + 1) * 400, y: baseY },
                          data: {
                            label: story.title || `${item.title || 'Item'} - Pt ${storyIdx + 2}`,
                            type: storyMediaType,
                            thumbnail: storyUrl,
                            id: `STR-${itemIdx + 1}-${storyIdx + 1}`,
                            aspectRatio: story.aspectRatio || item.aspectRatio || (storyMediaType === 'video' ? 0.56 : 1)
                          }
                        });

                        const prevId = storyIdx === 0 
                          ? mainNodeId 
                          : (item.stories?.[storyIdx - 1]?.id || `${mainNodeId}-story-${storyIdx - 1}`);

                        initialEdges.push({
                          id: `e-h-${prevId}-${storyNodeId}`,
                          source: prevId,
                          target: storyNodeId,
                          sourceHandle: 'right',
                          targetHandle: 'left',
                          type: 'button',
                          animated: true,
                          style: { stroke: '#FEF200', strokeWidth: 2 }
                        });
                      });

                      if (itemIdx < project.feed.length - 1) {
                        const nextItem = project.feed[itemIdx + 1];
                        if (nextItem && nextItem.id) {
                          // Garante que o ID da aresta vertical seja único por direção
                          initialEdges.push({
                            id: `e-v-${mainNodeId}-${nextItem.id}`,
                            source: mainNodeId,
                            target: nextItem.id,
                            sourceHandle: 'bottom',
                            targetHandle: 'top',
                            type: 'button',
                            animated: true,
                            style: { stroke: '#FEF200', strokeWidth: 2, strokeDasharray: '5,5' }
                          });
                        }
                      }
                    });
                  }
                } catch (err) {
                  console.error("Erro crítico no mapeamento de Flow:", err);
                }

                return (
                  <div className="fixed inset-0 z-50 bg-black">
                    <FlowConstructor 
                      key={`flow-editor-${project.id}`}
                      initialData={{ 
                        nodes: initialNodes, 
                        edges: initialEdges,
                        projectName: project.title 
                      }}
                      onCancel={() => setSelectedProjectId(null)}
                      cancelLabel="Trocar Projeto"
                      onSave={async (flowResult) => {
                      try {
                        const { nodes, edges } = flowResult;
                        
                        // Função auxiliar para converter node em FeedItem
                        const nodeToFeedItem = (node: any): FeedItem => ({
                          id: node.id,
                          title: node.data.label || 'Sem Título',
                          media: {
                            type: node.data.type || 'image',
                            url: node.data.thumbnail || '',
                            order: 1
                          },
                          aspectRatio: node.data.aspectRatio || (node.data.type === 'video' ? 0.56 : 1),
                          stories: []
                        });

                        // 1. Identificar Roots (Nós que não tem entrada Left ou que são entrada de Top)
                        const roots = nodes.filter(n => {
                          const hasHorizontalInput = edges.some(e => e.target === n.id && e.targetHandle === 'left');
                          return !hasHorizontalInput;
                        });

                        // 2. Ordenar Roots por Y
                        roots.sort((a, b) => a.position.y - b.position.y);

                        // 3. Para cada Root, seguir a trilha 'right' para criar stories
                        const newFeed: FeedItem[] = roots.map(root => {
                          const item = nodeToFeedItem(root);
                          const stories: FeedItem[] = [];
                          
                          let currentId = root.id;
                          let foundNext = true;
                          let safetyCounter = 0;
                          const visited = new Set([root.id]);

                          while (foundNext && safetyCounter < 50) {
                            safetyCounter++;
                            const horizontalEdge = edges.find(e => e.source === currentId && e.sourceHandle === 'right');
                            if (horizontalEdge) {
                              const storyNode = nodes.find(n => n.id === horizontalEdge.target);
                              if (storyNode && !visited.has(storyNode.id)) {
                                stories.push(nodeToFeedItem(storyNode));
                                currentId = storyNode.id;
                                visited.add(currentId);
                              } else {
                                foundNext = false;
                              }
                            } else {
                              foundNext = false;
                            }
                          }
                          
                          item.stories = stories as any[];
                          return item;
                        });

                        const projectData = {
                          ...project,
                          flowData: { nodes: flowResult.nodes, edges: flowResult.edges },
                          feed: newFeed,
                        };

                        await updateProject(project.id, projectData);
                        alert("Fluxo salvo com sucesso!");
                        setSelectedProjectId(null);
                      } catch (err) {
                        console.error("Erro ao salvar flow:", err);
                        alert("Erro ao salvar o fluxo.");
                      }
                    }}
                  />
                </div>
                );
              }}
            />
          )}
          {activeTab === 'media' && (
            <StructuralCenter 
              title="Biblioteca de Mídia" 
              description="Gerencie arquivos, uploads e pastas vinculadas à estrutura visual."
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
              renderTool={() => <MediaLibrary standalone={false} onClose={() => setSelectedProjectId(null)} closeLabel="Trocar Projeto" />}
            />
          )}
          {activeTab === 'services' && <ServiceManager />}
          {activeTab === 'testimonials' && <TestimonialManager />}
          {activeTab === 'about' && <AboutManager />}
          {activeTab === 'contact' && <ContactManager />}
          {activeTab === 'settings' && <GlobalSettingsManager />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </main>
    </div>
  );
};

const StructuralCenter = ({ title, description, selectedId, onSelect, onNew, renderTool }: { 
  title: string, 
  description: string, 
  selectedId: string | null,
  onSelect: (id: string | null) => void,
  onNew?: (() => void) | null,
  renderTool: (p: Project) => React.ReactNode 
}) => {
  const { data: projects, loading } = useCollection<Project>('projects');
  
  // Tratamento especial para criação de novo projeto
  if (selectedId === 'new') {
    return <>{renderTool({ id: 'new', title: 'Novo Projeto' } as Project)}</>;
  }

  const selectedProject = projects.find(p => p.id === selectedId);

  if (selectedId && selectedProject) {
    return <>{renderTool(selectedProject)}</>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-zinc-900/50 py-3 px-8 rounded-[12px] border border-white/5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        </div>
        {onNew && (
          <button 
            onClick={onNew}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-[8px] hover:bg-accent/80 transition shadow-lg shadow-accent/10 whitespace-nowrap"
          >
            <Plus size={20} /> Novo Projeto
          </button>
        )}
      </div>

      <div className="grid gap-3">
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Selecione uma Estrutura</div>
        {loading ? (
          <div className="p-12 text-center text-zinc-600 animate-pulse">Carregando projetos...</div>
        ) : (
          projects.map(p => (
            <button 
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="w-full bg-zinc-900/30 py-2 px-4 rounded-[8px] border border-white/5 hover:border-accent/40 hover:bg-zinc-900/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-[6px] overflow-hidden border border-white/10 shrink-0">
                  {p.galleryThumbnail && <img src={p.galleryThumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />}
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter">Projeto</span>
                  <h3 className="font-normal text-base leading-none text-zinc-200">{p.title}</h3>
                </div>
              </div>
              <ChevronRight size={18} className="text-zinc-700 group-hover:text-accent transition-colors" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
