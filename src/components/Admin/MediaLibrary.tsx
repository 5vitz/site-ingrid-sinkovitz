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
  projectId?: string;
  projectName?: string;
}

export const MediaLibrary = ({ onSelect, onClose, standalone = true, closeLabel, projectId, projectName }: MediaLibraryProps) => {
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

  const [usedIdentities, setUsedIdentities] = useState<Set<string>>(new Set());
  const [usedFilenames, setUsedFilenames] = useState<Set<string>>(new Set());
  const [showOnlyUsed, setShowOnlyUsed] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    fetchItems();
    fetchUsedUrls();
  }, [projectId]);

  // Função auxiliar para identificar o caminho real do arquivo no Storage
  const getFileIdentity = (item: MediaLibraryItem | string) => {
    try {
      let path = "";
      if (typeof item !== 'string') {
        // Se temos o fullPath do storage, usamos ele como identidade principal
        if (item.fullPath) path = item.fullPath;
        else path = item.url;
      } else {
        path = item;
      }
      
      if (!path || typeof path !== 'string') return { full: '', filename: '' };
      
      let fullMatch = path;
      
      // Se for uma URL do Firebase, extraímos o path entre /o/ e ?
      if (path.includes('/o/')) {
        const parts = path.split('/o/');
        const afterO = parts[1].split('?')[0];
        fullMatch = decodeURIComponent(afterO);
      } else if (path.includes('firebasestorage.googleapis.com')) {
         const parts = path.split('/o/');
         if (parts[1]) {
           fullMatch = decodeURIComponent(parts[1].split('?')[0]);
         }
      }
      
      // Normalização: remover barras duplas, iniciais e converter para minúsculo
      const normalizedFull = fullMatch.replace(/\/+/g, '/').replace(/^\/+/, '').trim().toLowerCase();
      const filename = normalizedFull.split('/').pop() || '';
      
      return { 
        full: normalizedFull, 
        filename: filename.toLowerCase() 
      };
    } catch (e) {
      return { full: '', filename: '' };
    }
  };

  const fetchUsedUrls = async () => {
    setIsScanning(true);
    try {
      const { getDocs, collection } = await import('firebase/firestore');
      const firebaseInstance = await import('../../lib/firebase');
      const db = firebaseInstance.db;

      if (!db) {
        console.error("[MEDIA SCAN] Firestore db instance not found");
        return;
      }
      
      const identities = new Set<string>();
      const filenames = new Set<string>();
      
      const extractFromValue = (val: any) => {
        if (val === null || val === undefined) return;
        
        if (typeof val === 'string') {
          const s = val.trim();
          if (s.length < 5) return; // Strings muito curtas não são URLs/Paths significativos

          // Focamos em URLs ou strings que pareçam caminhos/arquivos
          const isUrl = s.startsWith('http');
          const isFile = !!s.match(/\.(jpg|jpeg|png|gif|mp4|mov|mp3|wav|webp|pdf)$/i);
          
          if (isUrl || isFile) {
            const { full, filename } = getFileIdentity(s);
            if (full) identities.add(full);
            if (filename) filenames.add(filename);
          }
        } else if (Array.isArray(val)) {
          val.forEach(v => extractFromValue(v));
        } else if (typeof val === 'object') {
          // Scanner profundo para objetos (nós do FlowConstructor, etc)
          try {
            // Evitar objetos do sistema ou muito grandes
            if (val.constructor === Object) {
              Object.values(val).forEach(v => extractFromValue(v));
            }
          } catch (e) { }
        }
      };

      // 1. Scan Projects (Principal fonte de mídia do FlowConstructor)
      const projectsSnap = await getDocs(collection(db, 'projects'));
      projectsSnap.forEach(doc => extractFromValue(doc.data()));

      // 2. Scan outras coleções para cobertura global
      const collectionsToScan = ['about_content', 'testimonials', 'services', 'contact_info'];
      for (const colName of collectionsToScan) {
        try {
          const snap = await getDocs(collection(db, colName));
          snap.forEach(doc => extractFromValue(doc.data()));
        } catch (e) { }
      }

      console.log(`[MEDIA SCAN] Scanner finalizado.`);
      console.log(`- Caminhos Únicos (Identidades): ${identities.size}`);
      console.log(`- Nomes de Arquivo: ${filenames.size}`);
      
      setUsedIdentities(identities);
      setUsedFilenames(filenames);
    } catch (e) {
      console.error("Erro ao mapear mídia em uso:", e);
    } finally {
      setIsScanning(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getMediaLibrary(projectId);
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
      // Usar a mesma lógica de progressão para feedback
      await syncStorageWithFirestore('media', undefined, undefined, (msg) => {
        console.log(`[MEDIA_LIB_SYNC] ${msg}`);
      });
      await fetchItems();
      alert("Sincronização concluída! A biblioteca foi atualizada com os arquivos do Storage.");
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
        if (!projectId) {
          alert("Erro: ID do projeto não identificado para o upload.");
          return;
        }
        await uploadMedia(file, projectId, (p) => updateGlobalProgress(index, p));
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

  const isItemUsed = (item: MediaLibraryItem) => {
    const { full, filename } = getFileIdentity(item);
    
    // 1. Checagem por identidade completa (caminho no storage: media/projeto/arquivo.jpg)
    // É a forma mais segura pois ignora tokens da URL
    if (usedIdentities.has(full)) return { used: true, type: 'exact' as const };
    
    // 2. Checagem por nome de arquivo (flexível para casos onde o path no BD está inconsistente)
    if (usedFilenames.has(filename)) return { used: true, type: 'filename' as const };
    
    return { used: false, type: null };
  };

  const filteredItems = items
    .filter(i => filter === 'all' || i.category === filter)
    .filter(i => {
      if (showOnlyUsed) {
        return isItemUsed(i).used;
      }
      return true;
    })
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderItem = (item: MediaLibraryItem) => {
    const { used, type } = isItemUsed(item);

    return (
      <motion.div 
        layout
        key={item.id}
        className={`group relative bg-zinc-900 border border-white/5 opacity-70 hover:opacity-100 rounded-[8px] overflow-hidden hover:border-accent/50 transition-all flex flex-col`}
      >
        {isScanning && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[8px] font-black rounded animate-pulse">
            ESCANEAR...
          </div>
        )}

        {/* Preview Area */}
        <div className="aspect-[4/5] w-full bg-black flex items-center justify-center relative overflow-hidden">
          {item.category === 'image' && (
            <img src={item.url} className="w-full h-full object-cover" alt={item.name} loading="lazy" />
          )}
          {item.category === 'video' && (
            <div className="w-full h-full relative group/video bg-zinc-950">
              <video 
                src={item.url} 
                className="w-full h-full object-cover pointer-events-none"
                preload="metadata"
                muted
                playsInline
                onLoadedMetadata={(e) => {
                  e.currentTarget.currentTime = 0.5;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                <div className="bg-white/5 p-3 rounded-full backdrop-blur-sm group-hover:bg-accent group-hover:text-black transition-all">
                  <Video size={20} className="opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </div>
            </div>
          )}
          {item.category === 'audio' && (
            <div className="flex flex-col items-center gap-2">
              <Music size={40} className="text-zinc-500" />
              <span className="text-[10px] uppercase font-bold text-zinc-500">Áudio</span>
            </div>
          )}
          {item.category === 'other' && (
            <div className="flex flex-col items-center gap-2">
              <FileIcon size={40} className="text-zinc-500" />
              <span className="text-[10px] uppercase font-bold text-zinc-500">Arquivo</span>
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
                    className="flex-1 bg-red-600 text-white py-2 rounded font-black text-[9px] uppercase hover:bg-red-700 shadow-lg"
                  >
                    Excluir
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(null);
                    }}
                    className="flex-1 bg-white/10 text-white py-2 rounded font-black text-[9px] uppercase hover:bg-white/20"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </motion.div>
    );
  };

  const containerClasses = standalone 
    ? "bg-black h-screen text-white p-6 md:p-10 flex flex-col overflow-hidden"
    : "fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4";

  const content = (
    <div className={`w-full max-w-7xl mx-auto flex flex-col gap-6 h-full ${!standalone ? 'h-[90vh] bg-zinc-950 border border-white/10 rounded-[12px] shadow-2xl p-6 overflow-hidden' : ''}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 md:-translate-y-[12px]">
             {projectName ? `Biblioteca: ${projectName}` : 'Biblioteca de Mídia'}
          </h2>
          <div className="flex items-center gap-4 md:-translate-y-[11px]">
            <p className="text-accent text-[10px] font-black uppercase tracking-widest">
              {items.length} Arquivos total
            </p>
            <div className="h-1 w-1 rounded-full bg-zinc-800" />
            <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">
              {items.filter(i => isItemUsed(i).used).length} Usados
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto ml-auto">
          <button 
            onClick={handleSync}
            disabled={syncing || uploading}
            className="bg-accent text-zinc-950 px-8 py-2.5 rounded-[8px] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-accent/80 transition disabled:opacity-50 shadow-xl shadow-accent/20"
            title="Sincroniza os arquivos com o banco de dados"
          >
            {syncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {syncing ? 'Sincronizando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-white/5 pb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowOnlyUsed(false)}
            className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition flex items-center justify-center ${!showOnlyUsed ? 'bg-white text-black border-white shadow-lg shadow-white/10' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
          >
            Disponíveis
          </button>
          
          <button
            onClick={() => setShowOnlyUsed(true)}
            className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition flex items-center justify-center ${showOnlyUsed ? 'bg-accent text-black border-accent shadow-lg shadow-accent/10' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
          >
            Usadas no Flow
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || syncing}
            className="px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white/5 border-white/10 text-white transition flex items-center justify-center gap-2 hover:bg-white/10 disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {uploading ? `${currentUploadIdx}/${totalUploads}` : 'Novo Upload'}
          </button>

          {!standalone && (
            <button 
              onClick={onClose}
              className="px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-white/5 border-white/10 text-white transition flex items-center justify-center gap-2 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 transition group"
            >
              <X size={14} className="group-hover:rotate-90 transition-transform" /> Construtor de Flow
            </button>
          )}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            className="w-full bg-zinc-900/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent/40"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-accent" size={40} />
            <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">Sincronizando Biblioteca...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[12px] flex flex-col items-center gap-4">
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
             <div className="space-y-1">
               <span className="text-white font-bold block">Nenhum resultado encontrado</span>
               <span className="text-zinc-600 text-xs uppercase font-black tracking-widest block">
                 {showOnlyUsed ? 'Nenhum dos arquivos visíveis está sendo usado no projeto' : `Filtro atual: "${filter}"`}
               </span>
             </div>
             <button 
               onClick={() => { setSearch(''); setFilter('all'); setShowOnlyUsed(false); }} 
               className="mt-4 bg-white/5 px-6 py-2 rounded-full text-accent text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition border border-accent/20"
             >
               Limpar todos os filtros
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pb-10">
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
