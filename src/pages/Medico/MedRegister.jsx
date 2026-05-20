import { useState } from "react";
import LogoMark from "../../components/layout/LogoMark";

const UFs = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];
const ESPs = [
  "Clínica Geral",
  "Cardiologia",
  "Dermatologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Ginecologia",
  "Neurologia",
  "Oncologia",
  "Ortopedia",
  "Pediatria",
  "Psiquiatria",
  "Urologia",
  "Outra",
];

export default function MedRegister({ onRegister, onBack, onLogin }) {
  const [form, setForm] = useState({
    nome: "",
    crm: "",
    crmUF: "SP",
    esp: "Clínica Geral",
    clinica: "",
    email: "",
    senha: "",
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handle = () => {
    if (!form.nome || !form.crm || !form.email || !form.senha) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (!/^\d{4,8}$/.test(form.crm)) {
      setError("Número de CRM inválido (4–8 dígitos numéricos).");
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
          <h2>Criar conta médica</h2>
          <p className="f-auth-sub">
            Preencha seus dados para acessar o painel clínico com verificação de
            CRM.
          </p>
          <div className="f-form-row">
            <div className="f-form-group">
              <label>Nome completo *</label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                placeholder="Dr. João Silva"
              />
            </div>
            <div className="f-form-group">
              <label>Número CRM *</label>
              <input
                type="text"
                value={form.crm}
                onChange={(e) => set("crm", e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
              />
            </div>
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <label>Estado CRM *</label>
              <select
                value={form.crmUF}
                onChange={(e) => set("crmUF", e.target.value)}
              >
                {UFs.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="f-form-group">
              <label>Especialidade *</label>
              <select
                value={form.esp}
                onChange={(e) => set("esp", e.target.value)}
              >
                {ESPs.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="f-form-group">
            <label>Clínica / Estabelecimento</label>
            <input
              type="text"
              value={form.clinica}
              onChange={(e) => set("clinica", e.target.value)}
              placeholder="Clínica São Lucas (opcional)"
            />
          </div>
          <div className="f-form-row">
            <div className="f-form-group">
              <label>E-mail *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="joao@clinica.com.br"
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
          <div className="med-crm-notice">
            <span>🔒</span>
            <p>
              Seu CRM será verificado por documento na próxima etapa. Apenas
              médicos registrados têm acesso ao painel clínico.
            </p>
          </div>
          {error && <div className="f-form-error">{error}</div>}
          <button className="f-btn-primary full" onClick={handle}>
            Cadastrar e verificar CRM
          </button>
          <p className="f-auth-link">
            Já tem conta? <a onClick={onLogin}>Fazer login</a>
          </p>
          <button className="auth-back" onClick={onBack}>← Voltar</button>
        </div>
        <div className="f-auth-visual">
          <div className="f-av-inner">
            {["1 Cadastro", "2 Verificação CRM", "3 Painel Clínico"].map(
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
