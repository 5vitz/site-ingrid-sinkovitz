import React, { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { Testimonial } from '../../types';
import { addTestimonial, updateTestimonial, deleteTestimonial } from '../../services/dataService';
import { Plus, Trash2, Edit2, User, Save, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export const TestimonialManager = () => {
  const { data: testimonials, loading } = useCollection<Testimonial>('testimonials');
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);

  const handleSave = async () => {
    if (!editing?.author || !editing?.text) return;
    try {
      if (editing.id) {
        await updateTestimonial(editing.id, editing);
      } else {
        await addTestimonial(editing as Omit<Testimonial, 'id'>);
      }
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="animate-pulse text-zinc-500">Carregando depoimentos...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Depoimentos</h2>
        <button 
          onClick={() => setEditing({ author: '', role: '', text: '', photoUrl: '' })}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-[8px] hover:bg-accent/80 transition shadow-lg shadow-accent/20"
        >
          <Plus size={18} /> Novo Depoimento
        </button>
      </div>

      {editing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism p-8 rounded-[8px] border-accent/20 border-2 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-400">Nome do Autor</label>
                <input 
                  className="w-full bg-zinc-950 border border-white/10 rounded-[8px] px-5 py-3 mt-1 focus:outline-none focus:border-accent"
                  value={editing.author}
                  onChange={e => setEditing({ ...editing, author: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-400">Cargo / Relação</label>
                <input 
                  className="w-full bg-zinc-950 border border-white/10 rounded-[8px] px-5 py-3 mt-1 focus:outline-none focus:border-accent"
                  value={editing.role}
                  onChange={e => setEditing({ ...editing, role: e.target.value })}
                  placeholder="Ex: Diretor de Marketing"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-400">URL da Foto</label>
                <input 
                  className="w-full bg-zinc-950 border border-white/10 rounded-[8px] px-5 py-3 mt-1 focus:outline-none focus:border-accent"
                  value={editing.photoUrl}
                  onChange={e => setEditing({ ...editing, photoUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-zinc-400">Texto do Depoimento</label>
            <textarea 
              className="w-full bg-zinc-950 border border-white/10 rounded-[8px] px-5 py-4 mt-1 h-32 resize-none focus:outline-none focus:border-accent"
              value={editing.text}
              onChange={e => setEditing({ ...editing, text: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setEditing(null)} className="px-6 py-3 text-zinc-400 hover:text-white transition font-medium">Cancelar</button>
            <button 
              onClick={handleSave}
              className="px-10 py-3 bg-white text-black font-black uppercase tracking-widest rounded-[8px] hover:bg-zinc-200 transition"
            >
              <Save size={18} className="inline mr-2" /> Salvar
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="glass-morphism p-8 rounded-[8px] group relative border border-white/5 hover:border-accent/40 transition-colors">
            <Quote className="absolute top-6 right-8 text-accent/20" size={40} />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-zinc-800 rounded-full overflow-hidden border border-white/10">
                {t.photoUrl ? <img src={t.photoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-500"><User size={20}/></div>}
              </div>
              <div>
                <h4 className="font-bold text-white">{t.author}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{t.role}</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4">"{t.text}"</p>
            
            <div className="flex justify-end gap-2 pt-4 border-t border-white/5 opacity-40 group-hover:opacity-100 transition">
              <button 
                onClick={() => setEditing(t)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-[8px] text-zinc-400 hover:text-white transition"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => deleteTestimonial(t.id)}
                className="p-3 bg-red-600/5 hover:bg-red-600/20 rounded-[8px] text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
