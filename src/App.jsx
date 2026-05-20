import { useState, useEffect } from "react";
import Landing from "./pages/Landing/Landing";
import FornecedorApp from "./pages/Fornecedor/FornecedorApp";
import MedicoApp from "./pages/Medico/MedicoApp";

export default function App() {
  const [appView, setAppView] = useState("landing");

  useEffect(() => {
    document.body.style.overflow = appView !== "landing" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [appView]);

  const openFornecedor = () => setAppView("fornecedor");
  const openMedico = () => setAppView("medico");
  const close = () => setAppView("landing");

  return (
    <>
      {appView === "landing" && (
        <Landing openFornecedor={openFornecedor} openMedico={openMedico} />
      )}
      {appView === "fornecedor" && <FornecedorApp onClose={close} />}
      {appView === "medico" && <MedicoApp onClose={close} />}
    </>
  );
}
