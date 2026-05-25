import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    // Mock the native event structure so existing onChange handlers don't need changes
    if (onChange) {
      onChange({ target: { value: val } });
    }
    setIsOpen(false);
  };

  // Option list content to be shared between desktop and mobile views
  const OptionsList = () => (
    <div className="py-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => handleSelect(opt.value)}
          className={`w-full text-left px-4 py-3 md:py-2 flex items-center justify-between hover:bg-white/10 transition-colors
            ${value === opt.value ? 'text-indigo-400 font-semibold bg-white/5' : 'text-slate-200'}`}
        >
          <span>{opt.label}</span>
          {value === opt.value && <Check className="w-4 h-4 text-indigo-400" />}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <span className="truncate">{selectedOption?.label || 'Select...'}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Desktop Dropdown (absolute) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="hidden md:block absolute z-50 w-full mt-1 bg-[var(--color-surface-800)] border border-[var(--color-border-subtle)] rounded-lg shadow-xl max-h-60 overflow-y-auto"
            >
              <OptionsList />
            </motion.div>

            {/* Mobile Bottom Sheet (fixed overlay) */}
            <div className="md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-x-0 bottom-0 z-[70] bg-[var(--color-surface-800)] rounded-t-2xl border-t border-[var(--color-border-subtle)] overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[var(--color-surface-800)] shrink-0">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Select Option</h3>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-y-auto overscroll-contain flex-1">
                  <OptionsList />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
