import { useState } from "react";
import LogoMark from "../../components/layout/LogoMark";
import { maskCNPJ } from "../../utils/masks";

export default function FornRegister({ onRegister, onBack, onLogin }) {
  const [form, setForm] = useState({
    tipo: "",
    cnpj: "",
    empresa: "",
    responsavel: "",
    email: "",
    senha: "",
    endereco: "",
    cidade: "",
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handle = () => {
    if (!form.empresa || !form.email || !form.senha) {
      setError("Preencha nome da empresa, e-mail e senha.");
      return;
    }
    setError("");
    onRegister(form);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      <div className="f-auth-layout">
        <div className="f-auth-side wide">
          <div className="f-alogo">
            <LogoMark sm /> MediLink
          </div>
          <h2>Criar conta de fornecedor</h2>
          <p className="f-auth-sub">
            Preencha os dados da sua empresa para começar.
          </p>
          <div className="f-form-row">
            <div className="f-form-group">
              <label>Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => set("tipo", e.target.value)}
              >
                <option value="">Selecione...</option>
                <option>Farmácia</option>
                <option>Distribuidor</option>
              </select>
            </div>
            <div className="f-form-group">
              <label>CNPJ</label>
              <input
                type="text"
                value={form.cnpj}
                onChange={(e) => set("cnpj", maskCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>
          <div className="f-form-group">
            <label>Nome da empresa *</label>
            <input
              type="text"
              value={form.empresa}
              onChange={(e) => set("empresa", e.target.value)}
              placeholder="Distribuidora Saúde Ltda."
            />
          </div>
          <div className="f-form-group">
            <label>Nome do responsável</label>
            <input
              type="text"
              value={form.responsavel}
              onChange={(e) => set("responsavel", e.target.value)}
              placeholder="João Silva"
            />
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <label>E-mail *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="joao@empresa.com.br"
              />
            </div>
            <div className="f-form-group">
              <label>Senha *</label>
              <input
                type="password"
                value={form.senha}
                onChange={(e) => set("senha", e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <label>Endereço</label>
              <input
                type="text"
                value={form.endereco}
                onChange={(e) => set("endereco", e.target.value)}
                placeholder="Rua das Flores, 123"
              />
            </div>
            <div className="f-form-group">
              <label>Cidade</label>
              <input
                type="text"
                value={form.cidade}
                onChange={(e) => set("cidade", e.target.value)}
                placeholder="São Paulo"
              />
            </div>
          </div>
          {error && <div className="f-form-error">{error}</div>}
          <button className="f-btn-primary full" onClick={handle}>
            Cadastrar
          </button>
          <p className="f-auth-link">
            Já tem conta? <a onClick={onLogin}>Fazer login</a>
          </p>
          <button className="auth-back" onClick={onBack}>← Voltar</button>
        </div>
        <div className="f-auth-visual">
          <div className="f-av-inner">
            {["1 Cadastro", "2 Documentos", "3 Produtos", "4 Painel"].map(
              (s, i) => (
                <div key={s} className={`f-av-step${i === 0 ? " active" : ""}`}>
                  {s}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
