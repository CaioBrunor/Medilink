import { useState } from "react";
import OrderCard from "./OrderCard";

export default function FornPedidosView({ orders, onDetail, onUpdateStatus }) {
  const [filter, setFilter] = useState("todos");
  const filtered =
    filter === "todos" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="f-view f-view-active">
      <div className="f-page-header">
        <div>
          <h2>Pedidos</h2>
          <p className="f-page-sub">Gerencie e acompanhe todos os pedidos</p>
        </div>
        <div className="f-filter-tabs">
          {[
            ["todos", "Todos"],
            ["pendente", "Pendentes"],
            ["aceito", "Aceitos"],
            ["enviado", "Enviados"],
          ].map(([v, l]) => (
            <button
              key={v}
              className={`f-ftab${filter === v ? " active" : ""}`}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="f-order-list">
        {filtered.length === 0 ? (
          <p style={{ color: "var(--f-text3)", padding: "1rem 0" }}>
            Nenhum pedido nesta categoria.
          </p>
        ) : (
          filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onDetail={() => onDetail(o)}
              onUpdateStatus={onUpdateStatus}
              showActions
            />
          ))
        )}
      </div>
    </div>
  );
}
