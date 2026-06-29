export default function LogoMark({ sm }) {
  const s = sm ? 28 : 34;
  return (
    <div className={`f-logo-mark${sm ? ' sm' : ''}`} style={{ width: s, height: s }}>
      <svg viewBox="0 0 20 20" fill="none" style={{ width: sm ? 14 : 18, height: sm ? 14 : 18 }}>
        <path d="M10 2v16M2 10h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
