import { useState, useEffect, useRef } from "react";

const SLIDES = [
  { id: 1, src: "/assets/imgmedlink1.png", label: "Consulta médica" },
  { id: 2, src: "/assets/imgmedlink2.png", label: "Equipe médica" },
  { id: 3, src: "/assets/imgmedlink3.png", label: "Medicamentos" },
  { id: 4, src: "/assets/imgmedlink4.png", label: "Gestão hospitalar" },
];

function PhotoSlider() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);
  const go = (dir) =>
    setCurrent((c) => (c + dir + SLIDES.length) % SLIDES.length);
  return (
    <div className="slider-wrap">
      <div
        className="slider-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((s) => (
          <div key={s.id} className="slide-item">
            <img src={s.src} alt={s.label} className="slide-img" />
          </div>
        ))}
      </div>
      <button className="slider-arrow left" onClick={() => go(-1)}>
        ‹
      </button>
      <button className="slider-arrow right" onClick={() => go(1)}>
        ›
      </button>
      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slider-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

export default function Landing({ openFornecedor, openMedico }) {
  const [activeSection, setActiveSection] = useState("inicio");
  const [mobOpen, setMobOpen] = useState(false);
  const [showComum, setShowComum] = useState(false);
  const [contact, setContact] = useState({ nome: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const setC = (k, v) => setContact((c) => ({ ...c, [k]: v }));

  const [rFunc, vFunc] = useReveal();
  const [rSobre, vSobre] = useReveal();
  const [rPlanos, vPlanos] = useReveal();
  const [rContato, vContato] = useReveal();

  useEffect(() => {
    const onScroll = () => {
      const secs = document.querySelectorAll("section[id]");
      let cur = "inicio";
      secs.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) cur = s.id;
      });
      setActiveSection(cur);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setShowComum(false);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const navLinks = [
    ["inicio", "Início"],
    ["como-funciona", "Como funciona"],
    ["quem-somos", "Quem somos"],
    ["planos", "Planos"],
    ["contato", "Contato"],
  ];

  const handleContact = () => {
    if (!contact.nome || !contact.email || !contact.msg) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setContact({ nome: "", email: "", msg: "" });
    }, 4000);
  };

  return (
    <>
      <nav>
        <a href="#inicio" className="nav-logo">
          <span className="logo-mark">
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2v16M2 10h16"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          MediLink
        </a>
        <ul className="nav-links">
          {navLinks.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? "active" : ""}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-cta">
          <button className="btn btn-outline" onClick={openMedico}>
            Sou médico
          </button>
          <button className="btn btn-green-dk" onClick={openFornecedor}>
            Sou fornecedor
          </button>
        </div>
        <button
          className="hamburger"
          onClick={() => setMobOpen(!mobOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div id="mob-menu" style={{ display: mobOpen ? "flex" : "none" }}>
        {navLinks.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setMobOpen(false)}>
            {label}
          </a>
        ))}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowComum(true);
            setMobOpen(false);
          }}
          style={{ color: "var(--green)" }}
        >
          Entrar (Área do Cliente)
        </a>
        <div className="mob-btns">
          <button
            className="btn btn-outline"
            onClick={() => {
              openMedico();
              setMobOpen(false);
            }}
          >
            Sou médico
          </button>
          <button
            className="btn btn-navy"
            onClick={() => {
              openFornecedor();
              setMobOpen(false);
            }}
          >
            Sou fornecedor
          </button>
        </div>
      </div>

      <section id="inicio">
        <div className="hero-inner">
          <div className="hero-text hero-anim">
            <span className="hero-chip">Saúde que funciona de verdade</span>
            <h1>
              Menos burocracia.
              <br /> Mais tempo para <em>cuidar</em>.
            </h1>
            <p>
              Sabemos que sua prioridade é o paciente — não ficar ligando para
              fornecedor, esperando orçamento ou gerenciando planilha de
              estoque. O MediLink cuida de tudo isso por você, de forma simples
              e automatizada.
            </p>
            <div className="hero-btns">
              <button className="btn-hero-m" onClick={openMedico}>
                Sou médico
              </button>
              <button className="btn-hero-f" onClick={openFornecedor}>
                Sou fornecedor
              </button>
            </div>
          </div>
          <div className="hero-card-col">
            {[
              {
                icon: "💊",
                t: "Encontre o que precisa, rápido",
                p: "Busque medicamentos por nome, princípio ativo ou laboratório e receba em dias, não semanas.",
                d: ".1s",
              },
              {
                icon: "📦",
                t: "Estoque sempre no controle",
                p: "Chega de surpresa com produto em falta. Você recebe alertas antes do problema acontecer.",
                d: ".22s",
              },
              {
                icon: "🤝",
                t: "Fornecedores de confiança",
                p: "Todos os parceiros são verificados. Você compra com segurança e rastreia cada entrega.",
                d: ".34s",
              },
            ].map((c) => (
              <div
                key={c.t}
                className="h-card h-card-anim"
                style={{ animationDelay: c.d }}
              >
                <div className="h-card-icon">{c.icon}</div>
                <div>
                  <h3>{c.t}</h3>
                  <p>{c.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" ref={rFunc}>
        <div className="container">
          <span className="sec-tag">Fluxo Operacional</span>
          <h2 className="sec-title">Eficiência do pedido ao recebimento</h2>
          <div className="steps">
            {[
              {
                n: "01",
                t: "Homologação",
                p: "Validamos CRM ou CNPJ para garantir um ambiente restrito ao setor.",
              },
              {
                n: "02",
                t: "Requisição",
                p: "Selecione os insumos necessários através da nossa busca inteligente.",
              },
              {
                n: "03",
                t: "Processamento",
                p: "O pedido é encaminhado ao fornecedor para preparo imediato.",
              },
              {
                n: "04",
                t: "Recebimento",
                p: "Acompanhe a entrega direto na sua unidade com relatórios.",
              },
            ].map((s, i) => (
              <div
                key={s.n}
                className={`step${vFunc ? " reveal" : ""}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="quem-somos" ref={rSobre}>
        <div className="container">
          <div className="about-wrap">
            <div className={`about-left${vSobre ? " reveal" : ""}`}>
              <span className="sec-tag">Quem somos</span>
              <h2 className="sec-title">
                Feito por quem entende o dia a dia da saúde
              </h2>
              <p>
                O MediLink nasceu de uma inquietação real: médicos e clínicas
                perdendo tempo precioso tentando garantir o básico — que os
                medicamentos certos estivessem disponíveis na hora certa. Vimos
                esse problema de perto e decidimos resolver.
              </p>
              <p style={{ marginTop: "1rem" }}>
                Somos um time que une tecnologia e vivência na área da saúde.
                Desenvolvemos cada funcionalidade pensando nas pessoas que estão
                na linha de frente: o médico que precisa atender, o gestor que
                precisa controlar, o fornecedor que precisa entregar.
              </p>
              <p style={{ marginTop: "1rem" }}>
                Nossa missão é simples: tirar da frente dos profissionais de
                saúde tudo que não deveria ser problema deles.
              </p>
            </div>
            <div
              className={`about-right${vSobre ? " reveal" : ""}`}
              style={{ animationDelay: ".18s" }}
            >
              <PhotoSlider />
            </div>
          </div>
        </div>
      </section>

      <section id="planos" ref={rPlanos}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="sec-tag">Modelos de Assinatura</span>
          <h2 className="sec-title">Planos adequados à sua escala</h2>
          <div className="plans">
            {[
              {
                name: "Free",
                price: "R$ 0",
                per: "/mês",
                feats: [
                  "Até 10 pedidos/mês",
                  "1 médico cadastrado",
                  "Catálogo básico de insumos",
                  "Rastreio de entregas",
                ],
                cta: "Começar grátis",
                cls: "",
                feat: false,
                d: "0s",
              },
              {
                name: "Pro",
                price: "R$ 99",
                per: "/mês",
                feats: [
                  "Pedidos ilimitados",
                  "Até 5 unidades de saúde",
                  "Relatórios analíticos PDF",
                  "Alertas de estoque por IA",
                  "Sugestões inteligentes de reposição",
                ],
                cta: "Assinar Pro",
                cls: "cta-pro",
                feat: true,
                d: ".12s",
              },
              {
                name: "Hospitalar",
                price: "R$ 349",
                per: "/mês",
                feats: [
                  "Unidades ilimitadas",
                  "API integrada ao HIS/PEP",
                  "IA preditiva de demanda",
                  "Conformidade regulatória ANVISA",
                  "Suporte técnico 24h",
                ],
                cta: "Falar com consultor",
                cls: "",
                feat: false,
                d: ".24s",
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`plan${p.feat ? " featured" : ""}${vPlanos ? " reveal" : ""}`}
                style={{ animationDelay: p.d }}
              >
                {p.feat && <div className="pop-badge">Recomendado</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
                  {p.price}
                  <span>{p.per}</span>
                </div>
                <ul className="feat-list">
                  {p.feats.map((f) => (
                    <li key={f}>
                      <span className="ck">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`plan-cta ${p.cls}`} onClick={openMedico}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="contact-section" ref={rContato}>
        <div className="contact-circle c1" />
        <div className="contact-circle c2" />
        <div className="contact-circle c3" />
        <div className={`contact-inner${vContato ? " reveal" : ""}`}>
          <div className="contact-left">
            <span className="sec-tag sec-tag-light">Fale Conosco</span>
            <h2 className="contact-title">Deixe Sua Mensagem</h2>
            <p className="contact-sub">
              Preencha o formulário e deixe sua mensagem. Estamos prontos para
              atender suas dúvidas, sugestões ou solicitações. Nossa equipe
              responderá o mais rápido possível para garantir que você tenha
              toda a atenção que merece.
            </p>
            <div className="contact-info">
              <div className="ci-item">
                <span>📧</span>
                <span>suporte@medilink.com.br</span>
              </div>
              <div className="ci-item">
                <span>⏱</span>
                <span>Resposta em até 24h úteis</span>
              </div>
              <div className="ci-item">
                <span>💬</span>
                <span>Atendimento em português</span>
              </div>
            </div>
          </div>
          <div className="contact-right">
            {sent ? (
              <div className="contact-success">
                <div className="cs-icon">✅</div>
                <h3>Mensagem enviada!</h3>
                <p>Nossa equipe entrará em contato em breve.</p>
              </div>
            ) : (
              <div className="contact-form">
                <div className="cf-group">
                  <label>Nome completo</label>
                  <input
                    type="text"
                    value={contact.nome}
                    onChange={(e) => setC("nome", e.target.value)}
                    placeholder="João Silva"
                  />
                </div>
                <div className="cf-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setC("email", e.target.value)}
                    placeholder="joao@clinica.com.br"
                  />
                </div>
                <div className="cf-group">
                  <label>Mensagem</label>
                  <textarea
                    rows="5"
                    value={contact.msg}
                    onChange={(e) => setC("msg", e.target.value)}
                    placeholder="Descreva sua dúvida, sugestão ou solicitação..."
                  />
                </div>
                <button className="contact-submit" onClick={handleContact}>
                  Enviar mensagem →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="f-logo">MediLink</span>
            <p
              style={{
                marginTop: ".5rem",
                color: "rgba(255,255,255,.6)",
                fontSize: ".88rem",
              }}
            >
              Sistemas de Informação aplicados à logística farmacêutica.
            </p>
          </div>
        </div>
        <div className="f-bottom">
          <span>© 2026 MediLink. Todos os direitos reservados.</span>
        </div>
      </footer>

      {showComum && (
        <div
          className="overlay open"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
          onClick={(e) => e.target === e.currentTarget && setShowComum(false)}
        >
          <div className="modal">
            <button
              className="modal-x"
              onClick={() => setShowComum(false)}
              aria-label="Fechar"
            >
              ✕
            </button>
            <h2 id="login-modal-title">Acesso ao Painel</h2>
            <p
              style={{
                fontSize: ".85rem",
                color: "var(--text2)",
                marginBottom: "1.5rem",
              }}
            >
              Acompanhe suas solicitações e entregas.
            </p>
            <div className="fg">
              <label>CPF ou E-mail</label>
              <input type="text" placeholder="000.000.000-00" />
            </div>
            <div className="fg">
              <label>Senha</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="modal-btn m-green">Entrar</button>
            <p className="text-center mt-sm">
              <a
                href="#"
                style={{
                  fontSize: ".8rem",
                  color: "var(--green)",
                  textDecoration: "none",
                }}
              >
                Esqueci minha senha
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
