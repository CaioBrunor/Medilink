import { useState, useEffect, useRef } from "react";
import { save, load } from "../../services/storage";
import { STATUS_LABELS } from "../../data/constants";
import { useToast } from "../../hooks/useToast";
import DemoBanner from "../../components/common/DemoBanner";
import ToastContainer from "../../components/common/ToastContainer";
import AppSidebar from "../../components/layout/AppSidebar";
import LogoMark from "../../components/layout/LogoMark";
import MedWelcome from "./MedWelcome";
import MedLogin from "./MedLogin";
import MedRegister from "./MedRegister";
import MedVerify from "./MedVerify";
import ClinicalView from "./ClinicalView";
import MedProductsModal from "./MedProductsModal";
import MedCheckoutModal from "./MedCheckoutModal";
import MedSuccessModal from "./MedSuccessModal";
import MedSettingsModal from "./MedSettingsModal";

export default function MedicoApp({ onClose }) {
  const [screen, setScreen] = useState(() =>
    localStorage.getItem("ml_medico_logged") ? "dashboard" : "welcome",
  );
  const [user, setUser] = useState(() => load("ml_medico_user", null));
  const [view, setView] = useState("clinical");
  const [medOrders, setMedOrders] = useState(() =>
    load("ml_medico_orders", []),
  );
  const [history, setHistory] = useState(() => load("ml_clinical_history", []));
  const [clinicalResult, setClinicalResult] = useState(null);
  const [clinicalTreats, setClinicalTreats] = useState([]);
  const [mobOpen, setMobOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProducts, setShowProducts] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showCheckout, setShowCheckout] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const [toasts, addToast] = useToast();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [view]);

  const saveOrders = (o) => {
    setMedOrders(o);
    save("ml_medico_orders", o);
  };
  const saveHistory = (h) => {
    setHistory(h);
    save("ml_clinical_history", h);
  };

  const login = (loginVal, senha) => {
    const u = load("ml_medico_user", null);
    const ok =
      u && (u.email === loginVal || u.crm === loginVal) && u.senha === senha;
    if (!ok) return "E-mail/CRM ou senha incorretos.";
    localStorage.setItem("ml_medico_logged", "1");
    setUser(u);
    setScreen("dashboard");
    return null;
  };

  const register = (data) => {
    setUser(data);
    save("ml_medico_user", data);
    localStorage.setItem("ml_medico_logged", "1");
    setScreen("verify");
  };

  const logout = () => {
    localStorage.removeItem("ml_medico_logged");
    onClose();
  };

  const wrap = (c) => <div id="medico-app">{c}</div>;

  if (screen === "welcome")
    return wrap(
      <MedWelcome
        onLogin={() => setScreen("login")}
        onRegister={() => setScreen("register")}
        onClose={onClose}
      />,
    );
  if (screen === "login")
    return wrap(
      <MedLogin
        onLogin={login}
        onBack={() => setScreen("welcome")}
        onRegister={() => setScreen("register")}
      />,
    );
  if (screen === "register")
    return wrap(
      <MedRegister
        onRegister={register}
        onBack={() => setScreen("welcome")}
        onLogin={() => setScreen("login")}
      />,
    );
  if (screen === "verify")
    return wrap(
      <MedVerify user={user} onContinue={() => setScreen("dashboard")} />,
    );

  const h = new Date().getHours();
  const saud = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  const pendingCount = medOrders.filter((o) => o.status === "pendente").length;

  const navItems = [
    {
      icon: "💡",
      title: "Consulta com IA",
      desc: "Sugestões baseadas em evidências",
      active: view === "clinical",
      onClick: () => setView("clinical"),
    },
    {
      icon: "📦",
      title: "Meus Pedidos",
      desc: "Acompanhe suas compras",
      active: view === "orders",
      onClick: () => setView("orders"),
      badge: pendingCount,
    },
    {
      icon: "📋",
      title: "Histórico Clínico",
      desc: "Consultas anteriores com IA",
      active: view === "history",
      onClick: () => setView("history"),
    },
    {
      icon: "⚙️",
      title: "Configurações",
      desc: "Atualize seus dados",
      active: false,
      onClick: () => setShowSettings(true),
    },
  ];

  return (
    <div id="medico-app">
      <DemoBanner />
      <ToastContainer toasts={toasts} />
      <div className="med-mob-header">
        <div className="mob-logo">
          <LogoMark sm /> MediLink
        </div>
        <button className="mob-menu-btn" onClick={() => setMobOpen(!mobOpen)}>
          ☰
        </button>
      </div>
      <div className="f-app-layout">
        <AppSidebar
          brand={user?.clinica || user?.nome || "Médico"}
          navItems={navItems}
          onLogout={logout}
          mobOpen={mobOpen}
          onCloseMob={() => setMobOpen(false)}
        />
        <main className="f-app-main" ref={mainRef}>
          {view === "clinical" && (
            <ClinicalView
              saud={saud}
              user={user}
              result={clinicalResult}
              treats={clinicalTreats}
              onGenerate={(res, treats, hist) => {
                setClinicalResult(res);
                setClinicalTreats(treats);
                saveHistory([hist, ...history].slice(0, 50));
              }}
              onReset={() => {
                setClinicalResult(null);
                setClinicalTreats([]);
              }}
              onSelectTreat={(t) => {
                setSelectedTags(t.tags);
                setShowProducts(t.nome);
              }}
            />
          )}

          {view === "orders" && (
            <div className="f-view f-view-active">
              <div className="f-page-header">
                <div>
                  <h2>Meus Pedidos</h2>
                  <p className="f-page-sub">
                    Histórico de compras da sua clínica
                  </p>
                </div>
              </div>
              <div className="f-order-list">
                {medOrders.length === 0 ? (
                  <div className="f-empty-state">
                    <div className="f-es-icon">📦</div>
                    <p>Nenhum pedido realizado ainda.</p>
                  </div>
                ) : (
                  medOrders.map((o) => {
                    const s = STATUS_LABELS[o.status] || {
                      label: o.status,
                      cls: "",
                    };
                    return (
                      <div key={o.id} className="f-order-card">
                        <div className="f-oc-top">
                          <div>
                            <span className="f-oc-id">{o.id}</span>
                            <span className="f-oc-prod"> — {o.produto}</span>
                          </div>
                          <span className={`f-status ${s.cls}`}>{s.label}</span>
                        </div>
                        <div className="f-oc-meta">
                          <span>Qtd: {o.qty}</span>
                          <span>{o.total}</span>
                          <span>{o.fornecedor}</span>
                          <span>{o.data}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {view === "history" && (
            <div className="f-view f-view-active">
              <div className="f-page-header">
                <div>
                  <h2>Histórico Clínico</h2>
                  <p className="f-page-sub">
                    Consultas de apoio realizadas com IA
                  </p>
                </div>
                <button
                  className="f-btn-primary sm"
                  onClick={() => setView("clinical")}
                >
                  + Nova consulta
                </button>
              </div>
              <div className="f-order-list">
                {history.length === 0 ? (
                  <div className="f-empty-state">
                    <div className="f-es-icon">📋</div>
                    <p>Nenhuma consulta realizada ainda.</p>
                  </div>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="f-order-card">
                      <div className="f-oc-top">
                        <div>
                          <span className="f-oc-id">{h.condNome}</span>
                          <span
                            className="f-oc-prod"
                            style={{ marginLeft: ".5rem" }}
                          >
                            {" "}
                            {h.queixa}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: ".78rem",
                            color: "var(--f-text3)",
                          }}
                        >
                          {h.timestamp}
                        </span>
                      </div>
                      <div className="f-oc-meta">
                        <span>
                          👤 {h.idade} anos · {h.sexo}
                        </span>
                        <span>🩺 {h.tipoPac}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {showProducts && (
        <MedProductsModal
          tratamento={showProducts}
          tags={selectedTags}
          onSelect={(p) => {
            setShowProducts(null);
            setShowCheckout(p);
          }}
          onClose={() => setShowProducts(null)}
        />
      )}
      {showCheckout && (
        <MedCheckoutModal
          product={showCheckout}
          onConfirm={(order) => {
            saveOrders([order, ...medOrders]);
            setShowCheckout(null);
            setShowSuccess(order);
            addToast("Pedido realizado!");
          }}
          onClose={() => setShowCheckout(null)}
        />
      )}
      {showSuccess && (
        <MedSuccessModal
          order={showSuccess}
          onClose={() => {
            setShowSuccess(null);
            setView("orders");
          }}
        />
      )}
      {showSettings && (
        <MedSettingsModal
          user={user}
          onSave={(data) => {
            const u = { ...user, ...data };
            setUser(u);
            save("ml_medico_user", u);
            setShowSettings(false);
            addToast("Dados atualizados!");
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
