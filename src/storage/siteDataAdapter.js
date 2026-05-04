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
  if (Array.isArray(sd.navLinks)) {
    base.navLinks = sd.navLinks.filter((l) => l && l.id !== 'achievements');
  }

  if (Array.isArray(sd.projects)) {
    base.projects = sd.projects.map((p) => {
      const screenshots = Array.isArray(p.screenshots)
        ? p.screenshots.map((s, idx) => ({
            id: s.id || `scr-${p.id}-${idx}`,
            imageUrl: s.imageUrl || null,
            imageDataUrl: s.imageBase64 || s.imageDataUrl || null,
          }))
        : [];
      const websiteRaw = pick(p.websiteUrl, p.projectWebsiteUrl, p.demoUrl, '');
      const visitRaw =
        typeof p.visitWebsite === 'string' && p.visitWebsite.trim()
          ? p.visitWebsite.trim()
          : typeof p.visitWebsiteLabel === 'string' && p.visitWebsiteLabel.trim()
            ? p.visitWebsiteLabel.trim()
            : '';
      return {
        ...p,
        coverImageId: null,
        coverImageUrl: p.coverImageUrl || null,
        coverImageDataUrl: p.coverImageBase64 || p.coverImageDataUrl || null,
        websiteUrl: websiteRaw || null,
        projectWebsiteUrl: websiteRaw || null,
        visitWebsite: visitRaw || 'Visit Website',
        visitWebsiteLabel: visitRaw || 'Visit Website',
        screenshots,
        demoUrl: null,
        files: (p.files || []).map((f) => ({
          name: f.name || 'file',
          mime: f.mime || 'application/octet-stream',
          dataUrl: f.base64 || f.dataUrl || null,
          url: f.url || null,
          fileId: null,
        })),
      };
    });
  }

  /** Replace unmigrated sample trio with current default two-project list (safe: exact IDs only). */
  const LEGACY_TRIO_IDS = ['aviation-cns', 'depi-dotnet', 'gis-analysis'];
  if (Array.isArray(base.projects) && base.projects.length === LEGACY_TRIO_IDS.length) {
    const idsSig = [...base.projects.map((p) => p?.id).filter(Boolean)].sort().join('|');
    if (idsSig === [...LEGACY_TRIO_IDS].sort().join('|')) {
      base.projects = JSON.parse(JSON.stringify(cloneDefaultSiteData().projects));
    }
  }

  if (Array.isArray(sd.certificates)) {
    const removedCertIds = new Set(['cert-12', 'cert-13', 'cert-14']);
    base.certificates = sd.certificates
      .filter((c) => c && !removedCertIds.has(c.id))
      .map((cert) => ({
        ...cert,
        imageId: null,
        imageUrl: cert.imageUrl || null,
        imageDataUrl: cert.imageBase64 || cert.imageDataUrl || null,
      }));
  }

  const legacyHeroTagline =
    'Final-year Aviation & Information Systems student with a strong interest in air navigation, CNS technologies, and modern aviation systems. I also build clean, responsive web applications that combine technical knowledge with creative digital solutions.';
  if (typeof base.personal.tagline === 'string' && base.personal.tagline.trim() === legacyHeroTagline) {
    base.personal.tagline = '';
  }

  const webAboutSuffix =
    ' I also build clean, responsive web applications that combine technical knowledge with creative digital solutions.';
  const legacyAboutLastPara = `I am eager to contribute to aviation technology environments – particularly in air navigation services, CNS systems, and flight operations – where I can apply both my aviation knowledge and technical skills to enhance safety and operational efficiency.`;
  if (Array.isArray(base.about?.paragraphs) && base.about.paragraphs.length > 0) {
    const i = base.about.paragraphs.length - 1;
    const last = base.about.paragraphs[i];
    if (typeof last === 'string' && !last.includes('I also build clean, responsive web')) {
      if (last === legacyAboutLastPara) {
        base.about.paragraphs[i] = legacyAboutLastPara + webAboutSuffix;
      } else if (last.trimEnd().endsWith('operational efficiency.')) {
        base.about.paragraphs[i] = `${last.trimEnd()}${webAboutSuffix}`;
      }
    }
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
      const wUrl = proj.websiteUrl || proj.demoUrl || null;
      const vVisit = proj.visitWebsiteLabel?.trim() || 'Visit Website';
      return {
        id: proj.id,
        title: proj.title,
        description: proj.description,
        projectType: proj.projectType,
        image: proj.image,
        badge: proj.badge,
        tech: [...(proj.tech || [])],
        projectWebsiteUrl: wUrl,
        visitWebsite: vVisit,
        websiteUrl: wUrl,
        visitWebsiteLabel: vVisit,
        demoUrl: wUrl,
        codeUrl: proj.codeUrl,
        coverImageUrl: cov.url,
        coverImageBase64: cov.data,
        screenshots: (proj.screenshots || []).map((s, idx) => {
          const im = mediaField(s.imageUrl, s.imageDataUrl);
          return { id: s.id || `scr-${proj.id}-${idx}`, imageUrl: im.url, imageBase64: im.data };
        }),
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
