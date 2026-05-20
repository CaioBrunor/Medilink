export default function MedSuccessModal({ order: o, onClose }) {
  return (
    <div className="f-modal-overlay">
      <div
        className="f-modal-box"
        style={{ textAlign: "center", maxWidth: 440 }}
      >
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>✅</div>
        <h3
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "1.4rem",
            marginBottom: ".5rem",
          }}
        >
          Pedido realizado!
        </h3>
        <p style={{ color: "var(--f-text2)", marginBottom: "1.5rem" }}>
          Seu pedido foi enviado ao fornecedor e está sendo processado.
        </p>
        <div
          style={{
            background: "var(--f-off)",
            padding: "1rem",
            borderRadius: "var(--f-r)",
            marginBottom: "1.5rem",
            textAlign: "left",
          }}
        >
          {[
            ["Pedido", o.id],
            ["Produto", o.produto],
            ["Qtd.", `${o.qty} un`],
            ["Total", o.total],
            ["Fornecedor", o.fornecedor],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: ".88rem",
                padding: ".3rem 0",
                borderBottom: "1px solid var(--f-border)",
              }}
            >
              <span style={{ color: "var(--f-text2)" }}>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <button className="f-btn-primary full" onClick={onClose}>
          Ver meus pedidos
        </button>
      </div>
    </div>
  );
}
