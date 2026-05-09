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
  closeLabel?: string;
}

export const MediaLibrary = ({ onSelect, onClose, standalone = true, closeLabel }: MediaLibraryProps) => {
  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentUploadIdx, setCurrentUploadIdx] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files) as File[];
    setUploading(true);
    setTotalUploads(fileList.length);
    setCurrentUploadIdx(0);
    setProgress(0);

    // Controle de progresso individual para calcular o progresso total
    const progressMap: { [key: number]: number } = {};
    const updateGlobalProgress = (index: number, p: number) => {
      progressMap[index] = p;
      const totalP = Object.values(progressMap).reduce((acc, curr) => acc + curr, 0);
      setProgress(totalP / fileList.length);
    };

    let completedCount = 0;
    let errorCount = 0;

    // Função para executar upload com atualização de estado
    const runUpload = async (file: File, index: number) => {
      try {
        await uploadMedia(file, (p) => updateGlobalProgress(index, p));
        completedCount++;
        setCurrentUploadIdx(prev => Math.min(fileList.length, prev + 1));
      } catch (err) {
        console.error(`Upload falhou para o arquivo ${file.name}:`, err);
        errorCount++;
        updateGlobalProgress(index, 100); // Marca como "concluído" (mesmo que erro) para a barra de progresso não travar
      }
    };

    // Processar em lotes de 3 para não sobrecarregar a conexão
    const batchSize = 3;
    for (let i = 0; i < fileList.length; i += batchSize) {
      const batch = fileList.slice(i, i + batchSize).map((file, idx) => runUpload(file, i + idx));
      await Promise.all(batch);
      // Atualiza a lista após cada lote para dar feedback imediato
      await fetchItems();
    }

    if (errorCount > 0) {
      alert(`${errorCount} arquivo(s) falharam no upload. Verifique o console.`);
    }

    setUploading(false);
    setProgress(0);
    setTotalUploads(0);
    setCurrentUploadIdx(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (item: MediaLibraryItem) => {
    try {
      await deleteMedia(item);
      setItems(items.filter(i => i.id !== item.id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir mídia. Verifique o console.");
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
          {onSelect && (
            <button 
              onClick={() => onSelect(item.url)}
              className="bg-accent text-black px-4 py-2 rounded-[8px] font-bold text-xs uppercase hover:scale-105 transition shadow-lg shadow-accent/20"
            >
              Selecionar
            </button>
          )}
          
          <div className="flex gap-2">
            {!onSelect && (
              <button 
                onClick={() => copyToClipboard(item.url, item.id)}
                className="bg-white text-black p-2 rounded-[8px] hover:scale-110 transition shadow-lg"
                title="Copiar Link"
              >
                {copiedId === item.id ? <Check size={18} /> : <Copy size={18} />}
              </button>
            )}
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmId(item.id);
              }}
              className="bg-red-600 text-white p-2 rounded-[8px] hover:scale-110 transition shadow-lg"
              title="Excluir Permanentemente"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Delete Confirmation Overlay */}
          <AnimatePresence>
            {deleteConfirmId === item.id && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-4 text-center z-50"
              >
                <Trash2 size={24} className="text-red-500 mb-2" />
                <p className="text-[10px] font-black uppercase mb-3 text-white leading-tight">Confirmar exclusão?</p>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    className="flex-1 bg-red-600 text-white py-2 rounded font-black text-[9px] uppercase hover:bg-red-700"
                  >
                    Sim
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(null);
                    }}
                    className="flex-1 bg-white/10 text-white py-2 rounded font-black text-[9px] uppercase hover:bg-white/20"
                  >
                    Não
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            title="Sincroniza os arquivos com o banco de dados"
          >
            {syncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {syncing ? 'Salvando...' : 'Salvar Alterações'}
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || syncing}
            className="bg-accent text-black px-6 py-2 rounded-[8px] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-accent/80 transition disabled:opacity-50"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? `${currentUploadIdx}/${totalUploads} (${Math.round(progress)}%)` : 'Novo Upload'}
          </button>
          
          {!standalone && (
            <button 
              onClick={onClose} 
              className="flex items-center gap-2 px-6 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-black rounded-lg border border-accent/20 transition font-black text-[10px] uppercase tracking-widest group"
            >
              <X size={14} className="group-hover:rotate-90 transition-transform" /> {closeLabel || 'Voltar'}
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
            <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">Sincronizando Biblioteca...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[12px] flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-2">
                <ImageIcon size={32} className="text-zinc-700" />
             </div>
             <div className="space-y-1">
               <h3 className="text-white font-bold text-lg">Sua Biblioteca está vazia</h3>
               <p className="text-zinc-500 text-sm max-w-xs mx-auto">Comece fazendo o upload das suas mídias (fotos, vídeos ou áudios) para usá-las nos seus fluxos.</p>
             </div>
             <button 
              onClick={() => fileInputRef.current?.click()} 
              className="mt-4 bg-accent text-zinc-950 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition shadow-lg shadow-accent/20"
             >
               Fazer Primeiro Upload
             </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-20 text-center border border-white/5 rounded-[12px] flex flex-col items-center gap-4">
             <Search size={48} className="text-zinc-800" />
             <span className="text-zinc-600 font-bold italic">Nenhum resultado para "{search || filter}"</span>
             <button onClick={() => { setSearch(''); setFilter('all'); }} className="text-accent text-xs font-black uppercase tracking-widest hover:underline">Limpar filtros</button>
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
        multiple
      />
    </div>
  );

  return standalone ? content : <div className={containerClasses}>{content}</div>;
};
