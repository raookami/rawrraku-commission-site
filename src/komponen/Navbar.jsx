import { Link, useLocation } from 'react-router-dom';

const centerTabs = [
  { path: '/',            label: 'Home',       icon: '🏠' },
  { path: '/portfolio',   label: 'Portfolio',  icon: '🖼️' },
  { path: '/commission',  label: 'Commission', icon: '🎨' },
  { path: '/ulasan',      label: 'Ulasan',     icon: '✍️' },
  { path: '/reviews',     label: 'Reviews',    icon: '⭐' },
];

const orderTab = { path: '/order', label: 'Order', icon: '🛒' };
const adminTab = { path: '/admin', label: 'Admin', icon: '🔐' };

// Urutan untuk bottom nav (mobile) — Order tetap di antara menu lain
const bottomTabsBase = [
  centerTabs[0],
  centerTabs[1],
  centerTabs[2],
  orderTab,
  centerTabs[3],
  centerTabs[4],
];

export default function Navbar({ isAdmin, visitorName, onLogout }) {
  const location = useLocation();

  const navTabs = isAdmin ? [...centerTabs, adminTab] : centerTabs;
  const bottomTabs = isAdmin ? [...bottomTabsBase, adminTab] : bottomTabsBase;

  const showLogout = !!visitorName && !isAdmin;

  return (
    <>
      {/* ===== NAVBAR ATAS ===== */}
      <header className="site-header">
        <div className="header-inner">

          {/* Kiri: tombol keluar (untuk visitor biasa) */}
          <div className="header-side header-side-left">
            {showLogout && (
              <button
                type="button"
                className="logout-btn"
                onClick={onLogout}
                title="Keluar dari sesi"
              >
                <span className="logout-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </span>
                <span className="logout-label">Keluar{visitorName ? `, ${visitorName}` : ''}</span>
              </button>
            )}
          </div>

          {/* Tengah: nav links */}
          <nav className="header-nav">
            {navTabs.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link${location.pathname === path ? ' nav-link-active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Kanan: tombol troli (Order) */}
          <div className="header-side header-side-right">
            <Link
              to="/order"
              className={`cart-btn${location.pathname === '/order' ? ' cart-btn-active' : ''}`}
              title="Order"
              aria-label="Order"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 2-1.58l1.65-7.41H5.12" />
              </svg>
              <span className="cart-label">Order</span>
            </Link>
          </div>

          {/* Mobile: sapaan */}
          {visitorName && (
            <span className="visitor-greeting mobile-greeting">
              Hii, {visitorName}! 👋
            </span>
          )}
        </div>
      </header>

      {/* ===== BOTTOM NAVBAR (MOBILE) ===== */}
      <nav className="bottom-nav">
        {bottomTabs.map(({ path, icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`bottom-nav-item${location.pathname === path ? ' bottom-nav-active' : ''}`}
          >
            <span className="bottom-nav-icon">{icon}</span>
            <span className="bottom-nav-label">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
