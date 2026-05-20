import { useState, useRef } from "react";

export default function MedVerify({ user, onContinue }) {
  const [docs, setDocs] = useState({ carteira: null, identidade: null });
  const refs = { carteira: useRef(), identidade: useRef() };

  const handleFile = (key, e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setDocs((d) => ({ ...d, [key]: f.name }));
  };

  const handleClick = (key) => {
    if (docs[key]) {
      setDocs((d) => ({ ...d, [key]: null }));
      refs[key].current.value = "";
    } else refs[key].current.click();
  };

  const items = [
    {
      key: "carteira",
      icon: "🪪",
      label: "Carteira do CRM",
      sub: "Frente e verso",
    },
    {
      key: "identidade",
      icon: "🗒️",
      label: "Documento de identidade",
      sub: "RG ou CNH",
    },
  ];

  return (
    <div style={{ flex: 1 }}>
      <div className="f-centered-layout">
        <div className="f-c-card wide">
          <div className="f-step-header">
            <div className="f-step-icon">🩺</div>
            <div>
              <h2>Verificação de CRM</h2>
              <p>Envie um documento que comprove seu registro médico ativo.</p>
            </div>
          </div>
          <div className="v-upload-grid col2">
            {items.map((item) => (
              <div
                key={item.key}
                className={`v-upload-box${docs[item.key] ? " uploaded" : ""}`}
                onClick={() => handleClick(item.key)}
              >
                <input
                  ref={refs[item.key]}
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(item.key, e)}
                />
                <div className="v-ub-icon">
                  {docs[item.key] ? "✅" : item.icon}
                </div>
                <div className="v-ub-label">{item.label}</div>
                {docs[item.key] ? (
                  <div className="v-ub-done">✓ {docs[item.key]}</div>
                ) : (
                  <div className="v-ub-sub">{item.sub}</div>
                )}
              </div>
            ))}
          </div>
          <div className="med-verify-info">
            <div className="med-vi-row">
              <span>👤</span>
              <span>{user?.nome || "—"}</span>
            </div>
            <div className="med-vi-row">
              <span>🪪</span>
              <span>
                CRM-{user?.crmUF || "??"} {user?.crm || "—"}
              </span>
            </div>
            <div className="med-vi-row">
              <span>🎓</span>
              <span>{user?.esp || "—"}</span>
            </div>
          </div>
          <div className="v-status-row">
            <span className="v-status-dot" />
            <span>
              CRM será validado em até 24h. Você já pode acessar o painel com
              acesso parcial.
            </span>
          </div>
          <button className="f-btn-primary full" onClick={onContinue}>
            Acessar painel clínico →
          </button>
        </div>
      </div>
    </div>
  );
}
