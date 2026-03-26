import React from "react";
import { createRoot } from "react-dom/client";
import App from "../prescricao_jogos_reduzidos.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker registration (production only)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Detect new version available
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New content available — dispatch event for UI to pick up
              window.dispatchEvent(new CustomEvent("sw-update-available", { detail: reg }));
            }
          });
        });
      })
      .catch((err) => console.warn("SW registration failed:", err));
  });
}
