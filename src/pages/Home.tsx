import React, { useEffect } from 'react';
import { Project, SiteSettings, AboutMe } from '../types';
import { AboutMeSection } from '../components/AboutMeSection';
import { ProjectSection } from '../components/ProjectSection';
import { ServicesSection } from '../components/ServicesSection';
import { TestimonialsSection } from '../components/TestimonialsSection';

interface HomeProps {
  onSelectProject: (project: Project) => void;
  settings: {
    global: SiteSettings | null;
    sobre: AboutMe | null;
  };
}

export const Home: React.FC<HomeProps> = ({ onSelectProject, settings }) => {
  useEffect(() => {
    if (settings.global) {
      const g = settings.global;
      if (g.accentColor) document.documentElement.style.setProperty('--accent-color', g.accentColor);
      if (g.cor1) document.documentElement.style.setProperty('--cor1', g.cor1);
      if (g.cor2) document.documentElement.style.setProperty('--cor2', g.cor2);
      if (g.cor3) document.documentElement.style.setProperty('--cor3', g.cor3);
      if (g.cor4) document.documentElement.style.setProperty('--cor4', g.cor4);
      if (g.cor5) document.documentElement.style.setProperty('--cor5', g.cor5);
      if (g.cor6) document.documentElement.style.setProperty('--cor6', g.cor6);
      if (g.white) document.documentElement.style.setProperty('--white', g.white);
      if (g.grayLight) document.documentElement.style.setProperty('--gray-light', g.grayLight);
      if (g.textDark) document.documentElement.style.setProperty('--text-dark', g.textDark);
      if (g.shadow) document.documentElement.style.setProperty('--shadow', g.shadow);
      if (g.fontSizeH1) document.documentElement.style.setProperty('--font-size-h1', g.fontSizeH1);
      if (g.fontSizeH2) document.documentElement.style.setProperty('--font-size-h2', g.fontSizeH2);
      if (g.fontSizeH3) document.documentElement.style.setProperty('--font-size-h3', g.fontSizeH3);
      if (g.fontSizeH4) document.documentElement.style.setProperty('--font-size-h4', g.fontSizeH4);
    }
  }, [settings.global]);

  return (
    <div className="bg-zinc-950">
      <AboutMeSection settings={settings} />
      <ProjectSection onSelectProject={onSelectProject} />
      <ServicesSection />
      <TestimonialsSection />
    </div>
  );
};
