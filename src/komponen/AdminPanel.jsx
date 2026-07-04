import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase';
import { imgUrl } from '../cloudinary';

function StarDisplay({ rating }) {
  return <span className="star-display">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>;
}

// ─── Tab: Ulasan ───────────────────────────────────────────────────────────────
function TabUlasan() {
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
      <div className="admin-tab-filter">
        {[{ key: 'pending', label: '⏳ Pending' }, { key: 'approved', label: '✅ Approved' }].map(({ key, label }) => (
          <button key={key} onClick={() => switchFilter(key)} className={`admin-filter-btn${filter === key ? ' active' : ''}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-empty">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="admin-empty">
          {filter === 'pending' ? '🎉 Tidak ada ulasan pending!' : '📭 Belum ada ulasan approved.'}
        </div>
      ) : (
        <div className="admin-review-list">
          {reviews.map((review) => (
            <div key={review.id} className="admin-review-card">
              <div className="admin-review-header">
                <div className="review-avatar">{review.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="admin-review-name">{review.name}</div>
                  <StarDisplay rating={review.rating} />
                </div>
                <div className="admin-review-date">
                  {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <p className="admin-review-comment">"{review.comment}"</p>
              {filter === 'pending' && (
                <div className="admin-review-actions">
                  <button onClick={() => approve(review.id)} className="btn-approve">✅ Approve</button>
                  <button onClick={() => reject(review.id)} className="btn-reject">🗑️ Hapus</button>
                </div>
              )}
              {filter === 'approved' && (
                <button onClick={() => reject(review.id)} className="btn-reject" style={{ marginTop: 4 }}>🗑️ Hapus Ulasan Ini</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Portfolio ────────────────────────────────────────────────────────────
function TabPortfolio() {
  const [categories, setCategories] = useState([]);
  const [portfolioMap, setPortfolioMap] = useState({});
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const fileRef = useRef();

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvxznh0cz';
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    const { data: cats } = await supabase.from('portfolio_categories').select('*').order('sort_order');
    if (!cats || cats.length === 0) { setLoading(false); return; }

    const map = {};
    await Promise.all(cats.map(async (c) => {
      const { data: items } = await supabase.from('portfolio_items').select('*').eq('category_id', c.id).order('sort_order');
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
      alert('Upload preset Cloudinary belum diisi!\n\nBuka file .env, tambahkan:\nVITE_CLOUDINARY_UPLOAD_PRESET=nama_preset_kamu\n\nLalu restart dev server.');
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

  function onDragStart(e, id) { setDragId(id); e.dataTransfer.effectAllowed = 'move'; }
  function onDragOver(e, id) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverId(id); }
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
    setDragId(null); setDragOverId(null);
  }

  async function saveOrder() {
    const items = portfolioMap[selectedCat] || [];
    if (items.length === 0) return;
    setSavingOrder(true);
    let failed = false;
    for (let idx = 0; idx < items.length; idx++) {
      const { error } = await supabase.from('portfolio_items').update({ sort_order: idx }).eq('id', items[idx].id).select();
      if (error) { console.error('[saveOrder] ERROR item', items[idx].id, error); failed = true; }
    }
    if (failed) {
      setSavingOrder(false);
      alert('Urutan gagal disimpan!\n\nBuka console (F12) dan lihat error merah.');
      return;
    }
    await loadPortfolio();
    setSavingOrder(false);
  }

  if (loading) return <div className="admin-empty">Memuat...</div>;

  return (
    <div>
      <div className="admin-card">
        <div className="admin-card-label">Kategori</div>
        <div className="admin-tab-filter" style={{ marginBottom: 16 }}>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`admin-filter-btn${selectedCat === cat.id ? ' active' : ''}`}>
              {cat.label} ({(portfolioMap[cat.id] || []).length})
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <label className={`btn-upload${uploading ? ' disabled' : ''}`}>
            {uploading ? '⏳ Uploading...' : '📤 Upload Gambar'}
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
          <button onClick={saveOrder} disabled={savingOrder} className={`btn-save-order${savingOrder ? ' disabled' : ''}`}>
            {savingOrder ? '💾 Menyimpan...' : '💾 Simpan Urutan'}
          </button>
        </div>
        <div className="admin-hint">Drag & drop gambar untuk ubah urutan, lalu tekan Simpan Urutan.</div>
      </div>

      {selectedCat && (
        <div className="portfolio-grid">
          {(portfolioMap[selectedCat] || []).map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onDragStart(e, item.id)}
              onDragOver={(e) => onDragOver(e, item.id)}
              onDrop={(e) => onDrop(e, item.id)}
              onDragEnd={() => { setDragId(null); setDragOverId(null); }}
              className={`portfolio-thumb${dragId === item.id ? ' dragging' : ''}${dragOverId === item.id && dragId !== item.id ? ' drag-over' : ''}`}
            >
              <div className="drag-handle">⠿</div>
              <img src={imgUrl(item.cloudinary_id, 300)} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              <button onClick={() => handleDelete(item.id)} className="btn-delete-img" title="Hapus">×</button>
            </div>
          ))}
          {(portfolioMap[selectedCat] || []).length === 0 && (
            <div className="admin-empty" style={{ gridColumn: '1/-1' }}>Belum ada gambar. Upload dulu!</div>
          )}
        </div>
      )}
      <p className="admin-footnote">💡 Gambar dihapus dari database tapi tidak dari Cloudinary.</p>
    </div>
  );
}

// ─── SettingField ──────────────────────────────────────────────────────────────
function SettingField({ label, keyName, multiline, fieldVals, setFieldVals, onSave, saving, saved }) {
  return (
    <div className="setting-field">
      <label className="admin-card-label">{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        {multiline
          ? <textarea className="form-input" value={fieldVals[keyName] || ''} onChange={(e) => setFieldVals((p) => ({ ...p, [keyName]: e.target.value }))} rows={3} style={{ flex: 1, resize: 'vertical', fontSize: 14 }} />
          : <input className="form-input" type="text" value={fieldVals[keyName] || ''} onChange={(e) => setFieldVals((p) => ({ ...p, [keyName]: e.target.value }))} style={{ flex: 1, fontSize: 14 }} />
        }
        <button onClick={() => onSave(keyName)} className={`btn-simpan${saved[keyName] ? ' saved' : ''}`} disabled={saving[keyName]}>
          {saving[keyName] ? '...' : saved[keyName] ? '✓' : 'Simpan'}
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Settings ─────────────────────────────────────────────────────────────
function TabSettings() {
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
    setSaving((p) => ({ ...p, [key]: true }));
    const { error } = await supabase.from('settings').upsert({ key, value: String(fieldVals[key] ?? '') }, { onConflict: 'key' });
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

  async function toggleCommissionStatus() {
    const newVal = fieldVals.commission_open === 'false' ? 'true' : 'false';
    setSaving((p) => ({ ...p, commission_open: true }));
    const { error } = await supabase.from('settings').upsert({ key: 'commission_open', value: newVal }, { onConflict: 'key' });
    setSaving((p) => ({ ...p, commission_open: false }));
    if (error) { alert('Gagal simpan: ' + error.message); return; }
    setFieldVals((p) => ({ ...p, commission_open: newVal }));
    flashSaved('commission_open');
  }

  function flashSaved(key) {
    setSaved((p) => ({ ...p, [key]: true }));
    setTimeout(() => setSaved((p) => ({ ...p, [key]: false })), 2000);
  }

  function StatusBtn({ k }) {
    if (saving[k]) return <span className="status-saving">...</span>;
    if (saved[k]) return <span className="status-saved">✓</span>;
    return null;
  }

  const sfProps = { fieldVals, setFieldVals, onSave: saveSetting, saving, saved };

  if (loading) return <div className="admin-empty" style={{ padding: 60 }}>Memuat...</div>;

  const isCommOpen = fieldVals.commission_open !== 'false';

  return (
    <div>
      <div className="admin-card">
        <h3 className="admin-card-title">🟢 Status Commission</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div className={`status-box ${isCommOpen ? 'status-open' : 'status-closed'}`} style={{ margin: 0 }}>
            <span className="status-dot" />
            <strong>{isCommOpen ? 'COMMISSION OPEN' : 'COMMISSION CLOSED'}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={toggleCommissionStatus} className="btn-simpan" disabled={saving.commission_open}>
              {saving.commission_open ? '...' : `Ubah ke ${isCommOpen ? 'CLOSED' : 'OPEN'}`}
            </button>
            <StatusBtn k="commission_open" />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">📝 Info Umum</h3>
        <SettingField label="Estimasi pengerjaan" keyName="info_estimasi" {...sfProps} />
        <SettingField label="Metode pembayaran" keyName="info_pembayaran" {...sfProps} />
        <SettingField label="Jumlah revisi" keyName="info_revisi" {...sfProps} />
        <SettingField label="Format file" keyName="info_format" {...sfProps} />
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">💰 Harga & Slot</h3>
        {commissions.map((comm) => (
          <div key={comm.id} className="admin-comm-row">
            <div className="admin-comm-header">
              <span className="admin-comm-name">{comm.emoji} {comm.type}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="admin-card-label" style={{ marginBottom: 0 }}>Slot:</span>
                <input type="number" defaultValue={comm.slots} min={0} max={99}
                  onBlur={(e) => saveCommSlots(comm.id, e.target.value)}
                  className="form-input" style={{ width: 64, padding: '4px 8px', fontSize: 14, textAlign: 'center' }} />
                <StatusBtn k={`slots_${comm.id}`} />
              </div>
            </div>
            {(comm.commission_variants || []).map((v) => (
              <div key={v.id} className="admin-variant-row">
                <span className="admin-variant-label">{v.label}</span>
                <span className="admin-rp">Rp</span>
                <input type="number" defaultValue={v.price} step={1000}
                  onBlur={(e) => saveCommVariant(v.id, 'price', e.target.value)}
                  className="form-input" style={{ width: 130, padding: '4px 8px', fontSize: 14 }} />
                <StatusBtn k={`v_${v.id}_price`} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">✨ Add-ons</h3>
        {addons.map((addon) => (
          <div key={addon.id} className="admin-comm-row">
            <label className="admin-card-label">{addon.label}</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {addon.type === 'range' ? (
                <>
                  <span className="admin-rp">Min Rp</span>
                  <input type="number" defaultValue={addon.value_min} step={1000} onBlur={(e) => saveAddon(addon.id, 'value_min', e.target.value)} className="form-input" style={{ width: 120, padding: '4px 8px', fontSize: 14 }} />
                  <StatusBtn k={`addon_${addon.id}_value_min`} />
                  <span className="admin-rp">Max Rp</span>
                  <input type="number" defaultValue={addon.value_max} step={1000} onBlur={(e) => saveAddon(addon.id, 'value_max', e.target.value)} className="form-input" style={{ width: 120, padding: '4px 8px', fontSize: 14 }} />
                  <StatusBtn k={`addon_${addon.id}_value_max`} />
                </>
              ) : (
                <>
                  <span className="admin-rp">{addon.type === 'percent' ? '%' : addon.type === 'multiplier' ? '×' : 'Rp'}</span>
                  <input type="number" defaultValue={addon.value_num} step={addon.type === 'percent' ? 1 : 1000} onBlur={(e) => saveAddon(addon.id, 'value_num', e.target.value)} className="form-input" style={{ width: 130, padding: '4px 8px', fontSize: 14 }} />
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
export default function AdminPanel() {
  const [tab, setTab] = useState('ulasan');

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem('visitor_name');
    window.location.href = '/';
  }

  const tabs = [
    { key: 'ulasan',    label: '⭐ Ulasan' },
    { key: 'portfolio', label: '🖼️ Portfolio' },
    { key: 'settings',  label: '⚙️ Konten' },
  ];

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <h2 className="admin-title">🛡️ Admin Panel</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      <div className="admin-tabs">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`admin-filter-btn${tab === key ? ' active' : ''}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'ulasan'    && <TabUlasan />}
      {tab === 'portfolio' && <TabPortfolio />}
      {tab === 'settings'  && <TabSettings />}
    </div>
  );
}
