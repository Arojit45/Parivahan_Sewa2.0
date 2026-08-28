import { useEffect, useRef } from 'react';

const PING_URL = 'https://parivahan-sewa2-0-backend.onrender.com/api/ping';
const INTERVAL_MS = 60_000; // 1 minute — well within the 5-min Render sleep threshold

/**
 * useKeepAlive — pings the Render backend every 60 seconds so the free-tier
 * server never goes idle and spins down.
 *
 * • Starts immediately on mount (sends the very first ping without waiting 1 min).
 * • Clears the interval automatically on unmount.
 * • Silent — logs only to the browser console, never throws to the UI.
 * • Works whether the user is logged in or not (endpoint is public).
 */
export function useKeepAlive() {
  const intervalRef = useRef(null);

  useEffect(() => {
    const ping = async () => {
      try {
        const res = await fetch(PING_URL, { method: 'GET' });
        const data = await res.json().catch(() => null);
        console.debug(
          `[KeepAlive] ✓ Server awake — ${data?.timestamp ?? new Date().toISOString()}`
        );
      } catch (err) {
        // Don't throw — a failed ping just means the server was sleeping.
        // The next ping in 60 s will wake it up.
        console.warn('[KeepAlive] ⚠ Ping failed (server may be starting up):', err?.message);
      }
    };

    // Fire immediately so we don't wait 1 min on first load
    ping();

    // Then repeat every 60 seconds
    intervalRef.current = setInterval(ping, INTERVAL_MS);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);
}
