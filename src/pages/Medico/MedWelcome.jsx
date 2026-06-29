import LogoMark from "../../components/layout/LogoMark";

export default function MedWelcome({ onLogin, onRegister, onClose }) {
  return (
    <div className="wlc-bg">
      <div className="wlc-circle wlc-c1" />
      <div className="wlc-circle wlc-c2" />
      <div className="wlc-card">
        <div className="wlc-logo">
          <LogoMark sm />
          <span>MediLink</span>
        </div>
        <div className="wlc-badge">Área Clínica</div>
        <h1 className="wlc-h1">
          Decisão clínica <em>inteligente</em> na palma da mão
        </h1>
        <p className="wlc-sub">
          Apoio diagnóstico com IA, alertas de contraindicação, sugestões
          baseadas em diretrizes e logística farmacêutica integrada.
        </p>
        <div className="wlc-btns">
          <button className="wlc-btn-solid" onClick={onRegister}>
            Criar conta médica
          </button>
          <button className="wlc-btn-outline" onClick={onLogin}>
            Já tenho conta
          </button>
        </div>
        <div className="wlc-divider" />
        <div className="wlc-icons">
          {[
            { i: "🤖", l: "IA Clínica" },
            { i: "⚠️", l: "Alertas" },
            { i: "💊", l: "Suprimentos" },
            { i: "📋", l: "Conformidade" },
          ].map((x) => (
            <div key={x.l} className="wlc-icon-item">
              <span>{x.i}</span>
              <small>{x.l}</small>
            </div>
          ))}
        </div>
        <button className="wlc-back" onClick={onClose}>
          ← Voltar ao site
        </button>
      </div>
    </div>
  );
}
