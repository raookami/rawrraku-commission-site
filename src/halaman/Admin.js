import AdminPanel from '../komponen/AdminPanel';

export default function Admin({ isDark, theme, isAdmin }) {
  if (!isAdmin) {
    return (
      <div className="page-enter" style={{ ...theme.page, textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
        <h2 style={{ ...theme.sectionTitle, marginBottom: 8 }}>Akses Ditolak</h2>
        <p style={{ fontSize: 14, color: isDark ? '#aaa' : '#888' }}>
          Halaman ini hanya untuk admin.
        </p>
      </div>
    );
  }

  return (
    <div className="page-enter" style={theme.page}>
      <AdminPanel theme={theme} isDark={isDark} />
    </div>
  );
}
