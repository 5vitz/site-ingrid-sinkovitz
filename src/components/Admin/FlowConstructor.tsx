import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Handle, 
  Position, 
  Background, 
  Controls, 
  Panel,
  NodeProps,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  addEdge,
  ConnectionMode,
  ReactFlowProvider,
  useReactFlow,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  X, Save, Plus, MousePointer2, Layout, Layers, 
  Type, Image as ImageIcon, Video, Share2, 
  Maximize2, Minimize2, ZoomIn, ZoomOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaLibrary } from './MediaLibrary';

// --- CUSTOM NODES ---

interface CommunicationNodeData {
  id: string;
  label: string;
  type: 'video' | 'image';
  thumbnail?: string;
  onSelectMedia?: (id: string) => void;
  onLabelChange?: (id: string, newLabel: string) => void;
  onDelete?: (id: string) => void;
}

const CommunicationNode = ({ id, data, selected }: NodeProps<CommunicationNodeData>) => {
  return (
    <div className={`
      relative w-56 bg-zinc-900 border-2 rounded-xl transition-all duration-300
      ${selected ? 'border-accent shadow-[0_0_20px_rgba(254,242,0,0.15)] scale-[1.01]' : 'border-white/10'}
    `}>
      {/* Botão de Excluir Node */}
      <button 
        onClick={(e) => { e.stopPropagation(); data.onDelete?.(id); }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 border-2 border-black"
        title="Excluir Card"
      >
        <X size={12} />
      </button>

      {/* Header do Card */}
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40 rounded-t-[10px]">
        <div className="flex items-center gap-2 flex-1">
          <div className={`w-2 h-2 rounded-full ${data.type === 'video' ? 'bg-red-500' : 'bg-blue-500'}`} />
          <input 
            type="text"
            className="bg-transparent border-none p-0 text-[10px] uppercase font-black tracking-tighter text-zinc-400 focus:text-white focus:ring-0 w-full outline-none"
            value={data.label || ''}
            onChange={(e) => data.onLabelChange?.(id, e.target.value)}
          />
        </div>
        <div className="flex gap-1 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 space-y-3">
        <button 
          onClick={() => data.onSelectMedia?.(id)}
          className="w-full aspect-video bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5 overflow-hidden group/media relative"
        >
          {data.thumbnail ? (
            <>
              <img src={data.thumbnail} className="w-full h-full object-cover opacity-80 group-hover/media:opacity-100 transition-opacity" alt="" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                <ImageIcon size={24} className="text-white" />
              </div>
            </>
          ) : (
            <div className="text-zinc-600 flex flex-col items-center gap-1 group-hover/media:text-accent transition-colors">
              {data.type === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
              <span className="text-[8px] uppercase font-bold">Selecionar Mídia</span>
            </div>
          )}
        </button>
        
        <div className="space-y-1">
          <div className="h-2 w-3/4 bg-white/10 rounded" />
          <div className="h-2 w-1/2 bg-white/5 rounded" />
        </div>

        <div className="pt-2 border-t border-white/5 flex justify-between items-center">
          <div className="flex -space-x-2">
            {[1, 2].map(i => (
              <div key={i} className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                +
              </div>
            ))}
          </div>
          <span className="text-[8px] text-zinc-500 font-mono uppercase">#{data.id || '001'}</span>
        </div>
      </div>

      {/* Handles para conexões (Tamanho aumentado para facilitar clique) */}
      <Handle type="target" position={Position.Left} id="left" className="!w-4 !h-4 !bg-accent !border-zinc-950 !border-2 shadow-[0_0_10px_rgba(254,242,0,0.5)]" />
      <Handle type="source" position={Position.Right} id="right" className="!w-4 !h-4 !bg-accent !border-zinc-950 !border-2 shadow-[0_0_10px_rgba(254,242,0,0.5)]" />
      <Handle type="target" position={Position.Top} id="top" className="!w-4 !h-4 !bg-accent !border-zinc-950 !border-2 shadow-[0_0_10px_rgba(254,242,0,0.5)]" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-4 !h-4 !bg-accent !border-zinc-950 !border-2 shadow-[0_0_10px_rgba(254,242,0,0.5)]" />
    </div>
  );
};

const nodeTypes = {
  communication: CommunicationNode,
};

const ButtonEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button 
            className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center border border-black hover:scale-125 hover:bg-red-500 transition shadow-lg text-[12px] font-bold z-50"
            onClick={(event) => {
              event.stopPropagation();
              setEdges((edges) => edges.filter((edge) => edge.id !== id));
            }}
            title="Remover Conexão"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const edgeTypes = {
  button: ButtonEdge,
};

// --- FLOW CONSTRUCTOR COMPONENT ---

interface FlowConstructorProps {
  initialData?: { nodes: any[], edges: any[], projectName?: string };
  onCancel: () => void;
  onSave: (data: { nodes: any[], edges: any[], projectName: string }) => void;
}

const FlowEngine: React.FC<FlowConstructorProps> = ({ initialData, onCancel, onSave }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialData?.edges || []);
  const [projectName, setProjectName] = useState(initialData?.projectName || 'Novo Projeto');
  const [selectingNodeId, setSelectingNodeId] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Memorizar callbacks para evitar recriação constante de nós
  const onSelectMedia = useCallback((id: string) => {
    console.log("Selecionando mídia para node:", id);
    setSelectingNodeId(id);
  }, []);

  const onLabelChange = useCallback((id: string, newLabel: string) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n));
  }, []);

  const onDeleteNode = useCallback((id: string) => {
    setNodes((nds) => nds.filter(n => n.id !== id));
    setEdges((eds) => eds.filter(e => e.source !== id && e.target !== id));
  }, []);

  // Inicializar nós
  useEffect(() => {
    const rawNodes = initialData?.nodes && initialData.nodes.length > 0 
      ? initialData.nodes 
      : [{
          id: '1',
          type: 'communication',
          position: { x: 100, y: 100 },
          data: { label: 'Conceito Inicial', type: 'video', id: 'INIT-01' },
      }];

    setNodes(rawNodes.map((node: any) => ({
      ...node,
      data: {
        ...node.data,
        onSelectMedia,
        onLabelChange,
        onDelete: onDeleteNode
      }
    })));
  }, [initialData, onSelectMedia, onLabelChange, onDeleteNode]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'button', animated: true, style: { stroke: '#FEF200', strokeWidth: 2 } }, eds)),
    [setEdges]
  );

  const addNode = () => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: 'communication',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { 
        label: 'Novo Tópico', 
        type: 'image', 
        id: `TPC-${nodes.length + 1}`,
        onSelectMedia,
        onLabelChange,
        onDelete: onDeleteNode
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleMediaSelect = (url: string) => {
    const nodeId = selectingNodeId;
    if (!nodeId) return;
    
    console.log("Mídia selecionada:", url, "para node:", nodeId);

    const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v)/i) || url.includes('/videos/');
    
    setNodes((nds) => nds.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            thumbnail: url,
            type: isVideo ? 'video' : 'image'
          }
        };
      }
      return node;
    }));
    setSelectingNodeId(null);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Limpeza profunda dos nodes para persistência
      // Removemos funções e propriedades internas do ReactFlow que podem causar erro de serialização
      const cleanedNodes = nodes.map(n => {
        const { 
          dragging: _, 
          dragHandle: __, 
          selected: ___, 
          measured: ____,
          width: _____,
          height: ______,
          ...rest 
        } = n as any;
        
        return {
          ...rest,
          data: {
            id: n.data.id,
            label: n.data.label,
            type: n.data.type,
            thumbnail: n.data.thumbnail || '',
          }
        };
      });

      // Limpeza das edges
      const cleanedEdges = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        type: e.type,
        animated: e.animated,
        style: e.style
      }));

      await onSave({ 
        nodes: cleanedNodes, 
        edges: cleanedEdges,
        projectName 
      });
    } catch (err) {
      console.error("Erro ao preparar salvamento:", err);
      alert("Houve um erro ao processar os dados do flow para salvamento.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col font-sans">
      {/* Barra de Ferramentas Superior */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-950">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 p-2 rounded-lg text-accent">
            <Share2 size={20} />
          </div>
          <div>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-transparent border-none p-0 text-sm font-black uppercase tracking-widest text-white focus:ring-0 w-64 outline-none"
              placeholder="Nome do Projeto"
            />
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Editando Estrutura Visual</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-lg border border-white/5">
             <button onClick={addNode} className="p-2 hover:bg-white/5 rounded text-zinc-400 hover:text-accent transition flex items-center gap-2 px-3">
               <Plus size={16} /> <span className="text-[10px] font-black uppercase">Novo Card</span>
             </button>
             <div className="w-px h-4 bg-white/5" />
             <div className="px-2 text-zinc-600 text-[10px] uppercase font-bold">
               {nodes.length} cards
             </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`px-8 py-2 ${isSaving ? 'bg-zinc-700' : 'bg-accent'} text-black text-[10px] font-black uppercase rounded-lg hover:bg-accent/80 transition shadow-[0_0_20px_rgba(0,102,255,0.3)] flex items-center gap-2 disabled:opacity-50`}
            >
              {isSaving ? (
                <>Salvando...</>
              ) : (
                <><Save size={14} /> Salvar Estrutura</>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Área de Trabalho (Canvas) */}
      <main className="flex-1 relative bg-[#0a0a0a]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.01}
          maxZoom={4}
          className="flow-engine"
        >
          <Background color="#1a1a1a" gap={20} size={1} />
          
          <Panel position="bottom-center" className="mb-8 p-1 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-xl flex items-center gap-1 shadow-2xl">
            <button className="p-2.5 hover:bg-white/10 text-zinc-400 rounded-lg transition" title="Menu" onClick={() => {}}><Layers size={18}/></button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button className="p-2.5 hover:bg-white/10 text-zinc-400 rounded-lg transition" title="Zoom Out" onClick={() => zoomOut()}><ZoomOut size={18}/></button>
            <div className="bg-black/50 px-3 py-2 rounded-md text-[10px] font-mono text-zinc-500">ZOOM</div>
            <button className="p-2.5 hover:bg-white/10 text-zinc-400 rounded-lg transition" title="Zoom In" onClick={() => zoomIn()}><ZoomIn size={18}/></button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button className="p-2.5 hover:bg-white/10 text-zinc-400 rounded-lg transition" title="Reset View" onClick={() => fitView()}><Maximize2 size={18}/></button>
          </Panel>

          <Panel position="top-right" className="mr-6 mt-6 p-4 bg-zinc-900/50 backdrop-blur border border-white/5 rounded-2xl w-48 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-3">Tutorial Rápido</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[9px] text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />
                <span>Clique e arraste para mover cards</span>
              </li>
              <li className="flex items-start gap-2 text-[9px] text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />
                <span>Conecte as bolinhas amarelas para criar o fluxo</span>
              </li>
              <li className="flex items-start gap-2 text-[9px] text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-0.5" />
                <span>Horizontal e Vertical permitidos</span>
              </li>
            </ul>
          </Panel>
          
          <Controls showInteractive={false} className="!bg-zinc-900 !border-white/10 !rounded-lg !overflow-hidden !shadow-xl !m-6" />
        </ReactFlow>
      </main>

      {/* Seletor de Mídia Modal */}
      <AnimatePresence>
        {selectingNodeId && (
          <MediaLibrary 
            standalone={false} 
            onClose={() => setSelectingNodeId(null)} 
            onSelect={handleMediaSelect} 
          />
        )}
      </AnimatePresence>

      {/* Barra de Status Inferior */}
      <footer className="h-10 bg-zinc-950 border-t border-white/5 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Sync Ativo
          </div>
          <div className="text-[9px] text-zinc-600 font-mono">NODES: {nodes.length} | EDGES: {edges.length}</div>
        </div>
        <div className="text-[9px] text-zinc-700 font-black uppercase tracking-tight">Ingrid v2.0 // Flow Engine Mockup Mode</div>
      </footer>

      <style>{`
        .react-flow__handle {
          cursor: crosshair;
        }
        .react-flow__handle:hover {
          transform: scale(1.3);
          background-color: #ffffff !important;
        }
        .react-flow__edge-path {
          stroke: #FEF200;
          stroke-width: 2.5;
          stroke-dasharray: 6;
          animation: flow-dash 1s linear infinite;
        }
        @keyframes flow-dash {
          from { stroke-dashoffset: 10; }
          to { stroke-dashoffset: 0; }
        }
        .react-flow__node.selected {
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export const FlowConstructor: React.FC<FlowConstructorProps> = (props) => (
  <ReactFlowProvider>
    <FlowEngine {...props} />
  </ReactFlowProvider>
);
