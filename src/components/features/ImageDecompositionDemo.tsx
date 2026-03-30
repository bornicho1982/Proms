'use client';

import React, { useState, useEffect, useRef } from 'react';

const LAYERS = [
  {
    label: 'IMAGEN BASE',
    color: '#ffffff',
    filter: 'none',
    overlay: null,
    showGrid: false,
  },
  {
    label: 'ILUMINACIÓN',
    color: '#60a5fa',
    filter: 'brightness(1.15) contrast(0.9)',
    overlay: 'linear-gradient(135deg, rgba(59,130,246,0.25) 0%, transparent 60%)',
    showGrid: false,
  },
  {
    label: 'COMPOSICIÓN',
    color: '#fbbf24',
    filter: 'contrast(1.1) saturate(0.8)',
    overlay: null,
    showGrid: true,
  },
  {
    label: 'PALETA CROMÁTICA',
    color: '#a78bfa',
    filter: 'saturate(1.8) hue-rotate(15deg)',
    overlay: 'linear-gradient(180deg, rgba(139,92,246,0.3) 0%, transparent 100%)',
    showGrid: false,
  },
  {
    label: 'TEXTURAS',
    color: '#94a3b8',
    filter: 'contrast(1.6) saturate(0.3) brightness(1.05)',
    overlay: null,
    showGrid: false,
  },
  {
    label: 'ADN VISUAL',
    color: '#34d399',
    filter: 'hue-rotate(100deg) saturate(1.5) brightness(0.85)',
    overlay: 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(52,211,153,0.07) 6px, rgba(52,211,153,0.07) 7px)',
    showGrid: false,
  },
];

const ANALYSIS_CARDS = [
  {
    label: 'ILUMINACIÓN',
    color: '#60a5fa',
    text: 'Iluminación Rembrandt sutil, temperatura 5400K, ángulo 45° izquierda, alto rango dinámico, sombras profundas controladas.',
    isFinal: false,
  },
  {
    label: 'COMPOSICIÓN',
    color: '#fbbf24',
    text: 'Regla de tercios perfecta, sujeto desplazado izquierda, espacio negativo compensado, líneas de fuga naturales detectadas.',
    isFinal: false,
  },
  {
    label: 'PALETA CROMÁTICA',
    color: '#a78bfa',
    text: 'Paleta cinematográfica desaturada, tonos piel precisos, contraste verde-magenta sutil en las sombras, temperatura cálida.',
    isFinal: false,
  },
  {
    label: 'TEXTURAS',
    color: '#94a3b8',
    text: 'Grano de película 35mm, textura de tela macroscópica visible, porosidad dérmica preservada, bokeh orgánico f/1.4.',
    isFinal: false,
  },
  {
    label: 'PROMPT MAESTRO GENERADO',
    color: '#7c3aed',
    isFinal: true,
    text: 'Close-up editorial portrait, subtle Rembrandt lighting 45°, warm cinematic desaturated palette, 85mm f/1.2 lens, rule of thirds, organic 35mm film grain, hyper-realistic skin texture, 8K resolution, FLUX.1 optimized.',
  },
];

