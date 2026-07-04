import AdminPanel from '../komponen/AdminPanel';

export default function Admin({ isAdmin }) {
  if (!isAdmin) {
    return (
      <div className="page-enter" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
        <h2 className="section-title">Akses Ditolak</h2>
        <p className="section-desc">Halaman ini hanya untuk admin.</p>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <AdminPanel />
    </div>
  );
}
