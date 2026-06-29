import { useState, useRef } from "react";

export default function FornVerify({ onContinue }) {
  const [docs, setDocs] = useState({ cnpj: null, alvara: null, licenca: null });
  const refs = { cnpj: useRef(), alvara: useRef(), licenca: useRef() };

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
      key: "cnpj",
      icon: "🗒️",
      label: "Cartão CNPJ",
      sub: "Clique para enviar",
    },
    {
      key: "alvara",
      icon: "🏛️",
      label: "Alvará de Funcionamento",
      sub: "Clique para enviar",
    },
    {
      key: "licenca",
      icon: "✅",
      label: "Licença Sanitária",
      sub: "Clique para enviar",
    },
  ];

  return (
    <div style={{ flex: 1 }}>
      <div className="f-centered-layout">
        <div className="f-c-card wide">
          <div className="f-step-header">
            <div className="f-step-icon">📋</div>
            <div>
              <h2>Verificação de documentos</h2>
              <p>Envie seus documentos para ativar sua conta.</p>
            </div>
          </div>
          <div className="v-upload-grid">
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
          <div className="v-status-row">
            <span className="v-status-dot" />
            <span>
              Status: <strong>Em análise</strong> — Documentos serão revisados
              em até 24h.
            </span>
          </div>
          <button className="f-btn-primary full" onClick={onContinue}>
            Continuar
          </button>
          <p
            className="f-auth-link"
            style={{ textAlign: "center", marginTop: ".75rem" }}
          >
            Você pode <a onClick={onContinue}>pular esta etapa</a> e enviar
            depois nas configurações.
          </p>
        </div>
      </div>
    </div>
  );
}
