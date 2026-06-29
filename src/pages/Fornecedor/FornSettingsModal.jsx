import { useState } from "react";

export default function FornSettingsModal({ user, onSave, onClose }) {
  const [form, setForm] = useState({
    empresa: user?.empresa || "",
    responsavel: user?.responsavel || "",
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
          <label>Nome da empresa</label>
          <input
            type="text"
            value={form.empresa}
            onChange={(e) => set("empresa", e.target.value)}
          />
        </div>
        <div className="f-form-group">
          <label>Responsável</label>
          <input
            type="text"
            value={form.responsavel}
            onChange={(e) => set("responsavel", e.target.value)}
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
              CNPJ <span className="label-note">(não editável)</span>
            </label>
            <input
              type="text"
              value={user?.cnpj || ""}
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
