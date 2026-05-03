import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseStorage, isFirebaseConfigured } from './firebaseClient';

export const FIRESTORE_COLLECTION = 'siteContent';
export const FIRESTORE_DOC_ID = 'public';

/** @param {import('firebase/firestore').Firestore} db */
export function getSiteDocRef(db) {
  return doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
}

/**
 * @param {import('firebase/firestore').Firestore} db
 * @param {(data: object | null) => void} onData
 * @param {(err: Error) => void} [onError]
 * @returns {() => void} unsubscribe
 */
export function subscribeSiteDocument(db, onData, onError) {
  const dRef = getSiteDocRef(db);
  return onSnapshot(
    dRef,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(snap.data());
    },
    (err) => {
      if (onError) onError(err);
      else console.error('[sitePersistence]', err);
    }
  );
}

/**
 * @param {import('firebase/firestore').Firestore} db
 * @param {object} sitePayload — JSON-serializable site document (URLs, no large base64)
 */
export async function writeSiteDocument(db, sitePayload) {
  await setDoc(getSiteDocRef(db), sitePayload);
}

function isDataUrl(s) {
  return typeof s === 'string' && s.startsWith('data:');
}

/**
 * Uploads all embedded data: URLs to Firebase Storage and sets *Url fields.
 * When Firebase Storage is not configured, returns a deep clone unchanged (local-only dev).
 * @param {object} appData — same shape as in-memory portfolio data
 */
export async function resolveSiteMediaUploads(appData) {
  const storage = getFirebaseStorage();
  const out = JSON.parse(JSON.stringify(appData));
  if (!storage) return out;

  async function uploadDataUrl(dataUrl, hint) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const safe = String(hint).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
    const path = `portfolio/${Date.now()}_${safe}`;
    const r = ref(storage, path);
    await uploadBytes(r, blob, { contentType: blob.type || 'application/octet-stream' });
    return getDownloadURL(r);
  }

  const p = out.personal;
  if (isDataUrl(p.profileImageDataUrl)) {
    p.profileImageUrl = await uploadDataUrl(p.profileImageDataUrl, 'profile');
    p.profileImageDataUrl = null;
  }
  if (isDataUrl(p.heroIllustrationDataUrl)) {
    p.heroIllustrationUrl = await uploadDataUrl(p.heroIllustrationDataUrl, 'hero_illustration');
    p.heroIllustrationDataUrl = null;
  }
  if (isDataUrl(p.cvDataUrl)) {
    p.cvUrl = await uploadDataUrl(p.cvDataUrl, p.cvFileName || 'cv.pdf');
    p.cvDataUrl = null;
  }
  if (isDataUrl(p.qrCodeDataUrl)) {
    p.qrCodeUrl = await uploadDataUrl(p.qrCodeDataUrl, 'qr');
    p.qrCodeDataUrl = null;
  }

  if (out.about && isDataUrl(out.about?.sectionImageDataUrl)) {
    out.about.sectionImageUrl = await uploadDataUrl(out.about.sectionImageDataUrl, 'about_section');
    out.about.sectionImageDataUrl = null;
  }

  for (const proj of out.projects || []) {
    if (isDataUrl(proj.coverImageDataUrl)) {
      proj.coverImageUrl = await uploadDataUrl(proj.coverImageDataUrl, `cover_${proj.id}`);
      proj.coverImageDataUrl = null;
    }
    const files = proj.files || [];
    for (let i = 0; i < files.length; i += 1) {
      const f = files[i];
      if (isDataUrl(f.dataUrl)) {
        f.url = await uploadDataUrl(f.dataUrl, f.name || `file_${i}`);
        f.dataUrl = null;
      }
    }
  }

  for (const c of out.certificates || []) {
    if (isDataUrl(c.imageDataUrl)) {
      c.imageUrl = await uploadDataUrl(c.imageDataUrl, `cert_${c.id}`);
      c.imageDataUrl = null;
    }
  }

  return out;
}

export function persistenceMode() {
  return isFirebaseConfigured() ? 'firebase' : 'localStorage';
}
