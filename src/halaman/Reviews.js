import ReviewList from '../komponen/ReviewList';

export default function Reviews({ isDark, theme }) {
  return (
    <div
      className="page-enter"
      style={{ ...theme.page, maxWidth: 560, margin: '0 auto' }}
    >
      <h2 style={theme.sectionTitle}>⭐ Review Klien</h2>
      <p
        style={{
          fontSize: 14,
          color: isDark ? '#aaa' : '#888',
          marginBottom: 16,
        }}
      >
        Kata mereka yang udah pernah order 💙
      </p>
      <ReviewList isDark={isDark} />
    </div>
  );
}
