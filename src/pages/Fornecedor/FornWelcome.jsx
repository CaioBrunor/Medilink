import LogoMark from "../../components/layout/LogoMark";

export default function FornWelcome({ onLogin, onRegister, onClose }) {
  return (
    <div className="wlc-bg">
      <div className="wlc-circle wlc-c1" />
      <div className="wlc-circle wlc-c2" />
      <div className="wlc-card">
        <div className="wlc-logo">
          <LogoMark sm />
          <span>MediLink</span>
        </div>
        <div className="wlc-badge">Área do Fornecedor</div>
        <h1 className="wlc-h1">
          Venda para médicos e clínicas de forma <em>direta e organizada</em>
        </h1>
        <p className="wlc-sub">
          Gerencie seus produtos, acompanhe pedidos e expanda sua distribuição
          para toda a rede MediLink.
        </p>
        <div className="wlc-btns">
          <button className="wlc-btn-solid" onClick={onRegister}>
            Criar conta
          </button>
          <button className="wlc-btn-outline" onClick={onLogin}>
            Já tenho conta
          </button>
        </div>
        <div className="wlc-divider" />
        <div className="wlc-stats">
          {[
            { n: "+340", l: "Distribuidoras" },
            { n: "+12k", l: "Unidades atendidas" },
            { n: "98%", l: "Eficiência" },
          ].map((s) => (
            <div key={s.n} className="wlc-stat">
              <div className="wlc-stat-n">{s.n}</div>
              <div className="wlc-stat-l">{s.l}</div>
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
