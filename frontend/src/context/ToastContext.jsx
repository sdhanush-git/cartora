import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, duration) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const toastDuration = duration !== undefined ? duration : (type === "error" ? 6000 : 3500);

    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);

    if (toastDuration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toastDuration);
    }
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => addToast("success", msg, duration),
    error: (msg, duration) => addToast("error", msg, duration),
    info: (msg, duration) => addToast("info", msg, duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex max-w-sm flex-col gap-2.5 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              t.type === "success"
                ? "border-emerald-200 bg-white text-emerald-950"
                : t.type === "error"
                ? "border-red-200 bg-white text-red-950"
                : "border-blue-200 bg-white text-blue-950"
            }`}
          >
            <div className="shrink-0 pt-0.5">
              {t.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
              {t.type === "error" && (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              {t.type === "info" && (
                <Info className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-sm font-medium leading-snug">
              {t.message}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastContextProvider");
  }
  return context;
};
