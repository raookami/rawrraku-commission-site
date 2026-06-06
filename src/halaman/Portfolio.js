import { useState, useEffect } from 'react';
import { imgUrl } from '../cloudinary';
import { supabase } from '../supabase';

const pink = '#5e81d1';

export default function Portfolio({ isDark, theme }) {
  const [categories, setCategories] = useState([]);
  const [portfolioMap, setPortfolioMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loadedImgs, setLoadedImgs] = useState({});

  useEffect(() => {
    async function fetchPortfolio() {
      const { data: cats } = await supabase
        .from('portfolio_categories')
        .select('*')
        .order('sort_order');

      if (!cats || cats.length === 0) { setLoading(false); return; }

      // Fetch per kategori supaya sort_order tidak bentrok antar kategori
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
      setSelectedCategory((prev) => prev || cats[0].id);
      setLoading(false);
    }
    fetchPortfolio();

    // Refetch setiap kali halaman dapat fokus (misal balik dari tab admin)
    function onFocus() { fetchPortfolio(); }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Preload prev & next saat lightbox aktif
  useEffect(() => {
    if (!lightbox) return;
    const { imgs, index } = lightbox;
    const preloadIndexes = [
      (index + 1) % imgs.length,
      (index - 1 + imgs.length) % imgs.length,
    ];
    preloadIndexes.forEach((i) => {
      const img = new Image();
      img.src = imgUrl(imgs[i], 1200);
    });
  }, [lightbox]);

  if (loading) {
    return (
      <div className="page-enter" style={{ ...theme.page, textAlign: 'center', paddingTop: 60 }}>
        <div style={{ color: '#aaa' }}>Memuat portfolio...</div>
      </div>
    );
  }

  const currentImgs = selectedCategory
    ? (portfolioMap[selectedCategory] || []).map((item) => item.cloudinary_id)
    : [];

  return (
    <div className="page-enter" style={theme.page}>
      <h2 style={theme.sectionTitle}>Portfolio</h2>

      {/* Tab kategori — hanya dari database, tidak ada hardcode */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 20px', borderRadius: 999,
              border: '1.5px solid ' + pink,
              background: selectedCategory === cat.id ? pink : 'transparent',
              color: selectedCategory === cat.id ? 'white' : pink,
              cursor: 'pointer', fontWeight: 600, fontSize: 14,
            }}
          >
            {cat.label} ({(portfolioMap[cat.id] || []).length})
          </button>
        ))}
      </div>

      {/* Grid foto */}
      {selectedCategory && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {currentImgs.map((img, index) => (
            <div
              key={index}
              style={{ ...theme.portfolioCard, cursor: 'zoom-in', position: 'relative', overflow: 'hidden' }}
              onClick={() => setLightbox({ imgs: currentImgs, index })}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1.08)';
                e.currentTarget.querySelector('.overlay').style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                e.currentTarget.querySelector('.overlay').style.opacity = '0';
              }}
            >
              {!loadedImgs[img] && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                  backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
                }} />
              )}
              <img
                src={imgUrl(img, 400)}
                alt={`karya ${index + 1}`}
                loading="lazy"
                onLoad={() => setLoadedImgs((prev) => ({ ...prev, [img]: true }))}
                style={{
                  width: '100%', height: 180, objectFit: 'cover', display: 'block',
                  opacity: loadedImgs[img] ? 1 : 0,
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                }}
              />
              <div className="overlay" style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.3s ease', fontSize: 32,
              }}>🔍</div>
            </div>
          ))}

          {currentImgs.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#aaa' }}>
              Belum ada karya di kategori ini.
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, cursor: 'zoom-out' }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lb) => ({ ...lb, index: (lb.index - 1 + lb.imgs.length) % lb.imgs.length })); }}
            style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: 28, borderRadius: '50%', width: 48, height: 48, cursor: 'pointer' }}
          >‹</button>

          <img
            src={imgUrl(lightbox.imgs[lightbox.index], 1200)}
            alt=""
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); setLightbox((lb) => ({ ...lb, index: (lb.index + 1) % lb.imgs.length })); }}
            style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: 28, borderRadius: '50%', width: 48, height: 48, cursor: 'pointer' }}
          >›</button>

          <div style={{ position: 'absolute', bottom: 20, color: 'white', fontSize: 13, opacity: 0.7 }}>
            {lightbox.index + 1} / {lightbox.imgs.length}
          </div>
        </div>
      )}
    </div>
  );
}