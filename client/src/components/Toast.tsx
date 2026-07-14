import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <Info className="toast-icon text-indigo-400" size={18} />;
          let borderColor = 'rgba(99, 102, 241, 0.4)';

          if (toast.type === 'success') {
            icon = <CheckCircle className="text-emerald-500" size={18} />;
            borderColor = 'rgba(16, 185, 129, 0.4)';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="text-rose-500" size={18} />;
            borderColor = 'rgba(244, 63, 94, 0.4)';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="text-amber-500" size={18} />;
            borderColor = 'rgba(245, 158, 11, 0.4)';
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              className="toast-item glass-panel"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                borderLeft: `4px solid ${borderColor}`,
                boxShadow: 'var(--shadow-lg)',
                minWidth: '280px',
                maxWidth: '400px',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ display: 'flex', flexShrink: 0 }}>{icon}</div>
              <div style={{ flexGrow: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.5,
                  padding: '2px',
                  borderRadius: '4px',
                  color: 'inherit',
                  transition: 'opacity var(--transition-fast)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
