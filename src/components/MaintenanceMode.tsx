import React from 'react';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';

interface MaintenanceModeProps {
  title?: string;
}

export const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ title }) => {
  const { login, loading } = useAuth();

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-black">
      <div className="relative z-10 w-full max-w-xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-24"
        >
          {/* Logo pulsante integrada ao fluxo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="animate-pulse"
          >
            <h2 className="text-xl md:text-2xl font-bold tracking-tighter uppercase text-white">
              Ingrid <span className="text-accent">Sinkovitz</span>
            </h2>
            <p className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] opacity-30 font-bold text-white mt-1">
              Estratégia | Planejamento | Gestão
            </p>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-white uppercase">
              {title || 'Sob manutenção'}
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm font-light tracking-[0.2em] uppercase max-w-md mx-auto">
              Voltaremos em breve
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={login}
              disabled={loading}
              className="px-6 py-3 bg-accent text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-[8px] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(242,187,50,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={14} /> Acesso Administrativo</>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Marca Ingrid Sinkovitz sutil no rodapé */}
      <div className="absolute bottom-10 left-0 w-full text-center z-10">
        <p className="text-[9px] font-black tracking-[0.5em] text-white opacity-10 uppercase">
          © 2026 INGRID SINKOVITZ
        </p>
      </div>
    </div>
  );
};
