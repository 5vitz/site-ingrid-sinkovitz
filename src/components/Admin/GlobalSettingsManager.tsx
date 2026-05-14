import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/dataService';
import { migrateLegacyMedia, syncStorageWithFirestore, repairProjectLinks } from '../../services/storageService';
import { useCollection } from '../../hooks/useCollection';
import { SiteSettings, Project } from '../../types';
import { Save, Settings2, Phone, Layout, Palette, Type, ShieldCheck, Database, Zap, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const GlobalSettingsManager = () => {
  const { data: projects } = useCollection<Project>('projects');
  const [settings, setSettings] = useState<SiteSettings>({ 
    whatsappNumber: '', 
    accentColor: '#f29232',
    maintenanceMode: false,
    maintenanceTitle: 'Sob manutenção, até breve!',
    cor1: '#f29232',
    cor2: '#203F44',
    cor3: '#BE735E',
    cor4: '#6B3028',
    cor5: '#B35227',
    cor6: '#C1908A',
    white: '#ffffff',
    grayLight: '#f8f9fa',
    textDark: '#1a1a1a',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    fontSizeH1: '48px',
    fontSizeH2: '36px',
    fontSizeH3: '24px',
    fontSizeH4: '20px'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [migrationProjectId, setMigrationProjectId] = useState('');

  useEffect(() => {
    getSettings().then(data => {
      if (data.global) {
        setSettings(prev => ({ ...prev, ...data.global }));
      }
      setLoading(false);
    });
  }, []);

  const handleMigrate = async () => {
    if (!migrationProjectId) {
      alert('Selecione um projeto de destino para as mídias.');
      return;
    }

    if (!confirm('Esta ação vinculará todas as mídias sem projeto ao projeto selecionado. Deseja continuar?')) return;

    setMigrating(true);
    try {
      const count = await migrateLegacyMedia(migrationProjectId);
      alert(`${count} mídias foram vinculadas com sucesso ao projeto.`);
    } catch (err) {
      console.error(err);
      alert('Erro durante a migração.');
    } finally {
      setMigrating(false);
    }
  };

  const handleFullSync = async () => {
    console.log("[DEBUG] Iniciando sincronização via UI");
    setSyncing(true);
    setSyncLogs(['Iniciando varredura global...']);
    setShowConfirm(false);

    try {
      // Sincroniza pasta 'media'
      const itemsMedia = await syncStorageWithFirestore('media', undefined, undefined, (msg) => {
        setSyncLogs(prev => [...prev, msg].slice(-40));
      });
      
      // Sincroniza pasta 'Projetos'
      setSyncLogs(prev => [...prev, '🔎 Varrendo pasta adicional: "Projetos"...']);
      const itemsProjetos = await syncStorageWithFirestore('Projetos', undefined, undefined, (msg) => {
        setSyncLogs(prev => [...prev, msg].slice(-40));
      });

      const totalItems = itemsMedia.length + itemsProjetos.length;
      setSyncLogs(prev => [...prev, `✅ Sincronização concluída! ${totalItems} novos itens encontrados.`]);
      
      // Oferecer reparo automático após sincronizar novos arquivos
      if (totalItems > 0) {
        if (confirm(`Encontrei ${totalItems} novos arquivos. Deseja tentar reparar automaticamente os links quebrados nos projetos que usam esses nomes de arquivo?`)) {
          handleRepair();
        }
      }
    } catch (err) {
      console.error(err);
      setSyncLogs(prev => [...prev, `❌ Erro: ${err instanceof Error ? err.message : 'Falha desconhecida'}`]);
    } finally {
      setSyncing(false);
    }
  };

  const handleRepair = async () => {
    setRepairing(true);
    setSyncLogs(prev => [...prev, 'Iniciando reparo de links...']);
    try {
      const count = await repairProjectLinks((msg) => {
        setSyncLogs(prev => [...prev, msg].slice(-40));
      });
      console.log(`Reparo concluído em ${count} projetos`);
    } catch (err) {
      console.error(err);
    } finally {
      setRepairing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings('global', settings);
      alert('Configurações globais salvas!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleMaintenance = async () => {
    const newMode = !settings.maintenanceMode;
    // Update local state first for instant UI feedback
    setSettings(prev => ({ ...prev, maintenanceMode: newMode }));
    
    try {
      // Save to database immediately
      await updateSettings('global', { ...settings, maintenanceMode: newMode });
      // We don't need a loud alert here, just a subtle console log or nothing
      console.log(`Modo manutenção: ${newMode ? 'Ativado' : 'Desativado'}`);
    } catch (err) {
      console.error("Erro ao salvar modo manutenção:", err);
      // Revert state if save fails
      setSettings(prev => ({ ...prev, maintenanceMode: !newMode }));
      alert('Falha ao alterar modo manutenção no servidor.');
    }
  };

  const ColorInput = ({ label, value, onChange, id }: { label: string, value: string, onChange: (val: string) => void, id: string }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
        {label}
      </label>
      <div className="flex gap-3 items-center">
        <input 
          type="color"
          className="w-10 h-10 bg-transparent border-none rounded-[8px] cursor-pointer"
          value={value.startsWith('#') ? value : '#000000'}
          onChange={e => onChange(e.target.value)}
        />
        <input 
          className="flex-1 bg-zinc-950 border border-white/5 rounded-[8px] px-4 py-2 text-sm focus:outline-none focus:border-accent font-mono uppercase"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
    </div>
  );

  if (loading) return <div className="animate-pulse text-zinc-500">Carregando configurações...</div>;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Configurações Master</h2>
          <p className="text-zinc-500">Gestão de Identidade Visual e Dados Globais.</p>
        </div>
        <button 
          disabled={saving}
          onClick={handleSave}
          className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-[8px] hover:bg-accent hover:text-black transition disabled:opacity-50 flex items-center gap-3 text-sm shadow-xl shadow-white/5"
        >
          {saving ? 'Gravando...' : <><Save size={18} /> Salvar Tudo</>}
        </button>
      </header>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Contato Principal & Fontes */}
        <div className="md:col-span-1 space-y-8">
          {/* MODO DE MANUTENÇÃO */}
          <div className="glass-morphism p-8 rounded-[8px] border border-white/5 space-y-6 bg-white/[0.02]">
            <h3 className="font-bold flex items-center gap-2 mb-2 text-white/50 text-xs uppercase tracking-widest">
              <ShieldCheck size={14} /> Manutenção
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-[8px] border border-white/5">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Ativar Modo</span>
              <button 
                onClick={toggleMaintenance}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.maintenanceMode ? 'bg-accent' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Título da Mensagem</label>
              <input 
                className="w-full bg-zinc-950 border border-white/5 rounded-[8px] px-5 py-3 focus:outline-none focus:border-accent"
                placeholder="Ex: Sob manutenção, até breve!"
                value={settings.maintenanceTitle}
                onChange={e => setSettings({ ...settings, maintenanceTitle: e.target.value })}
              />
            </div>
            
            <p className="text-[10px] text-zinc-500 leading-relaxed italic">
              * Quando ativo, visitantes verão apenas a tela de manutenção. Administradores logados continuam tendo acesso ao site.
            </p>
          </div>

          {/* MANUTENÇÃO DE BANCO DE DADOS */}
          <div className="glass-morphism p-8 rounded-[8px] border border-white/5 space-y-6 bg-red-500/[0.02]">
            <h3 className="font-bold flex items-center gap-2 mb-2 text-red-500/50 text-xs uppercase tracking-widest">
              <Database size={14} /> Banco de Dados
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Projeto Alvo (Migração)</label>
                <select 
                  className="w-full bg-zinc-950 border border-white/5 rounded-[8px] px-5 py-3 focus:outline-none focus:border-accent text-zinc-400 text-xs"
                  value={migrationProjectId}
                  onChange={e => setMigrationProjectId(e.target.value)}
                >
                  <option value="">Selecione um projeto...</option>
                  {(projects || []).map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleMigrate}
                disabled={migrating || !migrationProjectId}
                className="w-full py-4 bg-zinc-900 border border-white/5 text-zinc-300 hover:bg-accent hover:text-black font-black uppercase text-[10px] tracking-widest rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {migrating ? 'Processando...' : <><Zap size={14} /> Corrigir Mídias Órfãs</>}
              </button>

              <div className="pt-4 border-t border-white/5 space-y-4">
                {!showConfirm ? (
                  <button 
                    onClick={() => setShowConfirm(true)}
                    disabled={syncing}
                    className="w-full py-4 bg-accent text-black font-black uppercase text-[10px] tracking-widest rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-accent/20"
                  >
                    {syncing ? <RefreshCw size={14} className="animate-spin" /> : <><RefreshCw size={14} /> Sincronizar Tudo do Storage</>}
                  </button>
                ) : (
                  <div className="p-4 bg-zinc-950 border border-accent/20 rounded-lg space-y-3">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold text-center">Confirmar varredura total?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleFullSync}
                        className="flex-1 py-3 bg-accent text-black font-black uppercase text-[10px] rounded-md shadow-lg shadow-accent/20"
                      >
                        Sim, Iniciar
                      </button>
                      <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-3 bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] rounded-md"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleRepair}
                  disabled={repairing || syncing}
                  className="w-full py-4 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white font-black uppercase text-[10px] tracking-widest rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  {repairing ? <RefreshCw size={14} className="animate-spin" /> : <><RefreshCw size={14} /> Reparar Links de Projetos</>}
                </button>

                {/* AREA DE LOGS EM TEMPO REAL */}
                {(syncLogs.length > 0 || syncing) && (
                  <div className="p-3 bg-black rounded border border-white/5 font-mono text-[9px] text-zinc-500 max-h-32 overflow-y-auto space-y-1">
                    {syncLogs.map((log, i) => (
                      <div key={i} className={log.startsWith('✅') ? 'text-green-500' : log.startsWith('❌') ? 'text-red-500' : ''}>
                        {log}
                      </div>
                    ))}
                    {syncing && <div className="animate-pulse">Varrendo pastas...</div>}
                  </div>
                )}

                <p className="text-[9px] text-zinc-500 uppercase tracking-tighter text-center">
                  Varre as pastas: <b>media/projeto-nome/</b>
                </p>
              </div>
            </div>
            
            <p className="text-[9px] text-zinc-600 leading-relaxed">
              Vincule imagens antigas (sem ID de projeto) ao projeto selecionado para que apareçam na biblioteca correta.
            </p>
          </div>

          <div className="glass-morphism p-8 rounded-[8px] border border-white/5 space-y-6 bg-white/[0.02]">
            <h3 className="font-bold flex items-center gap-2 mb-2 text-white/50 text-xs uppercase tracking-widest">
              <Phone size={14} /> Contato
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">WhatsApp</label>
              <input 
                className="w-full bg-zinc-950 border border-white/5 rounded-[8px] px-5 py-3 focus:outline-none focus:border-accent"
                placeholder="55XXXXXXXXXXX"
                value={settings.whatsappNumber}
                onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="glass-morphism p-8 rounded-[8px] border border-white/5 space-y-8 bg-white/[0.02]">
            <h3 className="font-bold flex items-center gap-2 mb-2 text-white/50 text-xs uppercase tracking-widest">
              <Type size={14} /> Tipografia (PX)
            </h3>
            
            <div className="flex flex-col gap-6">
              {[
                { id: 'fontSizeH1', label: 'H1 (Título)' },
                { id: 'fontSizeH2', label: 'H2 (Subtítulos)' },
                { id: 'fontSizeH3', label: 'H3 (Seções)' },
                { id: 'fontSizeH4', label: 'H4 (Cards)' },
              ].map(font => (
                <div key={font.id} className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">{font.label}</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range"
                      min="10"
                      max="120"
                      step="1"
                      className="flex-1 accent-accent h-1.5 bg-zinc-900 rounded-[8px] appearance-none cursor-pointer"
                      value={parseInt(settings[font.id as keyof SiteSettings] as string || '16')}
                      onChange={e => setSettings({ ...settings, [font.id]: `${e.target.value}px` })}
                    />
                    <span className="text-[11px] font-mono bg-zinc-900 px-2 py-1 rounded border border-white/10 min-w-[40px] text-center text-accent">
                      {settings[font.id as keyof SiteSettings]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Paleta de Cores Acadêmica */}
        <div className="md:col-span-2 glass-morphism p-8 rounded-[8px] border border-white/5 space-y-8 bg-white/[0.02]">
          <h3 className="font-bold flex items-center gap-2 mb-2 text-white/50 text-xs uppercase tracking-widest">
            <Palette size={14} /> Paleta de Cores & Estilo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <ColorInput label="Acento Primário (Cor 1)" value={settings.cor1 || settings.accentColor} onChange={val => setSettings({ ...settings, cor1: val, accentColor: val })} id="cor1" />
            <ColorInput label="Texto Escuro (Cor 2)" value={settings.cor2 || ''} onChange={val => setSettings({ ...settings, cor2: val })} id="cor2" />
            <ColorInput label="Acento Secundário (Cor 3)" value={settings.cor3 || ''} onChange={val => setSettings({ ...settings, cor3: val })} id="cor3" />
            <ColorInput label="Terciário Escuro (Cor 4)" value={settings.cor4 || ''} onChange={val => setSettings({ ...settings, cor4: val })} id="cor4" />
            <ColorInput label="Vívido (Cor 5)" value={settings.cor5 || ''} onChange={val => setSettings({ ...settings, cor5: val })} id="cor5" />
            <ColorInput label="Suave (Cor 6)" value={settings.cor6 || ''} onChange={val => setSettings({ ...settings, cor6: val })} id="cor6" />
            <ColorInput label="Branco" value={settings.white || ''} onChange={val => setSettings({ ...settings, white: val })} id="white" />
            <ColorInput label="Cinza Claro" value={settings.grayLight || ''} onChange={val => setSettings({ ...settings, grayLight: val })} id="grayLight" />
            <ColorInput label="Texto Dark" value={settings.textDark || ''} onChange={val => setSettings({ ...settings, textDark: val })} id="textDark" />
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Sombra (CSS Shadow)</label>
              <input 
                className="w-full bg-zinc-950 border border-white/5 rounded-[8px] px-5 py-3 focus:outline-none focus:border-accent text-sm"
                value={settings.shadow}
                onChange={e => setSettings({ ...settings, shadow: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
