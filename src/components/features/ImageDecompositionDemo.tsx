'use client';

import React, { useState, useEffect, useRef } from 'react';

const ANALYSIS_CARDS = [
  {
    id: 'lighting',
    label: 'ANÁLISIS DE LUZ',
    color: '#3b82f6',
    text: 'Iluminación Rembrandt sutil, temperatura de 5400K, f-stop proyectado en sombra profunda, alto rango dinámico detectado.',
  },
  {
    id: 'composition',
    label: 'EQUILIBRIO GEOMÉTRICO',
    color: '#f59e0b',
    text: 'Regla de tercios perfecta, puntos de interés centrados en el ojo dominante, espacio negativo compensado a la derecha.',
  },
  {
    id: 'color',
    label: 'ESPECTRO CROMÁTICO',
    color: '#8b5cf6',
    text: 'Paleta cinematográfica desaturada, tonos piel precisos, contraste verde-magenta sutil en las sombras.',
  },
  {
    id: 'textures',
    label: 'DETALLE DE SUPERFICIE',
    color: '#94a3b8',
    text: 'Grano de película 35mm, textura de tela macroscópica, detalles de porosidad dérmica preservados al 100%.',
  },
  {
    id: 'final',
    label: 'PROMPT MAESTRO GENERADO',
    color: '#7c3aed',
    isFinal: true,
    text: 'Close-up editorial portrait, hyper-realistic fine skin textures, subtle Rembrandt lighting from 45 degrees, cinematic desaturated palette, 85mm f/1.2 lens, rule of thirds composition, organic 35mm film grain, 8K resolution, FLUX.1 high-fidelity output.',
  },
];

