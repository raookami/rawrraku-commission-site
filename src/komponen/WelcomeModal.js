import { useState } from 'react';
import { supabase } from '../supabase';

export default function WelcomeModal({ theme, isDark, onEnter }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('name'); // 'name' | 'auth'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_NAME = process.env.REACT_APP_ADMIN_NAME?.toLowerCase();

  function handleNameSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const isAdminName = trimmedName.toLowerCase() === ADMIN_NAME;

    if (isAdminName) {
      // Lanjut ke step auth (Supabase)
      setStep('auth');
      setError('');
    } else {
      // Client biasa — langsung masuk, tanpa auth
      localStorage.setItem('visitor_name', trimmedName);
      localStorage.removeItem('is_admin');
      onEnter(trimmedName, false, null);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError('Email atau password salah!');
      setLoading(false);
      return;
    }

    // Sukses — simpan nama saja, TIDAK simpan is_admin di localStorage
    const trimmedName = name.trim();
    localStorage.setItem('visitor_name', trimmedName);
    localStorage.removeItem('is_admin'); // tidak pakai localStorage untuk admin
    onEnter(trimmedName, true, data.session);
    setLoading(false);
  }

  function handleBackToName() {
    setStep('name');
    setError('');
    setEmail('');
    setPassword('');
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
        {step === 'name' && (
          <>
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
              onSubmit={handleNameSubmit}
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
                  setError('');
                }}
                autoFocus
                required
              />
              <button type="submit" style={{ ...theme.btnPrimary, marginTop: 4 }}>
                Masuk ✨
              </button>
            </form>
          </>
        )}

        {step === 'auth' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: isDark ? '#eee' : '#222',
                marginBottom: 4,
              }}
            >
              Halo, Admin!
            </h2>
            <p
              style={{
                fontSize: 13,
                color: isDark ? '#aaa' : '#888',
                marginBottom: 24,
              }}
            >
              Masuk dengan email & password akun kamu
            </p>

            <form
              onSubmit={handleAdminLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <input
                style={{ ...theme.input, textAlign: 'center', fontSize: 15 }}
                type="email"
                placeholder="Email admin..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                autoFocus
                required
              />
              <input
                style={{
                  ...theme.input,
                  textAlign: 'center',
                  letterSpacing: 4,
                  fontSize: 16,
                }}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />

              {error && (
                <div style={{ fontSize: 13, color: '#e05', marginTop: -4 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                style={{ ...theme.btnPrimary, marginTop: 4, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin 🛡️'}
              </button>

              <button
                type="button"
                onClick={handleBackToName}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isDark ? '#888' : '#aaa',
                  fontSize: 13,
                  cursor: 'pointer',
                  marginTop: -4,
                }}
              >
                ← Bukan admin? Kembali
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
