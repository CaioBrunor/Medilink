import { useState } from 'react';

export default function FornProductModal({ product: p, onSave, onClose }) {
  const [form, setForm] = useState({
    nome:   p?.nome   || '',
    tipo:   p?.tipo   || 'Genérico',
    preco:  p?.preco  || '',
    estoque:p?.estoque|| '',
    prazo:  p?.prazo  || 'Mesmo dia',
    regiao: p?.regiao || 'Nacional',
  });
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="f-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="f-modal-box">
        <div className="f-modal-header">
          <h3>{p ? 'Editar produto' : 'Novo produto'}</h3>
          <button className="f-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="f-form-row">
          <div className="f-form-group">
            <label>Nome do medicamento</label>
            <input type="text" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Amoxicilina 500mg" />
          </div>
          <div className="f-form-group">
            <label>Tipo</label>
            <select value={form.tipo} onChange={e => set('tipo', e.target.value)}>
              <option>Genérico</option><option>Referência</option><option>Similar</option>
            </select>
          </div>
        </div>
        <div className="f-form-row">
          <div className="f-form-group">
            <label>Preço (R$)</label>
            <input type="number" value={form.preco} onChange={e => set('preco', e.target.value)} placeholder="0,00" min="0" step="0.01" />
          </div>
          <div className="f-form-group">
            <label>Estoque (un)</label>
            <input type="number" value={form.estoque} onChange={e => set('estoque', e.target.value)} placeholder="0" min="0" />
          </div>
        </div>
        <div className="f-form-row">
          <div className="f-form-group">
            <label>Prazo de entrega</label>
            <select value={form.prazo} onChange={e => set('prazo', e.target.value)}>
              {['Mesmo dia', '1 dia útil', '2 dias úteis', '3–5 dias úteis', 'Sob consulta'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="f-form-group">
            <label>Região</label>
            <select value={form.regiao} onChange={e => set('regiao', e.target.value)}>
              {['Nacional', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>
        {error && <div className="f-form-error">{error}</div>}
        <button className="f-btn-primary full" style={{ marginTop: '.5rem' }} onClick={() => {
          if (!form.nome) { setError('Preencha o nome do medicamento.'); return; }
          onSave({ ...form, preco: parseFloat(form.preco) || 0, estoque: parseInt(form.estoque) || 0 });
        }}>
          Salvar produto
        </button>
      </div>
    </div>
  );
}
