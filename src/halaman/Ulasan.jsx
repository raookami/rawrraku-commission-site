import ReviewForm from '../komponen/ReviewForm';

export default function Ulasan({ visitorName }) {
  return (
    <div className="page-enter ulasan-page">
      <h2 className="section-title">✍️ Tulis Ulasan</h2>
      <p className="section-desc">Pernah order? Ceritain pengalaman kamu! 💙</p>
      <ReviewForm visitorName={visitorName} />
    </div>
  );
}
