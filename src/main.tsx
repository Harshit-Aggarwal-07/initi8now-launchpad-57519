import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA } from "./lib/analytics";

// Initialize Google Analytics
initGA();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element with id 'root' not found");
}

createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);