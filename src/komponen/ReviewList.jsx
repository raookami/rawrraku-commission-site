import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

function StarDisplay({ rating }) {
  return (
    <span className="star-display">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (data) setReviews(data);
      setLoading(false);
    }
    fetchReviews();
  }, []);

  if (loading) return <p className="review-meta">Memuat ulasan...</p>;
  if (reviews.length === 0) return <p className="review-meta">Belum ada ulasan.</p>;

  return (
    <div className="review-list">
      {reviews.map((r) => (
        <div key={r.id} className="review-item">
          <div className="review-header">
            <div className="review-avatar">
              {r.name.charAt(0).toUpperCase()}
            </div>
            <span className="review-name">{r.name}</span>
            <StarDisplay rating={r.rating} />
          </div>
          <p className="review-comment">"{r.comment}"</p>
        </div>
      ))}
    </div>
  );
}
