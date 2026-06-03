export default function Footer({ isDark, theme }) {
  return (
    <footer style={theme.footer}>
      <p>© 2026 RAWRRAKU</p>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Instagram: @raooraku_ · Discord: RAOORAKU
      </p>
    </footer>
  );
}
