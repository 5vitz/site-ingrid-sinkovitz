import React, { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { Project, MediaItem, LayoutType, MediaType } from '../../types';
import { addProject, updateProject, deleteProject } from '../../services/dataService';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, Image as ImageIcon, Video, FileText, Link as LinkIcon, Save, X, Eye, LayoutGrid } from 'lucide-react';
import { motion, Reorder } from 'motion/react';

export const ProjectManager = () => {
  const { data: projects, loading } = useCollection<Project>('projects');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = async () => {
    if (!editingProject?.title || !editingProject?.layoutType) return;

    try {
      if (editingProject.id) {
        await updateProject(editingProject.id, editingProject);
      } else {
        await addProject({
          ...editingProject as Omit<Project, 'id'>,
          order: projects.length + 1,
          mediaItems: editingProject.mediaItems || []
        });
      }
      setEditingProject(null);
      setIsAdding(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  if (loading) return <div>Carregando projetos...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Projetos</h2>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingProject({ title: '', layoutType: 'vertical', mediaItems: [] });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-semibold rounded-[8px] hover:bg-accent/80 transition"
        >
          <Plus size={18} /> Novo Projeto
        </button>
      </div>

      {(isAdding || editingProject) && (
        <ProjectForm 
          project={editingProject!} 
          onSave={handleSave} 
          onCancel={() => { setEditingProject(null); setIsAdding(false); }} 
          onChange={setEditingProject}
        />
      )}

      <div className="grid gap-4">
        {projects.map((p) => (
          <div key={p.id} className="glass-morphism p-4 rounded-[8px] flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-zinc-800 rounded-[8px] overflow-hidden border border-white/5">
                {p.galleryThumbnail && <img src={p.galleryThumbnail} className="w-full h-full object-cover" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <span className="text-xs uppercase tracking-widest text-zinc-500">{p.layoutType}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setEditingProject(p)} 
                className="p-3 bg-white/5 hover:bg-accent hover:text-black rounded-[8px] transition-all shadow-lg"
                title="Editar Projeto"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => {
                  if(confirm('Tem certeza que deseja excluir este projeto?')) deleteProject(p.id);
                }} 
                className="p-3 bg-red-600/5 hover:bg-red-600 hover:text-white rounded-[8px] transition-all shadow-lg text-red-500 hover:text-white"
                title="Excluir Projeto"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onCancel, onChange }: { 
  project: Partial<Project>, 
  onSave: () => void, 
  onCancel: () => void,
  onChange: (p: Partial<Project>) => void
}) => {
  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({ type: 'video', url: '' });

  const addMediaItem = () => {
    if (!newMedia.url) return;
    const items = [...(project.mediaItems || []), { ...newMedia, order: (project.mediaItems?.length || 0) + 1 } as MediaItem];
    onChange({ ...project, mediaItems: items });
    setNewMedia({ type: 'video', url: '' });
  };

  const removeMediaItem = (index: number) => {
    const items = project.mediaItems?.filter((_, i) => i !== index);
    onChange({ ...project, mediaItems: items });
  };

  const moveMediaItem = (index: number, direction: 'up' | 'down') => {
    if (!project.mediaItems) return;
    const newItems = [...project.mediaItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    
    [newItems[index], newItems[targetIdx]] = [newItems[targetIdx], newItems[index]];
    
    // Update orders
    const finalItems = newItems.map((item, i) => ({ ...item, order: i + 1 }));
    onChange({ ...project, mediaItems: finalItems });
  };

  const handleReorder = (newItems: MediaItem[]) => {
    const finalItems = newItems.map((item, i) => ({ ...item, order: i + 1 }));
    onChange({ ...project, mediaItems: finalItems });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-8 rounded-[8px] border-accent/20 border-2 space-y-8"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Título do Projeto</label>
            <input 
              className="w-full bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 focus:outline-none focus:border-accent"
              value={project.title}
              onChange={e => onChange({ ...project, title: e.target.value })}
              placeholder="Ex: EloBike Bahia"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Tipo de Layout</label>
            <div className="flex gap-2">
              {(['vertical', 'horizontal'] as LayoutType[]).map(type => (
                <button
                  key={type}
                  onClick={() => onChange({ ...project, layoutType: type })}
                  className={`flex-1 py-3 rounded-[8px] border transition capitalize ${project.layoutType === type ? 'bg-accent text-black border-accent' : 'bg-transparent border-white/10 text-zinc-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Trilha Sonora (URL do Áudio)</label>
            <input 
              className="w-full bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 focus:outline-none focus:border-accent"
              value={project.audioUrl || ''}
              onChange={e => onChange({ ...project, audioUrl: e.target.value })}
              placeholder="Link para o arquivo .mp3 ou .wav"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Foto-Link (Capa Galeria)</label>
            <input 
              className="w-full bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 focus:outline-none focus:border-accent"
              value={project.galleryThumbnail || ''}
              onChange={e => onChange({ ...project, galleryThumbnail: e.target.value })}
              placeholder="URL da imagem de capa"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Quick View (Resumo)</label>
            <textarea 
              className="w-full bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 focus:outline-none focus:border-accent h-32 resize-none"
              value={project.description || ''}
              onChange={e => onChange({ ...project, description: e.target.value })}
              placeholder="Breve descrição que aparece ao clicar no projeto"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/5 pt-8">
        <h4 className="text-lg font-semibold flex items-center gap-2"><LayoutGrid size={20} /> Mídias do Reel</h4>
        
        <div className="flex gap-2">
          <select 
            className="bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 focus:outline-none"
            value={newMedia.type}
            onChange={e => setNewMedia({ ...newMedia, type: e.target.value as MediaType })}
          >
            <option value="video">Vídeo</option>
            <option value="image">Imagem</option>
            <option value="text">Texto</option>
            <option value="link">Link</option>
          </select>
          <input 
            className="flex-1 bg-zinc-900 border border-white/10 rounded-[8px] px-4 py-3 focus:outline-none"
            value={newMedia.url}
            onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
            placeholder="URL da mídia ou conteúdo de texto"
          />
          <button 
            onClick={addMediaItem}
            className="px-6 bg-white text-black font-bold rounded-[8px] hover:bg-zinc-200 transition"
          >
            Adicionar
          </button>
        </div>

        <Reorder.Group 
          axis="y" 
          values={project.mediaItems || []} 
          onReorder={handleReorder}
          className="space-y-3"
        >
           {project.mediaItems?.map((item, idx) => (
             <Reorder.Item 
                key={`${item.type}-${item.url}-${idx}`} 
                value={item}
                className="glass-morphism p-4 rounded-[8px] flex items-center justify-between group border border-white/5 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-xs font-black text-accent bg-accent/10 w-6 h-6 flex items-center justify-center rounded-full">
                      {idx + 1}
                    </span>
                  </div>
                  
                  <div className="w-12 h-16 bg-zinc-900 rounded-[8px] overflow-hidden border border-white/5 flex items-center justify-center shrink-0">
                    {item.type === 'image' && <img src={item.url} className="w-full h-full object-cover" />}
                    {item.type === 'video' && <Video size={20} className="text-zinc-600" />}
                    {item.type === 'text' && <FileText size={20} className="text-zinc-600" />}
                    {item.type === 'link' && <LinkIcon size={20} className="text-zinc-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-accent font-bold mb-1">{item.type}</div>
                    <div className="text-sm text-zinc-400 truncate font-mono bg-black/20 px-2 py-1 rounded-[8px]">
                      {item.url}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); moveMediaItem(idx, 'up'); }}
                      disabled={idx === 0}
                      className="p-1.5 hover:bg-white/10 rounded-[8px] disabled:opacity-20 transition"
                    >
                      <MoveUp size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); moveMediaItem(idx, 'down'); }}
                      disabled={idx === (project.mediaItems?.length || 0) - 1}
                      className="p-1.5 hover:bg-white/10 rounded-[8px] disabled:opacity-20 transition"
                    >
                      <MoveDown size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeMediaItem(idx); }} 
                    className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-[8px] transition-all"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
             </Reorder.Item>
           ))}
        </Reorder.Group>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <button onClick={onCancel} className="px-6 py-3 text-zinc-400 hover:text-white transition">Cancelar</button>
        <button 
          onClick={onSave}
          className="px-10 py-3 bg-accent text-black font-bold rounded-[8px] flex items-center gap-2 hover:bg-accent/80 transition"
        >
          <Save size={18} /> Salvar Projeto
        </button>
      </div>
    </motion.div>
  );
};
