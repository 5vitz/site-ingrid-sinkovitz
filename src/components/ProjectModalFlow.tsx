import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, MediaItem } from '../types';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaRenderer } from './MediaRenderer';

interface ProjectModalFlowProps {
  project: Project;
  onClose: () => void;
  isMuted: boolean;
  audioVolume: number;
}

export const ProjectModalFlow: React.FC<ProjectModalFlowProps> = ({ 
  project, 
  onClose,
  isMuted,
  audioVolume
}) => {
  const { nodes, edges } = project.flowData || { nodes: [], edges: [] };
  
  // Encontrar o node inicial (mais ao topo e à esquerda)
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(() => {
    if (nodes.length === 0) return null;
    const sorted = [...nodes].sort((a, b) => {
      // Diferença significativa em Y (níveis)
      if (Math.abs(a.position.y - b.position.y) > 50) return a.position.y - b.position.y;
      // Se estiverem no mesmo nível, ordena por X
      return a.position.x - b.position.x;
    });
    return sorted[0].id;
  });

  const currentNode = useMemo(() => nodes.find(n => n.id === currentNodeId), [nodes, currentNodeId]);

  // Transforma o node em um MediaItem para o MediaRenderer
  const currentMedia = useMemo((): MediaItem | null => {
    if (!currentNode) return null;
    return {
      id: currentNode.id,
      type: currentNode.data.type || 'image',
      url: currentNode.data.thumbnail || currentNode.data.url || '',
      title: currentNode.data.label || '',
      aspectRatio: project.theme?.aspectRatio || (currentNode.data.type === 'video' ? 0.56 : 0.8)
    };
  }, [currentNode, project.theme?.aspectRatio]);

  // Agrupar nodes por linha (Y) para identificar blocos/carrosséis
  const rowNodes = useMemo(() => {
    if (!currentNode) return [];
    // Consideramos no mesmo bloco nodes com diferença de Y menor que 100px
    return nodes
      .filter(n => Math.abs(n.position.y - currentNode.position.y) < 100)
      .sort((a, b) => a.position.x - b.position.x);
  }, [nodes, currentNode]);

  const currentNodeIndexInRow = useMemo(() => {
    return rowNodes.findIndex(n => n.id === currentNodeId);
  }, [rowNodes, currentNodeId]);

  // Detectar conexões disponíveis para o node atual
  const availableDirections = useMemo(() => {
    const directions = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    if (!currentNodeId || !currentNode) return directions;

    // 1. Verificar Edges (Conexões explícitas - Amarelas)
    edges.forEach(edge => {
      if (edge.source === currentNodeId) {
        if (edge.sourceHandle === 'bottom') directions.down = true;
        if (edge.sourceHandle === 'right' || !edge.sourceHandle) directions.right = true;
        if (edge.sourceHandle === 'top') directions.up = true;
        if (edge.sourceHandle === 'left') directions.left = true;
      }
      if (edge.target === currentNodeId) {
        if (edge.targetHandle === 'top') directions.up = true;
        if (edge.targetHandle === 'left' || !edge.targetHandle) directions.left = true;
        if (edge.targetHandle === 'bottom') directions.down = true;
        if (edge.targetHandle === 'right') directions.right = true;
      }
    });

    // 2. Lógica Constante (Blocos): Se não houver conexão explícita, verifica se existe bloco acima/abaixo/lados
    const others = nodes.filter(n => n.id !== currentNode.id);
    
    if (!directions.left && currentNodeIndexInRow > 0) directions.left = true;
    if (!directions.right && currentNodeIndexInRow < rowNodes.length - 1) directions.right = true;
    
    if (!directions.down) {
      directions.down = others.some(n => n.position.y > currentNode.position.y + 150);
    }
    if (!directions.up) {
      directions.up = others.some(n => n.position.y < currentNode.position.y - 150);
    }

    return directions;
  }, [currentNodeId, edges, nodes, currentNode, rowNodes, currentNodeIndexInRow]);

  const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!currentNodeId || !currentNode) return;

    // 1. Tentar encontrar via Edge (Conexão explícita/Amarela) - PRIORIDADE 1
    const edge = edges.find(e => {
      if (direction === 'down') return (e.source === currentNodeId && e.sourceHandle === 'bottom') || (e.target === currentNodeId && e.targetHandle === 'bottom');
      if (direction === 'up') return (e.source === currentNodeId && e.sourceHandle === 'top') || (e.target === currentNodeId && e.targetHandle === 'top');
      if (direction === 'right') return (e.source === currentNodeId && (e.sourceHandle === 'right' || !e.sourceHandle)) || (e.target === currentNodeId && e.targetHandle === 'right');
      if (direction === 'left') return (e.source === currentNodeId && e.sourceHandle === 'left') || (e.target === currentNodeId && (e.targetHandle === 'left' || !e.targetHandle));
      return false;
    });

    if (edge) {
      const targetId = edge.source === currentNodeId ? edge.target : edge.source;
      setCurrentNodeId(targetId);
      return;
    }

    // 2. Lógica Constante (Estrutura de Blocos) - PRIORIDADE 2
    if (direction === 'right' && currentNodeIndexInRow < rowNodes.length - 1) {
      setCurrentNodeId(rowNodes[currentNodeIndexInRow + 1].id);
      return;
    }
    if (direction === 'left' && currentNodeIndexInRow > 0) {
      setCurrentNodeId(rowNodes[currentNodeIndexInRow - 1].id);
      return;
    }

    // 3. Navegação Vertical Estrutural (Sempre volta para o INÍCIO do próximo bloco)
    const others = nodes.filter(n => n.id !== currentNodeId);
    if (direction === 'down') {
      const below = others.filter(n => n.position.y > currentNode.position.y + 100);
      if (below.length > 0) {
        // Encontra a linha mais próxima abaixo
        const nextY = Math.min(...below.map(n => n.position.y));
        const nextRow = below.filter(n => Math.abs(n.position.y - nextY) < 50);
        // Pega o primeiro card dessa linha (mais à esquerda)
        const target = nextRow.sort((a, b) => a.position.x - b.position.x)[0];
        setCurrentNodeId(target.id);
      }
    } else if (direction === 'up') {
      const above = others.filter(n => n.position.y < currentNode.position.y - 100);
      if (above.length > 0) {
        // Encontra a linha mais próxima acima
        const prevY = Math.max(...above.map(n => n.position.y));
        const prevRow = above.filter(n => Math.abs(n.position.y - prevY) < 50);
        // Pega o primeiro card dessa linha (mais à esquerda)
        const target = prevRow.sort((a, b) => a.position.x - b.position.x)[0];
        setCurrentNodeId(target.id);
      }
    }
  }, [currentNodeId, currentNode, edges, nodes, rowNodes, currentNodeIndexInRow]);

  // Teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate('right');
      if (e.key === 'ArrowLeft') navigate('left');
      if (e.key === 'ArrowDown') navigate('down');
      if (e.key === 'ArrowUp') navigate('up');
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onClose]);

  if (!currentMedia) return null;

  const theme = project.theme || { accentColor: '#FEF200' };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black group/flow">
      {/* Media Main Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full flex items-center justify-center p-4 md:p-8"
          style={{
            maxWidth: project.theme?.playerWidth ? `${project.theme.playerWidth}px` : '540px',
            maxHeight: project.theme?.playerMaxHeight ? `${project.theme.playerMaxHeight}px` : '90vh',
            aspectRatio: project.theme?.aspectRatio?.toString() || '0.8',
          }}
        >
          <div 
            className="w-full h-full overflow-hidden relative flex flex-col transition-all duration-500"
            style={{
              backgroundColor: project.theme?.playerBg?.startsWith('#') ? project.theme.playerBg : undefined,
              border: `${project.theme?.borderWidth || '1px'} solid ${project.theme?.playerBorderColor || 'rgba(255,255,255,0.1)'}`,
              borderRadius: project.theme?.borderRadius || '24px',
              boxShadow: project.theme?.boxShadow || '0 0 50px rgba(0,0,0,0.5)',
            }}
          >
            <div className={`flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-hide custom-scrollbar ${!project.theme?.playerBg?.startsWith('#') ? (project.theme?.playerBg || 'bg-zinc-900') : ''}`}>
              <MediaRenderer 
                media={currentMedia}
                isActive={true}
                isPlaying={true}
                isMuted={isMuted}
                theme={theme}
              />
            </div>

            {/* Title / Label Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
              <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-widest drop-shadow-lg pointer-events-auto">
                {currentMedia.title}
              </h2>
              {/* Progresso do Block/Carousel */}
              <div className="flex gap-1.5 mt-4 max-w-md mx-auto pointer-events-auto">
                {rowNodes.map(n => (
                  <div 
                    key={n.id} 
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${n.id === currentNodeId ? 'bg-accent opacity-100 scale-y-125' : 'bg-white/20 opacity-50'}`}
                    style={{ 
                      backgroundColor: n.id === currentNodeId ? theme.accentColor : undefined,
                      boxShadow: n.id === currentNodeId ? `0 0 10px ${theme.accentColor}40` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles de Navegação Flutuantes */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        {/* Lado Direito */}
        {availableDirections.right && (
          <button 
            onClick={() => navigate('right')}
            className="absolute right-6 md:right-12 p-4 bg-black/40 hover:bg-accent text-white hover:text-black rounded-full transition-all pointer-events-auto group/btn backdrop-blur-md"
          >
            <ChevronRight size={32} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
        
        {/* Lado Esquerdo */}
        {availableDirections.left && (
          <button 
            onClick={() => navigate('left')}
            className="absolute left-6 md:left-12 p-4 bg-black/40 hover:bg-accent text-white hover:text-black rounded-full transition-all pointer-events-auto group/btn backdrop-blur-md"
          >
            <ChevronLeft size={32} className="group-hover/btn:-translate-x-1 transition-transform" />
          </button>
        )}

        {/* Topo */}
        {availableDirections.up && (
          <button 
            onClick={() => navigate('up')}
            className="absolute top-12 p-4 bg-black/40 hover:bg-accent text-white hover:text-black rounded-full transition-all pointer-events-auto group/btn backdrop-blur-md"
          >
            <ChevronUp size={24} className="group-hover/btn:-translate-y-1 transition-transform" />
          </button>
        )}

        {/* Base */}
        {availableDirections.down && (
          <button 
            onClick={() => navigate('down')}
            className="absolute bottom-12 p-4 bg-black/40 hover:bg-accent text-white hover:text-black rounded-full transition-all pointer-events-auto group/btn backdrop-blur-md animate-bounce"
          >
            <ChevronDown size={24} className="group-hover/btn:translate-y-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Close Button UI */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-zinc-900 border border-white/10 text-white rounded-full hover:scale-110 transition shadow-2xl"
      >
        <X size={20} />
      </button>

      {/* Info de Atalhos */}
      <div className="absolute bottom-6 left-6 text-[8px] font-black uppercase text-zinc-500 tracking-widest opacity-0 group-hover/flow:opacity-100 transition-opacity">
        Use as setas do teclado para navegar no Flow
      </div>
    </div>
  );
};
