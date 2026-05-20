import { MOCK_PRODUCTS_CATALOG } from "../../data/constants";

export default function MedProductsModal({
  tratamento,
  tags,
  onSelect,
  onClose,
}) {
  const list = MOCK_PRODUCTS_CATALOG.filter((p) =>
    tags.some((t) => p.tags.includes(t)),
  );

  return (
    <div
      className="f-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="products-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="f-modal-box modal-wide">
        <div className="f-modal-header">
          <h3 id="products-modal-title">Catálogo de Produtos</h3>
          <button
            className="f-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <p className="f-auth-sub mb-md">
          Produtos disponíveis para: <strong>{tratamento}</strong>
        </p>
        {list.length === 0 ? (
          <p className="text-muted p-md">
            Nenhum produto disponível para este tratamento.
          </p>
        ) : (
          <div className="f-product-grid">
            {list.map((p) => (
              <div key={p.id} className="f-product-card">
                <div className="f-pc-header">
                  <div className="f-pc-icon">💊</div>
                  <div className="f-pc-info">
                    <h4>{p.nome}</h4>
                    <p>{p.fornecedor}</p>
                  </div>
                </div>
                <div className="f-pc-body">
                  <div className="f-pc-row">
                    <span>Preço unit.</span>
                    <span>
                      <strong>R$ {p.preco.toFixed(2)}</strong>
                    </span>
                  </div>
                  <div className="f-pc-row">
                    <span>Unidade</span>
                    <span>{p.unidade}</span>
                  </div>
                  <div className="f-pc-row">
                    <span>Estoque</span>
                    <span>{p.estoque} un</span>
                  </div>
                  <div className="f-pc-row">
                    <span>Prazo</span>
                    <span>{p.prazo}</span>
                  </div>
                  <div className="f-pc-row">
                    <span>Mín. pedido</span>
                    <span>{p.minPedido} un</span>
                  </div>
                </div>
                <div className="f-pc-actions pc-actions-bordered">
                  <button
                    className="f-btn-primary full"
                    onClick={() => onSelect(p)}
                  >
                    Solicitar pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