export default function ImageDecompositionDemo() {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [typewrittenTexts, setTypewrittenTexts] = useState<string[]>(
    Array(ANALYSIS_CARDS.length).fill('')
  );
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to trigger animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Main animation sequence
  useEffect(() => {
    if (!isVisible) return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const runSequence = () => {
      setStage(0);
      setProgress(0);
      setTypewrittenTexts(Array(ANALYSIS_CARDS.length).fill(''));

      const steps = [
        { time: 800, s: 1, p: 20 },
        { time: 2200, s: 2, p: 40 },
        { time: 3600, s: 3, p: 60 },
        { time: 5000, s: 4, p: 80 },
        { time: 6400, s: 5, p: 100 },
      ];

      steps.forEach((step) => {
        const t = setTimeout(() => {
          setStage(step.s);
          setProgress(step.p);
        }, step.time);
        timeouts.push(t);
      });

      // Loop: restart after full cycle (13s)
      const loopTimer = setTimeout(runSequence, 13000);
      timeouts.push(loopTimer);
    };

    runSequence();
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [isVisible]);

  // Typewriter effect per card - Bug 2 Fix: Stale closure prevention
  useEffect(() => {
    if (stage === 0) return;
    const idx = stage - 1;
    if (idx >= ANALYSIS_CARDS.length) return;
    const target = ANALYSIS_CARDS[idx].text;
    let curr = 0;
    const interval = setInterval(() => {
      curr++;
      if (curr <= target.length) {
        setTypewrittenTexts(prev => {
          const next = [...prev];
          next[idx] = target.slice(0, curr);
          return next;
        });
      }
      if (curr >= target.length) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [stage]);

  const handleCopy = () => {
    const finalCard = ANALYSIS_CARDS.find((c) => c.isFinal);
    if (finalCard) {
      navigator.clipboard.writeText(finalCard.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Bug 1: Fanned layout offsets
  const fanOffsets = [
    { x: 0,    y: 0,    rotate: 0 },    // base — stays fixed
    { x: -8,   y: -70,  rotate: -1.5 }, // lighting
    { x: -16,  y: -140, rotate: -3 },   // composition  
    { x: -8,   y: -210, rotate: -1.5 }, // palette
    { x: 0,    y: -280, rotate: 0 },    // textures
    { x: 8,    y: -350, rotate: 1.5 },  // dna
  ];

  return (
    <section
      id="demo"
      ref={containerRef}
      style={{
        backgroundColor: '#080810',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0,
        paddingTop: '80px', // Bug 4 Fix
        paddingBottom: '96px',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header - Bug 4 Fix: centered */}
        <div className="text-center mb-16" style={{ marginBottom: '60px' }}>
          <span
            className="inline-block text-[10px] font-mono tracking-[0.2em] mb-4 px-4 py-1.5 rounded-full border"
            style={{
              color: '#7c3aed',
              borderColor: 'rgba(124, 58, 237, 0.3)',
              backgroundColor: 'rgba(124, 58, 237, 0.05)',
            }}
          >
            MOTOR DE ANÁLISIS VISUAL
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Diseccionamos cada imagen{' '}
            <span style={{ color: '#8b5cf6' }}>capa a capa</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Entendemos la luz, la composición y el ADN visual para reconstruir tu visión con precisión absoluta.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'flex-start',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {/* LEFT: Layer Stack */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '720px', // Bug 1 Fix: Higher container
                overflow: 'visible',
                maxWidth: '420px', // Bug 5 Fix
                margin: '0 auto', // Bug 5 Fix
              }}
            >
              {LAYERS.map((layer, i) => {
                const isActive = stage > i;
                // Bug 1: Fanned layout offsets when active
                const transform = isActive 
                  ? `translate(${fanOffsets[i].x}px, ${fanOffsets[i].y}px) rotate(${fanOffsets[i].rotate}deg)`
                  : 'translate(0px, 0px) rotate(0deg)';

                return (
                  <div
                    key={layer.label}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '280px', // Bug 5 Fix
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition:
                        'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.9s ease',
                      transform: transform,
                      zIndex: i + 1,
                      // Visual Enhancement 1: Depth Shadow
                      boxShadow:
                        isActive && i > 0
                          ? `0 -8px 40px rgba(0,0,0,0.8), 0 0 20px ${layer.color}33`
                          : '0 4px 20px rgba(0,0,0,0.5)',
                      border: `1px solid ${layer.color}33`,
                      // Visual Enhancement 2: Reveal Glow
                      animation: isActive && i > 0 ? 'layerReveal 1.2s ease-out forwards' : 'none',
                    }}
                    // Force remount to trigger animation when isActive changes
                    {...({ key: `${layer.label}-${isActive}` } as any)}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80"
                      alt={layer.label}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: layer.filter,
                        display: 'block',
                      }}
                    />

                    {/* Overlay specific to layer type */}
                    {layer.overlay && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: layer.overlay,
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    {layer.showGrid && (
                      <svg
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0.55,
                        }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <line x1="33.3" y1="0" x2="33.3" y2="100" stroke="#fbbf24" strokeWidth="0.4" />
                        <line x1="66.6" y1="0" x2="66.6" y2="100" stroke="#fbbf24" strokeWidth="0.4" />
                        <line x1="0" y1="33.3" x2="100" y2="33.3" stroke="#fbbf24" strokeWidth="0.4" />
                        <line x1="0" y1="66.6" x2="100" y2="66.6" stroke="#fbbf24" strokeWidth="0.4" />
                        <circle cx="33.3" cy="33.3" r="1.5" fill="#fbbf24" />
                        <circle cx="66.6" cy="33.3" r="1.5" fill="#fbbf24" />
                        <circle cx="33.3" cy="66.6" r="1.5" fill="#fbbf24" />
                        <circle cx="66.6" cy="66.6" r="1.5" fill="#fbbf24" />
                      </svg>
                    )}

                    {/* Badge Label */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0,0,0,0.75)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${layer.color}55`,
                        borderRadius: '100px',
                        padding: '4px 14px',
                        zIndex: 10,
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: layer.color,
                          boxShadow: `0 0 8px ${layer.color}`,
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'monospace',
                          letterSpacing: '0.12em',
                          color: layer.color,
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {layer.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Analysis Feed */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingTop: '16px',
            }}
          >
            {/* Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6b7280', letterSpacing: '0.1em' }}>
                  ● ANALIZANDO ADN VISUAL
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#7c3aed', fontWeight: 800 }}>
                  {progress}%
                </span>
              </div>
              <div style={{ height: '3px', background: '#1e1e2e', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #7c3aed, #34d399)',
                    transition: 'width 0.7s ease',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </div>

            {/* Analysis Cards */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {ANALYSIS_CARDS.map((card, cardIndex) => {
                const isShown = stage > cardIndex;
                if (!isShown) return null;

                return (
                  <div
                    key={card.label}
                    style={{
                      background: card.isFinal ? 'rgba(124,58,237,0.08)' : 'rgba(15,15,26,0.9)',
                      border: `1px solid ${card.isFinal ? '#7c3aed55' : '#1e1e2e'}`,
                      borderRadius: '12px',
                      padding: '16px 20px',
                      animation: 'slideUp 0.5s ease forwards',
                      boxShadow: card.isFinal ? '0 0 24px rgba(124,58,237,0.15)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.12em',
                        color: card.color,
                        fontWeight: 800,
                        marginBottom: '8px',
                      }}
                    >
                      {card.label}
                    </div>
                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.7',
                        color: card.isFinal ? '#e2e8f0' : '#94a3b8',
                        fontFamily: card.isFinal ? 'monospace' : 'inherit',
                        fontWeight: card.isFinal ? 500 : 400,
                        margin: 0,
                        minHeight: '1.5em',
                        // Bug 2 Fix: prevent mid-word cutting
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {typewrittenTexts[cardIndex]}
                      {/* Blinking cursor while typing */}
                      {stage === cardIndex + 1 &&
                        typewrittenTexts[cardIndex].length < card.text.length && (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '2px',
                              height: '14px',
                              background: '#7c3aed',
                              marginLeft: '4px',
                              verticalAlign: 'middle',
                              animation: 'blink 0.8s step-end infinite',
                            }}
                          />
                        )}
                    </p>
                    {/* Bug 3 Fix: Button visible when stage 5+ or done */}
                    {card.isFinal && (stage >= 5 || typewrittenTexts[cardIndex].length === card.text.length) && (
                      <button
                        onClick={handleCopy}
                        style={{
                          marginTop: '20px',
                          width: '100%',
                          padding: '14px',
                          background: '#7c3aed',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          letterSpacing: '0.1em',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = '#6d28d9')}
                        onMouseOut={(e) => (e.currentTarget.style.background = '#7c3aed')}
                      >
                        {copied ? '✓ COPIADO' : 'COPIAR PROMPT MAESTRO'}
                      </button>
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
