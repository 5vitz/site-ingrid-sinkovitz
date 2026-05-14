import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/dataService';
import { SiteSettings } from '../../types';
import { Save, Link as LinkIcon, Instagram, Linkedin, Mail, MessageSquare } from 'lucide-react';

export const ContactManager = () => {
  const [settings, setSettings] = useState<SiteSettings>({ 
    whatsappNumber: '', 
    linkedinUrl: '',
    instagramUrl: '',
    emailContact: '',
    accentColor: '#f29232'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(data => {
      if (data.global) {
        setSettings(prev => ({ ...prev, ...data.global }));
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings('global', settings);
      alert('Informações de contato salvas!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse text-zinc-500">Carregando contatos...</div>;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Gestão de Contato</h2>
          <p className="text-zinc-500">Configure seus links de redes sociais e canais de atendimento.</p>
        </div>
        <button 
          disabled={saving}
          onClick={handleSave}
          className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-[8px] hover:bg-accent hover:text-black transition disabled:opacity-50 flex items-center gap-3 text-sm shadow-xl shadow-white/5"
        >
          {saving ? 'Gravando...' : <><Save size={18} /> Salvar Alterações</>}
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-morphism p-8 rounded-[12px] border border-white/5 space-y-6 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-full text-accent">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold text-lg">Canais Diretos</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 italic block">WhatsApp (Somente números)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-mono">+</span>
                <input 
                  className="w-full bg-zinc-950 border border-white/5 rounded-[8px] pl-8 pr-5 py-3 focus:outline-none focus:border-accent font-mono"
                  placeholder="5527999999999"
                  value={settings.whatsappNumber}
                  onChange={e => setSettings({ ...settings, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 italic block">E-mail de Contato</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  className="w-full bg-zinc-950 border border-white/5 rounded-[8px] pl-12 pr-5 py-3 focus:outline-none focus:border-accent"
                  placeholder="seu@email.com"
                  value={settings.emailContact}
                  onChange={e => setSettings({ ...settings, emailContact: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-morphism p-8 rounded-[12px] border border-white/5 space-y-6 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 rounded-full text-accent">
              <LinkIcon size={20} />
            </div>
            <h3 className="font-bold text-lg">Redes Sociais</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 italic block">LinkedIn (URL Completa)</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  className="w-full bg-zinc-950 border border-white/5 rounded-[8px] pl-12 pr-5 py-3 focus:outline-none focus:border-accent"
                  placeholder="https://linkedin.com/in/..."
                  value={settings.linkedinUrl}
                  onChange={e => setSettings({ ...settings, linkedinUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 italic block">Instagram (URL Completa)</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  className="w-full bg-zinc-950 border border-white/5 rounded-[8px] pl-12 pr-5 py-3 focus:outline-none focus:border-accent"
                  placeholder="https://instagram.com/..."
                  value={settings.instagramUrl}
                  onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 p-6 rounded-[12px] border border-dashed border-white/10 text-center">
        <p className="text-sm text-zinc-500 italic">Essas informações são refletidas no rodapé e em links de contato do site.</p>
      </div>
    </div>
  );
};
