import LogoMark from './LogoMark';

export default function AppSidebar({ brand, navItems, onLogout, mobOpen, onCloseMob }) {
  return (
    <>
      <div className={`f-sidebar-overlay${mobOpen ? ' visible' : ''}`} onClick={onCloseMob} />
      <aside className={`f-sidebar${mobOpen ? ' mob-open' : ''}`}>
        <div className="f-sb-logo">
          <LogoMark />
          <span>MediLink</span>
        </div>
        <div className="f-sb-company">{brand}</div>
        <nav className="f-sb-nav">
          {navItems.map((item) => (
            <div
              key={item.title}
              className={`f-sb-card${item.active ? ' active' : ''}`}
              onClick={() => { item.onClick(); onCloseMob(); }}
            >
              <span className="f-sb-card-icon">{item.icon}</span>
              <div className="f-sb-card-body">
                <div className="f-sb-card-title">{item.title}</div>
                <div className="f-sb-card-desc">{item.desc}</div>
              </div>
              <span className="f-sb-card-arrow">›</span>
              {item.badge > 0 && <span className="f-sb-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="f-sb-footer">
          <button className="f-sb-logout" onClick={onLogout}>← Sair</button>
        </div>
      </aside>
    </>
  );
}
