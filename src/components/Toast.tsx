import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string; action?: { label: string; onClick: () => void } };

const ToastContext = createContext<{
  push: (t: Omit<Toast, 'id'>) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { ...t, id }]);
    return id;
  }, []);

  useEffect(() => {
    // auto dismiss
    const timers = toasts.map(t => {
      const id = setTimeout(() => setToasts(s => s.filter(x => x.id !== t.id)), 4000);
      return () => clearTimeout(id);
    });
    return () => timers.forEach(fn => fn());
  }, [toasts]);

  const remove = useCallback((id: number) => {
    setToasts((s) => s.filter(x => x.id !== id));
  }, []);

  const iconFor = (type: Toast['type']) => {
    if (type === 'success') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (type === 'error') return <XCircle className="w-5 h-5 text-red-600" />;
    return <Info className="w-5 h-5 text-gray-600" />;
  };

  const toastBg = (type: Toast['type']) => {
    if (type === 'success') return 'bg-green-100';
    if (type === 'error') return 'bg-red-100';
    return 'bg-gray-100';
  };

  const toastBorder = (type: Toast['type']) => {
    if (type === 'success') return 'border-green-500';
    if (type === 'error') return 'border-red-500';
    return 'border-gray-400';
  };

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-6 flex flex-col gap-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className="relative overflow-hidden flex items-center gap-3 rounded shadow animate-toast-in">
            <div className={`${toastBg(t.type)} flex items-center px-3 py-2 border-l-4 ${toastBorder(t.type)}`}>
              <div className="mr-3 flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">{iconFor(t.type)}</div>
                <div className="text-sm text-gray-800">{t.message}</div>
              </div>
              <div className="ml-3">
                {t.action ? (
                  <button
                    type="button"
                    className="underline text-sm"
                    onClick={() => {
                      try { t.action!.onClick(); } catch (e) { console.error(e); }
                      remove(t.id);
                    }}
                  >{t.action.label}</button>
                ) : null}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-black/10 animate-toast-progress" style={{ width: '100%' }} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
