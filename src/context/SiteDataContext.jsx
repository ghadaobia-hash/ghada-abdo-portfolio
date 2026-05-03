import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import {
  LS_SITE_KEY,
  appDataToSiteData,
  readSiteDataFromLocalStorage,
  siteDataToAppData,
  writeSiteDataToLocalStorage,
} from '../storage/siteDataAdapter';
import { getFirestoreDb } from '../services/firebaseClient';
import {
  persistenceMode as getPersistenceMode,
  resolveSiteMediaUploads,
  subscribeSiteDocument,
  writeSiteDocument,
} from '../services/sitePersistence';

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const { isAdmin } = useAdminAuth();
  const [remoteData, setRemoteData] = useState(() => siteDataToAppData(readSiteDataFromLocalStorage()));
  const [editBuffer, setEditBuffer] = useState(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  const remoteDataRef = useRef(remoteData);
  const isAdminRef = useRef(isAdmin);
  const prevIsAdmin = useRef(isAdmin);

  useEffect(() => {
    remoteDataRef.current = remoteData;
  }, [remoteData]);
  useEffect(() => {
    isAdminRef.current = isAdmin;
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && !prevIsAdmin.current) {
      setEditBuffer(JSON.parse(JSON.stringify(remoteDataRef.current)));
    }
    if (!isAdmin && prevIsAdmin.current) {
      setEditBuffer(null);
    }
    prevIsAdmin.current = isAdmin;
  }, [isAdmin]);

  useEffect(() => {
    if (getPersistenceMode() === 'firebase') {
      const db = getFirestoreDb();
      if (!db) {
        queueMicrotask(() => {
          setRemoteData(siteDataToAppData(readSiteDataFromLocalStorage()));
          setReady(true);
        });
        return undefined;
      }
      const unsub = subscribeSiteDocument(db, (raw) => {
        const next = siteDataToAppData(raw);
        setRemoteData(next);
        setReady(true);
      });
      return () => unsub();
    }

    queueMicrotask(() => {
      setRemoteData(siteDataToAppData(readSiteDataFromLocalStorage()));
      setReady(true);
    });
    const onStorage = (e) => {
      if (e.key === LS_SITE_KEY && e.newValue && !isAdminRef.current) {
        try {
          setRemoteData(siteDataToAppData(JSON.parse(e.newValue)));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const displayData = isAdmin && editBuffer != null ? editBuffer : remoteData;

  const persist = useCallback((next) => {
    try {
      const site = appDataToSiteData(next);
      writeSiteDataToLocalStorage(site);
      setRemoteData(next);
    } catch (e) {
      window.alert(e?.message || 'Could not save site data.');
    }
  }, []);

  const commitSiteSave = useCallback(async () => {
    if (!isAdmin || editBuffer == null) return;
    setSaving(true);
    try {
      let buf = JSON.parse(JSON.stringify(editBuffer));
      buf = await resolveSiteMediaUploads(buf);
      const siteDoc = appDataToSiteData(buf);
      if (getPersistenceMode() === 'firebase') {
        const db = getFirestoreDb();
        if (!db) throw new Error('Firebase is not configured correctly (missing Firestore).');
        await writeSiteDocument(db, siteDoc);
        setEditBuffer(buf);
      } else {
        writeSiteDataToLocalStorage(siteDoc);
        const applied = siteDataToAppData(siteDoc);
        setRemoteData(applied);
        setEditBuffer(applied);
      }
    } catch (e) {
      window.alert(e?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }, [isAdmin, editBuffer]);

  const replaceData = useCallback((updater) => {
    if (!isAdminRef.current) return;
    setEditBuffer((prev) => {
      const draft = JSON.parse(JSON.stringify(prev ?? remoteDataRef.current));
      const out = updater(draft);
      return out ?? draft;
    });
  }, []);

  const getFileUrl = useCallback(() => null, []);

  const value = useMemo(
    () => ({
      data: displayData,
      remoteData,
      ready,
      saving,
      fileUrls: {},
      getFileUrl,
      persist,
      replaceData,
      commitSiteSave,
      persistenceMode: getPersistenceMode(),
    }),
    [displayData, remoteData, ready, saving, getFileUrl, persist, replaceData, commitSiteSave]
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData must be used within SiteDataProvider');
  }
  return ctx;
}
