import { useEffect, useState } from 'react';
import { imgUrl } from '../cloudinary';
import { supabase } from '../supabase';

export default function PortfolioMarquee({ onClickPortfolio, intervalMs = 3000 }) {
  const [items, setItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('sort_order')
      if (data && data.length > 0) setItems(data);
    }
    fetchItems();
  }, []);

  // Ganti slide otomatis tiap `intervalMs`
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items, intervalMs]);

  if (items.length === 0) return null;

  return (
    <div
      onClick={onClickPortfolio}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 10,
        cursor: onClickPortfolio ? 'pointer' : 'default',
      }}
    >
      {items.map((item, i) => (
        <img
          key={item.id}
          src={item.cloudinary_id ? imgUrl(item.cloudinary_id, 300) : item.src}
          alt="karya"
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === activeIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
    </div>
  );
}