export default function ImageDecompositionDemo() {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [typewrittenTexts, setTypewrittenTexts] = useState<string[]>(Array(ANALYSIS_CARDS.length).fill(''));
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Parallax logic - Subtle ±8deg max
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !isHovering) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let timer: NodeJS.Timeout;
    const runSequence = () => {
      setStage(0);
      setProgress(0);
      setTypewrittenTexts(Array(ANALYSIS_CARDS.length).fill(''));
      
      const sequence = [
        () => { setStage(1); setProgress(20); },
        () => { setStage(2); setProgress(40); },
        () => { setStage(3); setProgress(60); },
        () => { setStage(4); setProgress(80); },
        () => { setStage(5); setProgress(100); },
      ];

      sequence.forEach((fn, i) => {
        setTimeout(fn, (i + 1) * 1200);
      });

      timer = setTimeout(runSequence, 14000);
    };
    runSequence();
    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    if (stage === 0) return;
    const idx = Math.min(stage - 1, ANALYSIS_CARDS.length - 1);
    const target = ANALYSIS_CARDS[idx].text;
    let curr = 0;
    const interval = setInterval(() => {
      if (curr < target.length) {
        curr++;
        setTypewrittenTexts(prev => {
          const next = [...prev];
          next[idx] = target.slice(0, curr);
          return next;
        });
      } else clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <section 
      id="demo"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePos({ x: 0, y: 0 });
      }}
      className="relative isolate z-0 overflow-hidden py-32 px-6 bg-[#05050a]"
    >
      {/* Background Decorative Grids */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="mx-auto max-w-[1240px] relative z-10">
        <div className="mb-20 text-center">
          <span className="text-technical text-accent-color text-[0.65rem] mb-4 block animate-pulse">
            SISTEMA DE ANÁLISIS ESPECTRAL V2.0
          </span>
          <h2 className="section-title !text-5xl md:!text-6xl mb-6">
            Ingeniería que <span className="text-gradient">entiende el arte</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            No somos un simple generador. Somos un director de arte digital que disecciona la realidad para reconstruir tu visión.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Premium 3D Stack - Bug 2 Fix: overflow-hidden & contain: layout */}
          <div className="relative flex justify-center py-20 lg:py-0 overflow-hidden" style={{ contain: 'layout' }}>
            <div className="relative w-full max-w-[440px] aspect-[4/5] perspective-container">
              {/* Layers Stack */}
              {[
                { id: 'base', tilt: 1 },
                { id: 'lighting', tilt: 1.5, color: '#3b82f6' },
                { id: 'composition', tilt: 2, color: '#f59e0b' },
                { id: 'color', tilt: 2.5, color: '#8b5cf6' },
                { id: 'textures', tilt: 3, color: '#94a3b8' },
                { id: 'dna', tilt: 3.5, color: '#7c3aed' }
              ].map((layer, i) => {
                const active = stage > i;
                const offset = active ? i * 55 : 0; // Bug 2 Fix: Reduced offset
                
                // Bug 1 Fix: Rotation only on hover, max ±8deg
                const rotateX = isHovering ? mousePos.y * 16 : 0;
                const rotateY = isHovering ? mousePos.x * 16 : 0;
                
                return (
                  <div
                    key={layer.id}
                    className="absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      transform: `translate3d(0, -${offset}px, ${i * 15}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, // Bug 2 Fix: Reduced Z-depth
                      opacity: active || i === 0 ? 1 : 0,
                      zIndex: i
                    }}
                  >
                    <div className={`relative h-full w-full rounded-2xl border-white/10 border overflow-hidden shadow-2xl ${i > 0 ? 'bg-black/20 backdrop-blur-[2px]' : ''}`}>
                      {/* Image Source */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" 
                        alt="Demo"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${i > 0 ? 'opacity-30 blur-[1px] grayscale' : ''}`}
                      />

                      {/* Technical Overlays */}
                      {layer.id === 'lighting' && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-white/10 mix-blend-overlay" />
                      )}
                      
                      {layer.id === 'composition' && (
                        <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100">
                          <line x1="33.3" y1="0" x2="33.3" y2="100" stroke="#f59e0b" strokeWidth="0.2" />
                          <line x1="66.6" y1="0" x2="66.6" y2="100" stroke="#f59e0b" strokeWidth="0.2" />
                          <line x1="0" y1="33.3" x2="100" y2="33.3" stroke="#f59e0b" strokeWidth="0.2" />
                          <line x1="0" y1="66.6" x2="100" y2="66.6" stroke="#f59e0b" strokeWidth="0.2" />
                          <circle cx="33.3" cy="33.3" r="1" fill="#f59e0b" />
                          <circle cx="66.6" cy="33.3" r="1" fill="#f59e0b" />
                        </svg>
                      )}

                      {layer.id === 'dna' && (
                        <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                      )}

                      {/* Technical Label */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 border border-white/10 rounded-full text-[10px] text-technical text-white/70">
                        {layer.id} _layer_{i.toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Glassmorphic Stream */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-technical text-[0.6rem] text-text-muted">PROC_STATUS: ANALYZING_SPECTRAL_DATA</span>
              </div>
              <span className="text-technical text-[0.6rem] text-accent-color">{progress}%</span>
            </div>

            <div className="h-[1px] w-full bg-white/5 relative">
              <div className="absolute top-0 left-0 h-full bg-accent-color transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>

            <div className="space-y-4">
              {ANALYSIS_CARDS.map((card, i) => {
                const show = stage > i;
                if (!show) return null;
                
                return (
                  <div 
                    key={card.id} 
                    className={`bg-glass-dark p-5 rounded-xl border-technical transition-all duration-500 slide-up shimmer-technical ${card.isFinal ? 'ring-1 ring-accent-color/30 border-accent-color/40 bg-accent-color/5' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-technical text-[0.65rem]" style={{ color: card.color }}>{card.label}</h4>
                      {stage === i + 1 && <span className="h-1 w-8 bg-accent-color/30 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-color animate-progress-fast" />
                      </span>}
                    </div>
                    
                    <p className={`text-[13px] font-medium leading-relaxed ${card.isFinal ? 'text-white' : 'text-text-secondary'}`}>
                      {typewrittenTexts[i]}
                      {stage === i + 1 && typewrittenTexts[i].length < card.text.length && (
                        <span className="inline-block w-2 h-4 bg-accent-color ml-1 animate-flicker align-middle" />
                      )}
                    </p>

                    {card.isFinal && typewrittenTexts[i].length === card.text.length && (
                      <div className="mt-6 flex gap-4">
                        <button className="flex-1 py-3 bg-accent-color hover:bg-accent-hover text-white text-[0.7rem] font-bold rounded-lg transition-all transform active:scale-95 shadow-lg shadow-accent-color/20">
                          COPIAR PROMPT MAESTRO
                        </button>
                        <button className="px-6 py-3 border border-white/10 hover:bg-white/5 text-[0.7rem] font-bold rounded-lg transition-all">
                          EDITAR
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
