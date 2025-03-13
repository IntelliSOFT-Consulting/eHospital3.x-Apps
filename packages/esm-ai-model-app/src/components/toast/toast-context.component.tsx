import React, { createContext, useContext, useState, ReactNode } from "react";
import { ToastNotification } from "@carbon/react";

interface Toast {
  id: string;
  type: "success" | "error";
  title: string;
  subtitle: string;
}

interface ToastContextProps {
  showToast: (type: "success" | "error", title: string, subtitle: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: "success" | "error", title: string, subtitle: string) => {
    const newToast: Toast = {
      id: Date.now().toString(),
      type,
      title,
      subtitle,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== newToast.id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            kind={toast.type}
            title={toast.title}
            subtitle={toast.subtitle}
            timeout={3000}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};