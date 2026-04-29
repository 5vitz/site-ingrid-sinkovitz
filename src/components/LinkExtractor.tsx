import React, { useState, useRef, useEffect } from 'react';
import { X, Copy, Image as ImageIcon, Move, Square } from 'lucide-react';

interface Rect {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export const LinkExtractor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [rects, setRects] = useState<Rect[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState<Rect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setIsDrawing(true);
    setCurrentRect({
      id: Math.random().toString(36).substr(2, 9),
      top: y,
      left: x,
      width: 0,
      height: 0
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentRect || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = x - startPos.x;
    const height = y - startPos.y;

    setCurrentRect({
      ...currentRect,
      top: height < 0 ? y : startPos.y,
      left: width < 0 ? x : startPos.x,
      width: Math.abs(width),
      height: Math.abs(height)
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.width > 5) {
      setRects([...rects, currentRect]);
    }
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const deleteRect = (id: string) => {
    setRects(rects.filter(r => r.id !== id));
  };

  const copyToClipboard = (rect: Rect) => {
    const code = `top: '${Math.round(rect.top)}px',\nleft: '${Math.round(rect.left)}px',\nwidth: '${Math.round(rect.width)}px',\nheight: '${Math.round(rect.height)}px'`;
    navigator.clipboard.writeText(code);
    alert('Coordenadas copiadas!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">EXTRATOR DE <span className="text-accent">COORDENADAS</span></h1>
            <p className="text-zinc-500 text-sm">Desenhe os retângulos sobre o print para obter as posições exatas.</p>
          </div>
          <label className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-full cursor-pointer hover:bg-white transition-colors">
            <ImageIcon size={20} />
            CARREGAR PRINT
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div 
              ref={containerRef}
              className="relative bg-zinc-900 border border-white/5 rounded-lg overflow-hidden cursor-crosshair select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ minHeight: '600px' }}
            >
              {image ? (
                <img src={image} className="w-full h-auto pointer-events-none" alt="Base" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold uppercase tracking-widest text-xl">
                  Selecione uma imagem para começar
                </div>
              )}

              {rects.map(rect => (
                <div
                  key={rect.id}
                  className="absolute border-2 border-accent bg-accent/20 flex items-center justify-center group"
                  style={{
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    zIndex: 10
                  }}
                >
                  <div className="absolute -top-8 left-0 bg-accent text-black text-[10px] px-2 py-1 font-bold rounded flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(rect.width)}x{Math.round(rect.height)}
                  </div>
                </div>
              ))}

              {currentRect && (
                <div
                  className="absolute border-2 border-white/50 bg-white/10"
                  style={{
                    top: currentRect.top,
                    left: currentRect.left,
                    width: currentRect.width,
                    height: currentRect.height,
                    zIndex: 20
                  }}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest opacity-40">Retângulos</h2>
            <div className="space-y-3">
              {rects.length === 0 && <p className="text-zinc-600 italic text-sm text-center py-8">Nenhum retângulo desenhado ainda.</p>}
              {rects.map((rect, idx) => (
                <div key={rect.id} className="bg-zinc-900/50 p-4 rounded-lg border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-accent uppercase"># {idx + 1}</span>
                    <div className="flex gap-2">
                      <button onClick={() => copyToClipboard(rect)} className="p-1.5 hover:text-accent transition"><Copy size={14}/></button>
                      <button onClick={() => deleteRect(rect.id)} className="p-1.5 hover:text-red-500 transition"><X size={14}/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono opacity-60">
                    <div>T: {Math.round(rect.top)}px</div>
                    <div>L: {Math.round(rect.left)}px</div>
                    <div>W: {Math.round(rect.width)}px</div>
                    <div>H: {Math.round(rect.height)}px</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
