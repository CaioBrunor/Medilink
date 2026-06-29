import { useState } from "react";

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="demo-banner" role="status" aria-live="polite">
      <span className="demo-banner-icon">⚠️</span>
      <span>
        Ambiente de demonstração — dados fictícios, senhas não são
        criptografadas.
      </span>
      <button
        className="demo-banner-close"
        onClick={() => setVisible(false)}
        aria-label="Fechar aviso"
      >
        ✕
      </button>
    </div>
  );
}
