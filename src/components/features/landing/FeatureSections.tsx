import Image from 'next/image';
import { IconCamera, IconScanFace, IconWand } from '@/components/ui/Icons';
import { Card } from '@/components/ui/Card';

export const GallerySection = ({ isEs = true }: { isEs?: boolean }) => {
  const images = [
    { src: '/hero/cyberpunk.png', alt: 'Cyberpunk', tag: 'Midjourney v6.1', label: isEs ? 'Mapeo Facial Perfecto' : 'Perfect Face Mapping' },
    { src: '/hero/fantasy.png', alt: 'Fantasy', tag: 'Unreal Engine', label: isEs ? 'Iluminación Volumétrica' : 'Volumetric Lighting' },
    { src: '/hero/portrait.png', alt: 'Portrait', tag: 'PBR Lighting', label: isEs ? 'Retrato de Estudio' : 'Studio Portrait' },
  ];

  return (
    <div className="section-container" id="gallery">
      <div className="section-header-modern">
        <h2 className="section-title-modern">{isEs ? 'Ingeniería Precisa.' : 'Precise Engineering.'}</h2>
        <p className="section-subtitle-modern">
          {isEs ? 'Imágenes de grado de producción renderizadas en Midjourney tras pasar por Proms.' 
                : 'Production-grade images rendered in Midjourney through the Proms pipeline.'}
        </p>
      </div>
      
      <div className="gallery-masonry-modern">
        {images.map((img, i) => (
          <div key={i} className="gallery-card-modern anim-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <Image 
              src={img.src} 
              alt={img.alt} 
              width={400} 
              height={500} 
              className="gallery-img-modern" 
              priority={i === 0}
            />
            <div className="gallery-overlay-modern">
              <span className="gallery-tag-modern">{img.tag}</span>
              <p>{img.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FeatureGrid = ({ isEs = true }: { isEs?: boolean }) => {
  return (
    <section className="section-container" id="features">
      <div className="section-header-modern">
        <h2 className="section-title-modern">{isEs ? 'El fin de las "recetas a ciegas"' : 'The end of "blind recipes"'}</h2>
        <p className="section-subtitle-modern">
          {isEs ? 'Nuestra arquitectura transforma inspiración visual en código para el motor gráfico.'
                : 'Our architecture transforms visual inspiration into production code.'}
        </p>
      </div>
      <div className="bento-grid-modern">
        <Card className="bento-card-modern bento-large-modern">
          <div className="bento-icon-modern"><IconCamera size={28} /></div>
          <h3>{isEs ? 'Análisis Forense Fotográfico' : 'Photographic Forensic Analysis'}</h3>
          <p className="bento-desc-modern">
            {isEs 
              ? 'Rompe la imagen en capas moleculares. Detectamos el ángulo de luz, la saturación y el renderizado para copiar su esencia matemática exacta.'
              : 'Break images into molecular layers. We detect light angle, saturation, and rendering to copy their exact mathematical essence.'}
          </p>
        </Card>
        <Card className="bento-card-modern">
          <div className="bento-icon-modern"><IconScanFace size={24} /></div>
          <h3>{isEs ? 'Camerino de Actores' : 'Actor Dressing Room'}</h3>
          <p className="bento-desc-modern">
            {isEs 
              ? 'Sube la foto de tu modelo real. Guardamos sus rasgos biométricos localmente para que no mude entre generaciones.'
              : 'Upload your real model photo. We save biometric traits locally to ensure your model doesn’t mutate between generations.'}
          </p>
        </Card>
        <Card className="bento-card-modern">
          <div className="bento-icon-modern"><IconWand size={24} /></div>
          <h3>{isEs ? 'Dialectos Multi-Motor' : 'Multi-Engine Dialects'}</h3>
          <p className="bento-desc-modern">
            {isEs 
              ? 'Proms traduce tus referencias a sintaxis reactiva fluida para Flow, o encriptado denso técnico para Midjourney v6.'
              : 'Proms translates your references to fluid reactive syntax for Flow, or dense technical encryption for Midjourney v6.'}
          </p>
        </Card>
      </div>
    </section>
  );
};
