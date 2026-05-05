import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, ChevronRight, AlertCircle } from 'lucide-react';
import { Project } from '../types';

interface ProjectPasswordModalProps {
  project: Project | null;
  onClose: () => void;
  onSuccess: (project: Project) => void;
}

export const ProjectPasswordModal: React.FC<ProjectPasswordModalProps> = ({ project, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === project.password || password === 'admin123') { // admin123 as master override
      onSuccess(project);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[12px] p-8 shadow-2xl flex flex-col items-center text-center space-y-6"
        >
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-2">
            <Lock size={32} />
          </div>

          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest mb-2">Acesso Restrito</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">
              O projeto <span className="text-white font-bold">{project.title}</span> está protegido.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha..."
                autoFocus
                className={`w-full bg-black/50 border ${error ? 'border-red-500' : 'border-white/10'} rounded-[8px] py-4 px-10 text-center text-accent placeholder:text-zinc-700 focus:outline-none focus:border-accent/50 transition-all`}
              />
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest"
              >
                <AlertCircle size={12} />
                Senha Incorreta
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-accent text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-[8px] flex items-center justify-center gap-2 hover:bg-white transition-all group"
            >
              Acessar Projeto
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            Voltar para Galeria
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
