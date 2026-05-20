import { useState } from 'react';

export default function MedCheckoutModal({ product: p, onConfirm, onClose }) {
  const [qty, setQty] = useState(1);
  const [addr, setAddr] = useState('');
  const [addrErr, setAddrErr] = useState(false);

  const sub = (p.preco * qty).toFixed(2);
  const com = (p.preco * qty * 0.05).toFixed(2);
  const tot = (p.preco * qty * 1.05).toFixed(2);

  return (
    <div className="f-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-modal-title" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="f-modal-box">
        <div className="f-modal-header">
          <h3 id="checkout-modal-title">Finalizar Pedido</h3>
          <button className="f-modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className="med-checkout">
          <div className="med-co-product">
            <div style={{ fontSize: '2rem' }}>💊</div>
            <div>
              <h4 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem' }}>{p.nome}</h4>
              <p style={{ color: 'var(--f-text2)', fontSize: '.82rem' }}>{p.fornecedor} · {p.unidade}</p>
            </div>
          </div>
          <div className="med-co-row">
            <span>Quantidade</span>
            <div className="med-co-qty">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <input type="number" value={qty} readOnly />
              <button type="button" onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>
          <div className="f-form-group" style={{ margin: '.25rem 0 .5rem' }}>
            <label>Endereço de entrega *</label>
            <input
              type="text"
              value={addr}
              onChange={e => { setAddr(e.target.value); setAddrErr(false); }}
              placeholder="Rua, número, bairro, cidade — UF"
              style={addrErr ? { borderColor: 'var(--f-danger)' } : {}}
            />
          </div>
          <div className="med-co-row"><span>Subtotal</span><span>R$ {sub}</span></div>
          <div className="med-co-row"><span>Comissão MediLink (5%)</span><span style={{ color: 'var(--f-text3)' }}>R$ {com}</span></div>
          <div className="med-co-row total"><span>Total</span><span>R$ {tot}</span></div>
          <button className="f-btn-primary full" style={{ marginTop: '1.25rem' }} onClick={() => {
            if (!addr.trim()) { setAddrErr(true); return; }
            onConfirm({
              id: '#MED-' + String(Date.now()).slice(-5),
              produto: p.nome,
              fornecedor: p.fornecedor,
              qty,
              preco: p.preco.toFixed(2),
              total: `R$ ${tot}`,
              comissao: `R$ ${com}`,
              endereco: addr,
              status: 'pendente',
              data: new Date().toLocaleDateString('pt-BR'),
            });
          }}>
            Confirmar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
