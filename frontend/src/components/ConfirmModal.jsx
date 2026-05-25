import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card bg-[var(--color-surface-800)] w-full max-w-md p-6 pointer-events-auto shadow-2xl border border-[var(--color-border-subtle)]"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full flex-shrink-0 ${isDanger ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger-400)]' : 'bg-[var(--color-warning-bg)] text-[var(--color-warning-400)]'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                      {title}
                    </h3>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="btn-ghost"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={isDanger ? "btn-primary !bg-[var(--color-danger-500)] hover:!bg-[var(--color-danger-400)]" : "btn-primary"}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
