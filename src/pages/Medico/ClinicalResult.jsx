import { MOCK_PRODUCTS_CATALOG } from "../../data/constants";

export default function ClinicalResult({ result, onSelectTreat, onReset }) {
  const {
    condNome,
    db,
    contraAlerts,
    interAlerts,
    pac,
    duracao,
    gravidade,
    tipoPac,
    tags,
    now,
  } = result;
  const allAlerts = [...contraAlerts, ...interAlerts];

  return (
    <div className="med-result-wrap">
      <div className="med-res-header">
        <div className="med-res-title">
          <span>🤖</span>
          <div>
            <h3>Apoio Clínico — {condNome}</h3>
            <p>
              {now} · {pac.idade || "—"} anos · {pac.sexo} · {tipoPac}
            </p>
          </div>
        </div>
        <div className="med-res-chips">
          <span className="med-chip">Duração: {duracao}</span>
          <span className="med-chip">Gravidade: {gravidade}</span>
          {tags.condicoes.length > 0 && (
            <span className="med-chip">
              {tags.condicoes.slice(0, 2).join(", ")}
            </span>
          )}
        </div>
      </div>

      <div className="med-res-body">
        <div className="med-res-section">
          <h4 className="med-res-sec-title">⚠️ Alertas Importantes</h4>
          {allAlerts.length > 0 ? (
            allAlerts.map((a, i) => (
              <div
                key={i}
                className={`med-alert ${a.severity}`}
                dangerouslySetInnerHTML={{ __html: `⚠️ ${a.desc}` }}
              />
            ))
          ) : (
            <div className="med-alert info">
              ✅ Nenhuma interação ou contraindicação detectada.
            </div>
          )}
          {db.alertas_gerais.map((a, i) => (
            <div key={i} className="med-alert info">
              ℹ️ {a}
            </div>
          ))}
        </div>

        <div className="med-res-section">
          <h4 className="med-res-sec-title">💊 Sugestões Clínicas</h4>
          {[db.primeira, db.alternativa].map((t, idx) => {
            const p = MOCK_PRODUCTS_CATALOG.find((x) => x.id === t.id) || {};
            return (
              <div key={idx} className="med-trat-card">
                <div className="med-trat-header">
                  <div>
                    <div className="med-trat-badge">{t.linha}</div>
                    <h4 className="med-trat-nome">{t.nome}</h4>
                  </div>
                  <button
                    className="f-btn-primary sm"
                    onClick={() => onSelectTreat(t)}
                  >
                    Selecionar →
                  </button>
                </div>
                <p className="med-trat-desc">{t.desc}</p>
                <div className="med-trat-bars">
                  <div className="med-bar-row">
                    <span>Eficácia</span>
                    <div className="med-bar-track">
                      <div
                        className="med-bar-fill eficacia"
                        style={{ width: `${t.eficacia}%` }}
                      />
                    </div>
                    <span className="med-bar-val">{t.eficacia}%</span>
                  </div>
                  <div className="med-bar-row">
                    <span>Segurança</span>
                    <div className="med-bar-track">
                      <div
                        className="med-bar-fill seguranca"
                        style={{ width: `${t.seguranca}%` }}
                      />
                    </div>
                    <span className="med-bar-val">{t.seguranca}%</span>
                  </div>
                </div>
                <div className="med-trat-footer">
                  <span>
                    💰 A partir de R$ {p.preco ? p.preco.toFixed(2) : "—"}
                  </span>
                  <span>⏱ {p.prazo || "—"}</span>
                  <span>🏭 {p.fornecedor || "—"}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="med-res-section">
          <h4 className="med-res-sec-title">📊 Comparação</h4>
          <div className="med-compare-table">
            <div className="med-ct-row med-ct-head">
              <div></div>
              <div>{db.primeira.nome}</div>
              <div>{db.alternativa.nome}</div>
            </div>
            <div className="med-ct-row">
              <div>Eficácia</div>
              <div>{db.primeira.eficacia}%</div>
              <div>{db.alternativa.eficacia}%</div>
            </div>
            <div className="med-ct-row">
              <div>Segurança</div>
              <div>{db.primeira.seguranca}%</div>
              <div>{db.alternativa.seguranca}%</div>
            </div>
            <div className="med-ct-row">
              <div>Efeitos colaterais</div>
              <div>{db.primeira.efeitos}</div>
              <div>{db.alternativa.efeitos}</div>
            </div>
            <div className="med-ct-row">
              <div>Linha terapêutica</div>
              <div>{db.primeira.linha}</div>
              <div>{db.alternativa.linha}</div>
            </div>
          </div>
        </div>

        <div className="med-res-section med-res-disclaimer">
          <p>
            📚 <strong>Base de evidências:</strong> CONITEC/MS · SBMFC 2024 ·
            Formulário Terapêutico Nacional.
          </p>
          <p
            style={{
              marginTop: ".4rem",
              color: "var(--f-text3)",
              fontSize: ".8rem",
            }}
          >
            ⚠️ Auxílio de decisão fictício para fins de demonstração. Não
            substitui julgamento clínico.
          </p>
        </div>

        <button className="med-reset-btn" onClick={onReset}>
          ↺ Nova consulta
        </button>
      </div>
    </div>
  );
}
