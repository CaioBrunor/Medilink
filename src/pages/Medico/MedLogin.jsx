import { useState } from "react";
import LogoMark from "../../components/layout/LogoMark";

export default function MedLogin({ onLogin, onBack, onRegister }) {
  const [loginVal, setLoginVal] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    const err = onLogin(loginVal, senha);
    if (err) setError(err);
  };

  return (
    <div style={{ flex: 1 }}>
      <div className="f-auth-layout">
        <div className="f-auth-side">
          <div
            className="f-alogo"
            onClick={onBack}
            style={{ cursor: "pointer" }}
          >
            <LogoMark sm /> MediLink
          </div>
          <h2>Acesse seu painel</h2>
          <p className="f-auth-sub">Bem-vindo de volta, doutor(a).</p>
          <div className="f-form-group">
            <label>E-mail ou CRM</label>
            <input
              type="text"
              value={loginVal}
              onChange={(e) => setLoginVal(e.target.value)}
              placeholder="email@clinica.com.br ou CRM"
            />
          </div>
          <div className="f-form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              placeholder="••••••••"
            />
          </div>
          {error && <div className="f-form-error">{error}</div>}
          <button className="f-btn-primary full" onClick={handle}>
            Entrar
          </button>
          <p className="f-auth-link">
            Não tem conta? <a onClick={onRegister}>Cadastrar-se</a>
          </p>
          <p className="f-auth-link" style={{ marginTop: ".5rem" }}>
            <a onClick={onBack} style={{ color: "var(--f-text3)" }}>
              ← Voltar
            </a>
          </p>
        </div>
        <div className="f-auth-visual">
          <div className="f-av-inner">
            {[
              "🤖 Apoio clínico com IA",
              "✅ Alertas de contraindicação",
              "💊 Catálogo de insumos",
            ].map((t) => (
              <div key={t} className="f-av-card">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
