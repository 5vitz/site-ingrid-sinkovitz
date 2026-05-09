import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, MessageSquare, Mail, Play, Menu, 
  ShieldCheck, Plus, Share2, Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ProjectManager } from './ProjectManager';
import { MediaLibrary } from './MediaLibrary';
import { FlowConstructor } from './FlowConstructor';
import { ServiceManager } from './ServiceManager';
import { TestimonialManager } from './TestimonialManager';
import { AboutManager } from './AboutManager';
import { GlobalSettingsManager } from './GlobalSettingsManager';
import { UserManagement } from './UserManagement';
import { DatabaseControlCenter } from './DatabaseControlCenter';
import { seedAll } from '../../seed';
import { updateProject } from '../../services/dataService';
import { useCollection } from '../../hooks/useCollection';
import { Project, FeedItem } from '../../types';

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
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'testimonials' | 'about' | 'users' | 'settings' | 'media' | 'flow'>('projects');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Resetar seleção ao trocar de aba para evitar estados inconsistentes
  useEffect(() => {
    setSelectedProjectId(null);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-zinc-900 border-r border-white/5 p-8 flex flex-col gap-12 shrink-0">
        <div>
          <Link to="/" className="text-2xl font-bold tracking-tighter">Ingrid <span className="text-accent">Sinkovitz</span></Link>
          <div className="text-[10px] tracking-widest text-zinc-500 mt-1 font-bold">Admin Dashboard</div>
        </div>

        <nav className="flex-1 space-y-2">
          <AdminNavItem active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<LayoutGrid size={20}/>} label="Editor de Projetos" />
          <AdminNavItem active={activeTab === 'flow'} onClick={() => setActiveTab('flow')} icon={<Share2 size={20}/>} label="Construtor de Flow" />
          <AdminNavItem active={activeTab === 'media'} onClick={() => setActiveTab('media')} icon={<ImageIcon size={20}/>} label="Biblioteca de Mídia" />
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
          {activeTab === 'projects' && (
            <StructuralCenter 
              key={`projects-center-${selectedProjectId}`}
              title="Editor de Projetos" 
              description="Gerencie as configurações básicas, temas e estilos visuais do seu portfólio."
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
              onNew={() => {
                setSelectedProjectId('new');
              }}
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
              key={`flow-center-${selectedProjectId}`}
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
                    if (media?.type === 'video') return 'video';
                    if (media?.type === 'image') return 'image';
                    const url = media?.url || '';
                    if (url.match(/\.(mp4|webm|ogg|mov|m4v)/i)) return 'video';
                    return 'image';
                  };

                  if (project.flowData?.nodes?.length) {
                    const repairedNodes = (project.flowData.nodes || []).filter(Boolean).map((node: any) => {
                      if (!node.data.type || !node.data.thumbnail) {
                        // Tenta encontrar o item correspondente no feed para recuperar os dados
                        const feedItem = project.feed?.find((f: any) => f.id === node.id) || 
                                       project.feed?.flatMap((f: any) => f.stories || []).find((s: any) => s.id === node.id);
                        
                        if (feedItem) {
                          return {
                            ...node,
                            data: {
                              ...node.data,
                              type: node.data.type || detectMediaType(feedItem.media),
                              thumbnail: node.data.thumbnail || feedItem.media?.url
                            }
                          };
                        }
                      }
                      // Mesmo que tenha type, reforçamos a detecção do detectMediaType se for nulo
                      if (!node.data.type) {
                        node.data.type = detectMediaType({ url: node.data.thumbnail });
                      }
                      return node;
                    });
                    initialNodes.push(...repairedNodes);
                    initialEdges.push(...(project.flowData.edges || []).filter(Boolean));
                  } else if (project.feed?.length) {
                    // Mapeamento Inteligente: Transforma feed linear em fluxo
                    project.feed.forEach((item, itemIdx) => {
                      if (!item) return;

                      const mainNodeId = item.id || `item-${itemIdx}`;
                      const baseY = 100 + (itemIdx * 600);
                      const itemMediaType = detectMediaType(item.media);

                      // Card Principal
                      initialNodes.push({
                        id: mainNodeId,
                        type: 'communication',
                        position: { x: 300, y: baseY },
                        data: { 
                          label: item.title || 'Sem título', 
                          type: itemMediaType,
                          thumbnail: item.media?.url,
                          id: `IMT-${itemIdx + 1}`,
                          aspectRatio: item.aspectRatio || (itemMediaType === 'video' ? 0.56 : 1)
                        }
                      });

                      // Carrosséis (Stories)
                      item.stories?.forEach((story, storyIdx) => {
                        if (!story) return;

                        const storyNodeId = story.id || `${mainNodeId}-story-${storyIdx}`;
                        const storyMediaType = detectMediaType(story.media);

                        initialNodes.push({
                          id: storyNodeId,
                          type: 'communication',
                          position: { x: 300 + (storyIdx + 1) * 400, y: baseY },
                          data: {
                            label: story.title || `${item.title || 'Item'} - Pt ${storyIdx + 2}`,
                            type: storyMediaType,
                            thumbnail: story.media?.url,
                            id: `STR-${itemIdx + 1}-${storyIdx + 1}`,
                            aspectRatio: story.aspectRatio || item.aspectRatio || (storyMediaType === 'video' ? 0.56 : 1)
                          }
                        });

                        // Conector Horizontal (Carousel) - Lógica de ID robusta
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

                      // Conector Vertical (Próximo Item)
                      if (itemIdx < project.feed.length - 1) {
                        const nextItem = project.feed[itemIdx + 1];
                        if (nextItem && nextItem.id) {
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
                  // Se falhar o mapeamento, pelo menos não crashamos o render
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
              key={`media-center-${selectedProjectId}`}
              title="Biblioteca de Mídia" 
              description="Gerencie arquivos, uploads e pastas vinculadas à estrutura visual."
              selectedId={selectedProjectId}
              onSelect={setSelectedProjectId}
              renderTool={() => <MediaLibrary key={`media-lib-${selectedProjectId}`} standalone={false} onClose={() => setSelectedProjectId(null)} closeLabel="Trocar Projeto" />}
            />
          )}
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

const StructuralCenter = ({ title, description, selectedId, onSelect, onNew, renderTool }: { 
  title: string, 
  description: string, 
  selectedId: string | null,
  onSelect: (id: string | null) => void,
  onNew?: () => void,
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
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-[12px] border border-white/5">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-zinc-500 mt-2">{description}</p>
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
              className="w-full bg-zinc-900/30 p-5 rounded-[8px] border border-white/5 hover:border-accent/40 hover:bg-zinc-900/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-[6px] overflow-hidden border border-white/10 shrink-0">
                  {p.galleryThumbnail && <img src={p.galleryThumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />}
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter">Projeto</span>
                  <h3 className="font-bold text-lg leading-none">{p.title}</h3>
                </div>
              </div>
              <ChevronRight className="text-zinc-700 group-hover:text-accent transition-colors" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
