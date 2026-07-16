import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUp, ArrowUpRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'PROJETOS', path: '/', isAnchor: true },
    { name: 'EXPERTISE', path: '/expertise', isAnchor: false },
    { name: 'SOBRE', path: '/sobre', isAnchor: false },
  ];

  const handleNavClick = (link: typeof navLinks[0], e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (link.isAnchor && location.pathname === '/') {
      e.preventDefault();
      const projectsSection = document.getElementById('projects-grid');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream text-black font-sans selection:bg-brand-blue selection:text-brand-cream">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-black/5 px-6 py-5 md:px-12 flex justify-between items-center transition-all duration-300">
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-start gap-1.5 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/logos/LogoCirculo.png" 
            alt="Ingrid Sinkovitz Logo" 
            className="w-30 h-30 object-contain"
          />
          <span className="font-serif text-base md:text-lg tracking-[0.15em] font-medium text-black">
            INGRID SINKOVITZ
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-12 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={(e) => handleNavClick(link, e)}
              className={({ isActive }) => 
                `text-sm font-medium tracking-[0.15em] relative py-1 transition-all duration-300 hover:text-brand-blue after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-brand-blue after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-300 ${
                  isActive && !link.isAnchor ? 'text-brand-blue after:scale-x-100' : 'text-brand-charcoal'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <a
            href="#contato"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('footer-cta')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm font-medium tracking-[0.15em] text-brand-charcoal hover:text-brand-blue py-1 transition-all duration-300"
          >
            CONTATO
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-black hover:text-brand-blue transition-colors p-1"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-brand-cream/98 backdrop-blur-lg flex flex-col justify-center items-center space-y-8 transition-all duration-500 md:hidden ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={(e) => handleNavClick(link, e)}
            className="font-serif text-3xl tracking-[0.15em] text-brand-charcoal hover:text-brand-blue transition-colors"
          >
            {link.name}
          </NavLink>
        ))}
        <a
          href="#contato"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            document.getElementById('footer-cta')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="font-serif text-3xl tracking-[0.15em] text-brand-charcoal hover:text-brand-blue transition-colors"
        >
          CONTATO
        </a>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer id="footer-cta" className="bg-brand-cream border-t border-black/10 py-16 px-6 md:py-24 md:px-12 flex flex-col items-center text-center">
        <h2 className="font-serif text-4xl md:text-7xl tracking-[0.05em] uppercase text-black mb-6">
          VAMOS CRIAR JUNTOS?
        </h2>
        <p className="font-sans text-brand-charcoal max-w-md mb-12 text-base md:text-lg leading-relaxed">
          Tem um projeto em mente ou precisa estruturar a comunicação e posicionamento estratégico da sua marca? Entre em contato.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 w-full md:w-auto px-4 justify-center items-center">
          <a 
            href="mailto:ingridsinkovitz@gmail.com"
            className="w-full md:w-auto inline-flex justify-center items-center gap-2 bg-black text-brand-cream px-8 py-4 tracking-[0.15em] text-sm font-medium hover:bg-brand-blue hover:text-brand-cream transition-all duration-300 uppercase shadow-sm"
          >
            E-mail <ArrowUpRight size={16} />
          </a>
          <a 
            href="https://wa.me/5527999193525"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex justify-center items-center gap-2 border border-black text-black px-8 py-4 tracking-[0.15em] text-sm font-medium hover:border-brand-blue hover:text-brand-blue transition-all duration-300 uppercase"
          >
            WhatsApp <ArrowUpRight size={16} />
          </a>
          <a 
            href="https://www.linkedin.com/in/ingridsinkovitz/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex justify-center items-center gap-2 border border-black text-black px-8 py-4 tracking-[0.15em] text-sm font-medium hover:border-brand-blue hover:text-brand-blue transition-all duration-300 uppercase"
          >
            LinkedIn <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 text-xs text-brand-charcoal tracking-[0.1em] gap-6">
          <span>&copy; {new Date().getFullYear()} BY INGRID SINKOVITZ. TODOS OS DIREITOS RESERVADOS.</span>
          
          <button 
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 font-medium hover:text-brand-blue transition-colors group cursor-pointer"
          >
            VOLTAR AO TOPO 
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>
      </footer>
    </div>
  );
};
export default Layout;
