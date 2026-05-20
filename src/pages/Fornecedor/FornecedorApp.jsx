import { useState, useEffect, useRef } from "react";
import { save, load } from "../../services/storage";
import { DEFAULT_FORN_ORDERS } from "../../data/constants";
import { useToast } from "../../hooks/useToast";
import DemoBanner from "../../components/common/DemoBanner";
import ToastContainer from "../../components/common/ToastContainer";
import ConfirmModal from "../../components/common/ConfirmModal";
import AppSidebar from "../../components/layout/AppSidebar";
import LogoMark from "../../components/layout/LogoMark";
import FornWelcome from "./FornWelcome";
import FornLogin from "./FornLogin";
import FornRegister from "./FornRegister";
import FornVerify from "./FornVerify";
import FornPedidosView from "./FornPedidosView";
import FornProductModal from "./FornProductModal";
import FornOrderModal from "./FornOrderModal";
import FornSettingsModal from "./FornSettingsModal";
import OrderCard from "./OrderCard";

export default function FornecedorApp({ onClose }) {
  const [screen, setScreen] = useState(() =>
    localStorage.getItem("ml_forn_logged") ? "dashboard" : "welcome",
  );
  const [user, setUser] = useState(() => load("ml_forn_user", null));
  const [view, setView] = useState("dash");
  const [products, setProducts] = useState(() => load("ml_products", []));
  const [orders, setOrders] = useState(
    () => load("ml_forn_orders", null) || DEFAULT_FORN_ORDERS,
  );
  const [mobOpen, setMobOpen] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toasts, addToast] = useToast();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [view]);

  const saveProducts = (p) => {
    setProducts(p);
    save("ml_products", p);
  };
  const saveOrders = (o) => {
    setOrders(o);
    save("ml_forn_orders", o);
  };

  const login = (email, senha) => {
    const u = load("ml_forn_user", null);
    if (!u || u.email !== email || u.senha !== senha)
      return "E-mail ou senha incorretos.";
    localStorage.setItem("ml_forn_logged", "1");
    setUser(u);
    setScreen("dashboard");
    return null;
  };

  const register = (data) => {
    setUser(data);
    save("ml_forn_user", data);
    localStorage.setItem("ml_forn_logged", "1");
    setScreen("verify");
  };

  const logout = () => {
    localStorage.removeItem("ml_forn_logged");
    onClose();
  };

  const updateOrderStatus = (id, status) => {
    const upd = orders.map((o) => (o.id === id ? { ...o, status } : o));
    saveOrders(upd);
    if (orderDetail?.id === id) setOrderDetail((d) => ({ ...d, status }));
  };

  const wrap = (content) => <div id="fornecedor-app">{content}</div>;

  if (screen === "welcome")
    return wrap(
      <FornWelcome
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
        onClose={onClose}
      />,
    );
  if (screen === "login")
    return wrap(
      <FornLogin
        onLogin={login}
        onBack={() => setScreen("welcome")}
        onRegister={() => setScreen("register")}
      />,
    );
  if (screen === "register")
    return wrap(
      <FornRegister
        onRegister={register}
        onBack={() => setScreen("welcome")}
        onLogin={() => setScreen("login")}
      />,
    );
  if (screen === "verify")
    return wrap(
      <FornVerify user={user} onContinue={() => setScreen("dashboard")} />,
    );

  const h = new Date().getHours();
  const saud = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const kpiReceita = orders.reduce((s, o) => s + o.total, 0);
  const kpiMov = orders.filter(
    (o) => o.status === "enviado" || o.status === "separando",
  ).length;
  const pendingCount = orders.filter((o) => o.status === "pendente").length;

  const navItems = [
    {
      icon: "📊",
      title: "Dashboard",
      desc: "KPIs e pedidos recentes",
      active: view === "dash",
      onClick: () => setView("dash"),
    },
    {
      icon: "💊",
      title: "Produtos",
      desc: "Gerencie seu catálogo",
      active: view === "produtos",
      onClick: () => setView("produtos"),
    },
    {
      icon: "📦",
      title: "Pedidos",
      desc: "Aceite e acompanhe pedidos",
      active: view === "pedidos",
      onClick: () => setView("pedidos"),
      badge: pendingCount,
    },
    {
      icon: "⚙️",
      title: "Configurações",
      desc: "Dados da empresa",
      active: false,
      onClick: () => setShowSettings(true),
    },
  ];

  return (
    <div id="fornecedor-app">
      <DemoBanner />
      <ToastContainer toasts={toasts} />
      <div className="forn-mob-header">
        <div className="mob-logo">
          <LogoMark sm /> MediLink
        </div>
        <button className="mob-menu-btn" onClick={() => setMobOpen(!mobOpen)}>
          ☰
        </button>
      </div>
      <div className="f-app-layout">
        <AppSidebar
          brand={user?.empresa || "Fornecedor"}
          navItems={navItems}
          onLogout={logout}
          mobOpen={mobOpen}
          onCloseMob={() => setMobOpen(false)}
        />
        <main className="f-app-main" ref={mainRef}>
          {view === "dash" && (
            <div className="f-view f-view-active">
              <div className="f-page-header">
                <div>
                  <h2>
                    {saud}, {user?.empresa || "Fornecedor"}!
                  </h2>
                  <p className="f-page-sub">Resumo do dia de hoje</p>
                </div>
                <button
                  className="f-btn-primary sm"
                  onClick={() => setView("pedidos")}
                >
                  Ver pedidos
                </button>
              </div>
              <div className="f-kpi-grid">
                <div className="f-kpi-card">
                  <div className="f-kpi-icon">📦</div>
                  <div className="f-kpi-val">{orders.length}</div>
                  <div className="f-kpi-label">Pedidos no sistema</div>
                </div>
                <div className="f-kpi-card">
                  <div className="f-kpi-icon">💰</div>
                  <div className="f-kpi-val">
                    R$ {kpiReceita.toFixed(2).replace(".", ",")}
                  </div>
                  <div className="f-kpi-label">Receita simulada</div>
                </div>
                <div className="f-kpi-card">
                  <div className="f-kpi-icon">🚚</div>
                  <div className="f-kpi-val">{kpiMov}</div>
                  <div className="f-kpi-label">Em transporte</div>
                </div>
                <div className="f-kpi-card">
                  <div className="f-kpi-icon">💊</div>
                  <div className="f-kpi-val">{products.length}</div>
                  <div className="f-kpi-label">Produtos ativos</div>
                </div>
              </div>
              <div className="f-section-title">Pedidos recentes</div>
              <div className="f-order-list">
                {orders.slice(0, 4).map((o) => (
                  <OrderCard
                    key={o.id}
                    order={o}
                    onDetail={() => setOrderDetail(o)}
                  />
                ))}
              </div>
            </div>
          )}

          {view === "produtos" && (
            <div className="f-view f-view-active">
              <div className="f-page-header">
                <div>
                  <h2>Produtos</h2>
                  <p className="f-page-sub">
                    Gerencie seu catálogo de medicamentos
                  </p>
                </div>
                <button
                  className="f-btn-primary sm"
                  onClick={() => {
                    setEditProduct(null);
                    setShowProductModal(true);
                  }}
                >
                  + Novo produto
                </button>
              </div>
              {products.length === 0 ? (
                <div className="f-empty-state">
                  <div className="f-es-icon">💊</div>
                  <p>Nenhum produto cadastrado.</p>
                  <button
                    className="f-btn-primary"
                    style={{ marginTop: "1rem" }}
                    onClick={() => setShowProductModal(true)}
                  >
                    Adicionar produto
                  </button>
                </div>
              ) : (
                <div className="f-product-grid">
                  {products.map((p) => (
                    <div key={p.id} className="f-product-card">
                      <div className="f-pc-header">
                        <div className="f-pc-icon">💊</div>
                        <div className="f-pc-info">
                          <h4>{p.nome}</h4>
                          <p>{p.tipo || "Genérico"}</p>
                        </div>
                      </div>
                      <div className="f-pc-body">
                        <div className="f-pc-row">
                          <span>Preço unit.</span>
                          <span>
                            <strong>R$ {(+p.preco || 0).toFixed(2)}</strong>
                          </span>
                        </div>
                        <div className="f-pc-row">
                          <span>Estoque</span>
                          <span>{p.estoque || 0} un</span>
                        </div>
                        <div className="f-pc-row">
                          <span>Prazo</span>
                          <span>{p.prazo || "—"}</span>
                        </div>
                        <div className="f-pc-row">
                          <span>Região</span>
                          <span>{p.regiao || "—"}</span>
                        </div>
                      </div>
                      <div className="f-pc-actions">
                        <button
                          className="f-btn-outline sm"
                          onClick={() => {
                            setEditProduct(p);
                            setShowProductModal(true);
                          }}
                        >
                          ✏ Editar
                        </button>
                        <button
                          className="f-btn-danger sm"
                          onClick={() => setConfirmDelete(p.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "pedidos" && (
            <FornPedidosView
              orders={orders}
              onDetail={setOrderDetail}
              onUpdateStatus={(id, st) => {
                updateOrderStatus(id, st);
                addToast("Status atualizado!");
              }}
            />
          )}
        </main>
      </div>

      {showProductModal && (
        <FornProductModal
          product={editProduct}
          onSave={(data) => {
            if (editProduct)
              saveProducts(
                products.map((p) =>
                  p.id === editProduct.id ? { ...editProduct, ...data } : p,
                ),
              );
            else saveProducts([...products, { id: "p" + Date.now(), ...data }]);
            setShowProductModal(false);
            addToast("Produto salvo!");
          }}
          onClose={() => setShowProductModal(false)}
        />
      )}
      {orderDetail && (
        <FornOrderModal
          order={orderDetail}
          onClose={() => setOrderDetail(null)}
          onUpdateStatus={(id, st) => {
            updateOrderStatus(id, st);
            addToast("Status atualizado!");
          }}
        />
      )}
      {showSettings && (
        <FornSettingsModal
          user={user}
          onSave={(data) => {
            const u = { ...user, ...data };
            setUser(u);
            save("ml_forn_user", u);
            setShowSettings(false);
            addToast("Dados atualizados!");
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          message="Remover este produto do catálogo?"
          confirmLabel="Remover"
          onConfirm={() => {
            saveProducts(products.filter((x) => x.id !== confirmDelete));
            setConfirmDelete(null);
            addToast("Produto removido.");
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
