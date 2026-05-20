export default function StatusActions({
  status,
  orderId,
  onUpdateStatus,
  onDetail,
  onClose,
}) {
  return (
    <div className="f-status-actions">
      {status === "pendente" && (
        <>
          <button
            className="f-btn-accept sm"
            onClick={() => onUpdateStatus(orderId, "aceito")}
          >
            ✓ Aceitar
          </button>
          <button
            className="f-btn-danger sm"
            onClick={() => onUpdateStatus(orderId, "cancelado")}
          >
            ✕ Recusar
          </button>
        </>
      )}
      {status === "aceito" && (
        <button
          className="f-btn-primary sm"
          onClick={() => onUpdateStatus(orderId, "separando")}
        >
          📦 Separando
        </button>
      )}
      {status === "separando" && (
        <button
          className="f-btn-primary sm"
          onClick={() => onUpdateStatus(orderId, "enviado")}
        >
          🚚 Enviado
        </button>
      )}
      {status === "enviado" && (
        <button
          className="f-btn-primary sm"
          onClick={() => onUpdateStatus(orderId, "entregue")}
        >
          ✅ Entregue
        </button>
      )}
      {onDetail && (
        <button className="f-btn-outline sm" onClick={onDetail}>
          👁 Detalhar
        </button>
      )}
      {onClose && (
        <button className="f-btn-outline sm" onClick={onClose}>
          Fechar
        </button>
      )}
    </div>
  );
}
