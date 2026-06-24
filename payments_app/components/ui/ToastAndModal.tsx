"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// SVGs for Icons
const SuccessIcon = () => (
  <svg className="w-5 h-5 text-brand-sage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5 text-brand-clay shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-brand-forest shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Types
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ModalOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

interface ToastAndModalContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
  alert: (options: ModalOptions | string) => Promise<void>;
  confirm: (options: ModalOptions | string) => Promise<boolean>;
}

const ToastAndModalContext = createContext<ToastAndModalContextType | undefined>(undefined);

export const useToastAndModal = () => {
  const context = useContext(ToastAndModalContext);
  if (!context) {
    throw new Error("useToastAndModal must be used within a ToastAndModalProvider");
  }
  return context;
};

export const ToastAndModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    isDestructive: boolean;
    resolve: (value: boolean) => void;
  } | null>(null);

  // Toast controls
  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastMethods = React.useMemo(() => ({
    success: (message: string, duration?: number) => addToast(message, "success", duration),
    error: (message: string, duration?: number) => addToast(message, "error", duration),
    info: (message: string, duration?: number) => addToast(message, "info", duration),
    warning: (message: string, duration?: number) => addToast(message, "warning", duration),
  }), [addToast]);

  // Modal controls
  const alert = useCallback((options: ModalOptions | string) => {
    return new Promise<void>((resolve) => {
      const title = typeof options === "string" ? "Atención" : options.title;
      const message = typeof options === "string" ? options : options.message;
      const confirmLabel = typeof options === "string" ? "Aceptar" : (options.confirmLabel || "Aceptar");
      const isDestructive = typeof options === "string" ? false : !!options.isDestructive;

      setModal({
        isOpen: true,
        type: "alert",
        title,
        message,
        confirmLabel,
        cancelLabel: "",
        isDestructive,
        resolve: () => {
          setModal(null);
          resolve();
        }
      });
    });
  }, []);

  const confirm = useCallback((options: ModalOptions | string) => {
    return new Promise<boolean>((resolve) => {
      const title = typeof options === "string" ? "Confirmar acción" : options.title;
      const message = typeof options === "string" ? options : options.message;
      const confirmLabel = typeof options === "string" ? "Confirmar" : (options.confirmLabel || "Confirmar");
      const cancelLabel = typeof options === "string" ? "Cancelar" : (options.cancelLabel || "Cancelar");
      const isDestructive = typeof options === "string" ? false : !!options.isDestructive;

      setModal({
        isOpen: true,
        type: "confirm",
        title,
        message,
        confirmLabel,
        cancelLabel,
        isDestructive,
        resolve: (value: boolean) => {
          setModal(null);
          resolve(value);
        }
      });
    });
  }, []);

  // Keyboard navigation for active modal
  useEffect(() => {
    if (!modal) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        modal.resolve(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  return (
    <ToastAndModalContext.Provider value={{ toast: toastMethods, alert, confirm }}>
      {children}

      {/* Toasts Container */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => {
          let styles = "";
          let icon = null;

          switch (t.type) {
            case "success":
              styles = "bg-white border-brand-sage/30 text-brand-forest shadow-brand-sage/5";
              icon = <SuccessIcon />;
              break;
            case "error":
              styles = "bg-white border-brand-clay/30 text-brand-clay shadow-brand-clay/5";
              icon = <ErrorIcon />;
              break;
            case "warning":
              styles = "bg-white border-amber-300 text-amber-800 shadow-amber-500/5";
              icon = <WarningIcon />;
              break;
            default:
              styles = "bg-white border-brand-sand/50 text-zinc-700 shadow-zinc-500/5";
              icon = <InfoIcon />;
          }

          return (
            <div
              key={t.id}
              className={`flex items-start justify-between gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto transition-all duration-300 transform translate-x-0 animate-slide-in ${styles}`}
              style={{
                animation: "toast-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
              }}
            >
              <div className="flex items-start gap-3 flex-1">
                {icon}
                <p className="text-sm font-semibold leading-snug">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors p-0.5 rounded-lg hover:bg-zinc-100 cursor-pointer shrink-0"
              >
                <CloseIcon />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modals Container */}
      {modal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-brand-forest/40 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="w-full max-w-md bg-white border border-brand-sand/40 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 animate-scale-up"
            style={{
              animation: "modal-scale-up 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
            }}
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
              <h3 className="text-lg font-extrabold text-brand-forest">
                {modal.title}
              </h3>
            </div>

            {/* Body */}
            <div className="px-6 py-2">
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                {modal.message}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 mt-4 bg-brand-beige/30 border-t border-brand-sand/20 flex justify-end gap-3">
              {modal.type === "confirm" && (
                <button
                  onClick={() => modal.resolve(false)}
                  className="rounded-xl border border-brand-sand/60 bg-white hover:bg-brand-beige text-brand-forest px-4 py-2 text-sm font-bold shadow-sm transition-colors cursor-pointer select-none"
                >
                  {modal.cancelLabel}
                </button>
              )}
              <button
                onClick={() => modal.resolve(true)}
                className={`rounded-xl px-5 py-2 text-sm font-bold shadow-sm text-brand-beige transition-colors cursor-pointer select-none ${
                  modal.isDestructive 
                    ? "bg-brand-clay hover:bg-brand-clay/90" 
                    : "bg-brand-forest hover:bg-brand-sage"
                }`}
              >
                {modal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes toast-slide-in {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes modal-scale-up {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastAndModalContext.Provider>
  );
};
