'use client';

import Link from 'next/link';
import { SignInButton, Show } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';

export const Navbar = ({ isEs = true }: { isEs?: boolean }) => {
  return (
    <nav className="landing-nav">
      <div className="landing-logo">
        Proms<span className="accent-dot">.</span>
      </div>
      <div className="landing-links">
        <Link href="#gallery">{isEs ? 'Resultados' : 'Showcase'}</Link>
        <Link href="#features">{isEs ? 'Tecnología' : 'Tech'}</Link>
        <div className="nav-separator"></div>
        
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" className="btn-modern">
               {isEs ? 'Entrar al Estudio' : 'Enter Studio'}
            </Button>
          </SignInButton>
        </Show>
        
        <Show when="signed-in">
          <Link href="/studio">
            <Button variant="secondary" className="btn-modern">
               {isEs ? 'Ir a mi Workspace' : 'My Workspace'}
            </Button>
          </Link>
        </Show>
      </div>
    </nav>
  );
};

export const Footer = ({ isEs = true }: { isEs?: boolean }) => {
  return (
    <footer className="footer-modern">
      <div className="footer-content">
        <div className="landing-logo">Proms<span className="accent-dot">.</span></div>
        <p>{isEs ? 'Herramientas Vercel-Grade para Diseñadores 10x.' : 'Vercel-Grade Tools for 10x Designers.'}</p>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Proms AI Workspace.</span>
        <span>{isEs ? 'Desarrollado con Arquitectura Avanzada AI.' : 'Built with Advanced AI Architecture.'}</span>
      </div>
    </footer>
  );
};
