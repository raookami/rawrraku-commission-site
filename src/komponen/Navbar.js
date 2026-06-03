import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/portfolio', label: 'Portfolio', icon: '🖼️' },
  { path: '/commission', label: 'Commission', icon: '🎨' },
  { path: '/order', label: 'Order', icon: '📝' },
  { path: '/ulasan', label: 'Ulasan', icon: '✍️' },
  { path: '/reviews', label: 'Reviews', icon: '⭐' },
  { path: '/admin', label: '🔐', icon: '🔐' },
];

export default function Navbar({ isDark, toggleTheme, theme }) {
  const location = useLocation();

  return (
    <>
      {/* ===== NAVBAR ATAS (DESKTOP) ===== */}
      <header style={theme.header}>
        <div style={theme.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <h1 style={theme.logo}>🐺 RAOORAKU</h1>
              <p style={theme.tagline}>Illustrator · Commission Open</p>
            </div>
            <button
              onClick={toggleTheme}
              className="mobile-theme-toggle"
              style={{ ...theme.themeToggle, display: 'none' }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>

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
            <button
              onClick={toggleTheme}
              style={theme.themeToggle}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>
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
            <span
              style={{
                fontSize: 10,
                fontWeight: location.pathname === path ? 700 : 400,
              }}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
