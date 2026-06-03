import ReviewForm from '../komponen/ReviewForm';

export default function Ulasan({ isDark, theme }) {
  return (
    <div
      className="page-enter"
      style={{ ...theme.page, maxWidth: 560, margin: '0 auto' }}
    >
      <h2 style={theme.sectionTitle}>✍️ Tulis Ulasan</h2>
      <p
        style={{
          fontSize: 14,
          color: isDark ? '#aaa' : '#888',
          marginBottom: 16,
        }}
      >
        Pernah order? Ceritain pengalaman kamu! 💙
      </p>
      <ReviewForm theme={theme} isDark={isDark} />
    </div>
  );
}
