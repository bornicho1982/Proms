'use client';

import { IconWand } from '@/components/ui/Icons';
import { Card, Badge } from '@/components/ui/Card';

export const GallerySection = ({ isEs = true }: { isEs?: boolean }) => {
  return (
    <section id="gallery" className="gallery-section-modern">
      <div className="section-header-modern">
        <Badge variant="accent">{isEs ? 'RESULTADOS' : 'RESULTS'}</Badge>
        <h2 className="section-title-modern">
          {isEs ? 'Calidad Cinematográfica' : 'Cinematic Quality'}
        </h2>
        <p className="section-subtitle-modern">
          {isEs ? 'Explora prompts generados con precisión fotográfica.' : 'Explore prompts generated with photographic precision.'}
        </p>
      </div>
      
      <div className="gallery-masonry-modern">
        {[1, 2, 3].map((i) => (
          <div key={i} className="gallery-card-modern">
            <div className="gallery-placeholder">
               <IconWand size={32} />
            </div>
            <div className="gallery-overlay-modern">
              <span className="gallery-tag-modern">FLUX.1 PHOTOREAL</span>
              <p>{isEs ? 'Retrato de detalle con iluminación volumétrica.' : 'Detail portrait with volumetric lighting.'}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const FeatureGrid = ({ isEs = true }: { isEs?: boolean }) => {
  const features = [
    {
      title: isEs ? 'Análisis Forense Fotográfico' : 'Photographic Forensic Analysis',
      desc: isEs ? 'Descompone cada píxel de tus referencias para extraer parámetros de iluminación, lente y composición.' : 'Breaks down every pixel of your references to extract lighting, lens, and composition parameters.',
      icon: <IconWand size={24} />
    },
    {
      title: isEs ? 'Camerino de Actores' : 'Character Dressing Room',
      desc: isEs ? 'Entrena y guarda identidades visuales para mantener la consistencia en múltiples generaciones.' : 'Train and save visual identities to maintain consistency across multiple generations.',
      icon: <IconWand size={24} />
    },
    {
      title: isEs ? 'Dialectos Multi-Motor' : 'Multi-Engine Dialects',
      desc: isEs ? 'Optimiza automáticamente el ADN visual para Midjourney, FLUX, DALL-E y Stable Diffusion.' : 'Automatically optimizes visual DNA for Midjourney, FLUX, DALL-E, and Stable Diffusion.',
      icon: <IconWand size={24} />
    }
  ];

  return (
    <section id="features" className="features-grid-section">
      <div className="section-header-modern">
        <Badge variant="primary">{isEs ? 'TECNOLOGÍA' : 'ARCHITECTURE'}</Badge>
        <h2 className="section-title-modern">
          {isEs ? 'Arquitectura 10x para Directores de Arte' : '10x Architecture for Art Directors'}
        </h2>
      </div>

      <div className="features-container">
        {features.map((f, i) => (
          <Card key={i} variant="glass" className="feature-card-premium">
            <div className="feature-icon-wrapper">
              {f.icon}
            </div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
            <div className="feature-card-glow" />
          </Card>
        ))}
      </div>
    </section>
  );
};
