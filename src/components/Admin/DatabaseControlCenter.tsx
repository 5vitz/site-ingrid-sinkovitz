import React, { useState, useEffect } from 'react';
import { Database, X, RefreshCw, Zap } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { PROJECTS_LIST } from '../../constants/projects';

interface DatabaseControlCenterProps {
  seedAll: (onProgress?: (msg: string) => void) => Promise<void>;
}

export const DatabaseControlCenter: React.FC<DatabaseControlCenterProps> = ({ seedAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, 'idle' | 'syncing' | 'done' | 'error'>>({});
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [dbIdDisplay, setDbIdDisplay] = useState('...');
  const [connStatus, setConnStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    import('../../../firebase-applet-config.json').then(config => {
      setDbIdDisplay(config.default?.firestoreDatabaseId || '(default)');
    });
  }, []);

  useEffect(() => {
    const checkConn = async () => {
      if (!db) {
        setConnStatus('offline');
        return;
      }
      try {
        const { getDocFromServer, doc: fireDoc } = await import('firebase/firestore');
        await getDocFromServer(fireDoc(db, 'diagnostics', 'ping'));
        setConnStatus('online');
      } catch (e: any) {
        if (e.code === 'permission-denied' || e.code === 'unauthenticated') setConnStatus('online');
        else setConnStatus('offline');
      }
    };
    if (db) checkConn();
    else setConnStatus('offline');
  }, []);

  const PROJECTS = [
    { id: 'projeto-metavix', name: 'Metavix' },
    { id: 'projeto-elobike', name: 'EloBike' },
    { id: 'projeto-good-storage', name: 'Good Storage' },
    { id: 'projeto-auddar', name: 'Auddar' },
    { id: 'projeto-lion-jump', name: 'Lion Jump' },
    { id: 'projeto-scalla-records', name: 'Scalla Records' },
    { id: 'config-global', name: 'Configurações Globais' }
  ];

  const handleSyncProject = async (projectId: string) => {
    setSyncStatus(prev => ({ ...prev, [projectId]: 'syncing' }));
    setError('');

    async function withTimeout<T>(promise: Promise<T>, ms: number) {
      const timeout = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Tempo esgotado (Time-out)')), ms)
      );
      return Promise.race([promise, timeout]);
    }

    try {
      if (projectId === 'config-global') {
        const { seedGlobalSettings } = await import('../../seed');
        await withTimeout(seedGlobalSettings(), 15000);
      } else {
        const projectData = PROJECTS_LIST.find(p => p.id === projectId);
        if (!projectData) throw new Error('Dados não encontrados no código');
        if (!db) throw new Error('Conexão Firebase não iniciada');
        
        await withTimeout(setDoc(doc(db, 'projects', projectId), {
          ...projectData,
          updatedAt: serverTimestamp()
        }, { merge: true }), 20000);
      }
      setSyncStatus(prev => ({ ...prev, [projectId]: 'done' }));
    } catch (err: any) {
      console.error('[SYNC_ERROR]', err);
      setSyncStatus(prev => ({ ...prev, [projectId]: 'error' }));
      setError(`${projectId}: ${err.message || 'Erro desconhecido'}`);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-zinc-800 text-accent text-[10px] font-black uppercase tracking-widest rounded-[8px] hover:bg-accent hover:text-white transition flex items-center justify-center gap-2 shadow-xl"
      >
        <Database size={14} /> Sincronizar Firestore
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sync Firestore</span>
          <div className="flex flex-col gap-0.5 mt-0.5">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${connStatus === 'online' ? 'bg-green-500' : connStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[7px] font-bold uppercase text-zinc-600">{connStatus === 'online' ? 'Online' : 'Offline'}</span>
            </div>
            <span className="text-[6px] font-mono text-zinc-700 uppercase">DB: {dbIdDisplay}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setSyncStatus({});
              setError('');
            }}
            className="p-1 px-2 text-[8px] font-black uppercase text-zinc-600 border border-white/5 rounded hover:bg-white/5 hover:text-zinc-400"
          >
            Limpar
          </button>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
        {PROJECTS.map(proj => (
          <div key={proj.id} className="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5">
            <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[120px]">{proj.name}</span>
            <button 
              disabled={syncStatus[proj.id] === 'syncing'}
              onClick={() => handleSyncProject(proj.id)}
              className={`px-3 py-1.5 rounded text-[8px] font-black uppercase transition-all ${
                syncStatus[proj.id] === 'done' 
                ? 'bg-green-500/20 text-green-500' 
                : syncStatus[proj.id] === 'syncing'
                ? 'bg-accent/20 text-accent animate-pulse'
                : 'bg-white text-black hover:bg-accent hover:text-white'
              }`}
            >
              {syncStatus[proj.id] === 'done' ? 'OK' : syncStatus[proj.id] === 'syncing' ? '...' : 'SYNC'}
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={async () => {
          if(!confirm('Sincronizar TODOS?')) return;
          setLoading(true);
          try {
            await seedAll((msg: string) => setProgress(msg));
            alert('Sucesso!');
            window.location.reload();
          } catch(e: any) {
            setError(e.message);
            setLoading(false);
          }
        }}
        className="w-full py-2 bg-accent text-white text-[10px] font-black uppercase rounded mt-2 hover:brightness-110 flex items-center justify-center gap-2"
      >
        {loading ? <RefreshCw size={12} className="animate-spin" /> : <Zap size={12} />}
        {loading ? progress || 'Sincronizando...' : 'GERAL'}
      </button>

      {error && (
        <div className="p-2 bg-red-600/10 border border-red-600/20 rounded text-[9px] text-red-500 font-mono italic">
          {error}
        </div>
      )}
    </div>
  );
};
