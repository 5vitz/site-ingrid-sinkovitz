import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Maintenance: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const authorizedEmails = ['sinkando@gmail.com', 'ingridsinkovitz@gmail.com.br'];

    if (!authorizedEmails.includes(normalizedEmail)) {
      setError('E-mail não autorizado para acesso restrito.');
      return;
    }

    // Senha de acesso temporária para visualização do site
    if (password !== 'Ingrid2026!') {
      setError('Senha incorreta.');
      return;
    }

    // Armazena a autorização localmente e redireciona
    localStorage.setItem('ingrid_access_token', 'true');
    localStorage.setItem('ingrid_user_email', normalizedEmail);
    
    // Se for o administrador principal, podemos salvar isso também
    navigate('/');
    window.location.reload(); // Garante o recarregamento do Router com o novo estado de autenticação
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center bg-brand-cream text-brand-charcoal px-6 py-12 md:py-20 select-none relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header (Empty for balancing layout) */}
      <div className="w-full h-8" />

      {/* Main Content */}
      <div className="flex flex-col items-center text-center max-w-lg z-10 animate-fade-in">
        {/* Logo Circular */}
        <div className="mb-8 relative group">
          <img 
            src="/logos/LogoCirculo.png" 
            alt="Ingrid Sinkovitz Logo" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.05)] transition-transform duration-700 group-hover:rotate-12"
          />
        </div>

        {/* Text Logo */}
        <h1 className="font-serif text-3xl md:text-4xl tracking-[0.2em] font-medium text-black uppercase mb-4">
          INGRID SINKOVITZ
        </h1>
        
        {/* Divider Line */}
        <div className="w-12 h-[1px] bg-brand-charcoal/20 my-4" />

        {/* Message */}
        <p className="font-serif italic text-2xl md:text-3xl text-brand-charcoal font-light leading-relaxed mb-2">
          Renovando... até breve!
        </p>
        <p className="font-sans text-xs tracking-[0.1em] text-brand-charcoal/60 uppercase">
          Estamos preparando novidades estratégicas.
        </p>
      </div>

      {/* Footer / Access Button */}
      <div className="z-10 flex flex-col items-center">
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-brand-charcoal/40 hover:text-brand-blue transition-colors uppercase border border-black/0 hover:border-brand-blue/20 px-4 py-2 rounded-full duration-300"
          aria-label="Acesso restrito"
        >
          <Lock size={12} />
          Acesso Restrito
        </button>
      </div>

      {/* Access Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-brand-cream border border-black/10 rounded-lg max-w-md w-full p-8 shadow-2xl relative animate-scale-up">
            
            {/* Close Button */}
            <button 
              onClick={() => { setShowModal(false); setError(''); }}
              className="absolute top-4 right-4 text-brand-charcoal/40 hover:text-brand-charcoal transition-colors p-1"
            >
              fechar
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="font-serif text-2xl text-black uppercase tracking-wider mb-2">
                Acesso Autorizado
              </h2>
              <p className="font-sans text-xs text-brand-charcoal/60 uppercase tracking-widest">
                Insira suas credenciais para visualizar
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/20 text-red-700 text-xs p-3 rounded">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all text-black"
                  placeholder="seuemail@exemplo.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5 relative">
                <label className="block text-[10px] font-semibold tracking-wider text-brand-charcoal/80 uppercase">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-white transition-all text-black"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-charcoal/40 hover:text-brand-charcoal"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-brand-cream py-3.5 rounded text-xs font-semibold tracking-[0.15em] hover:bg-brand-blue transition-colors duration-300 uppercase mt-4"
              >
                Desbloquear Acesso
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
