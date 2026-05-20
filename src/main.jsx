import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/components/landing.css";
import "./styles/components/auth.css";
import "./styles/components/app-shell.css";
import "./styles/components/components.css";
import "./styles/components/medico.css";
import "./styles/components/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
