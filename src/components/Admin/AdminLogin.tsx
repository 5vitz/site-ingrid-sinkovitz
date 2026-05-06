import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldCheck, LogIn, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AdminLoginProps {
  onClose?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose }) => {
  const { login, user, role, loading, logout } = useAuth();
  
  if (user && role && !onClose) return <Navigate to="/admin" />;
  
  return (
    <div className={`flex items-center justify-center p-4 ${onClose ? 'fixed inset-0 z-[15000] bg-black/98 backdrop-blur-2xl' : 'h-screen bg-zinc-950'}`}>
      <div className="bg-zinc-900/40 backdrop-blur-md p-12 rounded-[8px] max-w-md w-full text-center space-y-8 relative overflow-hidden border border-white/5">
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-all hover:rotate-90"
          >
            <X size={24} />
          </button>
        )}

        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="w-20 h-20 bg-accent/20 text-accent mx-auto rounded-full flex items-center justify-center shadow-[0_0_40px_-10px_rgba(var(--accent-rgb),0.3)]">
            <ShieldCheck size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tighter">Painel Restrito</h2>
            <p className="text-zinc-500 text-sm font-medium">Acesso restrito para administradores e suporte técnico.</p>
          </div>

          {user && role ? (
            <div className="space-y-6">
              <div className="py-4 px-6 bg-accent/10 border border-accent/20 rounded-[8px] flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-accent font-black uppercase tracking-widest text-[10px]">Portal de Acesso Livre</span>
                </div>
                <span className="text-white/60 text-[11px] font-medium truncate w-full">{user.email}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/admin" 
                  className="py-4 bg-accent text-black font-black tracking-widest text-[9px] rounded-[8px] hover:bg-white transition-all text-center"
                >
                  Painel Admin
                </Link>
                <button 
                  onClick={logout}
                  className="py-4 bg-zinc-800 text-white font-black tracking-widest text-[9px] rounded-[8px] hover:bg-zinc-700 transition-all"
                >
                  Sair da Conta
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={login}
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black tracking-[0.2em] text-[11px] rounded-[8px] flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={20} /> Entrar com Google</>
              )}
            </button>
          )}

          <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-[0.3em]">
            Ambiente Seguro Scalla Records
          </p>
        </div>
      </div>
    </div>
  );
};
