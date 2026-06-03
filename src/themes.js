import './styles.css';

// Warna utama
const blue = '#5e81d1'; // biru utama (brand)
const blueLight = '#c8d8f8'; // biru muda untuk border
const navy = '#1a2340'; // deep navy
const iceBlue = '#e8f0fc'; // ice blue untuk background

// ============================================================
// LIGHT THEME
// ============================================================
const light = {
  bg: iceBlue,
  surface: '#ffffff',
  border: blueLight,
  text: '#1a2340',
  textMuted: '#4a5c80',
  textLight: '#7a90b8',
  blue,
  blueLight,

  app: {
    minHeight: '100vh',
    background: iceBlue,
    fontFamily: "'Segoe UI', sans-serif",
    color: '#1a2340',
    transition: 'background 0.3s, color 0.3s',
  },

  header: {
    background: '#ffffff',
    borderBottom: '2px solid ' + blueLight,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'background 0.3s, border-color 0.3s',
  },
  headerInner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  logo: {
    margin: 0,
    fontSize: 22,
    color: blue,
    fontWeight: 700,
  },
  tagline: {
    margin: '2px 0 0',
    fontSize: 12,
    color: '#7a90b8',
  },
  nav: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  navBtn: {
    padding: '8px 16px',
    borderRadius: 999,
    border: '1.5px solid ' + blueLight,
    background: 'white',
    cursor: 'pointer',
    fontSize: 14,
    color: '#7a90b8',
    transition: 'all 0.2s',
  },
  navBtnActive: {
    background: blue,
    color: 'white',
    borderColor: blue,
  },
  themeToggle: {
    padding: '8px 12px',
    borderRadius: 999,
    border: '1.5px solid ' + blueLight,
    background: 'white',
    cursor: 'pointer',
    fontSize: 16,
    lineHeight: 1,
    transition: 'all 0.2s',
  },

  main: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '20px 20px 60px',
    overflowX: 'hidden',
  },
  page: {
    animation: 'fadeIn 0.3s ease',
  },

  hero: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: blue,
    margin: '0 0 12px',
  },
  heroDesc: {
    fontSize: 16,
    color: '#4a5c80',
    maxWidth: 500,
    margin: '0 auto 24px',
    lineHeight: 1.7,
  },
  heroButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  btnPrimary: {
    padding: '12px 24px',
    borderRadius: 999,
    border: 'none',
    background: blue,
    color: 'white',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '12px 24px',
    borderRadius: 999,
    border: '2px solid ' + blue,
    background: 'transparent',
    color: blue,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: {
    padding: '12px 24px',
    borderRadius: 999,
    border: 'none',
    background: '#ddd',
    color: '#aaa',
    fontSize: 15,
    cursor: 'not-allowed',
  },

  statusBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    padding: '12px 20px',
    marginBottom: 24,
    fontSize: 15,
    transition: 'background 0.3s, border-color 0.3s',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'pulse 1.5s infinite',
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 16,
    marginTop: 8,
  },
  infoCard: {
    background: 'white',
    border: '1.5px solid ' + blueLight,
    borderRadius: 16,
    padding: '20px 16px',
    textAlign: 'center',
    transition: 'background 0.3s, border-color 0.3s',
  },
  infoIcon: { fontSize: 28, marginBottom: 8 },
  infoLabel: { fontSize: 12, color: '#7a90b8', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: 600, color: '#1a2340' },

  sectionTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: blue,
    marginBottom: 8,
  },
  sectionDesc: {
    color: '#4a5c80',
    marginBottom: 24,
  },

  portfolioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  portfolioCard: {
    borderRadius: 16,
    overflow: 'hidden',
    background: 'white',
    border: '1.5px solid ' + blueLight,
    transition: 'background 0.3s, border-color 0.3s',
  },
  portfolioImg: {
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
  },
  portfolioLabel: {
    margin: 0,
    padding: '10px 14px',
    fontSize: 14,
    fontWeight: 600,
    color: '#1a2340',
  },

  tip: {
    marginTop: 24,
    padding: '14px 18px',
    background: '#eef4ff',
    border: '1.5px solid ' + blueLight,
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.6,
    color: '#3a5080',
  },

  commissionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 32,
  },
  commCard: {
    background: 'white',
    border: '1.5px solid ' + blueLight,
    borderRadius: 20,
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'background 0.3s, border-color 0.3s',
  },
  commEmoji: { fontSize: 36 },
  commType: { margin: 0, fontSize: 18, fontWeight: 700, color: '#1a2340' },
  commPrice: { margin: 0, fontSize: 22, fontWeight: 800, color: blue },
  commDesc: {
    margin: 0,
    fontSize: 13,
    color: '#4a5c80',
    lineHeight: 1.5,
    flex: 1,
  },
  commSlots: { fontSize: 13, color: '#888' },

  tos: {
    background: iceBlue,
    border: '1.5px solid ' + blueLight,
    borderRadius: 16,
    padding: '20px 24px',
    transition: 'background 0.3s, border-color 0.3s',
  },
  tosTitle: { margin: '0 0 12px', fontSize: 16, color: '#1a2340' },
  tosList: {
    margin: 0,
    paddingLeft: 20,
    lineHeight: 2,
    fontSize: 14,
    color: '#3a5080',
  },

  form: {
    background: 'white',
    border: '1.5px solid ' + blueLight,
    borderRadius: 20,
    padding: 28,
    maxWidth: 580,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    transition: 'background 0.3s, border-color 0.3s',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a2340',
  },
  input: {
    padding: '10px 14px',
    border: '1.5px solid ' + blueLight,
    borderRadius: 10,
    fontSize: 15,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    background: iceBlue,
    color: '#1a2340',
    transition: 'background 0.3s, border-color 0.3s, color 0.3s',
  },
  successBox: {
    textAlign: 'center',
    padding: '48px 24px',
    background: 'white',
    border: '1.5px solid ' + blueLight,
    borderRadius: 20,
    maxWidth: 400,
    margin: '0 auto',
  },

  footer: {
    textAlign: 'center',
    padding: '24px 20px',
    borderTop: '1.5px solid ' + blueLight,
    fontSize: 14,
    color: '#7a90b8',
    transition: 'border-color 0.3s',
  },

  btnVariant: {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1.5px solid ' + blueLight,
    background: iceBlue,
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    fontSize: 14,
    color: '#1a2340',
    transition: 'background 0.3s, border-color 0.3s',
  },
};

