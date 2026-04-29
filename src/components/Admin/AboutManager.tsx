import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/dataService';
import { AboutMe } from '../../types';
import { Save, Play, FileText, Video } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutManager = () => {
  const [about, setAbout] = useState<AboutMe>({ description: '', videoUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(data => {
      if (data.sobre) setAbout(data.sobre);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings('sobre', about);
      alert('Seção "Sobre Mim" atualizada com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse text-zinc-500">Carregando dados da seção Sobre...</div>;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sobre Mim</h2>
        <p className="text-zinc-500">Configure sua bio e o vídeo cinematográfico de destaque da Home.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-morphism p-8 rounded-[8px] border border-white/5 space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
                <FileText size={16} /> Descrição / Bio Curta
              </label>
              <textarea 
                className="w-full bg-zinc-950 border border-white/10 rounded-[8px] px-5 py-4 h-48 resize-none focus:outline-none focus:border-accent transition"
                placeholder="Conte quem você é e sua proposta de valor..."
                value={about.description}
                onChange={e => setAbout({ ...about, description: e.target.value })}
              />
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Aparece na seção inicial (Hero) sobrepondo o vídeo.</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
                <Video size={16} /> Link do Vídeo (Google Drive ou MP4)
              </label>
              <input 
                className="w-full bg-zinc-950 border border-white/10 rounded-[8px] px-5 py-3 focus:outline-none focus:border-accent transition"
                placeholder="https://drive.google.com/file/d/..."
                value={about.videoUrl}
                onChange={e => setAbout({ ...about, videoUrl: e.target.value })}
              />
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-justify">
                Dica: O vídeo rodará em loop e sem áudio na Home. O link do Drive será convertido automaticamente.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-morphism p-8 rounded-[8px] border border-white/5 bg-zinc-900/40">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Play size={16} className="text-accent" /> Preview Visual
            </h3>
            <div className="aspect-video bg-black rounded-[8px] overflow-hidden relative border border-white/5">
              {about.videoUrl ? (
                <iframe 
                  src={`${about.videoUrl.replace('/view', '/preview')}?autoplay=1&mute=1&controls=0&loop=1`}
                  className="w-full h-full scale-125 pointer-events-none opacity-60"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs text-center p-4 italic">
                  Nenhum vídeo configurado ainda
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <p className="text-[10px] text-white text-center font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm p-4 rounded-[8px]">
                  {about.description.substring(0, 50)}...
                </p>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed">
              Este é um esboço de como a composição do vídeo com o texto aparecerá para o visitante.
            </p>
          </div>

          <button 
            disabled={saving}
            onClick={handleSave}
            className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest rounded-[8px] shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {saving ? 'Salvando...' : <><Save size={20} /> Salvar Alterações</>}
          </button>
        </div>
      </div>
    </div>
  );
};
