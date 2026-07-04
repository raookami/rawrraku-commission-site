import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { path: '/',           label: 'Home' },
  { path: '/portfolio',  label: 'Portfolio' },
  { path: '/commission', label: 'Commission' },
  { path: '/order',      label: 'Order' },
  { path: '/ulasan',     label: 'Ulasan' },
  { path: '/reviews',    label: 'Reviews' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/raooraku_',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@raooraku_',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18a4 4 0 1 0 4-4V2" />
        <path d="M13 6c1 2 3.5 4 6 4" />
      </svg>
    ),
  },
  {
    label: 'USD Commission',
    href: 'https://vgen.co/raooraku_',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M14.31 8h-3.62a2 2 0 0 0 0 4h2.62a2 2 0 0 1 0 4H9" />
        <line x1="12" y1="6" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="18" />
      </svg>
    ),
  },
];

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-col footer-brand">
          <h4 className="footer-logo">RAWRMISSION</h4>
          <p className="footer-tagline">
            Cute boy character illustration &amp; design oleh{' '}
            <a href="https://instagram.com/raooraku_" target="_blank" rel="noopener noreferrer">
              Raooraku
            </a>.
          </p>
          <button className="footer-cta" onClick={() => navigate('/commission')}>
            Lihat Commission ✦
          </button>
        </div>

        {/* Navigasi */}
        <div className="footer-col">
          <h5 className="footer-heading">Navigasi</h5>
          <ul className="footer-links">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link to={path}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="footer-col">
          <h5 className="footer-heading">Connect</h5>
          <ul className="footer-links">
            <li><a href="https://instagram.com/raooraku_" target="_blank" rel="noopener noreferrer">Instagram @raooraku_</a></li>
            <li><a href="https://tiktok.com/@raooraku_" target="_blank" rel="noopener noreferrer">TikTok @raooraku_</a></li>
            <li><a href="https://vgen.co/raooraku_" target="_blank" rel="noopener noreferrer">USD Commission ↗</a></li>
          </ul>
          <div className="footer-socials">
            {socialLinks.map(({ label, href, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label={label} title={label}>
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} RAWRMISSION by Raooraku. All artworks reserved.</p>
        <p className="footer-made">Made with ❤️ &amp; React</p>
      </div>
    </footer>
  );
}
