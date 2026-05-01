import React, { useState } from 'react';
import { Database, Copy, X, List, FolderOpen, Loader2 } from 'lucide-react';
import { PROJECTS_LIST } from '../constants/projects';
import { storage } from '../lib/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

export const MediaListTool = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'code' | 'storage'>('code');
  const [storagePath, setStoragePath] = useState('');
  const [storageLinks, setStorageLinks] = useState<{ name: string, url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllMediaFromCode = () => {
    const urls: { label: string, url: string }[] = [];
    
    PROJECTS_LIST.forEach(p => {
      if (p.coverImage) urls.push({ label: `Capa: ${p.title}`, url: p.coverImage });
      if (p.audioUrl) urls.push({ label: `Áudio: ${p.title}`, url: p.audioUrl });
      
      p.feed?.forEach(f => {
        if (f.media?.url) urls.push({ label: `Media: ${f.title || p.title}`, url: f.media.url });
        if (f.media?.images) {
          f.media.images.forEach((img, i) => {
            urls.push({ label: `Img ${i+1}: ${f.title || p.title}`, url: img });
          });
        }
        if (f.media?.overlays) {
          f.media.overlays.forEach((ov, i) => {
            if (ov.url) urls.push({ label: `Overlay ${i+1}: ${f.title || p.title}`, url: ov.url });
          });
        }
        if (f.stories) {
          f.stories.forEach((s, i) => {
            if (s.url) urls.push({ label: `Story ${i+1}: ${f.title || p.title}`, url: s.url });
          });
        }
      });
    });

    return urls;
  };

  const listStorageFolder = async () => {
    if (!storagePath.trim()) return;
    setLoading(true);
    try {
      const folderRef = ref(storage, storagePath);
      const result = await listAll(folderRef);
      const links = await Promise.all(
        result.items.map(async (item) => ({
          name: item.name,
          url: await getDownloadURL(item)
        }))
      );
      setStorageLinks(links);
    } catch (error) {
      console.error(error);
      alert('Erro ao listar pasta. Verifique o caminho.');
    } finally {
      setLoading(false);
    }
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-accent text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
      >
        <Database size={24} />
      </button>
    );
  }

  const mediaList = getAllMediaFromCode();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-96 h-[600px] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-accent" />
          <span className="text-xs font-bold uppercase tracking-widest text-white">Extrator de Mídia</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition">
          <X size={18} />
        </button>
      </div>

      <div className="flex bg-black/40 p-1 m-2 rounded-lg border border-white/5">
        <button 
          onClick={() => setTab('code')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition ${tab === 'code' ? 'bg-accent text-black' : 'text-zinc-500 hover:text-white'}`}
        >
          No Código
        </button>
        <button 
          onClick={() => setTab('storage')}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition ${tab === 'storage' ? 'bg-accent text-black' : 'text-zinc-500 hover:text-white'}`}
        >
          No Storage
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {tab === 'code' ? (
          mediaList.map((item, idx) => (
            <div key={idx} className="space-y-1.5 group">
              <div className="text-[10px] uppercase font-bold text-zinc-500 flex justify-between">
                <span>{item.label}</span>
                <button 
                  onClick={() => copy(item.url)} 
                  className="text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  <Copy size={10} /> Copiar
                </button>
              </div>
              <div className="text-[10px] break-all bg-black/30 p-2 rounded border border-white/5 text-zinc-400 font-mono">
                {item.url}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Caminho da Pasta</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={storagePath}
                  onChange={(e) => setStoragePath(e.target.value)}
                  placeholder="ex: Projetos/projeto1/Fotos"
                  className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white placeholder:text-zinc-700 outline-none focus:border-accent"
                />
                <button 
                  disabled={loading}
                  onClick={listStorageFolder}
                  className="bg-accent text-black p-2 rounded hover:scale-105 transition disabled:opacity-50 disabled:scale-100"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <FolderOpen size={16} />}
                </button>
              </div>
            </div>

            {storageLinks.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{storageLinks.length} arquivos encontrados</span>
                  <button 
                    onClick={() => {
                      const allUrls = storageLinks.map(l => l.url).join('\n');
                      navigator.clipboard.writeText(allUrls);
                      alert('Todos os links copiados!');
                    }}
                    className="text-[10px] font-bold text-accent hover:underline"
                  >
                    Copiar Todos
                  </button>
                </div>
                {storageLinks.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 group">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 flex justify-between">
                      <span className="truncate flex-1">{item.name}</span>
                      <button 
                        onClick={() => copy(item.url)} 
                        className="text-accent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                      >
                        <Copy size={10} />
                      </button>
                    </div>
                    <div className="text-[10px] break-all bg-black/30 p-2 rounded border border-white/5 text-zinc-400 font-mono">
                      {item.url}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-3 bg-black/40 text-[9px] text-center text-zinc-500 font-medium">
        {tab === 'code' ? `${mediaList.length} itens no código` : 'Use o caminho exato do Storage'}
      </div>
    </div>
  );
};

