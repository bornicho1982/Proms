'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';
import ImageDecompositionDemo from '@/components/features/ImageDecompositionDemo';

export default function LandingPage() {
  const { isEs, setLanguage, language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* 1. NAVBAR */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-left">
            <Link href="/" className="sidebar-logo">
              <span className="logo-icon">✧</span>
              <span className="logo-text">Proms<span className="accent-dot">.</span></span>
            </Link>
          </div>
          
          <div className="nav-center">
            <Link href="#features" className="nav-link">{isEs ? 'Características' : 'Features'}</Link>
            <Link href="#gallery" className="nav-link">{isEs ? 'Resultados' : 'Results'}</Link>
            <Link href="#demo" className="nav-link">{isEs ? 'Tecnología' : 'Technology'}</Link>
            <Link href="#pricing" className="nav-link">{isEs ? 'Precios' : 'Pricing'}</Link>
          </div>

          <div className="nav-right">
            <button 
              className="lang-pill-sm" 
              onClick={() => setLanguage(isEs ? 'en' : 'es')}
            >
              {language.toUpperCase()}
            </button>
            {isSignedIn ? (
              <>
                <UserButton appearance={{ elements: { userButtonAvatarBox: { width: '32px', height: '32px' } } }} />
                <Link href="/studio" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                  {isEs ? 'Ir al Studio →' : 'Go to Studio →'}
                </Link>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                  {isEs ? 'Lanzar Studio →' : 'Launch Studio →'}
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <section className="landing-section hero-section animate-in" style={{ paddingTop: '180px' }}>
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124, 58, 237, 0.1)', padding: '6px 14px', borderRadius: '100px', border: '1px solid var(--border-accent)', marginBottom: '32px' }}>
          <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--accent-color)' }}>
            {isEs ? 'MOTOR DE ANÁLISIS VISUAL ACTIVO' : 'VISUAL ANALYSIS ENGINE ACTIVE'}
          </span>
        </div>
        
        <h1 className="section-title" style={{ fontSize: '4.5rem', lineHeight: 1.1, maxWidth: '900px', margin: '0 auto 32px' }}>
          {isEs ? (
            <>Escribe Menos.<br/><span className="text-gradient">Genera como un Pro.</span></>
          ) : (
            <>Write Less.<br/><span className="text-gradient">Generate like a Pro.</span></>
          )}
        </h1>

        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 48px', lineHeight: 1.6 }}>
          {isEs 
            ? 'Extrae el ADN visual de cualquier imagen y genera prompts optimizados para FLUX, Midjourney y Stable Diffusion.' 
            : 'Extract the visual DNA of any image and generate optimized prompts for FLUX, Midjourney, and Stable Diffusion.'}
        </p>

        <div className="hero-ctas" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/studio" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            {isEs ? 'Lanzar Studio →' : 'Launch Studio →'}
          </Link>
          <button className="btn-ghost" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
            {isEs ? 'Ver cómo funciona' : 'See how it works'}
          </button>
        </div>

        <div className="mockup-frame animate-in" style={{ animationDelay: '0.2s' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000" alt="Product Mockup" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* 3. PROMPT RESULTS CAROUSEL */}
      <section id="gallery" className="landing-section gallery-section" style={{ background: '#0a0a14', overflow: 'hidden' }}>
        <h2 className="section-title" style={{ fontSize: '2.5rem' }}>
          {isEs ? 'Resultados reales del motor' : 'Actual engine results'}
        </h2>
        
        <div className="carousel-container" style={{ display: 'flex', gap: '24px', padding: '0 24px', animation: 'scroll 40s linear infinite' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="gallery-card card-premium" style={{ minWidth: '400px', padding: '0', overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${i+100}/800/1000`} alt="Result" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.8)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900, border: '1px solid var(--border-color)' }}>
                  {i % 2 === 0 ? 'FLUX.1' : 'MIDJOURNEY V6'}
                </div>
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(to top, black, transparent)', padding: '24px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-color)', letterSpacing: '0.1em' }}>PROMPT</span>
                  <p style={{ fontSize: '0.9rem', color: 'white', marginTop: '8px', fontStyle: 'italic', opacity: 0.9 }}>
                    {"\"Cinematic close-up portrait of a character, atmospheric neon lighting, detailed textures, 8k resolution...\""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="landing-section steps-section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '2.5rem' }}>{isEs ? 'Cómo funciona' : 'How it works'}</h2>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', marginTop: '64px' }}>
          {[
            { n: '1', t: isEs ? 'Sube tus referencias' : 'Upload references', d: isEs ? 'Arrastra tus imágenes de inspiración directamente al studio.' : 'Drag your inspiration images directly into the studio.' },
            { n: '2', t: isEs ? 'El motor analiza el ADN' : 'AI extracts the DNA', d: isEs ? 'Nuestra IA analiza iluminación, composición, estilo y texturas.' : 'Our AI analyzes lighting, composition, style, and textures.' },
            { n: '3', t: isEs ? 'Genera el prompt perfecto' : 'Generate the prompt', d: isEs ? 'Copia los prompts optimizados para cualquier motor de IA.' : 'Copy optimized prompts for any AI engine.' }
          ].map((s, i) => (
            <div key={i} className="step-card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-color)', opacity: 0.3, marginBottom: '16px' }}>{s.n}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>{s.t}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <ImageDecompositionDemo />

      {/* 5. FEATURE BREAKDOWN */}
      <section id="features" className="landing-section technology-section" style={{ background: '#0a0a14' }}>
        <h2 className="section-title" style={{ fontSize: '2.5rem' }}>{isEs ? 'Tecnología de nivel profesional' : 'Professional-grade technology'}</h2>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1200px', margin: '64px auto 0' }}>
          {[
            { t: isEs ? 'Análisis Forense Fotográfico' : 'Forensic Analysis', d: isEs ? 'Mapeo detallado de parámetros de cámara y óptica.' : 'Detailed mapping of camera and optical parameters.' },
            { t: isEs ? 'Camerino de Actores' : 'Actor Dressing Room', d: isEs ? 'Entrena identidades visuales consistentes para tus modelos.' : 'Train consistent visual identities for your models.' },
            { t: isEs ? 'Dialectos Multi-Motor' : 'Multi-Engine Dialects', d: isEs ? 'Traducción matemática para FLUX, Midjourney y DALL-E.' : 'Mathematical translation for FLUX, Midjourney, and DALL-E.' }
          ].map((f, i) => (
            <div key={i} className="card-premium" style={{ textAlign: 'left' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent-color)', borderRadius: '8px', marginBottom: '24px' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{f.t}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BEFORE / AFTER */}
      <section className="landing-section comparison-section" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className="section-title" style={{ fontSize: '2.5rem' }}>{isEs ? 'De imagen a prompt en segundos' : 'From image to prompt in seconds'}</h2>
        <div className="comparison-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '64px', textAlign: 'left' }}>
          <div className="comp-item">
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '16px', display: 'block', letterSpacing: '0.1em' }}>REFERENCIA</span>
            <div className="card-premium" style={{ padding: '4px', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600" alt="Reference" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
            </div>
          </div>
          <div className="comp-item">
            <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '16px', display: 'block', letterSpacing: '0.1em' }}>PROMPT GENERADO</span>
            <div className="card-premium" style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent-color)', minHeight: '300px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{"// FLUX.1 Optimized"}</span><br/><br/>
              Cinematic close-up portrait of a woman with natural freckles, soft window lighting from the left, shallow depth of field (f/1.8), organic textures, hyper-realistic, 8k render, neutral color temperature, shot on 85mm lens...
            </div>
          </div>
        </div>
      </section>

      {/* 7. SOCIAL PROOF */}
      <section className="landing-section trust-section" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '64px 0' }}>
         <div style={{ fontSize: '0.8rem', fontWeight: 700, color: "var(--text-muted)", marginBottom: '32px', letterSpacing: '0.1em' }}>
           OPTIMIZADO PARA LOS MEJORES MOTORES
         </div>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', opacity: 0.5, filter: 'grayscale(1)', fontWeight: 800, fontSize: '1.2rem' }}>
           <span>FLUX.1</span>
           <span>MIDJOURNEY</span>
           <span>STABLE DIFFUSION</span>
           <span>RUNWAY</span>
         </div>
      </section>

      {/* 8. FINAL CTA */}
      <section id="pricing" className="landing-section final-cta-section" style={{ background: 'linear-gradient(to bottom, #080810, #121225)', padding: '160px 24px' }}>
        <h2 className="section-title" style={{ fontSize: '4rem' }}>{isEs ? 'Empieza a generar como un profesional' : 'Start generating like a pro'}</h2>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '48px' }}>
          {isEs ? 'Gratis para empezar. Sin tarjeta de crédito.' : 'Free to start. No credit card required.'}
        </p>
        <Link href="/studio" className="btn-primary" style={{ padding: '20px 48px', fontSize: '1.25rem' }}>
          {isEs ? 'Abrir el Studio →' : 'Open Studio →'}
        </Link>
      </section>

      {/* 9. FOOTER */}
      <footer className="footer-modern" style={{ padding: '80px 24px', borderTop: '1px solid var(--border-color)', background: '#05050a' }}>
        <div className="nav-container" style={{ alignItems: 'flex-start' }}>
          <div className="footer-col" style={{ textAlign: 'left' }}>
            <Link href="/" className="sidebar-logo">
              <span className="logo-icon">✧</span>
              <span className="logo-text">Proms<span className="accent-dot">.</span></span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '24px', maxWidth: '250px' }}>
              {isEs 
                ? 'La plataforma definitiva de ingeniería de prompts para artistas visuales.' 
                : 'The ultimate prompt engineering platform for visual artists.'}
            </p>
          </div>

          <div className="footer-links" style={{ display: 'flex', gap: '80px' }}>
            <div className="footer-col" style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 900, marginBottom: '24px' }}>PRODUCTO</h4>
              <Link href="#" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>Studio</Link>
              <Link href="#" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>Precios</Link>
              <Link href="#" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>API</Link>
            </div>
            <div className="footer-col" style={{ textAlign: 'left' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 900, marginBottom: '24px' }}>LEGAL</h4>
              <Link href="#" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>Privacidad</Link>
              <Link href="#" style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>Términos</Link>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '64px auto 0', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <span>© 2026 Proms Studio.</span>
          <span>{isEs ? 'Hecho con IA en España' : 'Made with AI in Spain'}</span>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-424px * 3)); }
        }
      `}</style>
    </div>
  );
}
