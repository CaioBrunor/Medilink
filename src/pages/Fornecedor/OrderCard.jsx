import { STATUS_LABELS } from "../../data/constants";
import StatusActions from "../../components/common/StatusActions";

export default function OrderCard({
  order: o,
  onDetail,
  onUpdateStatus,
  showActions,
}) {
  const s = STATUS_LABELS[o.status] || { label: o.status, cls: "" };
  return (
    <div className="f-order-card">
      <div className="f-oc-top">
        <div>
          <span className="f-oc-id">{o.id}</span>
          <span className="f-oc-prod">
            {" "}
            — {o.produto} × {o.qty}
          </span>
        </div>
        <span className={`f-status ${s.cls}`}>{s.label}</span>
      </div>
      <div className="f-oc-meta">
        <span>🏥 {o.clinica}</span>
        <span>⏱ {o.prazo}</span>
        <span>💰 R$ {o.total.toFixed(2)}</span>
        <span>📅 {o.data}</span>
      </div>
      {showActions && (
        <StatusActions
          status={o.status}
          orderId={o.id}
          onUpdateStatus={onUpdateStatus}
          onDetail={onDetail}
        />
      )}
    </div>
  );
}
