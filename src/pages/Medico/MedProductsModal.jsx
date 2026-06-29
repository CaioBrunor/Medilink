import { useState, useEffect } from "react";
import { apiService } from "../../services/api";

export default function MedProductsModal({
  tratamento,
  tags,
  onSelect,
  onClose,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getProducts()
      .then((data) => {
        const filtered = data.filter((p) => {
          const productTags = p.tags || [p.description || p.tipo];
          return tags.some((t) => productTags.map(x => x.toLowerCase()).includes(t.toLowerCase()));
        });
        setProducts(filtered);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [tags]);

  return (
    <div className="f-modal-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="f-modal-box modal-wide">
        <div className="f-modal-header">
          <h3 id="products-modal-title">Catálogo de Produtos</h3>
          <button className="f-modal-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <p className="f-auth-sub mb-md">
          Produtos disponíveis para: <strong>{tratamento}</strong>
        </p>

        {loading ? (
          <div className="text-muted p-md" style={{ textAlign: 'center' }}>Carregando catálogo...</div>
        ) : products.length === 0 ? (
          <p className="text-muted p-md">Nenhum produto disponível para este tratamento.</p>
        ) : (
          <div className="f-product-grid">
            {products.map((p) => {
              const preco = p.price || p.preco || 0;
              const nome = p.name || p.nome;
              const estoque = p.stock ?? p.estoque ?? 0;
              const fornecedor = p.fornecedor || "Fornecedor Parceiro";

              return (
                <div key={p._id || p.id} className="f-product-card">
                  <div className="f-pc-header">
                    <div className="f-pc-icon">💊</div>
                    <div className="f-pc-info">
                      <h4>{nome}</h4>
                      <p>{fornecedor}</p>
                    </div>
                  </div>
                  <div className="f-pc-body">
                    <div className="f-pc-row">
                      <span>Preço unit.</span>
                      <span><strong>R$ {Number(preco).toFixed(2).replace('.', ',')}</strong></span>
                    </div>
                    <div className="f-pc-row">
                      <span>Unidade</span>
                      <span>{p.unidade || "cx"}</span>
                    </div>
                    <div className="f-pc-row">
                      <span>Estoque</span>
                      <span>{estoque} un</span>
                    </div>
                    <div className="f-pc-row">
                      <span>Prazo</span>
                      <span>{p.prazo || "1-3 dias"}</span>
                    </div>
                  </div>
                  <div className="f-pc-actions pc-actions-bordered">
                    <button className="f-btn-primary full" onClick={() => onSelect(p)}>Solicitar pedido</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}