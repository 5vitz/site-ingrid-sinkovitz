import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { aboutData } from '../data/aboutData';
import AboutCarousel from '../components/AboutCarousel';

export const About: React.FC = () => {
  const [data, setData] = useState({
    tagline: aboutData.tagline,
    paragraphs: aboutData.paragraphs
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, 'settings', 'mainSettings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetched = docSnap.data();
          if (fetched.version === 3) {
            setData({
              tagline: fetched.tagline || aboutData.tagline,
              paragraphs: fetched.paragraphs || aboutData.paragraphs
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings from Firestore, using fallback:', err);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <div className="animate-fade-in px-6 md:px-12 py-12 md:py-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* LEFT COLUMN: Visual/Photo container (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <AboutCarousel />
          
          <div className="mt-6 text-xs text-brand-charcoal/60 tracking-widest uppercase border-t border-black/10 pt-4">
            Vitória, Espírito Santo &bull; São Paulo, SP
          </div>
        </div>

        {/* RIGHT COLUMN: Bio text (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <span className="text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase mb-2">Sobre Mim</span>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-[0.05em] text-black mb-8">
            MINHA HISTÓRIA
          </h1>
          
          {/* Tagline Box */}
          <div className="bg-brand-blue/5 border-l-4 border-brand-blue p-6 rounded-r-lg mb-8">
            <p className="font-serif italic text-lg md:text-xl text-brand-charcoal leading-relaxed font-light">
              &ldquo;{data.tagline}&rdquo;
            </p>
          </div>

          {/* Paragraphs */}
          <div className="relative">
            <div 
              className={`space-y-6 text-brand-charcoal text-sm md:text-base leading-relaxed transition-all duration-700 ease-in-out overflow-hidden text-justify md:text-left ${
                isExpanded ? 'max-h-[3000px]' : 'max-h-[300px] md:max-h-none'
              }`}
            >
              {data.paragraphs.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Gradient Fade Overlay on Mobile when not expanded */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-cream via-brand-cream/90 to-transparent pointer-events-none md:hidden" />
            )}

            {/* Expand Button on Mobile when not expanded */}
            {!isExpanded && (
              <div className="flex justify-center mt-6 md:hidden">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-brand-blue uppercase py-2.5 px-6 border border-brand-blue/20 rounded-full bg-white/60 backdrop-blur-sm shadow-sm hover:bg-white transition-colors duration-300 cursor-pointer"
                >
                  Saiba Mais +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
