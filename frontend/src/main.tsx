import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./auth/AuthProvider";
import { ToastProvider } from "./context/ToastContext.tsx";
import { NotificationProvider } from "./context/NotificationProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
);
