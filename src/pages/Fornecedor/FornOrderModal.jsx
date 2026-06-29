import { STATUS_LABELS } from "../../data/constants";
import StatusActions from "../../components/common/StatusActions";

export default function FornOrderModal({ order: o, onClose, onUpdateStatus }) {
  const orderId = o._id || o.id;
  const statusAtual = o.status || "pendente";
  const s = STATUS_LABELS[statusAtual] || { label: statusAtual, cls: "" };
  
  const nomeProduto = o.productId?.name || o.produto || "Medicamento";
  const quantidade = o.quantity || o.qty || 1;
  const valorTotal = o.totalPrice || o.total || 0;
  
  const clinicaNome = o.userId?.name || o.clinica || "Clínica Médica";
  const dataFormatada = o.createdAt ? new Date(o.createdAt).toLocaleDateString('pt-BR') : o.data || "—";
  const prazoEntrega = o.prazo || "1-3 dias úteis";

  return (
    <div
      className="f-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="f-modal-box">
        <div className="f-modal-header">
          <h3 id="order-modal-title">Gestão do pedido</h3>
          <button className="f-modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className="f-om-grid">
          {[
            ["Pedido", orderId],
            ["Produto", nomeProduto],
            ["Quantidade", `${quantidade} unidades`],
            ["Clínica", clinicaNome],
            ["Prazo", prazoEntrega],
            ["Total", `R$ ${Number(valorTotal).toFixed(2).replace('.', ',')}`],
            ["Data", dataFormatada],
          ].map(([k, v]) => (
            <div key={k} className="f-om-row">
              <span className="om-label">{k}</span>
              <strong className="om-value">{v}</strong>
            </div>
          ))}
          <div className="f-om-row">
            <span className="om-label">Status</span>
            <span className={`f-status ${s.cls}`}>{s.label}</span>
          </div>
        </div>
        <StatusActions
          status={statusAtual}
          orderId={orderId}
          onUpdateStatus={onUpdateStatus}
          onClose={onClose}
        />
      </div>
    </div>
  );
}