import { useState } from "react";

export default function MedSettingsModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: user?.nome || "",
    clinica: user?.clinica || "",
    email: user?.email || "",
    senha: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="f-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="f-modal-box">
        <div className="f-modal-header">
          <h3>⚙️ Configurações da Conta</h3>
          <button className="f-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="f-form-group">
          <label>Nome completo</label>
          <input
            type="text"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
          />
        </div>
        <div className="f-form-group">
          <label>Clínica / Estabelecimento</label>
          <input
            type="text"
            value={form.clinica}
            onChange={(e) => set("clinica", e.target.value)}
          />
        </div>
        <div className="f-form-row">
          <div className="f-form-group">
            <label>E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="f-form-group">
            <label>
              CRM <span className="label-note">(não editável)</span>
            </label>
            <input
              type="text"
              value={`CRM-${user?.crmUF || ""} ${user?.crm || ""}`}
              readOnly
              className="readonly-field"
            />
          </div>
        </div>
        <div className="f-form-group">
          <label>Nova senha (deixe vazio para manter)</label>
          <input
            type="password"
            value={form.senha}
            onChange={(e) => set("senha", e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button
          className="f-btn-primary full"
          style={{ marginTop: ".5rem" }}
          onClick={() => onSave({ ...form, senha: form.senha || user.senha })}
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}
