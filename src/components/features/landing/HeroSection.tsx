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
        {isEs ? 'Mapeo Espectral Activo' : 'Spectral Mapping Active'}
      </div>
      
      <h1 className="hero-title-modern">
        {isEs ? (
          <>Escribe Menos.<br/><span className="text-gradient-modern">Genera como un Pro.</span></>
        ) : (
          <>Prompt Less.<br/><span className="text-gradient-modern">Generate like a Pro.</span></>
        )}
      </h1>
      
      <p className="hero-subtitle-modern">
        {isEs 
          ? 'La arquitectura definitiva para extraer ADN visual de múltiples planos cinematográficos y convertirlos en prompts optimizados.'
          : 'The definitive architecture to extract visual DNA from cinematic frames and convert them into optimized prompts.'}
      </p>

      {/* Premium Prompt Showcase */}
      <div className="hero-manifest-showcase">
        <Card variant="glass" className="manifest-mockup card-main">
           <div className="mockup-header">
             <Badge variant="accent">VISUAL DNA v1.0</Badge>
             <span className="mockup-engine">FLUX.1 [dev]</span>
           </div>
           <p className="mockup-text">
             {isEs 
               ? 'Cinematic close-up, cyberpunk lighting, extreme detail, 8k, raw texture, anamorphic flare...'
               : 'Cinematic close-up, cyberpunk lighting, extreme detail, 8k, raw texture, anamorphic flare...'}
           </p>
        </Card>
        
        <Card variant="glass" className="manifest-mockup card-sub">
           <div className="mockup-header">
             <Badge variant="primary">ENGINE OPTIMIZED</Badge>
           </div>
           <p className="mockup-text small">
             hyper-realistic skin texture, micro-pores, volumetric dust particles, shallow depth of field...
           </p>
        </Card>
      </div>

      <div className="hero-cta-group">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="primary" size="lg" className="btn-hero-main">
               {isEs ? 'Comenzar Gratis' : 'Start for Free'}
               <IconArrowRight size={18} style={{ marginLeft: '12px' }} />
            </Button>
          </SignInButton>
        </Show>
  
        <Show when="signed-in">
          <Link href="/studio">
            <Button variant="primary" size="lg" className="btn-hero-main">
               {isEs ? 'Lanzar Workspace' : 'Launch Workspace'}
               <IconArrowRight size={18} style={{ marginLeft: '12px' }} />
            </Button>
          </Link>
        </Show>
        
        <Link href="#features">
          <Button variant="ghost" size="lg" className="btn-hero-secondary">
            {isEs ? 'Ver Arquitectura' : 'View Architecture'}
          </Button>
        </Link>
      </div>
    </header>
  );
};
