import React from 'react';
import { ShieldCheck, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

interface MaintenanceModeProps {
  title?: string;
}

export const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ title }) => {
  const { login, loading } = useAuth();

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-black">
      {/* Imagem de Fundo com Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0706232208.firebasestorage.app/o/Assets%2Fmaintenance.jpg?alt=media" 
          alt="Manutenção"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="w-20 h-20 bg-accent/20 text-accent mx-auto rounded-full flex items-center justify-center animate-pulse">
            <ShieldCheck size={40} />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white uppercase">
              {title || 'Sob manutenção, até breve!'}
            </h1>
            <p className="text-zinc-400 text-lg font-light tracking-wide max-w-md mx-auto">
              Estamos preparando novidades incríveis para você. Voltaremos em breve com o conteúdo atualizado.
            </p>
          </div>

          <div className="pt-8 flex flex-col items-center gap-4">
            <button 
              onClick={login}
              disabled={loading}
              className="px-8 py-4 bg-accent text-black font-black uppercase tracking-[0.2em] text-xs rounded-[8px] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(242,187,50,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Acesso Administrativo</>
              )}
            </button>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              Restrito para administradores autorizados
            </p>
          </div>
        </motion.div>
      </div>

      {/* Marca Ingrid Sinkovitz */}
      <div className="absolute bottom-10 left-0 w-full text-center z-10">
        <p className="text-xs font-black tracking-[0.5em] text-white opacity-20 uppercase">
          Ingrid Sinkovitz
        </p>
      </div>
    </div>
  );
};
