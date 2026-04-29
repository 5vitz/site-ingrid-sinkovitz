import React, { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { Service } from '../../types';
import { updateService, deleteService } from '../../services/dataService';
import { Plus, Trash2, Edit2, CheckCircle2, Save, X } from 'lucide-react';
import { motion } from 'motion/react';

export const ServiceManager = () => {
  const { data: services, loading } = useCollection<Service>('services');
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  const handleSave = async () => {
    if (!editingService?.title) return;
    const id = editingService.id || `service_${Date.now()}`;
    await updateService(id, {
      ...editingService,
      order: editingService.order || services.length + 1,
      items: editingService.items || []
    });
    setEditingService(null);
  };

  if (loading) return <div>Carregando serviços...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Serviços</h2>
        <button 
          onClick={() => setEditingService({ title: '', items: [''] })}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-semibold rounded-[8px] hover:bg-accent/80 transition"
        >
          <Plus size={18} /> Novo Serviço
        </button>
      </div>

      {editingService && (
        <div className="glass-morphism p-6 rounded-[8px] space-y-4">
          <input 
            className="w-full bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 text-xl font-bold"
            value={editingService.title}
            onChange={e => setEditingService({ ...editingService, title: e.target.value })}
            placeholder="Título do Serviço"
          />
          <div className="space-y-2">
            <label className="text-sm text-zinc-500">Itens / Especialidades (um por linha)</label>
            <textarea 
              className="w-full bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 h-32 resize-none"
              value={editingService.items?.join('\n')}
              onChange={e => setEditingService({ ...editingService, items: e.target.value.split('\n') })}
              placeholder="Ex: Edição para TikTok&#10;Color Grading&#10;Sound Design"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditingService(null)} className="px-4 py-2">Cancelar</button>
            <button onClick={handleSave} className="px-6 py-2 bg-white text-black font-bold rounded-[8px] hover:bg-zinc-200">Salvar</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {services.map(s => (
          <div key={s.id} className="glass-morphism p-6 rounded-[8px] group relative">
            <h3 className="text-xl font-bold text-accent mb-4">{s.title}</h3>
            <ul className="space-y-1">
              {s.items.map((item, i) => (
                <li key={i} className="text-sm text-zinc-400 flex items-center gap-2"><CheckCircle2 size={14} className="text-accent" /> {item}</li>
              ))}
            </ul>
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => setEditingService(s)} 
                className="p-3 bg-white/5 hover:bg-accent hover:text-black rounded-[8px] transition-all shadow-lg"
                title="Editar Serviço"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => {
                  if(confirm('Tem certeza que deseja excluir este serviço?')) deleteService(s.id);
                }} 
                className="p-3 bg-red-600/5 hover:bg-red-600 hover:text-white rounded-[8px] transition-all shadow-lg text-red-500 hover:text-white"
                title="Excluir Serviço"
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
