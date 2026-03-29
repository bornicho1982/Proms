'use client';

import { SignInButton, Show } from '@clerk/nextjs';
import Link from 'next/link';
import { IconWand, IconArrowRight } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';

export const HeroSection = ({ isEs = true }: { isEs?: boolean }) => {
  return (
    <header className="hero-section">
      <div className="badge-modern">
        <IconWand size={16} /> 
        {isEs ? 'Motor de Mapeo Visual Activo' : 'Visual Mapping Engine Active'}
      </div>
      
      <h1 className="hero-title-modern">
        {isEs ? (
          <>Escribe Menos.<br/><span className="text-gradient-modern">Genera como un Profesional.</span></>
        ) : (
          <>Prompt Less.<br/><span className="text-gradient-modern">Generate like a Pro.</span></>
        )}
      </h1>
      
      <p className="hero-subtitle-modern">
        {isEs 
          ? 'Proms extrae fotográficamente la información de tus imágenes de referencia y programa el ADN visual perfecto en milisegundos.'
          : 'Proms photographically extracts data from your references and programs the perfect visual DNA in milliseconds.'}
      </p>
      
      <Card className="prompt-card glass-card">
         <div className="prompt-header">
           <Badge variant="primary">ENGINE OPTIMIZED</Badge>
           <Button variant="ghost" className="copy-btn">
             COPY PROMPT
           </Button>
         </div>
         <div className="prompt-text">
           {/* Prompt content here */}
         </div>
      </Card>

      <Card className="prompt-card glass-card" style={{ marginTop: '16px', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
         <div className="prompt-header">
           <Badge variant="accent" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>DETAILED SPECTRAL</Badge>
           <Button variant="ghost" className="copy-btn">
             COPY PROMPT
           </Button>
         </div>
         <div className="prompt-text" style={{ color: '#a78bfa', fontSize: '0.85rem' }}>
           {/* Detailed prompt content here */}
         </div>
      </Card>

      <div className="hero-cta">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="primary" className="btn-primary-modern">
              {isEs ? 'Comenzar Gratis' : 'Start for Free'}
              <IconArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Button>
          </SignInButton>
        </Show>

        <Show when="signed-in">
          <Link href="/studio">
            <Button variant="primary" className="btn-primary-modern">
              {isEs ? 'Lanzar Workspace' : 'Launch Workspace'}
              <IconArrowRight size={16} style={{ marginLeft: '8px' }} />
            </Button>
          </Link>
        </Show>
        
        <a href="#demo" className="btn-secondary-modern">
          {isEs ? 'Ver Arquitectura' : 'View Architecture'}
        </a>
      </div>
    </header>
  );
};
