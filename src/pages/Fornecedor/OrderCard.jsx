import { STATUS_LABELS } from "../../data/constants";
import StatusActions from "../../components/common/StatusActions";

export default function OrderCard({
  order: o,
  onDetail,
  onUpdateStatus,
  showActions,
}) {
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
    <div className="f-order-card">
      <div className="f-oc-top">
        <div>
          <span className="f-oc-id" style={{ fontSize: '.85rem', opacity: 0.7 }}>{orderId}</span>
          <span className="f-oc-prod">
            {" "}
            — {nomeProduto} × {quantidade}
          </span>
        </div>
        <span className={`f-status ${s.cls}`}>{s.label}</span>
      </div>
      <div className="f-oc-meta">
        <span>🏥 {clinicaNome}</span>
        <span>⏱ {prazoEntrega}</span>
        <span>💰 R$ {Number(valorTotal).toFixed(2).replace('.', ',')}</span>
        <span>📅 {dataFormatada}</span>
      </div>
      {showActions && (
        <StatusActions
          status={statusAtual}
          orderId={orderId}
          onUpdateStatus={onUpdateStatus}
          onDetail={onDetail}
        />
      )}
    </div>
  );
}