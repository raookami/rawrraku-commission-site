import AdminPanel from '../komponen/AdminPanel';

export default function Admin({ isDark, theme }) {
  return (
    <div className="page-enter" style={theme.page}>
      <AdminPanel theme={theme} isDark={isDark} />
    </div>
  );
}
