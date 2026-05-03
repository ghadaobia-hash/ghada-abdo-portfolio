import { cloneDefaultSiteData } from '../data/defaultSiteData';

export const LS_SITE_KEY = 'siteData';

function pick(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return vals[vals.length - 1];
}

/** @param {unknown} raw */
export function siteDataToAppData(raw) {
  const base = cloneDefaultSiteData();
  if (!raw || typeof raw !== 'object') return base;

  const sd = raw;
  const h = sd.hero && typeof sd.hero === 'object' ? sd.hero : {};
  const c = sd.contact && typeof sd.contact === 'object' ? sd.contact : {};

  base.personal = {
    ...base.personal,
    name: pick(h.name, base.personal.name),
    shortName: pick(h.shortName, base.personal.shortName),
    title: pick(h.title, base.personal.title),
    tagline: pick(h.tagline, base.personal.tagline),
    email: pick(c.email, h.email, base.personal.email),
    phone: pick(c.phone, h.phone, base.personal.phone),
    linkedin: pick(c.linkedin, h.linkedin, base.personal.linkedin),
    location: pick(c.location, h.location, base.personal.location),
    github: pick(h.github, base.personal.github),
    awardBadgeLabel: pick(h.awardBadgeLabel, base.personal.awardBadgeLabel),
    awardBadgeLine: pick(h.awardBadgeLine, base.personal.awardBadgeLine),
    heroEyebrow: pick(h.heroEyebrow, base.personal.heroEyebrow),
    heroCtaPrimary: pick(h.heroCtaPrimary, base.personal.heroCtaPrimary),
    heroCtaSecondary: pick(h.heroCtaSecondary, base.personal.heroCtaSecondary),
    heroCvButtonLabel: pick(h.heroCvButtonLabel, base.personal.heroCvButtonLabel),
    contactLead: pick(c.contactLead, base.personal.contactLead),
    profilePhotoId: null,
    heroIllustrationId: null,
    cvFileId: null,
    qrCodeId: null,
    heroImage: null,
    heroIllustration: null,
    profileImageUrl: pick(h.profileImageUrl, base.personal.profileImageUrl),
    heroIllustrationUrl: pick(h.heroIllustrationUrl, base.personal.heroIllustrationUrl),
    cvUrl: pick(h.cvUrl, base.personal.cvUrl),
    qrCodeUrl: pick(c.qrCodeUrl, base.personal.qrCodeUrl),
    profileImageDataUrl: h.profileImageBase64 || h.profileImageDataUrl || base.personal.profileImageDataUrl,
    heroIllustrationDataUrl: h.heroIllustrationBase64 || h.heroIllustrationDataUrl || base.personal.heroIllustrationDataUrl,
    cvDataUrl: h.cvBase64 || h.cvDataUrl || base.personal.cvDataUrl,
    cvFileName: pick(h.cvFilename, h.cvFileName, base.personal.cvFileName, 'CV.pdf'),
    qrCodeDataUrl: c.qrCodeBase64 || c.qrCodeDataUrl || base.personal.qrCodeDataUrl,
  };

  if (sd.about && typeof sd.about === 'object') {
    base.about = {
      ...base.about,
      ...sd.about,
      paragraphs: Array.isArray(sd.about.paragraphs) ? sd.about.paragraphs : base.about.paragraphs,
      highlights: Array.isArray(sd.about.highlights) ? sd.about.highlights : base.about.highlights,
      sectionImageUrl: sd.about.sectionImageUrl ?? base.about.sectionImageUrl ?? null,
      sectionImageDataUrl: sd.about.sectionImageBase64 || sd.about.sectionImageDataUrl || base.about.sectionImageDataUrl || null,
    };
  }

  if (Array.isArray(sd.education)) base.education = sd.education;
  if (Array.isArray(sd.experience)) base.experience = sd.experience;
  if (Array.isArray(sd.skills)) base.skillGroups = sd.skills;
  if (Array.isArray(sd.courses)) base.courses = sd.courses;
  if (Array.isArray(sd.achievements)) base.achievements = sd.achievements;
  if (Array.isArray(sd.navLinks)) base.navLinks = sd.navLinks;

  if (Array.isArray(sd.projects)) {
    base.projects = sd.projects.map((p) => ({
      ...p,
      coverImageId: null,
      coverImageUrl: p.coverImageUrl || null,
      coverImageDataUrl: p.coverImageBase64 || p.coverImageDataUrl || null,
      files: (p.files || []).map((f) => ({
        name: f.name || 'file',
        mime: f.mime || 'application/octet-stream',
        dataUrl: f.base64 || f.dataUrl || null,
        url: f.url || null,
        fileId: null,
      })),
    }));
  }

  if (Array.isArray(sd.certificates)) {
    base.certificates = sd.certificates.map((cert) => ({
      ...cert,
      imageId: null,
      imageUrl: cert.imageUrl || null,
      imageDataUrl: cert.imageBase64 || cert.imageDataUrl || null,
    }));
  }

  return base;
}

