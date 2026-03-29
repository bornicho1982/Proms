'use client';

import { useState } from 'react';
import { Navbar, Footer } from '@/components/layout/LandingLayout';
import { HeroSection } from '@/components/features/landing/HeroSection';
import { VisualMockup } from '@/components/features/landing/VisualMockup';
import { GallerySection, FeatureGrid } from '@/components/features/landing/FeatureSections';

export default function LandingPage() {
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const isEs = language === 'es';

  return (
    <div className="landing-container dots-bg">
      {/* Glow Effect */}
      <div className="hero-glow-orb" />
      
      {/* Layout: Navbar */}
      <Navbar isEs={isEs} />

      {/* Hero Section */}
      <HeroSection isEs={isEs} />

      {/* Product Mockup / Tech Demo */}
      <VisualMockup isEs={isEs} />

      {/* Main Content Sections */}
      <main className="section-main">
        <GallerySection isEs={isEs} />
        <FeatureGrid isEs={isEs} />
      </main>

      {/* Language Switcher (Floating or bottom) */}
      <div className="landing-lang-toggle">
        <button className={isEs ? 'active' : ''} onClick={() => setLanguage('es')}>ES</button>
        <button className={!isEs ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
      </div>

      {/* Layout: Footer */}
      <Footer isEs={isEs} />
    </div>
  );
}
