// src/komponen/AdminPanel.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase';
import { imgUrl } from '../cloudinary';

function StarDisplay({ rating }) {
  return <span style={{ color: '#f5a623' }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
}

// ─── Tab: Ulasan ───────────────────────────────────────────────────────────────
function TabUlasan({ theme, isDark }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { fetchReviews('pending'); }, []);

  async function fetchReviews(status) {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').eq('status', status).order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }

  async function approve(id) {
    const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
    if (error) { alert('Gagal approve: ' + error.message); return; }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  async function reject(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) { alert('Gagal hapus: ' + error.message); return; }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  function switchFilter(f) { setFilter(f); fetchReviews(f); }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ key: 'pending', label: '⏳ Pending' }, { key: 'approved', label: '✅ Approved' }].map(({ key, label }) => (
          <button key={key} onClick={() => switchFilter(key)} style={{ padding: '8px 20px', borderRadius: 999, border: '1.5px solid #5e81d1', background: filter === key ? '#5e81d1' : 'transparent', color: filter === key ? 'white' : '#5e81d1', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {label}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Loading...</div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)', borderRadius: 16, color: isDark ? '#aaa' : '#999' }}>
          {filter === 'pending' ? '🎉 Tidak ada ulasan pending!' : '📭 Belum ada ulasan approved.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)', border: isDark ? '1px solid #333' : '1px solid #e8e0f0', borderRadius: 14, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#5e81d1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#eee' : '#333' }}>{review.name}</div>
                    <StarDisplay rating={review.rating} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>{new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <p style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', margin: 0, lineHeight: 1.5 }}>"{review.comment}"</p>
              {filter === 'pending' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button onClick={() => approve(review.id)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#5ed182', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>✅ Approve</button>
                  <button onClick={() => reject(review.id)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: '#e05555', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>🗑️ Hapus</button>
                </div>
              )}
              {filter === 'approved' && (
                <button onClick={() => reject(review.id)} style={{ padding: '8px', borderRadius: 8, border: 'none', background: '#e05555', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 13, marginTop: 4 }}>🗑️ Hapus Ulasan Ini</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Portfolio ────────────────────────────────────────────────────────────
function TabPortfolio({ theme, isDark }) {
  const [categories, setCategories] = useState([]);
  const [portfolioMap, setPortfolioMap] = useState({});
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const fileRef = useRef();

  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dvxznh0cz';
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('portfolio_categories').select('*').order('sort_order');
    if (!cats || cats.length === 0) { setLoading(false); return; }

    // Fetch items per kategori supaya sort_order tidak bentrok antar kategori
    const map = {};
    await Promise.all(cats.map(async (c) => {
      const { data: items } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('category_id', c.id)
        .order('sort_order');
      map[c.id] = items || [];
    }));

    setCategories(cats);
    setPortfolioMap(map);
    if (cats.length > 0) setSelectedCat((prev) => prev || cats[0].id);
    setLoading(false);
  }, []);

  useEffect(() => { loadPortfolio(); }, [loadPortfolio]);

  async function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedCat) return;
    if (!UPLOAD_PRESET) {
      alert('Upload preset Cloudinary belum diisi!\n\nBuka file .env, tambahkan baris:\nREACT_APP_CLOUDINARY_UPLOAD_PRESET=nama_preset_kamu\n\nLalu restart npm start.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.public_id) {
          const currentItems = portfolioMap[selectedCat] || [];
          await supabase.from('portfolio_items').insert({ category_id: selectedCat, cloudinary_id: data.public_id, sort_order: currentItems.length });
        } else {
          alert(`Gagal upload "${file.name}": ${data.error?.message || 'Upload preset tidak valid atau belum diset ke Unsigned.'}`);
        }
      } catch (err) { alert('Gagal upload: ' + err.message); }
    }
    await loadPortfolio();
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleDelete(itemId) {
    if (!window.confirm('Hapus gambar ini?')) return;
    await supabase.from('portfolio_items').delete().eq('id', itemId);
    setPortfolioMap((prev) => ({ ...prev, [selectedCat]: (prev[selectedCat] || []).filter((i) => i.id !== itemId) }));
  }

  // ── Drag & drop handlers ──
  function onDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e, id) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverId(id);
  }

  function onDrop(e, targetId) {
    e.preventDefault();
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    setPortfolioMap((prev) => {
      const items = [...(prev[selectedCat] || [])];
      const fromIdx = items.findIndex((i) => i.id === dragId);
      const toIdx = items.findIndex((i) => i.id === targetId);
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      return { ...prev, [selectedCat]: items };
    });
    setDragId(null);
    setDragOverId(null);
  }

  async function saveOrder() {
    const items = portfolioMap[selectedCat] || [];
    if (items.length === 0) return;
    setSavingOrder(true);

    console.log('[saveOrder] Mulai update', items.length, 'item');
    let failed = false;
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const { data, error } = await supabase
        .from('portfolio_items')
        .update({ sort_order: idx })
        .eq('id', item.id)
        .select();
      if (error) {
        console.error('[saveOrder] ERROR item', item.id, error);
        failed = true;
      } else {
        console.log('[saveOrder] OK item', item.id, '→ sort_order', idx, data);
      }
    }

    if (failed) {
      setSavingOrder(false);
      alert('Urutan gagal disimpan!\n\nBuka console (F12) dan lihat error merah.\nKemungkinan RLS Supabase blokir UPDATE di portfolio_items.');
      return;
    }

    // Reload dari Supabase untuk konfirmasi
    await loadPortfolio();
    setSavingOrder(false);
    console.log('[saveOrder] Selesai, data di-reload dari Supabase');
  }

  const cardStyle = { background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)', border: isDark ? '1px solid #2a2a3a' : '1px solid #e8e0f0', borderRadius: 16, padding: '20px 22px', marginBottom: 16 };

  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Memuat...</div>;

  return (
    <div>
      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#aaa' : '#888', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Kategori</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)} style={{ padding: '7px 18px', borderRadius: 999, border: '1.5px solid #5e81d1', background: selectedCat === cat.id ? '#5e81d1' : 'transparent', color: selectedCat === cat.id ? 'white' : '#5e81d1', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              {cat.label} ({(portfolioMap[cat.id] || []).length})
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 10, background: uploading ? '#aaa' : '#5e81d1', color: 'white', fontWeight: 600, fontSize: 13, cursor: uploading ? 'not-allowed' : 'pointer' }}>
            {uploading ? '⏳ Uploading...' : '📤 Upload Gambar'}
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
          <button
            onClick={saveOrder}
            disabled={savingOrder}
            style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: savingOrder ? '#aaa' : '#5ed182', color: 'white', fontWeight: 600, fontSize: 13, cursor: savingOrder ? 'not-allowed' : 'pointer' }}
          >
            {savingOrder ? '💾 Menyimpan...' : '💾 Simpan Urutan'}
          </button>
        </div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>Drag & drop gambar untuk ubah urutan, lalu tekan Simpan Urutan.</div>
      </div>
      {selectedCat && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
          {(portfolioMap[selectedCat] || []).map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onDragStart(e, item.id)}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDrop={(e) => onDrop(e, item.id)}
              onDragEnd={() => { setDragId(null); setDragOverId(null); }}
              style={{
                position: 'relative', borderRadius: 10, overflow: 'hidden',
                background: isDark ? '#1a1a2e' : '#f5f0ff',
                cursor: 'grab',
                opacity: dragId === item.id ? 0.4 : 1,
                outline: dragOverId === item.id && dragId !== item.id ? '2.5px dashed #5e81d1' : 'none',
                transition: 'opacity 0.15s, outline 0.1s',
              }}
            >
              {/* drag handle badge */}
              <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.45)', borderRadius: 6, padding: '2px 6px', fontSize: 11, color: 'white', userSelect: 'none', pointerEvents: 'none' }}>⠿</div>
              <img src={imgUrl(item.cloudinary_id, 300)} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              <button onClick={() => handleDelete(item.id)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(220,0,50,0.85)', border: 'none', color: 'white', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Hapus">×</button>
            </div>
          ))}
          {(portfolioMap[selectedCat] || []).length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 32, color: '#aaa', fontSize: 14 }}>Belum ada gambar. Upload dulu!</div>
          )}
        </div>
      )}
      <p style={{ fontSize: 11, color: isDark ? '#555' : '#bbb', marginTop: 12 }}>💡 Gambar dihapus dari database tapi tidak dari Cloudinary.</p>
    </div>
  );
}

