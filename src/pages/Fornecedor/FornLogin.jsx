import { useState } from "react";
import LogoMark from "../../components/layout/LogoMark";
import { apiService } from "../../services/api"; 

export default function FornLogin({ onLogin, onBack, onRegister }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const erro = await onLogin(email, senha);

      if (erro) {
        setError(erro);
      }
    } catch (err) {
      setError(err.message || "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
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
          <p className="f-auth-sub">
            Bem-vindo de volta ao ecossistema MediLink.
          </p>
          <div className="f-form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="empresa@distribuidora.com.br"
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          {error && <div className="f-form-error">{error}</div>}
          
          <button className="f-btn-primary full" onClick={handle} disabled={loading}>
            {loading ? "Autenticando..." : "Entrar"}
          </button>
          
          <p className="f-auth-link">
            Não tem conta? <a onClick={onRegister}>Criar conta gratuita</a>
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
              "📦 12 pedidos hoje",
              "💰 R$ 4.280 receita",
              "🚚 3 em transporte",
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