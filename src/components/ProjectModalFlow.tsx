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
      aspectRatio: currentNode.data.type === 'video' ? 0.56 : 0.8
    };
  }, [currentNode]);

  // Detectar conexões disponíveis para o node atual
  const availableDirections = useMemo(() => {
    const directions = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    if (!currentNodeId) return directions;

    // Verificar Edges (Conexões explícitas)
    edges.forEach(edge => {
      if (edge.source === currentNodeId) {
        if (edge.sourceHandle === 'bottom') directions.down = true;
        if (edge.sourceHandle === 'right') directions.right = true;
        if (edge.sourceHandle === 'top') directions.up = true;
        if (edge.sourceHandle === 'left') directions.left = true;
        // Se não tiver handle específico, assume baseado na posição relativa do target
        if (!edge.sourceHandle) {
          const target = nodes.find(n => n.id === edge.target);
          if (target && currentNode) {
            const dx = target.position.x - currentNode.position.x;
            const dy = target.position.y - currentNode.position.y;
            if (Math.abs(dx) > Math.abs(dy)) {
              if (dx > 0) directions.right = true;
              else directions.left = true;
            } else {
              if (dy > 0) directions.down = true;
              else directions.up = true;
            }
          }
        }
      }
      if (edge.target === currentNodeId) {
        if (edge.targetHandle === 'top') directions.up = true;
        if (edge.targetHandle === 'left') directions.left = true;
        if (edge.targetHandle === 'bottom') directions.down = true;
        if (edge.targetHandle === 'right') directions.right = true;
      }
    });

    // Fallback: Verificar proximidade se não houver conexões (Garante que nenhum card fique órfão na navegação)
    if (Object.values(directions).every(v => v === false)) {
      if (currentNode) {
         const others = nodes.filter(n => n.id !== currentNode.id);
         directions.down = others.some(n => n.position.y > currentNode.position.y + 100);
         directions.up = others.some(n => n.position.y < currentNode.position.y - 100);
         directions.right = others.some(n => n.position.x > currentNode.position.x + 100 && Math.abs(n.position.y - currentNode.position.y) < 200);
         directions.left = others.some(n => n.position.x < currentNode.position.x - 100 && Math.abs(n.position.y - currentNode.position.y) < 200);
      }
    }

    return directions;
  }, [currentNodeId, edges, nodes, currentNode]);

  const navigate = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!currentNodeId || !currentNode) return;

    // 1. Tentar encontrar via Edge (Conexão explícita)
    const edge = edges.find(e => {
      if (direction === 'down') return (e.source === currentNodeId && e.sourceHandle === 'bottom') || (e.target === currentNodeId && e.targetHandle === 'bottom');
      if (direction === 'up') return (e.source === currentNodeId && e.sourceHandle === 'top') || (e.target === currentNodeId && e.targetHandle === 'top');
      if (direction === 'right') return (e.source === currentNodeId && e.sourceHandle === 'right') || (e.target === currentNodeId && e.targetHandle === 'right');
      if (direction === 'left') return (e.source === currentNodeId && e.sourceHandle === 'left') || (e.target === currentNodeId && e.targetHandle === 'left');
      return false;
    });

    if (edge) {
      const targetId = edge.source === currentNodeId ? edge.target : edge.source;
      setCurrentNodeId(targetId);
      return;
    }

    // 2. Fallback: Navegação Geográfica
    const others = nodes.filter(n => n.id !== currentNodeId);
    let target: any = null;

    if (direction === 'down') {
      const below = others.filter(n => n.position.y > currentNode.position.y + 50);
      target = [...below].sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x)[0];
    } else if (direction === 'up') {
      const above = others.filter(n => n.position.y < currentNode.position.y - 50);
      target = [...above].sort((a, b) => b.position.y - a.position.y || a.position.x - b.position.x)[0];
    } else if (direction === 'right') {
      const toRight = others.filter(n => n.position.x > currentNode.position.x + 50 && Math.abs(n.position.y - currentNode.position.y) < 200);
      target = [...toRight].sort((a, b) => a.position.x - b.position.x)[0];
    } else if (direction === 'left') {
      const toLeft = others.filter(n => n.position.x < currentNode.position.x - 50 && Math.abs(n.position.y - currentNode.position.y) < 200);
      target = [...toLeft].sort((a, b) => b.position.x - a.position.x)[0];
    }

    if (target) setCurrentNodeId(target.id);
  }, [currentNodeId, currentNode, edges, nodes]);

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
          className="relative z-10 w-full max-w-4xl aspect-[4/5] md:aspect-[16/9] flex items-center justify-center p-4"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 relative bg-zinc-900">
            <MediaRenderer 
              media={currentMedia}
              isActive={true}
              isPlaying={true}
              isMuted={isMuted}
              theme={theme}
            />

            {/* Title / Label Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-widest drop-shadow-lg">
                {currentMedia.title}
              </h2>
              {/* Progresso do Flow */}
              <div className="flex gap-1 mt-4">
                {nodes.map(n => (
                  <div 
                    key={n.id} 
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${n.id === currentNodeId ? 'bg-accent' : 'bg-white/20'}`}
                    style={{ backgroundColor: n.id === currentNodeId ? theme.accentColor : undefined }}
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
