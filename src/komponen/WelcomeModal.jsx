import { useState } from 'react';
import { supabase } from '../supabase';

export default function WelcomeModal({ onEnter }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_NAME = import.meta.env.VITE_ADMIN_NAME?.toLowerCase();

  function handleNameSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const isAdminName = trimmedName.toLowerCase() === ADMIN_NAME;
    if (isAdminName) {
      setStep('auth');
      setError('');
    } else {
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

    const trimmedName = name.trim();
    localStorage.setItem('visitor_name', trimmedName);
    localStorage.removeItem('is_admin');
    onEnter(trimmedName, true, data.session);
    setLoading(false);
  }

  function handleBackToName() {
    setStep('name');
    setError('');
    setEmail('');
    setPassword('');
  }

  const accent = '#1360d3';
  const accentMid = '#4b61a8';
  const bg = '#3a3b41';
  const cardBorder = '1px solid #3e3c52';
  const textPrimary = '#ffffff';
  const textSecondary = '#c4c2d8';
  const textMuted = '#8a88a8';
  const inputBg = '#1f1d2e';
  const inputBorder = '1px solid #3e3c52';

  const inputStyle = {
    width: '100%',
    padding: '13px 14px 13px 42px',
    fontSize: 15,
    borderRadius: 10,
    border: inputBorder,
    background: inputBg,
    color: textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const btnStyle = {
    width: '100%',
    padding: '14px',
    background: '#5b52cc',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    cursor: 'pointer',
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 20,
    }}>
      <div style={{
        background: bg,
        border: cardBorder,
        borderRadius: 24,
        padding: '2rem 1.75rem 1.75rem',
        maxWidth: 420,
        width: '100%',
        position: 'relative',
        textAlign: 'left',
      }}>

        {/* Accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 3,
          background: accentMid,
          borderRadius: '0 0 4px 4px',
        }} />

        {/* ── STEP: NAME ── */}
        {step === 'name' && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <div style={{
                width: 52, height: 52,
                borderRadius: 16,
                background: '#e8e7e7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#5b52cc" stroke="none">
                  <ellipse cx="6" cy="7.5" rx="1.8" ry="2.5"/>
                  <ellipse cx="10.5" cy="5.5" rx="1.8" ry="2.5"/>
                  <ellipse cx="15" cy="5.5" rx="1.8" ry="2.5"/>
                  <ellipse cx="19" cy="7.5" rx="1.8" ry="2.5"/>
                  <path d="M12 10c-3.5 0-6.5 2-6.5 5.5 0 2 1.5 3.5 3 3.5.8 0 1.5-.3 2-.5.5-.2.8-.3 1.5-.3s1 .1 1.5.3c.5.2 1.2.5 2 .5 1.5 0 3-1.5 3-3.5C18.5 12 15.5 10 12 10z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, color: textMuted, margin: 0, letterSpacing: '0.05em' }}>
                  RAOORAKU COMMISSION
                </p>
                <p style={{ fontSize: 18, fontWeight: 700, color: textPrimary, margin: '2px 0 0' }}>
                  Selamat datang!
                </p>
              </div>
            </div>

            {/* Greeting */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: textPrimary, margin: '0 0 6px', lineHeight: 1.2, textAlign: 'left' }}>
                Hei, siapa kamu?
              </h2>
              <p style={{ fontSize: 15, color: textSecondary, margin: 0, lineHeight: 1.5, textAlign: 'left' }}>
                Perkenalkan dirimu sebelum masuk ke galeri.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: textMuted, letterSpacing: '0.07em', display: 'block', marginBottom: 8, fontWeight: 600, textAlign: 'left' }}>
                  NAMA KAMU
                </label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }}
                    width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    style={inputStyle}
                    type="text"
                    placeholder="Nama / username kamu..."
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button type="submit" style={{ ...btnStyle, opacity: name.trim() ? 1 : 0.5, marginTop: 2 }} disabled={!name.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
                Masuk ke galeri
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 13, color: textMuted, margin: '1rem 0 0' }}>
              Namamu cuma disimpan di browser kamu
            </p>
          </>
        )}

        {/* ── STEP: AUTH (ADMIN) ── */}
        {step === 'auth' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <div style={{
                width: 52, height: 52,
                borderRadius: 16,
                background: '#FEF3C7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 11, color: textMuted, margin: 0, letterSpacing: '0.08em' }}>
                  RAOORAKU COMMISSION
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: textPrimary, margin: '2px 0 0' }}>
                  Area admin
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: textPrimary, margin: '0 0 6px', lineHeight: 1.2 }}>
                Halo, Admin!
              </h2>
              <p style={{ fontSize: 15, color: textSecondary, margin: 0, lineHeight: 1.5 }}>
                Masuk dengan email &amp; password akun kamu.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 12, color: textMuted, letterSpacing: '0.07em', display: 'block', marginBottom: 8, fontWeight: 600 }}>EMAIL</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }}
                    width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email admin..."
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: textMuted, letterSpacing: '0.07em', display: 'block', marginBottom: 8, fontWeight: 600 }}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: textMuted, pointerEvents: 'none' }}
                    width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    style={{ ...inputStyle, letterSpacing: 4 }}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    required
                  />
                </div>
              </div>

              {error && (
                <p style={{ fontSize: 13, color: '#DC2626', margin: 0, textAlign: 'center' }}>{error}</p>
              )}

              <button
                type="submit"
                style={{ ...btnStyle, background: '#B45309', marginTop: 2, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
              </button>

              <button
                type="button"
                onClick={handleBackToName}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: textMuted,
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Bukan admin? Kembali
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
