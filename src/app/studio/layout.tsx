import { UserButton, Show } from '@clerk/nextjs';
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="saas-layout">
      <aside className="saas-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">✧</span>
          <span className="logo-text">Proms<span style={{ color: "var(--accent-primary)" }}>.</span></span>
        </div>
        <nav className="sidebar-nav">
          <a href="/studio" className="nav-item active">
            <span className="nav-icon">⚡</span>
            <span className="nav-label">Studio</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🎭</span>
            <span className="nav-label">Camerino</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📚</span>
            <span className="nav-label">Historial</span>
          </a>
        </nav>

        {/* User Profile Hook (Clerk) */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Show when="signed-in">
            <UserButton appearance={{ elements: { userButtonAvatarBox: { width: '36px', height: '36px' } } }} />
          </Show>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>Director de Arte</p>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#a1a1aa' }}>Plan Free</p>
          </div>
        </div>
      </aside>
      <main className="saas-main">
        {children}
      </main>
    </div>
  );
}