// ============================================================
// DARK THEME — deep navy + ice blue gelap
// ============================================================
const dark = {
  ...light,

  bg: '#0d1424',
  surface: '#151e30',
  border: '#2a3a5a',
  text: '#e0eaf8',
  textMuted: '#8aa0c8',
  textLight: '#6a80a8',
  blue,
  blueLight: '#2a3a5a',

  // Add animation styles
  heroDesc: {
    ...light.heroDesc,
    color: '#8aa0c8',
    animation: 'fadeIn 1s ease-in-out forwards',
  },
  formGroup: {
    ...light.formGroup,
    animation: 'pulse 2s 1 ease-in-out', // Mengubah nilai ini
  },

  app: {
    ...light.app,
    background: '#0d1424',
    color: '#e0eaf8',
  },
  header: {
    ...light.header,
    background: '#111928',
    borderBottom: '2px solid #2a3a5a',
  },
  tagline: {
    ...light.tagline,
    color: '#6a80a8',
  },
  navBtn: {
    ...light.navBtn,
    border: '1.5px solid #2a3a5a',
    background: '#151e30',
    color: '#8aa0c8',
  },
  themeToggle: {
    ...light.themeToggle,
    border: '1.5px solid #2a3a5a',
    background: '#151e30',
  },
  heroDesc: {
    ...light.heroDesc,
    color: '#8aa0c8',
  },
  btnSecondary: {
    ...light.btnSecondary,
    color: blue,
  },
  infoCard: {
    ...light.infoCard,
    background: '#151e30',
    border: '1.5px solid #2a3a5a',
  },
  infoLabel: { fontSize: 12, color: '#6a80a8', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: 600, color: '#e0eaf8' },
  sectionDesc: {
    color: '#8aa0c8',
    marginBottom: 24,
  },
  portfolioCard: {
    ...light.portfolioCard,
    background: '#151e30',
    border: '1.5px solid #2a3a5a',
  },
  portfolioLabel: {
    ...light.portfolioLabel,
    color: '#c0d0e8',
  },
  tip: {
    ...light.tip,
    background: '#111928',
    border: '1.5px solid #2a3a5a',
    color: '#8aa0c8',
  },
  commCard: {
    ...light.commCard,
    background: '#151e30',
    border: '1.5px solid #2a3a5a',
  },
  commDesc: {
    ...light.commDesc,
    color: '#8aa0c8',
  },
  commSlots: { fontSize: 13, color: '#506080' },
  commType: { ...light.commType, color: '#e0eaf8' },
  tos: {
    ...light.tos,
    background: '#111928',
    border: '1.5px solid #2a3a5a',
  },
  tosTitle: { margin: '0 0 12px', fontSize: 16, color: '#e0eaf8' },
  tosList: {
    ...light.tosList,
    color: '#8aa0c8',
  },
  form: {
    ...light.form,
    background: '#151e30',
    border: '1.5px solid #2a3a5a',
  },
  label: {
    ...light.label,
    color: '#c0d0e8',
  },
  input: {
    ...light.input,
    background: '#0d1424',
    border: '1.5px solid #2a3a5a',
    color: '#e0eaf8',
  },
  successBox: {
    ...light.successBox,
    background: '#151e30',
    border: '1.5px solid #2a3a5a',
  },
  footer: {
    ...light.footer,
    borderTop: '1.5px solid #2a3a5a',
    color: '#506080',
  },
  btnVariant: {
    ...light.btnVariant,
    border: '1.5px solid #2a3a5a',
    background: '#0d1424',
    color: '#e0eaf8',
  },
};

export function getTheme(isDark) {
  return isDark ? dark : light;
}

export function getStatusStyle(isOpen, isDark) {
  if (isDark) {
    return {
      background: isOpen ? '#0a1a10' : '#1a0a0a',
      border: `1.5px solid ${isOpen ? '#1a4a2a' : '#4a1a1a'}`,
    };
  }
  return {
    background: isOpen ? '#efffef' : '#fff0f0',
    border: `1.5px solid ${isOpen ? '#a0e0a0' : '#f0a0a0'}`,
  };
}
