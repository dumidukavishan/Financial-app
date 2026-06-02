import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const WARNING_BEFORE     = 1 * 60 * 1000; // show warning 1 minute before logout

/**
 * Monitors user activity and calls `onLogout` after INACTIVITY_TIMEOUT ms of inactivity.
 *
 * FIX: callbacks are stored in refs so they NEVER cause useEffect/useCallback to
 * re-run when the parent re-renders (e.g. when setShowWarning flips state).
 * Without this, every state change in AppRoutes reset the logout timer silently.
 *
 * @returns {{ stayLoggedIn: () => void }} — call this from the "Stay Logged In" button
 */
export function useInactivityLogout({ onLogout, onWarn, onReset, active = true }) {
  const logoutTimer  = useRef(null);
  const warningTimer = useRef(null);

  // isWarning: when true, DOM activity events are ignored (prevents mouse hover resetting timer)
  const isWarning = useRef(false);

  // Store latest callbacks in refs — never stale, never cause hook re-runs
  const onLogoutRef = useRef(onLogout);
  const onWarnRef   = useRef(onWarn);
  const onResetRef  = useRef(onReset);

  // Keep refs in sync with latest prop values (does NOT trigger useEffect re-runs)
  useEffect(() => { onLogoutRef.current = onLogout; });
  useEffect(() => { onWarnRef.current   = onWarn;   });
  useEffect(() => { onResetRef.current  = onReset;  });

  // clearTimers is stable — no dependencies
  const clearTimers = useCallback(() => {
    clearTimeout(logoutTimer.current);
    clearTimeout(warningTimer.current);
  }, []);

  // startTimers is stable — uses refs for callbacks, only depends on clearTimers
  const startTimers = useCallback(() => {
    clearTimers();
    isWarning.current = false;

    // Warn the user before auto-logout
    warningTimer.current = setTimeout(() => {
      isWarning.current = true;        // freeze DOM activity detection
      onWarnRef.current?.();
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    // Fire logout — this runs to completion unless stayLoggedIn() is called
    logoutTimer.current = setTimeout(() => {
      onLogoutRef.current?.();
    }, INACTIVITY_TIMEOUT);
  }, [clearTimers]); // ← no onLogout/onWarn deps — they live in refs

  // DOM event handler — skipped during warning window, stable reference
  const handleActivity = useCallback(() => {
    if (isWarning.current) return;
    startTimers();
  }, [startTimers]);

  // The ONLY way to reset timers once warning is shown
  const stayLoggedIn = useCallback(() => {
    onResetRef.current?.();
    startTimers();
  }, [startTimers]);

  useEffect(() => {
    if (!active) {
      isWarning.current = false;
      clearTimers();
      return;
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    startTimers();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimers();
    };
    // Only re-runs when active flips (login/logout) — NOT on every parent render
  }, [active, handleActivity, startTimers, clearTimers]);

  return { stayLoggedIn };
}
