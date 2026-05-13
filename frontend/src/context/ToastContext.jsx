import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3500);
  };

  const value = useMemo(() => ({ toasts, addToast }), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {toasts.map((toast) => (
          <div key={toast.id} style={{ padding: '14px 18px', borderRadius: 18, background: toast.type === 'success' ? '#1f2937' : '#7f1d1d', color: '#fff', minWidth: 260, boxShadow: '0 24px 80px rgba(0,0,0,0.18)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