// ─── SettingField — WAJIB di luar TabSettings agar React tidak re-create tiap render ───
function SettingField({ label, keyName, multiline, fieldVals, setFieldVals, onSave, saving, saved, theme, labelStyle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        {multiline
          ? <textarea
              value={fieldVals[keyName] || ''}
              onChange={(e) => setFieldVals((p) => ({ ...p, [keyName]: e.target.value }))}
              rows={3}
              style={{ ...theme.input, flex: 1, resize: 'vertical', fontSize: 14 }}
            />
          : <input
              type="text"
              value={fieldVals[keyName] || ''}
              onChange={(e) => setFieldVals((p) => ({ ...p, [keyName]: e.target.value }))}
              style={{ ...theme.input, flex: 1, fontSize: 14 }}
            />
        }
        <button
          onClick={() => onSave(keyName)}
          style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: saved[keyName] ? '#5ed182' : '#5e81d1', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}
          disabled={saving[keyName]}
        >
          {saving[keyName] ? '...' : saved[keyName] ? '✓' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Settings ─────────────────────────────────────────────────────────────
function TabSettings({ theme, isDark }) {
  const [fieldVals, setFieldVals] = useState({});
  const [commissions, setCommissions] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [{ data: settingsData }, { data: commData }, { data: addonData }] = await Promise.all([
      supabase.from('settings').select('*'),
      supabase.from('commission_types').select('*, commission_variants(*)').order('sort_order'),
      supabase.from('addons').select('*').order('sort_order'),
    ]);
    const map = {};
    (settingsData || []).forEach((s) => { map[s.key] = s.value; });
    setFieldVals(map);
    setCommissions(commData || []);
    setAddons(addonData || []);
    setLoading(false);
  }

  async function saveSetting(key) {
    const value = fieldVals[key] ?? '';
    setSaving((p) => ({ ...p, [key]: true }));
    const { error } = await supabase.from('settings').upsert({ key, value: String(value) }, { onConflict: 'key' });
    if (error) alert('Gagal simpan: ' + error.message);
    setSaving((p) => ({ ...p, [key]: false }));
    flashSaved(key);
  }

  async function saveCommVariant(variantId, field, value) {
    const key = `v_${variantId}_${field}`;
    setSaving((p) => ({ ...p, [key]: true }));
    await supabase.from('commission_variants').update({ [field]: field === 'price' ? Number(value) : value }).eq('id', variantId);
    setSaving((p) => ({ ...p, [key]: false }));
    flashSaved(key);
    setCommissions((prev) => prev.map((c) => ({ ...c, commission_variants: c.commission_variants.map((v) => v.id === variantId ? { ...v, [field]: value } : v) })));
  }

  async function saveCommSlots(commId, slots) {
    const key = `slots_${commId}`;
    setSaving((p) => ({ ...p, [key]: true }));
    await supabase.from('commission_types').update({ slots: Number(slots) }).eq('id', commId);
    setSaving((p) => ({ ...p, [key]: false }));
    flashSaved(key);
    setCommissions((prev) => prev.map((c) => c.id === commId ? { ...c, slots: Number(slots) } : c));
  }

  async function saveAddon(addonId, field, value) {
    const key = `addon_${addonId}_${field}`;
    setSaving((p) => ({ ...p, [key]: true }));
    await supabase.from('addons').update({ [field]: Number(value) }).eq('id', addonId);
    setSaving((p) => ({ ...p, [key]: false }));
    flashSaved(key);
    setAddons((prev) => prev.map((a) => a.id === addonId ? { ...a, [field]: Number(value) } : a));
  }

  function flashSaved(key) {
    setSaved((p) => ({ ...p, [key]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2000);
  }

  const cardStyle = { background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)', border: isDark ? '1px solid #2a2a3a' : '1px solid #e8e0f0', borderRadius: 16, padding: '20px 22px', marginBottom: 16 };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: isDark ? '#aaa' : '#888', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 };

  function StatusBtn({ k }) {
    return saving[k] ? <span style={{ fontSize: 12, color: '#aaa' }}>...</span>
      : saved[k] ? <span style={{ fontSize: 12, color: '#5ed182' }}>✓</span> : null;
  }

  const sfProps = { fieldVals, setFieldVals, onSave: saveSetting, saving, saved, theme, labelStyle };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>Memuat...</div>;

  return (
    <div>
      <div style={cardStyle}>
        <h3 style={{ ...theme.sectionTitle, fontSize: 15, marginBottom: 16 }}>📝 Info Umum</h3>
        <SettingField label="Deskripsi singkat (hero)" keyName="hero_desc" {...sfProps} />
        <SettingField label="Estimasi pengerjaan" keyName="info_estimasi" {...sfProps} />
        <SettingField label="Metode pembayaran" keyName="info_pembayaran" {...sfProps} />
        <SettingField label="Jumlah revisi" keyName="info_revisi" {...sfProps} />
        <SettingField label="Format file" keyName="info_format" {...sfProps} />
      </div>

      <div style={cardStyle}>
        <h3 style={{ ...theme.sectionTitle, fontSize: 15, marginBottom: 16 }}>💰 Harga & Slot</h3>
        {commissions.map((comm) => (
          <div key={comm.id} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: isDark ? '1px solid #2a2a3a' : '1px solid #f0e8f8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#ddd' : '#333' }}>{comm.emoji} {comm.type}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#aaa' }}>Slot:</span>
                <input type="number" defaultValue={comm.slots} min={0} max={99} onBlur={(e) => saveCommSlots(comm.id, e.target.value)} style={{ ...theme.input, width: 64, padding: '4px 8px', fontSize: 14, textAlign: 'center' }} />
                <StatusBtn k={`slots_${comm.id}`} />
              </div>
            </div>
            {(comm.commission_variants || []).map((v) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, paddingLeft: 12 }}>
                <span style={{ fontSize: 13, color: isDark ? '#bbb' : '#666', minWidth: 90 }}>{v.label}</span>
                <span style={{ fontSize: 12, color: '#a06080' }}>Rp</span>
                <input type="number" defaultValue={v.price} step={1000} onBlur={(e) => saveCommVariant(v.id, 'price', e.target.value)} style={{ ...theme.input, width: 130, padding: '4px 8px', fontSize: 14 }} />
                <StatusBtn k={`v_${v.id}_price`} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h3 style={{ ...theme.sectionTitle, fontSize: 15, marginBottom: 16 }}>✨ Add-ons</h3>
        {addons.map((addon) => (
          <div key={addon.id} style={{ marginBottom: 14, paddingBottom: 12, borderBottom: isDark ? '1px solid #2a2a3a' : '1px solid #f0e8f8' }}>
            <label style={labelStyle}>{addon.label}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {addon.type === 'range' ? (
                <>
                  <span style={{ fontSize: 12, color: '#aaa' }}>Min Rp</span>
                  <input type="number" defaultValue={addon.value_min} step={1000} onBlur={(e) => saveAddon(addon.id, 'value_min', e.target.value)} style={{ ...theme.input, width: 120, padding: '4px 8px', fontSize: 14 }} />
                  <StatusBtn k={`addon_${addon.id}_value_min`} />
                  <span style={{ fontSize: 12, color: '#aaa' }}>Max Rp</span>
                  <input type="number" defaultValue={addon.value_max} step={1000} onBlur={(e) => saveAddon(addon.id, 'value_max', e.target.value)} style={{ ...theme.input, width: 120, padding: '4px 8px', fontSize: 14 }} />
                  <StatusBtn k={`addon_${addon.id}_value_max`} />
                </>
              ) : (
                <>
                  <span style={{ fontSize: 12, color: '#aaa' }}>{addon.type === 'percent' ? '%' : addon.type === 'multiplier' ? '×' : 'Rp'}</span>
                  <input type="number" defaultValue={addon.value_num} step={addon.type === 'percent' ? 1 : 1000} onBlur={(e) => saveAddon(addon.id, 'value_num', e.target.value)} style={{ ...theme.input, width: 130, padding: '4px 8px', fontSize: 14 }} />
                  <StatusBtn k={`addon_${addon.id}_value_num`} />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main AdminPanel ───────────────────────────────────────────────────────────
export default function AdminPanel({ theme, isDark }) {
  const [tab, setTab] = useState('ulasan');

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem('visitor_name');
    window.location.href = '/';
  }

  const tabs = [
    { key: 'ulasan', label: '⭐ Ulasan' },
    { key: 'portfolio', label: '🖼️ Portfolio' },
    { key: 'settings', label: '⚙️ Konten' },
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ ...theme.sectionTitle, margin: 0 }}>🛡️ Admin Panel</h2>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #e05', color: '#e05', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>Logout</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: '9px 22px', borderRadius: 999, border: '1.5px solid #5e81d1', background: tab === key ? '#5e81d1' : 'transparent', color: tab === key ? 'white' : '#5e81d1', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'ulasan' && <TabUlasan theme={theme} isDark={isDark} />}
      {tab === 'portfolio' && <TabPortfolio theme={theme} isDark={isDark} />}
      {tab === 'settings' && <TabSettings theme={theme} isDark={isDark} />}
    </div>
  );
}