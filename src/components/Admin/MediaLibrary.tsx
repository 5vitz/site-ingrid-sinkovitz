import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Search, Trash2, Copy, Check, 
  Image as ImageIcon, Video, Music, File as FileIcon,
  X, Loader2, Plus, Filter, RefreshCw
} from 'lucide-react';
import { getMediaLibrary, uploadMedia, deleteMedia, syncStorageWithFirestore } from '../../services/storageService';
import { MediaLibraryItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  onClose?: () => void;
  standalone?: boolean;
}

export const MediaLibrary = ({ onSelect, onClose, standalone = true }: MediaLibraryProps) => {
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getMediaLibrary();
      setItems(data);
    } catch (err) {
      console.error("Erro ao carregar biblioteca:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncStorageWithFirestore();
      await fetchItems();
      alert("Sincronização concluída! Arquivos encontrados no Storage foram adicionados.");
    } catch (err) {
      console.error("Erro na sincronização:", err);
      alert("Erro ao sincronizar arquivos. Verifique se as permissões do Storage estão corretas.");
    } finally {
      setSyncing(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    try {
      await uploadMedia(file, (p) => setProgress(p));
      await fetchItems();
    } catch (err) {
      console.error("Upload falhou:", err);
      alert("Erro ao subir arquivo.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item: MediaLibraryItem) => {
    if (!confirm(`Excluir "${item.name}"?`)) return;
    try {
      await deleteMedia(item);
      setItems(items.filter(i => i.id !== item.id));
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = items
    .filter(i => filter === 'all' || i.category === filter)
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderItem = (item: MediaLibraryItem) => (
    <motion.div 
      layout
      key={item.id}
      className="group relative bg-zinc-900 border border-white/5 rounded-[8px] overflow-hidden hover:border-accent/50 transition-all flex flex-col"
    >
      {/* Preview Area */}
      <div className="aspect-square w-full bg-black flex items-center justify-center relative overflow-hidden">
        {item.category === 'image' && (
          <img src={item.url} className="w-full h-full object-cover" alt={item.name} />
        )}
        {item.category === 'video' && (
          <div className="flex flex-col items-center gap-2">
            <Video size={40} className="text-accent/50" />
            <span className="text-[10px] uppercase font-bold text-zinc-500">Vídeo</span>
          </div>
        )}
        {item.category === 'audio' && (
          <div className="flex flex-col items-center gap-2">
            <Music size={40} className="text-zinc-500" />
            <span className="text-[10px] uppercase font-bold text-zinc-500">Áudio</span>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onSelect ? (
            <button 
              onClick={() => onSelect(item.url)}
              className="bg-accent text-black px-4 py-2 rounded-[8px] font-bold text-xs uppercase"
            >
              Selecionar
            </button>
          ) : (
            <>
              <button 
                onClick={() => copyToClipboard(item.url, item.id)}
                className="bg-white text-black p-2 rounded-[8px] hover:scale-110 transition"
                title="Copiar Link"
              >
                {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button 
                onClick={() => handleDelete(item)}
                className="bg-red-600 text-white p-2 rounded-[8px] hover:scale-110 transition"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-3">
        <h4 className="text-[11px] font-bold truncate text-zinc-300 mb-1" title={item.name}>{item.name}</h4>
        <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase font-black">
          <span>{formatSize(item.size)}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );

  const containerClasses = standalone 
    ? "bg-black min-h-screen text-white p-6 md:p-10"
    : "fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4";

  const content = (
    <div className={`w-full max-w-7xl mx-auto flex flex-col gap-6 ${!standalone ? 'h-[90vh] bg-zinc-950 border border-white/10 rounded-[12px] shadow-2xl p-6 overflow-hidden' : ''}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
             <Filter className="text-accent" /> Biblioteca de Mídia
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Gerencie seus arquivos do Storage aqui</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              className="w-full bg-zinc-900 border border-white/5 rounded-[8px] pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent/40"
              placeholder="Buscar arquivo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleSync}
            disabled={syncing || uploading}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-[8px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition disabled:opacity-50"
            title="Escaneia o Storage em busca de arquivos não registrados"
          >
            {syncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {syncing ? 'Sincronizando...' : 'Sincronizar Storage'}
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || syncing}
            className="bg-accent text-black px-6 py-2 rounded-[8px] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-accent/80 transition disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? `Subindo ${Math.round(progress)}%` : 'Novo Upload'}
          </button>
          
          {!standalone && (
            <button 
              onClick={onClose} 
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg border border-white/5 transition font-black text-[10px] uppercase tracking-widest"
            >
              <X size={14} /> Voltar ao Fluxo
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        {(['all', 'image', 'video', 'audio'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition ${filter === type ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'}`}
          >
            {type === 'all' ? 'Todos' : type === 'image' ? 'Imagens' : type === 'video' ? 'Vídeos' : 'Áudio'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">Carregando Biblioteca...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[12px] flex flex-col items-center gap-4">
             <ImageIcon size={48} className="text-zinc-800" />
             <span className="text-zinc-600 font-bold">Nenhum arquivo encontrado.</span>
             <button onClick={() => fileInputRef.current?.click()} className="text-accent text-xs font-black uppercase tracking-widest hover:underline">Fazer primeiro upload</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-10">
            {filteredItems.map(renderItem)}
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        className="hidden" 
        accept="image/*,video/*,audio/*"
      />
    </div>
  );

  return standalone ? content : <div className={containerClasses}>{content}</div>;
};
