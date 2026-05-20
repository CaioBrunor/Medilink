import { STATUS_LABELS } from "../../data/constants";
import StatusActions from "../../components/common/StatusActions";

export default function FornOrderModal({ order: o, onClose, onUpdateStatus }) {
  const s = STATUS_LABELS[o.status] || { label: o.status, cls: "" };
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
          <button
            className="f-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="f-om-grid">
          {[
            ["Pedido", o.id],
            ["Produto", o.produto],
            ["Quantidade", `${o.qty} unidades`],
            ["Clínica", o.clinica],
            ["Prazo", o.prazo],
            ["Total", `R$ ${o.total.toFixed(2)}`],
            ["Data", o.data],
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
          status={o.status}
          orderId={o.id}
          onUpdateStatus={onUpdateStatus}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
