import React, { useState } from 'react';

interface MediaRendererProps {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  className?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ 
  type, 
  url, 
  caption, 
  className = '' 
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden bg-brand-cream/50 ${className}`}>
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-brand-charcoal/5 animate-pulse flex items-center justify-center">
          <span className="text-xs text-brand-charcoal/40 tracking-widest uppercase">Carregando...</span>
        </div>
      )}

      {type === 'video' ? (
        <video
          src={url}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setLoading(false)}
        />
      ) : (
        <img
          src={url}
          alt={caption || 'Media Asset'}
          className={`w-full h-full object-cover transition-all duration-700 hover:scale-[1.02] ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setLoading(false)}
        />
      )}

      {caption && !loading && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-xs tracking-wider uppercase font-medium">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
};

export default MediaRenderer;
