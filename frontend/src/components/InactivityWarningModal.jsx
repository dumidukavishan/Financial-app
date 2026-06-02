import { useEffect, useState } from 'react';

/**
 * Modal that appears 1 minute before auto-logout.
 * Counts down seconds and lets the user dismiss it (resets the inactivity timer).
 */
export default function InactivityWarningModal({ visible, onStayLoggedIn }) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!visible) {
      setSeconds(60);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div style={styles.backdrop} />

      {/* Modal */}
      <div style={styles.modal} role="alertdialog" aria-modal="true" aria-labelledby="inactivity-title">
        {/* Icon */}
        <div style={styles.iconWrap}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h2 id="inactivity-title" style={styles.title}>Session Expiring Soon</h2>
        <p style={styles.subtitle}>
          You've been inactive. You will be automatically logged out in
        </p>

        {/* Countdown ring */}
        <div style={styles.countdownWrap}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="48" cy="48" r="42"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - seconds / 60)}`}
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.9s linear' }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <span style={styles.countdownNum}>{seconds}</span>
        </div>

        <p style={styles.unit}>seconds</p>

        <button
          id="stay-logged-in-btn"
          style={styles.button}
          onClick={onStayLoggedIn}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Stay Logged In
        </button>
      </div>
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(6px)',
    zIndex: 9998,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: '20px',
    padding: '40px 36px',
    width: '340px',
    textAlign: 'center',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
  },
  iconWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(245,158,11,0.15)',
    color: '#f59e0b',
    marginBottom: '16px',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '18px',
    fontWeight: 700,
    color: '#f1f5f9',
    fontFamily: 'Inter, sans-serif',
  },
  subtitle: {
    margin: '0 0 20px',
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: 1.5,
    fontFamily: 'Inter, sans-serif',
  },
  countdownWrap: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  countdownNum: {
    position: 'absolute',
    fontSize: '28px',
    fontWeight: 800,
    color: '#f59e0b',
    fontFamily: 'Inter, sans-serif',
    fontVariantNumeric: 'tabular-nums',
  },
  unit: {
    margin: '0 0 28px',
    fontSize: '13px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontFamily: 'Inter, sans-serif',
  },
  button: {
    width: '100%',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#1a1a2e',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    boxShadow: '0 4px 16px rgba(245,158,11,0.4)',
  },
};