/** @param {ReturnType<typeof cloneDefaultSiteData>} d */
export function appDataToSiteData(d) {
  const p = d.personal;
  const mediaField = (url, data) => {
    if (url && String(url).startsWith('http')) return { url, data: null };
    if (data && String(data).startsWith('data:')) return { url: null, data };
    return { url: url || null, data: data || null };
  };

  const prof = mediaField(p.profileImageUrl, p.profileImageDataUrl);
  const ill = mediaField(p.heroIllustrationUrl, p.heroIllustrationDataUrl);
  const cv = mediaField(p.cvUrl, p.cvDataUrl);
  const qr = mediaField(p.qrCodeUrl, p.qrCodeDataUrl);

  const about = d.about || {};
  const abImg = mediaField(about.sectionImageUrl, about.sectionImageDataUrl);

  return {
    hero: {
      name: p.name,
      shortName: p.shortName,
      title: p.title,
      tagline: p.tagline,
      email: p.email,
      phone: p.phone,
      linkedin: p.linkedin,
      location: p.location,
      github: p.github,
      awardBadgeLabel: p.awardBadgeLabel,
      awardBadgeLine: p.awardBadgeLine,
      heroEyebrow: p.heroEyebrow,
      heroCtaPrimary: p.heroCtaPrimary,
      heroCtaSecondary: p.heroCtaSecondary,
      heroCvButtonLabel: p.heroCvButtonLabel,
      profileImageUrl: prof.url,
      profileImageBase64: prof.data,
      heroIllustrationUrl: ill.url,
      heroIllustrationBase64: ill.data,
      cvUrl: cv.url,
      cvBase64: cv.data,
      cvFilename: p.cvFileName || 'CV.pdf',
    },
    contact: {
      email: p.email,
      phone: p.phone,
      linkedin: p.linkedin,
      location: p.location,
      contactLead: p.contactLead,
      qrCodeUrl: qr.url,
      qrCodeBase64: qr.data,
    },
    about: {
      paragraphs: [...(d.about?.paragraphs || [])],
      highlights: JSON.parse(JSON.stringify(d.about?.highlights || [])),
      sectionImageUrl: abImg.url,
      sectionImageBase64: abImg.data,
    },
    education: JSON.parse(JSON.stringify(d.education || [])),
    experience: JSON.parse(JSON.stringify(d.experience || [])),
    skills: JSON.parse(JSON.stringify(d.skillGroups || [])),
    projects: (d.projects || []).map((proj) => {
      const cov = mediaField(proj.coverImageUrl, proj.coverImageDataUrl);
      return {
        id: proj.id,
        title: proj.title,
        description: proj.description,
        projectType: proj.projectType,
        image: proj.image,
        badge: proj.badge,
        tech: [...(proj.tech || [])],
        demoUrl: proj.demoUrl,
        codeUrl: proj.codeUrl,
        coverImageUrl: cov.url,
        coverImageBase64: cov.data,
        files: (proj.files || []).map((f) => {
          const fd = mediaField(f.url, f.dataUrl);
          return {
            name: f.name || 'file',
            mime: f.mime || 'application/octet-stream',
            url: fd.url,
            base64: fd.data,
          };
        }),
      };
    }),
    certificates: (d.certificates || []).map((c) => {
      const im = mediaField(c.imageUrl, c.imageDataUrl);
      return {
        id: c.id,
        title: c.title,
        provider: c.provider,
        date: c.date,
        note: c.note || '',
        imageUrl: im.url,
        imageBase64: im.data,
      };
    }),
    courses: JSON.parse(JSON.stringify(d.courses || [])),
    achievements: JSON.parse(JSON.stringify(d.achievements || [])),
    navLinks: JSON.parse(JSON.stringify(d.navLinks || [])),
  };
}

export function readSiteDataFromLocalStorage() {
  try {
    const s = localStorage.getItem(LS_SITE_KEY);
    if (!s) return null;
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/** @param {object} site */
export function writeSiteDataToLocalStorage(site) {
  const json = JSON.stringify(site);
  try {
    localStorage.setItem(LS_SITE_KEY, json);
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('Storage full: remove large images or files from site data.', { cause: e });
    }
    throw e instanceof Error ? e : new Error(String(e), { cause: e });
  }
}
