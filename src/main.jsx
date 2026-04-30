import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DecisionProvider } from "./Context/DecisionContext.jsx";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DecisionProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </DecisionProvider>
  </StrictMode>
);