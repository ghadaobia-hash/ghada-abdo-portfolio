import { getSupabase, isSupabaseConfigured } from '../supabaseClient';

const BUCKET_ABOUT = 'about';
const BUCKET_PROJECTS = 'projects';
const BUCKET_CERTIFICATES = 'certificates';

/** @param {string} mime */
function mimeToExt(mime) {
  if (!mime || mime === 'application/octet-stream') return null;
  const map = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  };
  if (map[mime]) return map[mime];
  if (mime.startsWith('image/')) {
    const sub = mime.slice('image/'.length).replace(/\+xml$/, '');
    return sub.replace(/[^a-z0-9]/gi, '').slice(0, 8) || null;
  }
  return null;
}

/** @param {string} hint */
function sanitizeHint(hint, maxLen = 72) {
  return String(hint || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, maxLen);
}

/**
 * @param {string} dataUrl
 * @param {string} bucket
 * @param {string} nameHint
 * @returns {Promise<string>} Public object URL
 */
export async function uploadDataUrlToBucket(dataUrl, bucket, nameHint) {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured (set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).');
  }

  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const ext = mimeToExt(blob.type) || 'jpg';
  const safe = sanitizeHint(nameHint);
  const path = `${Date.now()}_${crypto.randomUUID().slice(0, 10)}_${safe}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    cacheControl: '3600',
    upsert: true,
    contentType: blob.type || 'application/octet-stream',
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function isDataUrl(s) {
  return typeof s === 'string' && s.startsWith('data:');
}

/**
 * Uploads about / project cover / certificate data URLs to Supabase Storage and sets *Url fields.
 * @param {object} out — deep-cloned app data (mutated)
 */
export async function resolveSupabaseSectionMedia(out) {
  if (!isSupabaseConfigured()) return;

  if (out.about && isDataUrl(out.about.sectionImageDataUrl)) {
    out.about.sectionImageUrl = await uploadDataUrlToBucket(
      out.about.sectionImageDataUrl,
      BUCKET_ABOUT,
      'section'
    );
    out.about.sectionImageDataUrl = null;
  }

  for (const proj of out.projects || []) {
    if (isDataUrl(proj.coverImageDataUrl)) {
      proj.coverImageUrl = await uploadDataUrlToBucket(
        proj.coverImageDataUrl,
        BUCKET_PROJECTS,
        `cover_${proj.id || 'project'}`
      );
      proj.coverImageDataUrl = null;
    }
    const shots = proj.screenshots || [];
    for (let si = 0; si < shots.length; si += 1) {
      const shot = shots[si];
      if (shot && isDataUrl(shot.imageDataUrl)) {
        shot.imageUrl = await uploadDataUrlToBucket(
          shot.imageDataUrl,
          BUCKET_PROJECTS,
          `gallery_${proj.id || 'project'}_${si}`
        );
        shot.imageDataUrl = null;
      }
    }
  }

  for (const c of out.certificates || []) {
    if (isDataUrl(c.imageDataUrl)) {
      c.imageUrl = await uploadDataUrlToBucket(
        c.imageDataUrl,
        BUCKET_CERTIFICATES,
        `cert_${c.id || 'certificate'}`
      );
      c.imageDataUrl = null;
    }
  }
}
