import ReviewList from '../komponen/ReviewList';

export default function Reviews() {
  return (
    <div className="page-enter reviews-page">
      <h2 className="section-title">⭐ Review Klien</h2>
      <p className="section-desc">Kata mereka yang udah pernah order 💙</p>
      <ReviewList />
    </div>
  );
}
