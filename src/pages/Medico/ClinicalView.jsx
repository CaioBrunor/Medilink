import { useState } from "react";
import { CLINICAL_DB, DRUG_INTERACTIONS } from "../../data/constants";
import { detectCondition } from "../../utils/clinical";
import TagInput from "../../components/common/TagInput";
import RadioGroup from "../../components/common/RadioGroup";
import ClinicalResult from "./ClinicalResult";

export default function ClinicalView({
  saud,
  user,
  result,
  treats,
  onGenerate,
  onReset,
  onSelectTreat,
}) {
  const [pac, setPac] = useState({
    idade: "",
    sexo: "Masculino",
    peso: "",
    altura: "",
    queixa: "",
    obs: "",
  });
  const [tags, setTags] = useState({
    condicoes: [],
    medicamentos: [],
    sintomas: [],
    evitar: [],
  });
  const [duracao, setDuracao] = useState("1–3 dias");
  const [gravidade, setGravidade] = useState("Moderada");
  const [tipoPac, setTipoPac] = useState("Adulto");
  const [loading, setLoading] = useState(false);

  const sp = (k, v) => setPac((p) => ({ ...p, [k]: v }));
  const st = (k, v) => setTags((t) => ({ ...t, [k]: v }));

  const handleGenerate = () => {
    if (!pac.queixa.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const condKey = detectCondition(pac.queixa);
      const db = CLINICAL_DB[condKey];
      const treatList = [db.primeira, db.alternativa];
      const contraAlerts = [];
      const interAlerts = [];

      tags.evitar.forEach((ev) => {
        const e = ev.toLowerCase();
        if (
          /penicilina/.test(e) &&
          treatList.some((t) => t.tags.includes("amoxicilina"))
        )
          contraAlerts.push({
            severity: "alta",
            desc: "<strong>Contraindicação: Alergia a Penicilina</strong> — Amoxicilina é uma penicilina. Substituir por Azitromicina.",
          });
        if (
          /aine|anti.?inflamat/.test(e) &&
          treatList.some((t) => t.tags.includes("aine"))
        )
          contraAlerts.push({
            severity: "alta",
            desc: "<strong>Contraindicação: AINEs</strong> — Restrição registrada. Evitar Ibuprofeno.",
          });
        if (
          /dipirona/.test(e) &&
          treatList.some((t) => t.tags.includes("dipirona"))
        )
          contraAlerts.push({
            severity: "alta",
            desc: "<strong>Contraindicação: Dipirona</strong> — Substituir por Paracetamol.",
          });
      });

      if (
        tipoPac === "Gestante" &&
        treatList.some((t) => t.tags.includes("aine"))
      )
        contraAlerts.push({
          severity: "alta",
          desc: "<strong>Gestante — AINEs contraindicados</strong> no 3º trimestre. Preferir Paracetamol.",
        });
      if (tipoPac === "Pediátrico")
        contraAlerts.push({
          severity: "info",
          desc: "<strong>Paciente Pediátrico</strong> — Verificar formulações pediátricas (suspensões) no catálogo.",
        });

      tags.medicamentos.forEach((med) => {
        const key = Object.keys(DRUG_INTERACTIONS).find((k) =>
          med.toLowerCase().includes(k),
        );
        if (!key) return;
        DRUG_INTERACTIONS[key].forEach((i) => {
          const trat = treatList
            .map((t) => (t.nome + " " + t.tags.join(" ")).toLowerCase())
            .join(" ");
          if (trat.includes(i.drug.toLowerCase()))
            interAlerts.push({
              severity: i.severity,
              desc: `<strong>Interação: ${med} × ${i.drug}</strong> — ${i.desc}`,
            });
        });
      });

      const condNomes = {
        garganta: "Faringoamigdalite",
        febre: "Síndrome Febril",
        dor: "Síndrome Álgica",
        pressao: "Hipertensão Arterial",
        gastrite: "Gastropatia / DRGE",
        default: "Quadro Clínico",
      };
      const now = new Date().toLocaleString("pt-BR");

      onGenerate(
        {
          condKey,
          condNome: condNomes[condKey],
          db,
          treats: treatList,
          contraAlerts,
          interAlerts,
          pac,
          duracao,
          gravidade,
          tipoPac,
          tags,
          now,
        },
        treatList,
        {
          queixa: pac.queixa,
          condKey,
          condNome: condNomes[condKey],
          idade: pac.idade || "—",
          sexo: pac.sexo,
          tipoPac,
          timestamp: now,
        },
      );
      setLoading(false);
    }, 1800);
  };

  const handleReset = () => {
    setPac({
      idade: "",
      sexo: "Masculino",
      peso: "",
      altura: "",
      queixa: "",
      obs: "",
    });
    setTags({ condicoes: [], medicamentos: [], sintomas: [], evitar: [] });
    setDuracao("1–3 dias");
    setGravidade("Moderada");
    setTipoPac("Adulto");
    onReset();
  };

  return (
    <div className="f-view f-view-active">
      <div className="f-page-header">
        <div>
          <h2>
            {saud}, Dr(a). {user?.nome || ""}!
          </h2>
          <p className="f-page-sub">
            Sugestões baseadas em diretrizes · Alertas de contraindicação ·
            Alternativas terapêuticas
          </p>
        </div>
      </div>
      <div className={`med-ai-wrap${result ? " has-result" : ""}`}>
        <div className="med-form-col">
          <div className="med-section-card">
            <div className="med-section-hdr">
              <span>👤</span>
              <h3>Dados do Paciente</h3>
            </div>
            <div className="f-form-row">
              <div className="f-form-group">
                <label>Idade</label>
                <input
                  type="number"
                  value={pac.idade}
                  onChange={(e) => sp("idade", e.target.value)}
                  placeholder="45"
                  min="0"
                  max="120"
                />
              </div>
              <div className="f-form-group">
                <label>Sexo</label>
                <select
                  value={pac.sexo}
                  onChange={(e) => sp("sexo", e.target.value)}
                >
                  {["Masculino", "Feminino", "Outro"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="f-form-group">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  value={pac.peso}
                  onChange={(e) => sp("peso", e.target.value)}
                  placeholder="78"
                  min="1"
                />
              </div>
              <div className="f-form-group">
                <label>Altura (m)</label>
                <input
                  type="number"
                  value={pac.altura}
                  onChange={(e) => sp("altura", e.target.value)}
                  placeholder="1.75"
                  step="0.01"
                />
              </div>
            </div>
            <TagInput
              label="Condições pré-existentes"
              tags={tags.condicoes}
              onChange={(v) => st("condicoes", v)}
              placeholder="Ex: Diabetes, HAS..."
              suggestions={[
                "Diabetes",
                "Hipertensão",
                "Asma",
                "Cardiopatia",
                "DRC",
              ]}
            />
            <TagInput
              label="Medicamentos em uso"
              tags={tags.medicamentos}
              onChange={(v) => st("medicamentos", v)}
              placeholder="Ex: Losartana, Metformina..."
            />
          </div>

          <div className="med-section-card">
            <div className="med-section-hdr">
              <span>🩺</span>
              <h3>Queixa Principal</h3>
            </div>
            <div className="f-form-group">
              <label>Queixa principal *</label>
              <input
                type="text"
                value={pac.queixa}
                onChange={(e) => sp("queixa", e.target.value)}
                placeholder="Ex: dor de garganta, febre, dor de cabeça..."
              />
            </div>
            <TagInput
              label="Sintomas associados"
              tags={tags.sintomas}
              onChange={(v) => st("sintomas", v)}
              placeholder="Ex: tosse, coriza..."
              suggestions={[
                "Tosse",
                "Coriza",
                "Náusea",
                "Vômito",
                "Diarreia",
                "Dispneia",
              ]}
            />
            <div className="f-form-row">
              <div className="f-form-group">
                <label>Duração</label>
                <RadioGroup
                  name="dur"
                  options={["1–3 dias", "4–7 dias", "+7 dias"]}
                  value={duracao}
                  onChange={setDuracao}
                />
              </div>
              <div className="f-form-group">
                <label>Gravidade</label>
                <RadioGroup
                  name="grav"
                  options={["Leve", "Moderada", "Grave"]}
                  value={gravidade}
                  onChange={setGravidade}
                />
              </div>
            </div>
            <div className="f-form-group">
              <label>Observações adicionais</label>
              <textarea
                value={pac.obs}
                onChange={(e) => sp("obs", e.target.value)}
                rows="3"
                placeholder="Histórico relevante, exames recentes..."
              />
            </div>
          </div>

          <div className="med-section-card">
            <div className="med-section-hdr">
              <span>⚠️</span>
              <h3>Restrições Clínicas</h3>
            </div>
            <TagInput
              label="Evitar (alergias / contraindicações)"
              tags={tags.evitar}
              onChange={(v) => st("evitar", v)}
              placeholder="Ex: Penicilina, AINEs..."
              suggestions={[
                "Penicilina",
                "Sulfa",
                "AINEs",
                "Dipirona",
                "Contraste",
              ]}
            />
            <div className="f-form-group">
              <label>Tipo de paciente</label>
              <RadioGroup
                name="tipo"
                options={["Adulto", "Gestante", "Idoso", "Pediátrico"]}
                value={tipoPac}
                onChange={setTipoPac}
              />
            </div>
          </div>

          <button
            className="med-gen-btn"
            onClick={handleGenerate}
            disabled={loading || !pac.queixa.trim()}
          >
            <span className="med-gen-icon">{loading ? "⏳" : "🤖"}</span>
            {loading
              ? "Analisando dados clínicos…"
              : "Gerar Apoio Clínico com IA"}
          </button>
        </div>

        <div className="med-result-col">
          {loading && (
            <div className="med-loading-state">
              <div className="med-loading-spinner" />
              <p style={{ color: "var(--f-text2)", marginTop: "1rem" }}>
                Consultando base de evidências clínicas…
              </p>
            </div>
          )}
          {result && !loading && (
            <ClinicalResult
              result={result}
              onSelectTreat={onSelectTreat}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
