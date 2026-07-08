import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");

  const showToast = (message: string) => {
    setMessage(message);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast message={message} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("usetoast must be inside ToastProvider");
  }

  return context;
}
