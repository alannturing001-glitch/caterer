import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

const SESSION_TIMEOUT = 15 * 60 * 1000;

export function useSessionTimeout() {
  const { user, logout } = useAuth();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;

    const startTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        logout();
        window.location.href = '/login?expired=true';
      }, SESSION_TIMEOUT);
    };

    startTimeout();

    const resetTimeout = () => startTimeout();
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => document.addEventListener(event, resetTimeout, true));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => document.removeEventListener(event, resetTimeout, true));
    };
  }, [user, logout]);
}

export default useSessionTimeout;
