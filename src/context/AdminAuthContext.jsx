import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const ADMIN_PASSWORD = 'ghada2026';

/** Session-only: never visible to “visitors” in another browser unless they know the password. */
export const SESSION_EDITOR_KEY = 'portfolio_editor_unlocked';

export function readEditorSession() {
  try {
    return sessionStorage.getItem(SESSION_EDITOR_KEY) === '1';
  } catch {
    return false;
  }
}

export function setEditorSession(value) {
  try {
    sessionStorage.setItem(SESSION_EDITOR_KEY, value ? '1' : '0');
  } catch {
    /* ignore */
  }
}

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(readEditorSession);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SESSION_EDITOR_KEY || e.key === null) {
        setIsAdmin(readEditorSession());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setEditorSession(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setEditorSession(false);
    setIsAdmin(false);
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
