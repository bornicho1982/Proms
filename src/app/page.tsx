'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Show, SignInButton } from '@clerk/nextjs';
import { useState } from 'react';

// --- Premium Inline SVGs (Lucide-style 2026) ---
const IconCamera = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const IconScanFace = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
);
const IconWand = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8l1.4 1.4"/><path d="M10.8 4.8l1.4 1.4"/><path d="M17.8 6.2l1.4-1.4"/><path d="M3 21l9-9"/><path d="M12.2 9.8l1.4-1.4"/></svg>
);
const IconCode = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'style' | 'bio' | 'tensor'>('tensor');
  
  const demoCode = {
    style: `const styleData = {
  lens: "35mm f/1.8",
  lighting: "Volumetric Neon",
  filmStock: "Cinestill 800T",
  colorGrade: "#8b5cf6, #000000"
};
// Extraído de: Referencia_A.jpg`,
    bio: `const biometricData = {
  jawline: "Angular, sharp",
  eyeColor: "Deep Amber",
  ethnicFeatures: "Mixed European",
  expression: "Subtle smirk"
};
// Rostro anclado con éxito.`,
    tensor: `const visionData = {
  ...styleData,
  ...biometricData
};

// Compilando mega-prompt...
const midjourneyPrompt = "--ar 16:9 --v 6.1 --style raw";
[STATUS]: Tensor fusionado al 100%.`
  };

  const currentCode = demoCode[activeTab];

  return (
    <div className="landing-container dots-bg">
      {/* Vercel-style Deep Radial Gradient Glow */}
      <div className="hero-glow-orb"></div>
      
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          Proms<span className="accent-dot">.</span>
        </div>
        <div className="landing-links">
          <Link href="#gallery">Resultados</Link>
          <Link href="#features">Tecnología</Link>
          <div className="nav-separator"></div>
          
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="btn-modern">Entrar al Estudio</button>
            </SignInButton>
          </Show>
          
          <Show when="signed-in">
            <Link href="/studio" className="btn-modern">Ir a mi Workspace</Link>
          </Show>
        </div>
      </nav>

      {/* Hero Section (Linear App Style) */}
      <header className="hero-section">
        <div className="badge-modern">
          <IconWand /> Motor de Mapeo Visual Activo
        </div>
        <h1 className="hero-title-modern">
          Escribe Menos.<br/>
          <span className="text-gradient-modern">Genera como un Profesional.</span>
        </h1>
        <p className="hero-subtitle-modern">
          Proms Extrae fotográficamente la información de tus imágenes de referencia 
          y programa el ADN visual perfecto para Midjourney y Flow en milisegundos.
        </p>
        <div className="hero-cta">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="btn-primary-modern">
                Comenzar Gratis
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <Link href="/studio" className="btn-primary-modern">
              Lanzar Workspace
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </Show>
          
          <a href="#demo" className="btn-secondary-modern">Ver Arquitectura</a>
        </div>
      </header>

      {/* Floating 3D Minimal Mockup */}
      <div className="mockup-container-modern" id="demo">
        <div className="mockup-header-modern">
          <div className="mockup-dots"><span/><span/><span/></div>
          <div className="mockup-url">proms.ai / workspace</div>
        </div>
        
        <div className="mockup-grid-modern">
           <div 
             className={`mockup-slot ${activeTab === 'style' ? 'active-slot-modern' : ''}`}
             onClick={() => setActiveTab('style')}
             style={{ cursor: 'pointer' }}
           >
             <IconCamera />
             <p>Input: Estilo Base</p>
           </div>
           <div 
             className={`mockup-slot ${activeTab === 'bio' ? 'active-slot-modern' : ''}`}
             onClick={() => setActiveTab('bio')}
             style={{ cursor: 'pointer' }}
           >
             <IconScanFace />
             <p>Input: Biometría</p>
           </div>
           <div 
             className={`mockup-slot ${activeTab === 'tensor' ? 'active-slot-modern' : ''}`}
             onClick={() => setActiveTab('tensor')}
             style={{ cursor: 'pointer' }}
           >
             <IconWand />
             <p>Analizando Tensor...</p>
           </div>
           <div className="mockup-output-modern">
             <div className="code-block-modern">
               {currentCode.split('\n').map((line: string, i: number) => {
                 if (line.startsWith('const') || line.startsWith('let')) {
                   const parts = line.split(' ');
                   const keyword = parts[0];
                   const varName = parts[1];
                   const rest = line.substring(line.indexOf('=') + 1);
                   return <div key={i}><span className="code-key">{keyword}</span> <span className="code-var">{varName}</span> = {rest}</div>;
                 }
                 if (line.includes(':') && !line.trim().startsWith('//')) { // Ensure it's not a comment that happens to have a colon
                   const [key, val] = line.split(':');
                   return <div key={i}>&nbsp;&nbsp;<span className="code-prop">{key.trim()}</span>: <span className="code-string">{val}</span></div>;
                 }
                 if (line.startsWith('//') || line.startsWith('[')) {
                   return <div key={i} className="code-comment">{line}</div>;
                 }
                 return <div key={i}>{line}</div>;
               })}
             </div>
           </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="section-container" id="gallery">
        <div className="section-header-modern">
          <h2 className="section-title-modern">Ingeniería Precisa.</h2>
          <p className="section-subtitle-modern">Imágenes de grado de producción renderizadas en Midjourney tras pasar por Proms.</p>
        </div>
        
        <div className="gallery-masonry-modern">
          <div className="gallery-card-modern">
            <Image src="/hero/cyberpunk.png" alt="Cyberpunk" width={400} height={500} className="gallery-img-modern" />
            <div className="gallery-overlay-modern">
              <span className="gallery-tag-modern">Midjourney v6.1</span>
              <p>Mapeo Facial Perfecto</p>
            </div>
          </div>
          <div className="gallery-card-modern">
            <Image src="/hero/fantasy.png" alt="Fantasy" width={400} height={500} className="gallery-img-modern" />
            <div className="gallery-overlay-modern">
              <span className="gallery-tag-modern">Unreal Engine</span>
              <p>Traducción de Iluminación Volumétrica</p>
            </div>
          </div>
          <div className="gallery-card-modern">
            <Image src="/hero/portrait.png" alt="Editorial Portrait" width={400} height={500} className="gallery-img-modern" />
            <div className="gallery-overlay-modern">
              <span className="gallery-tag-modern">PBR Lighting</span>
              <p>Retrato de Estudio a 35mm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Bento Section */}
      <section className="section-container" id="features">
        <div className="section-header-modern">
          <h2 className="section-title-modern">El fin de las &quot;recetas a ciegas&quot;</h2>
          <p className="section-subtitle-modern">Nuestra arquitectura transforma inspiración visual en código para el motor gráfico.</p>
        </div>
        <div className="bento-grid-modern">
          <div className="bento-card-modern bento-large-modern">
            <div className="bento-icon-modern"><IconCamera /></div>
            <h3>Análisis Forense Fotográfico</h3>
            <p className="bento-desc-modern">Rompe la imagen en capas moleculares. Detectamos el ángulo de luz, 
            la saturación de curva hex, la profundidad de campo y el estilo de renderizado para copiar su esencia matemática exacta.</p>
          </div>
          <div className="bento-card-modern">
            <div className="bento-icon-modern"><IconScanFace /></div>
            <h3>Camerino de Actores</h3>
            <p className="bento-desc-modern">Sube la foto de tu modelo real. Guardamos sus rasgos biométricos localmente 
            para garantizar que tu modelo no mute entre generaciones.</p>
          </div>
          <div className="bento-card-modern">
            <div className="bento-icon-modern"><IconCode /></div>
            <h3>Dialectos Multi-Motor</h3>
            <p className="bento-desc-modern">Tú no hablas el idioma de las máquinas. Proms traduce 
            tus referencias a sintaxis reactiva fluida para Flow, o encriptado denso técnico para Midjourney v6.</p>
          </div>
        </div>
      </section>

      <footer className="footer-modern">
        <div className="footer-content">
          <div className="landing-logo">Proms<span className="accent-dot">.</span></div>
          <p>Herramientas Vercel-Grade para Diseñadores 10x.</p>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Proms AI Workspace.</span>
          <span>Desarrollado con Arquitectura Avanzada AI.</span>
        </div>
      </footer>
    </div>
  );
}
