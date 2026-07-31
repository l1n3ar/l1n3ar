'use client';
import { useEffect } from 'react';
import { pingPresence } from '@/actions/presence';

const HEARTBEAT_INTERVAL = 15 * 1000;
const SESSION_STORAGE_KEY = 'presence-session-id';

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

/** Mount once, globally — pings presence for as long as the tab stays open, regardless of what's on screen. */
export function usePresenceHeartbeat() {
  useEffect(() => {
    const sessionId = getSessionId();
    const ping = () => { pingPresence(sessionId); };
    ping();
    const interval = setInterval(ping, HEARTBEAT_INTERVAL);
    return () => clearInterval(interval);
  }, []);
}
