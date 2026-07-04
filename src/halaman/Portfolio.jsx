import { useState, useEffect } from 'react';
import { imgUrl } from '../cloudinary';
import { supabase } from '../supabase';

export default function Portfolio() {
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

    function onFocus() { fetchPortfolio(); }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Preload prev & next saat lightbox aktif
  useEffect(() => {
    if (!lightbox) return;
    const { imgs, index } = lightbox;
    [(index + 1) % imgs.length, (index - 1 + imgs.length) % imgs.length].forEach((i) => {
      const img = new Image();
      img.src = imgUrl(imgs[i], 1200);
    });
  }, [lightbox]);

  // Tutup lightbox pakai keyboard Escape / arrow keys
  useEffect(() => {
    if (!lightbox) return;
    function onKey(e) {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((lb) => ({ ...lb, index: (lb.index + 1) % lb.imgs.length }));
      if (e.key === 'ArrowLeft')  setLightbox((lb) => ({ ...lb, index: (lb.index - 1 + lb.imgs.length) % lb.imgs.length }));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  if (loading) {
    return (
      <div className="page-enter" style={{ textAlign: 'center', paddingTop: 60, color: '#aaa' }}>
        Memuat portfolio...
      </div>
    );
  }

  const currentImgs = selectedCategory
    ? (portfolioMap[selectedCategory] || []).map((item) => item.cloudinary_id)
    : [];

  return (
    <div className="page-enter portfolio-page">
      <h2 className="section-title">Portfolio</h2>

      {/* Tab kategori */}
      <div className="portfolio-cats">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`admin-filter-btn${selectedCategory === cat.id ? ' active' : ''}`}
          >
            {cat.label} ({(portfolioMap[cat.id] || []).length})
          </button>
        ))}
      </div>

      {/* Grid foto */}
      {selectedCategory && (
        <div className="portfolio-img-grid">
          {currentImgs.map((img, index) => (
            <div
              key={index}
              className="portfolio-img-card"
              onClick={() => setLightbox({ imgs: currentImgs, index })}
            >
              {!loadedImgs[img] && <div className="img-shimmer" />}
              <img
                src={imgUrl(img, 400)}
                alt={`karya ${index + 1}`}
                loading="lazy"
                onLoad={() => setLoadedImgs((prev) => ({ ...prev, [img]: true }))}
                className={`portfolio-img${loadedImgs[img] ? ' loaded' : ''}`}
              />
              <div className="portfolio-overlay">🔍</div>
            </div>
          ))}

          {currentImgs.length === 0 && (
            <div className="admin-empty" style={{ gridColumn: '1/-1' }}>
              Belum ada karya di kategori ini.
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
          <button
            className="lightbox-btn lightbox-prev"
            onClick={(e) => { e.stopPropagation(); setLightbox((lb) => ({ ...lb, index: (lb.index - 1 + lb.imgs.length) % lb.imgs.length })); }}
          >‹</button>

          <img
            src={imgUrl(lightbox.imgs[lightbox.index], 1200)}
            alt=""
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="lightbox-btn lightbox-next"
            onClick={(e) => { e.stopPropagation(); setLightbox((lb) => ({ ...lb, index: (lb.index + 1) % lb.imgs.length })); }}
          >›</button>

          <div className="lightbox-counter">
            {lightbox.index + 1} / {lightbox.imgs.length}
          </div>
        </div>
      )}
    </div>
  );
}
