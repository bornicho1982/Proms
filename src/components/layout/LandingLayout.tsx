'use client';

import Link from 'next/link';
import { SignInButton, UserButton, Show } from '@clerk/nextjs';
import { Button } from '@/components/ui/Button';

export const Navbar = ({ 
  isEs = true, 
  language, 
  setLanguage 
}: { 
  isEs?: boolean; 
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
}) => {
  return (
    <nav className="landing-nav">
      <div className="nav-container">
        <div className="landing-logo">
          Proms<span className="accent-dot">.</span>
        </div>
        
        <div className="nav-center">
          <Link href="#gallery" className="nav-link">{isEs ? 'Resultados' : 'Showcase'}</Link>
          <Link href="#features" className="nav-link">{isEs ? 'Tecnología' : 'Tech'}</Link>
        </div>

        <div className="nav-right">
          <div className="nav-lang-switcher">
            <button className={language === 'es' ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
            <span className="sep">/</span>
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
          </div>

          <div className="nav-separator"></div>
          
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="btn-nav">
                 {isEs ? 'Entrar' : 'Sign In'}
              </Button>
            </SignInButton>
          </Show>
          
          <Show when="signed-in">
            <Link href="/studio">
              <Button variant="primary" size="sm" className="btn-nav">
                 {isEs ? 'Ir a mi Workspace' : 'My Workspace'}
              </Button>
            </Link>
            <UserButton />
          </Show>
        </div>
      </div>
    </nav>
  );
};

export const Footer = ({ isEs = true }: { isEs?: boolean }) => {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="landing-logo">Proms<span className="accent-dot">.</span></div>
            <p className="footer-tagline">
              {isEs ? 'Herramientas de grado industrial para directores de arte modernos.' : 'Industrial-grade tools for modern art directors.'}
            </p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/studio">Studio</Link>
              <Link href="#features">Features</Link>
              <Link href="#gallery">Showcase</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <div className="copyright">© 2026 Proms Studio by ART_DIR.</div>
          <div className="social-links">
             {isEs ? 'Arquitectura Avanzada IA' : 'Advanced AI Architecture'}
          </div>
        </div>
      </div>
    </footer>
  );
};
