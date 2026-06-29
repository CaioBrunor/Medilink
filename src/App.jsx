import { useState, useEffect } from "react";
import Landing from "./pages/Landing/Landing";
import FornecedorApp from "./pages/Fornecedor/FornecedorApp";
import MedicoApp from "./pages/Medico/MedicoApp";
import { tokenStorage } from "./services/storage"; 

export default function App() {
  const [appView, setAppView] = useState("landing");
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const token = tokenStorage.get();
  }, []);

  useEffect(() => {
    document.body.style.overflow = appView !== "landing" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [appView]);

  const openFornecedor = () => setAppView("fornecedor");
  const openMedico = () => setAppView("medico");
  
  const handleLogout = () => {
    tokenStorage.remove();
    setUsuarioLogado(null);
    setAppView("landing");
  };

  const handleLoginSuccess = (user) => {
    setUsuarioLogado(user);
    
    if (user.role === "admin" || user.role === "fornecedor") {
      setAppView("fornecedor");
    } else {
      setAppView("medico");
    }
  };

  return (
    <>
      {appView === "landing" && (
        <Landing 
          openFornecedor={openFornecedor} 
          openMedico={openMedico} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {appView === "fornecedor" && (
        <FornecedorApp onClose={handleLogout} user={usuarioLogado} />
      )}
      {appView === "medico" && (
        <MedicoApp onClose={handleLogout} user={usuarioLogado} />
      )}
    </>
  );
}