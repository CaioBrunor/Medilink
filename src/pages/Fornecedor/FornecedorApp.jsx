import { useState, useEffect, useRef } from "react";
import { save, load } from "../../services/storage";
import { DEFAULT_FORN_ORDERS } from "../../data/constants";
import { useToast } from "../../hooks/useToast";
import { apiService } from "../../services/api";
import { tokenStorage } from "../../services/storage";

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
    tokenStorage.get() ? "dashboard" : "welcome",
  );
  const [user, setUser] = useState(() => load("ml_forn_user", null));
  const [view, setView] = useState("dash");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
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

  useEffect(() => {
    if (screen === "dashboard") {
      apiService.getProducts()
        .then((dados) => setProducts(Array.isArray(dados) ? dados : []))
        .catch((err) => {
          console.error("Erro ao carregar catálogo:", err);
          setProducts([]);
        });

      apiService.getOrders()
        .then((dados) => setOrders(Array.isArray(dados) ? dados : []))
        .catch((err) => {
          console.error("Erro ao carregar pedidos:", err);
          setOrders([]);
        });
    }
  }, [screen, view]);

  const login = async (email, senha) => {
    try {
      const data = await apiService.login(email, senha);
      setUser(data.user);
      save("ml_medico_user", data.user);
      setScreen("dashboard");
      return null;
    } catch (err) {
      return err.message || "Erro ao efetuar login.";
    }
  };

  const register = async (data) => {
    try {
      const dataResponse = await apiService.register({ ...data, role: "fornecedor" });
      setUser(dataResponse.user);
      save("ml_forn_user", dataResponse.user);
      setScreen("verify");
    } catch (err) {
      addToast(err.message || "Erro ao registrar empresa.");
    }
  };

  const logout = () => {
    tokenStorage.remove();
    localStorage.removeItem("ml_forn_logged");
    onClose();
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const upd = orders.map((o) => (o._id === id || o.id === id ? { ...o, status } : o));
      setOrders(upd);
      if (orderDetail?._id === id || orderDetail?.id === id) setOrderDetail((d) => ({ ...d, status }));
    } catch (err) {
      console.error(err);
    }
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
  
  const kpiReceita = Array.isArray(orders) ? orders.reduce((s, o) => s + (o.totalPrice || o.total || 0), 0) : 0;
  const kpiMov = Array.isArray(orders) ? orders.filter((o) => o.status === "enviado" || o.status === "separando").length : 0;
  const pendingCount = Array.isArray(orders) ? orders.filter((o) => o.status === "pendente").length : 0;

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
                  <div className="f-kpi-label">Receita real</div>
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
                {!Array.isArray(orders) || orders.length === 0 ? (
                  <div className="f-empty-state">
                    <p>Nenhum pedido recebido.</p>
                  </div>
                ) : (
                  orders.slice(0, 4).map((o) => (
                    <OrderCard
                      key={o._id || o.id}
                      order={o}
                      onDetail={() => setOrderDetail(o)}
                    />
                  ))
                )}
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
              {!Array.isArray(products) || products.length === 0 ? (
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
                    <div key={p._id || p.id} className="f-product-card">
                      <div className="f-pc-header">
                        <div className="f-pc-icon">💊</div>
                        <div className="f-pc-info">
                          <h4>{p.name || p.nome}</h4>
                          <p>{p.description || p.tipo || "Insumo Médico"}</p>
                        </div>
                      </div>
                      <div className="f-pc-body">
                        <div className="f-pc-row">
                          <span>Preço unit.</span>
                          <span>
                            <strong>R$ {(+p.price || +p.preco || 0).toFixed(2)}</strong>
                          </span>
                        </div>
                        <div className="f-pc-row">
                          <span>Estoque</span>
                          <span>{p.stock || p.estoque || 100} un</span>
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
                          onClick={() => setConfirmDelete(p._id || p.id)}
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
              orders={Array.isArray(orders) ? orders : []}
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
          onSave={async (data) => {
            try {
              await apiService.saveProduct(data);
              const listaAtualizada = await apiService.getProducts();
              setProducts(listaAtualizada);
              setShowProductModal(false);
              addToast("Produto salvo com sucesso!");
            } catch (err) {
              addToast("Erro ao salvar produto.");
              console.error(err);
            }
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
            setProducts(products.filter((x) => (x._id !== confirmDelete && x.id !== confirmDelete)));
            setConfirmDelete(null);
            addToast("Produto removido.");
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}