import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusStyle } from '../themes';
import ReviewMarquee from '../komponen/ReviewMarquee';
import { supabase } from '../supabase';

// ─── GIF Editor (admin only) ────────────────────────────────────────────────
function GifEditor({ isDark, onClose, currentSettings, onSave }) {
  const [size, setSize] = useState(currentSettings.size || 100);
  const [posX, setPosX] = useState(currentSettings.posX || 50);
  const [posY, setPosY] = useState(currentSettings.posY || 50);
  const [scale, setScale] = useState(currentSettings.scale || 100);
  const [gifSrc, setGifSrc] = useState(currentSettings.gifSrc || '/lv_0_20250116221257.gif');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  // Pakai ref agar onMove selalu baca nilai terkini (hindari stale closure)
  const posXRef = useRef(posX);
  const posYRef = useRef(posY);
  useEffect(() => { posXRef.current = posX; }, [posX]);
  useEffect(() => { posYRef.current = posY; }, [posY]);

  function startDrag(e) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = posXRef.current;
    const startPosY = posYRef.current;

    function onMove(ev) {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      // sensitivity: tiap 2px drag = 1% pergeseran
      const newX = Math.max(0, Math.min(100, startPosX + dx / 2));
      const newY = Math.max(0, Math.min(100, startPosY + dy / 2));
      setPosX(newX);
      setPosY(newY);
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  async function handleUploadGif(e) {
    const file = e.target.files[0];
    if (!file) return;
    const CLOUD_NAME = 'dvxznh0cz';
    const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (!UPLOAD_PRESET) {
      alert('Upload preset Cloudinary belum diisi di .env!');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setGifSrc(data.secure_url);
      } else {
        alert('Gagal upload: ' + (data.error?.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Gagal upload: ' + err.message);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSave() {
    setSaving(true);
    const settings = { size, posX, posY, scale, gifSrc };
    await Promise.all([
      supabase.from('settings').upsert({ key: 'gif_size', value: String(size) }, { onConflict: 'key' }),
      supabase.from('settings').upsert({ key: 'gif_posX', value: String(posX) }, { onConflict: 'key' }),
      supabase.from('settings').upsert({ key: 'gif_posY', value: String(posY) }, { onConflict: 'key' }),
      supabase.from('settings').upsert({ key: 'gif_scale', value: String(scale) }, { onConflict: 'key' }),
      supabase.from('settings').upsert({ key: 'gif_src', value: gifSrc }, { onConflict: 'key' }),
    ]);
    setSaving(false);
    onSave(settings);
    onClose();
  }

  const overlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  };
  const modal = {
    background: isDark ? '#1a1a2e' : '#fff',
    borderRadius: 20, padding: 28, width: '90%', maxWidth: 420,
    boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
  };
  const label = { fontSize: 12, fontWeight: 700, color: isDark ? '#aaa' : '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' };
  const sliderStyle = { width: '100%', accentColor: '#5e81d1', cursor: 'pointer' };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: isDark ? '#eee' : '#333' }}>✏️ Edit GIF</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: isDark ? '#aaa' : '#888' }}>×</button>
        </div>

        {/* Preview lingkaran — onMouseDown di container bukan img */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div
            onMouseDown={startDrag}
            style={{ position: 'relative', width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: '3px solid #5e81d1', cursor: 'grab', flexShrink: 0, userSelect: 'none' }}
          >
            <img
              src={gifSrc}
              alt="GIF Preview"
              draggable={false}
              style={{
                width: `${scale}%`,
                height: `${scale}%`,
                objectFit: 'cover',
                position: 'absolute',
                left: `${posX}%`,
                top: `${posY}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginBottom: 16, marginTop: -12 }}>
          Drag gambar di preview untuk geser posisi
        </p>

        {/* Ukuran lingkaran */}
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Ukuran lingkaran: <strong>{size}px</strong></label>
          <input type="range" min={60} max={220} value={size} onChange={(e) => setSize(Number(e.target.value))} style={sliderStyle} />
        </div>

        {/* Zoom gambar */}
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Zoom gambar: <strong>{scale}%</strong></label>
          <input type="range" min={100} max={300} value={scale} onChange={(e) => setScale(Number(e.target.value))} style={sliderStyle} />
        </div>

        {/* Posisi X */}
        <div style={{ marginBottom: 14 }}>
          <label style={label}>Geser kiri / kanan: <strong>{Math.round(posX)}%</strong></label>
          <input type="range" min={0} max={100} value={posX} onChange={(e) => setPosX(Number(e.target.value))} style={sliderStyle} />
        </div>

        {/* Posisi Y */}
        <div style={{ marginBottom: 20 }}>
          <label style={label}>Geser atas / bawah: <strong>{Math.round(posY)}%</strong></label>
          <input type="range" min={0} max={100} value={posY} onChange={(e) => setPosY(Number(e.target.value))} style={sliderStyle} />
        </div>

        {/* Upload GIF baru */}
        <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f0ff' }}>
          <label style={label}>Upload GIF baru</label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, background: uploading ? '#aaa' : '#5e81d1', color: 'white', fontWeight: 600, fontSize: 13, cursor: uploading ? 'not-allowed' : 'pointer' }}>
            {uploading ? '⏳ Uploading...' : '📤 Pilih GIF / IMG'}
            <input ref={fileRef} type="file" accept="image/*,image/gif" onChange={handleUploadGif} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #aaa', background: 'transparent', color: isDark ? '#ccc' : '#666', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Batal
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: '10px', borderRadius: 10, border: 'none', background: saving ? '#aaa' : '#5e81d1', color: 'white', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? '💾 Menyimpan...' : '💾 Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Home ────────────────────────────────────────────────────────────────────
export default function Home({ isDark, theme, isAdmin }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [showGifEditor, setShowGifEditor] = useState(false);
  const [gifSettings, setGifSettings] = useState({
    size: 100, posX: 50, posY: 50, scale: 100,
    gifSrc: '/lv_0_20250116221257.gif',
  });
  const [info, setInfo] = useState({
    hero_desc: 'specialize in cute male character design.',
    info_estimasi: '7–14 hari kerja',
    info_pembayaran: 'Transfer Bank / E-WALLET',
    info_revisi: '2x revisi minor',
    info_format: 'PNG / JPG 300dpi',
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('key, value');
      if (data && data.length > 0) {
        const map = {};
        data.forEach((s) => { map[s.key] = s.value; });
        setInfo((prev) => ({ ...prev, ...map }));
        if (map.commission_open !== undefined) {
          setIsOpen(map.commission_open === 'true');
        }
        setGifSettings((prev) => ({
          ...prev,
          size: map.gif_size ? Number(map.gif_size) : prev.size,
          posX: map.gif_posX ? Number(map.gif_posX) : prev.posX,
          posY: map.gif_posY ? Number(map.gif_posY) : prev.posY,
          scale: map.gif_scale ? Number(map.gif_scale) : prev.scale,
          gifSrc: map.gif_src || prev.gifSrc,
        }));
      }
    }
    fetchSettings();
  }, []);

  return (
    <div className="page-enter">
      {showGifEditor && (
        <GifEditor
          isDark={isDark}
          onClose={() => setShowGifEditor(false)}
          currentSettings={gifSettings}
          onSave={(s) => setGifSettings(s)}
        />
      )}

      <ReviewMarquee isDark={isDark} onClickReviews={() => navigate('/reviews')} />

      <div style={theme.page}>
        {/* Hero */}
        <div style={theme.hero}>
          {/* Lingkaran GIF — klik untuk edit kalau admin */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              style={{
                width: gifSettings.size,
                height: gifSettings.size,
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                cursor: isAdmin ? 'pointer' : 'default',
              }}
              onClick={() => isAdmin && setShowGifEditor(true)}
              title={isAdmin ? 'Klik untuk edit GIF' : ''}
            >
              <img
                src={gifSettings.gifSrc}
                alt="Raooraku"
                draggable={false}
                style={{
                  width: `${gifSettings.scale}%`,
                  height: `${gifSettings.scale}%`,
                  objectFit: 'cover',
                  position: 'absolute',
                  left: `${gifSettings.posX}%`,
                  top: `${gifSettings.posY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
            {isAdmin && (
              <div
                onClick={() => setShowGifEditor(true)}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: '50%',
                  background: '#5e81d1', border: '2px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
                title="Edit GIF"
              >
                ✏️
              </div>
            )}
          </div>

          <h2 style={theme.heroTitle}>HI! I'M RAOORAKU ✨</h2>
          <p style={theme.heroDesc}>{info.hero_desc}</p>
          <div style={theme.heroButtons}>
            <button style={theme.btnPrimary} onClick={() => navigate('/commission')}>IDR COMMISSION</button>
            <button style={theme.btnSecondary} onClick={() => navigate('/portfolio')}>PORTFOLIO</button>
            <button style={theme.btnSecondary} onClick={() => window.open('https://vgen.co/raooraku_', '_blank')}>USD COMMISSION ↗</button>
          </div>
        </div>

        {/* Status commission */}
        <div style={{ ...theme.statusBox, ...getStatusStyle(isOpen, isDark), color: isOpen ? '#5ed15e' : '#ca5b5b' }}>
          <span style={{ ...theme.statusDot, background: isOpen ? '#0c0' : '#e00' }} />
          <strong>{isOpen ? 'COMMISSION OPEN' : 'COMMISSION CLOSED'}</strong>
          <button
            onClick={async () => {
              if (!isAdmin) return;
              const newStatus = !isOpen;
              setIsOpen(newStatus);
              await supabase.from('settings').upsert({ key: 'commission_open', value: String(newStatus) }, { onConflict: 'key' });
            }}
            style={{ marginLeft: 'auto', padding: '4px 14px', borderRadius: 999, border: 'none', background: isAdmin ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent', cursor: isAdmin ? 'pointer' : 'default', fontSize: 12, color: isAdmin ? (isDark ? '#ccc' : '#555') : 'transparent' }}
          >
            {isAdmin ? (isOpen ? 'Tutup' : 'Buka') : ''}
          </button>
        </div>

        {/* Info singkat */}
        <div style={theme.infoGrid}>
          {[
            { icon: '⏱️', label: 'Estimasi', value: info.info_estimasi },
            { icon: '💳', label: 'Pembayaran', value: info.info_pembayaran },
            { icon: '🔄', label: 'Revisi', value: info.info_revisi },
            { icon: '📩', label: 'Format', value: info.info_format },
          ].map((item) => (
            <div key={item.label} style={theme.infoCard}>
              <div style={theme.infoIcon}>{item.icon}</div>
              <div style={theme.infoLabel}>{item.label}</div>
              <div style={theme.infoValue}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}