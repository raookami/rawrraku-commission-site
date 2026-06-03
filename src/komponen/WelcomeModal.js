import { useState } from 'react';

export default function WelcomeModal({ theme, isDark, onEnter }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_NAME = process.env.REACT_APP_ADMIN_NAME?.toLowerCase();
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const isAdminName = trimmedName.toLowerCase() === ADMIN_NAME;

    if (isAdminName) {
      // Kalau nama admin, wajib input password
      if (!showPassword) {
        setShowPassword(true);
        setError('');
        return;
      }
      if (password !== ADMIN_PASSWORD) {
        setError('Password salah!');
        return;
      }
      // Login admin berhasil
      localStorage.setItem('visitor_name', trimmedName);
      localStorage.setItem('is_admin', 'true');
      onEnter(trimmedName, true);
    } else {
      // Client biasa
      localStorage.setItem('visitor_name', trimmedName);
      localStorage.removeItem('is_admin');
      onEnter(trimmedName, false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          background: isDark ? '#1e1e2e' : '#fff',
          border: isDark ? '1px solid #333' : '1px solid #e8e0f0',
          borderRadius: 24,
          padding: '40px 32px',
          maxWidth: 380,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 8 }}>🐺</div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: isDark ? '#eee' : '#222',
            marginBottom: 4,
          }}
        >
          Hai! Selamat datang!
        </h2>
        <p
          style={{
            fontSize: 14,
            color: isDark ? '#aaa' : '#888',
            marginBottom: 28,
          }}
        >
          Siapa namamu?
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            style={{
              ...theme.input,
              textAlign: 'center',
              fontSize: 16,
            }}
            type="text"
            placeholder="Nama / username kamu..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowPassword(false);
              setPassword('');
              setError('');
            }}
            autoFocus
            required
          />

          {showPassword && (
            <>
              <p style={{ fontSize: 13, color: isDark ? '#aaa' : '#888', margin: 0 }}>
                Halo admin! Masukkan password:
              </p>
              <input
                style={{
                  ...theme.input,
                  textAlign: 'center',
                  letterSpacing: 4,
                  fontSize: 16,
                }}
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoFocus
              />
            </>
          )}

          {error && (
            <div style={{ fontSize: 13, color: '#e05', marginTop: -4 }}>
              {error}
            </div>
          )}

          <button type="submit" style={{ ...theme.btnPrimary, marginTop: 4 }}>
            {showPassword ? 'Masuk sebagai Admin 🔐' : 'Masuk ✨'}
          </button>
        </form>
      </div>
    </div>
  );
}
