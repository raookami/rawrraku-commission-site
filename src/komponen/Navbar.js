import { Link, useLocation } from 'react-router-dom';

const publicTabs = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/portfolio', label: 'Portfolio', icon: '🖼️' },
  { path: '/commission', label: 'Commission', icon: '🎨' },
  { path: '/order', label: 'Order', icon: '📝' },
  { path: '/ulasan', label: 'Ulasan', icon: '✍️' },
  { path: '/reviews', label: 'Reviews', icon: '⭐' },
];

const adminTab = { path: '/admin', label: '🔐 Admin', icon: '🔐' };

export default function Navbar({ isDark, toggleTheme, theme, isAdmin, visitorName }) {
  const location = useLocation();
  const tabs = isAdmin ? [...publicTabs, adminTab] : publicTabs;

  return (
    <>
      {/* ===== NAVBAR ATAS (DESKTOP + MOBILE TOP) ===== */}
      <header style={theme.header}>
        <div style={theme.headerInner}>
          {/* Kiri: Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <h1 style={theme.logo}>🐺 RAOORAKU</h1>
              <p style={theme.tagline}>Illustrator · Commission Open</p>
            </div>
          </div>

          {/* Kanan desktop: nav links + sapaan + toggle */}
          <nav style={theme.nav}>
            {tabs.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                style={{
                  ...theme.navBtn,
                  ...(location.pathname === path ? theme.navBtnActive : {}),
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}

            {visitorName && (
              <span style={{ fontSize: 13, color: isDark ? '#aaa' : '#888', padding: '0 4px' }}>
                Hii, {visitorName}!
              </span>
            )}

            <button
              onClick={toggleTheme}
              style={theme.themeToggle}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>

          {/* Kanan mobile: sapaan + toggle — hanya tampil di mobile */}
          <div
            className="mobile-right"
            style={{ display: 'none', alignItems: 'center', gap: 8 }}
          >
            {visitorName && (
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? '#ccc' : '#555',
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                borderRadius: 999,
                padding: '4px 10px',
              }}>
                Hii, {visitorName}! 👋
              </span>
            )}
            <button onClick={toggleTheme} style={theme.themeToggle}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* ===== BOTTOM NAVBAR (MOBILE) ===== */}
      <nav
        className="bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: isDark ? '#1e1e2e' : '#ffffff',
          borderTop: isDark ? '1px solid #333' : '1px solid #e0e0e0',
          zIndex: 100,
          padding: '6px 0 10px',
        }}
      >
        {tabs.map(({ path, icon, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              textDecoration: 'none',
              padding: '4px 0',
              color:
                location.pathname === path
                  ? '#5e81d1'
                  : isDark
                    ? '#888'
                    : '#aaa',
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 10, fontWeight: location.pathname === path ? 700 : 400 }}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
