'use client';

import { UserButton, SignedIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const { isEs } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { label: isEs ? 'Estudio' : 'Studio', href: '/studio', icon: '⚡' },
    { label: isEs ? 'Camerino' : 'Dressing Room', href: '#', icon: '🎭' },
    { label: isEs ? 'Historial' : 'History', href: '#', icon: '📚' },
  ];

  return (
    <div className="saas-layout">
      {/* Primary Global Sidebar */}
      <aside className="saas-sidebar">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <span className="logo-icon">✧</span>
            <span className="logo-text">Proms<span className="accent-dot">.</span></span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-profile">
          <div className="profile-top">
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: { width: '32px', height: '32px' } } }} />
            </SignedIn>
            <div className="profile-info">
              <p className="profile-name">Director_01</p>
              <span className="plan-badge">FREE PLAN</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="saas-main">
        {children}
      </main>
    </div>
  );
}
