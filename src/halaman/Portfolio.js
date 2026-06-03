import { useState, useEffect } from 'react';
import { imgUrl } from '../cloudinary';

const pink = '#5e81d1';

const portfolio = [
  {
    id: 1,
    label: 'Bust Up',
    imgs: [
      'Illustration29_sgd3xw.jpg',
      'mike_kowalski.5_qczuzy.jpg',
      'Ilustrasi_xiwq4u.jpg',
      '8d33286e_original_fpol3u.jpg',
      'Illustration42_sw3cwt.png',
    ],
  },
  {
    id: 2,
    label: 'Half Body',
    imgs: [
      'Illustration64_am25jb.png',
      'Illustration41_xmux38.png',
      'Illustration32_sk8qhl.jpg',
      'ryugamine_ichigo_commission_fjgnht.jpg',
      'Illustration31_qm27sz.jpg',
      'raoo5325_gt99nr.jpg',
      'Illustration35_ao7jz9.jpg',
      '160723-2_upby6p.jpg',
      '1NewCanvas11_mfeb4o.jpg',
      'commis_shiro6_krzo8t.jpg',
    ],
  },
  {
    id: 3,
    label: 'Full Body',
    imgs: [
      'Illustration58cmmk.png',
      'Illustration51_kgpo3c.png',
      'Ilustrasicmmc06524.1-1_gyy9g0.jpg',
      'Illustration45_oyhpiq.png',
      'Illustration11_bsfhrr.jpg',
      'puppy0_1_bkzaw9.jpg',
    ],
  },
];

export default function Portfolio({ isDark, theme }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [loadedImgs, setLoadedImgs] = useState({});

  // Preload gambar prev & next saat lightbox aktif
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

  return (
    <div className="page-enter" style={theme.page}>
      <h2 style={theme.sectionTitle}>Portfolio</h2>

      {/* Tab kategori */}
      <div
        style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}
      >
        {portfolio.map((kategori) => (
          <button
            key={kategori.id}
            onClick={() => setSelectedCategory(kategori.id)}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: '1.5px solid ' + pink,
              background:
                selectedCategory === kategori.id ? pink : 'transparent',
              color: selectedCategory === kategori.id ? 'white' : pink,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {kategori.label} ({kategori.imgs.length})
          </button>
        ))}
      </div>

      {/* Grid foto */}
      {selectedCategory && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          {portfolio
            .find((k) => k.id === selectedCategory)
            ?.imgs.map((img, index) => (
              <div
                key={index}
                style={{
                  ...theme.portfolioCard,
                  cursor: 'zoom-in',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() =>
                  setLightbox({
                    imgs: portfolio.find((k) => k.id === selectedCategory).imgs,
                    index,
                  })
                }
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('img').style.transform =
                    'scale(1.08)';
                  e.currentTarget.querySelector('.overlay').style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('img').style.transform =
                    'scale(1)';
                  e.currentTarget.querySelector('.overlay').style.opacity = '0';
                }}
              >
                {/* Skeleton */}
                {!loadedImgs[img] && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                    }}
                  />
                )}

                <img
                  src={imgUrl(img, 400)}
                  alt={`karya ${index + 1}`}
                  loading="lazy"
                  onLoad={() =>
                    setLoadedImgs((prev) => ({ ...prev, [img]: true }))
                  }
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    display: 'block',
                    opacity: loadedImgs[img] ? 1 : 0,
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                  }}
                />

                <div
                  className="overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    fontSize: 32,
                  }}
                >
                  🔍
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            cursor: 'zoom-out',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) => ({
                ...lb,
                index: (lb.index - 1 + lb.imgs.length) % lb.imgs.length,
              }));
            }}
            style={{
              position: 'absolute',
              left: 20,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              fontSize: 28,
              borderRadius: '50%',
              width: 48,
              height: 48,
              cursor: 'pointer',
            }}
          >
            ‹
          </button>

          <img
            src={imgUrl(lightbox.imgs[lightbox.index], 1200)}
            alt=""
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 12,
              objectFit: 'contain',
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lb) => ({
                ...lb,
                index: (lb.index + 1) % lb.imgs.length,
              }));
            }}
            style={{
              position: 'absolute',
              right: 20,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              fontSize: 28,
              borderRadius: '50%',
              width: 48,
              height: 48,
              cursor: 'pointer',
            }}
          >
            ›
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: 20,
              color: 'white',
              fontSize: 13,
              opacity: 0.7,
            }}
          >
            {lightbox.index + 1} / {lightbox.imgs.length}
          </div>
        </div>
      )}
    </div>
  );
}
