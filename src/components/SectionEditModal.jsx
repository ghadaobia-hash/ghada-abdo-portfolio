import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PROJECT_TYPES } from '../data/defaultSiteData';
import { useSiteData } from '../context/SiteDataContext';
import { fileToDataUrl } from '../utils/fileToDataUrl';
import styles from './SectionEditModal.module.css';

export function SectionEditModal({ section, open, onClose }) {
  const { data, replaceData } = useSiteData();
  const [err, setErr] = useState('');

  const [hero, setHero] = useState(null);
  const profileRef = useRef(null);
  const illRef = useRef(null);
  const cvRef = useRef(null);

  const [aboutParas, setAboutParas] = useState('');
  const [hl, setHl] = useState([]);

  const [jsonText, setJsonText] = useState('');

  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  const [contact, setContact] = useState(null);
  const qrRef = useRef(null);
  const aboutImgRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => {
      setErr('');
      if (section === 'hero') {
        const p = data.personal;
        setHero({
          heroEyebrow: p.heroEyebrow ?? '',
          heroCtaPrimary: p.heroCtaPrimary ?? '',
          heroCtaSecondary: p.heroCtaSecondary ?? '',
          heroCvButtonLabel: p.heroCvButtonLabel ?? '',
          name: p.name,
          shortName: p.shortName,
          title: p.title,
          tagline: p.tagline,
          email: p.email,
          phone: p.phone,
          linkedin: p.linkedin,
          location: p.location,
          awardBadgeLabel: p.awardBadgeLabel,
          awardBadgeLine: p.awardBadgeLine,
          contactLead: p.contactLead,
          profileImageUrl: p.profileImageUrl,
          heroIllustrationUrl: p.heroIllustrationUrl,
          cvUrl: p.cvUrl,
          profileImageDataUrl: p.profileImageDataUrl,
          heroIllustrationDataUrl: p.heroIllustrationDataUrl,
          cvDataUrl: p.cvDataUrl,
          cvFileName: p.cvFileName || 'CV.pdf',
        });
      }
      if (section === 'about') {
        setAboutParas((data.about?.paragraphs || []).join('\n\n'));
        setHl(JSON.parse(JSON.stringify(data.about?.highlights || [])));
      }
      if (section === 'education') setJsonText(JSON.stringify(data.education || [], null, 2));
      if (section === 'experience') setJsonText(JSON.stringify(data.experience || [], null, 2));
      if (section === 'skills') setJsonText(JSON.stringify(data.skillGroups || [], null, 2));
      if (section === 'courses') setJsonText(JSON.stringify(data.courses || [], null, 2));
      if (section === 'achievements') setJsonText(JSON.stringify(data.achievements || [], null, 2));
      if (section === 'projects') setProjects(JSON.parse(JSON.stringify(data.projects || [])));
      if (section === 'certificates') setCerts(JSON.parse(JSON.stringify(data.certificates || [])));
      if (section === 'contact') {
        const p = data.personal;
        setContact({
          email: p.email,
          phone: p.phone,
          linkedin: p.linkedin,
          location: p.location,
          contactLead: p.contactLead,
          qrCodeUrl: p.qrCodeUrl,
          qrCodeDataUrl: p.qrCodeDataUrl,
        });
      }
    });
  }, [open, section, data]);

  const clearProfileImage = () => {
    if (profileRef.current) profileRef.current.value = '';
    setHero((h) => (h ? { ...h, profileImageUrl: null, profileImageDataUrl: null } : h));
  };

  const clearHeroIllustration = () => {
    if (illRef.current) illRef.current.value = '';
    setHero((h) => (h ? { ...h, heroIllustrationUrl: null, heroIllustrationDataUrl: null } : h));
  };

  const saveHero = async () => {
    if (!hero) return;
    try {
      let profileImageDataUrl = hero.profileImageDataUrl;
      let heroIllustrationDataUrl = hero.heroIllustrationDataUrl;
      let cvDataUrl = hero.cvDataUrl;
      let cvFileName = hero.cvFileName;
      if (profileRef.current?.files?.[0]) profileImageDataUrl = await fileToDataUrl(profileRef.current.files[0]);
      if (illRef.current?.files?.[0]) heroIllustrationDataUrl = await fileToDataUrl(illRef.current.files[0]);
      if (cvRef.current?.files?.[0]) {
        cvDataUrl = await fileToDataUrl(cvRef.current.files[0]);
        cvFileName = cvRef.current.files[0].name || cvFileName;
      }
      replaceData((d) => {
        Object.assign(d.personal, {
          ...hero,
          profileImageDataUrl,
          heroIllustrationDataUrl,
          cvDataUrl,
          cvFileName,
          profileImageUrl: profileRef.current?.files?.[0] ? null : hero.profileImageUrl,
          heroIllustrationUrl: illRef.current?.files?.[0] ? null : hero.heroIllustrationUrl,
          cvUrl: cvRef.current?.files?.[0] ? null : hero.cvUrl,
          profilePhotoId: null,
          heroIllustrationId: null,
          cvFileId: null,
          heroImage: null,
          heroIllustration: null,
        });
        return d;
      });
      onClose();
    } catch {
      setErr('Could not read a file. Try a smaller file.');
    }
  };

  const saveAbout = async () => {
    try {
      let sectionImageDataUrl = data.about?.sectionImageDataUrl;
      let sectionImageUrl = data.about?.sectionImageUrl;
      if (aboutImgRef.current?.files?.[0]) {
        sectionImageDataUrl = await fileToDataUrl(aboutImgRef.current.files[0]);
        sectionImageUrl = null;
      }
      const paras = aboutParas.split('\n\n').map((s) => s.trim()).filter(Boolean);
      replaceData((d) => {
        d.about.paragraphs = paras.length ? paras : d.about.paragraphs;
        d.about.highlights = hl
          .map((row) => ({
            id: row.id || crypto.randomUUID(),
            label: String(row.label || '').trim(),
            value: String(row.value || '').trim(),
          }))
          .filter((row) => row.label || row.value);
        d.about.sectionImageDataUrl = sectionImageDataUrl;
        d.about.sectionImageUrl = sectionImageUrl;
        return d;
      });
      onClose();
    } catch {
      setErr('About image read failed.');
    }
  };

  const saveJson = (key) => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText || '[]');
    } catch {
      setErr('Invalid JSON.');
      return;
    }
    if (!Array.isArray(parsed)) {
      setErr('Root JSON must be an array.');
      return;
    }
    replaceData((d) => {
      d[key] = parsed;
      return d;
    });
    onClose();
  };

  const saveProjects = () => {
    replaceData((d) => {
      d.projects = projects;
      return d;
    });
    onClose();
  };

  const saveCertificates = () => {
    replaceData((d) => {
      d.certificates = certs;
      return d;
    });
    onClose();
  };

  const saveContact = async () => {
    if (!contact) return;
    try {
      let qrCodeDataUrl = contact.qrCodeDataUrl;
      if (qrRef.current?.files?.[0]) qrCodeDataUrl = await fileToDataUrl(qrRef.current.files[0]);
      replaceData((d) => {
        Object.assign(d.personal, {
          ...contact,
          qrCodeDataUrl,
          qrCodeUrl: qrRef.current?.files?.[0] ? null : contact.qrCodeUrl,
          qrCodeId: null,
        });
        return d;
      });
      onClose();
    } catch {
      setErr('QR image read failed.');
    }
  };

  if (!open) return null;

  const portal = (
    <div className={styles.overlay} role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className={styles.head}>
          <h2 id="edit-modal-title" className={styles.title}>
            Edit · {section}
          </h2>
          <button type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
        </div>
        {err ? <p className={styles.err}>{err}</p> : null}

        {section === 'hero' && hero ? (
          <div>
            <div className={styles.field}>
              <span className={styles.label}>Eyebrow (line above pills)</span>
              <input
                className={styles.input}
                placeholder="Portfolio · Aviation × Technology"
                value={hero.heroEyebrow}
                onChange={(e) => setHero({ ...hero, heroEyebrow: e.target.value })}
              />
              <p className={styles.dragHint}>Leave empty to use the default line.</p>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Primary hero button</span>
              <input
                className={styles.input}
                placeholder="View My Work"
                value={hero.heroCtaPrimary}
                onChange={(e) => setHero({ ...hero, heroCtaPrimary: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Secondary hero button</span>
              <input
                className={styles.input}
                placeholder={"Let's Connect"}
                value={hero.heroCtaSecondary}
                onChange={(e) => setHero({ ...hero, heroCtaSecondary: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Full name</span>
              <input className={styles.input} value={hero.name} onChange={(e) => setHero({ ...hero, name: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Short name (navbar)</span>
              <input className={styles.input} value={hero.shortName} onChange={(e) => setHero({ ...hero, shortName: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Title</span>
              <input className={styles.input} value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Short bio</span>
              <textarea className={styles.textarea} rows={3} value={hero.tagline} onChange={(e) => setHero({ ...hero, tagline: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Email (hero strip)</span>
              <input className={styles.input} value={hero.email} onChange={(e) => setHero({ ...hero, email: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>LinkedIn URL</span>
              <input className={styles.input} value={hero.linkedin} onChange={(e) => setHero({ ...hero, linkedin: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Phone</span>
              <input className={styles.input} value={hero.phone} onChange={(e) => setHero({ ...hero, phone: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Location</span>
              <input className={styles.input} value={hero.location} onChange={(e) => setHero({ ...hero, location: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Contact lead (also editable in Contact)</span>
              <textarea className={styles.textarea} rows={2} value={hero.contactLead} onChange={(e) => setHero({ ...hero, contactLead: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Award badge label</span>
              <input className={styles.input} value={hero.awardBadgeLabel} onChange={(e) => setHero({ ...hero, awardBadgeLabel: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Award badge line</span>
              <input className={styles.input} value={hero.awardBadgeLine} onChange={(e) => setHero({ ...hero, awardBadgeLine: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Hero portrait photo (optional)</span>
              <p className={styles.dragHint}>
                Stored only; the centered hero layout does not show this image. Useful if you reuse it elsewhere or switch layouts later.
              </p>
              {hero.profileImageUrl || hero.profileImageDataUrl ? (
                <p className={styles.dragHint}>An image is set — choose a file to replace, or remove.</p>
              ) : null}
              <div className={styles.fileRow}>
                <input ref={profileRef} type="file" accept="image/*" className={styles.fileInput} />
                {(hero.profileImageUrl || hero.profileImageDataUrl) && (
                  <button type="button" className={styles.btnSm} onClick={clearProfileImage}>
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Hero illustration / wide image (optional)</span>
              <p className={styles.dragHint}>
                Stored only; the centered hero layout does not show this image currently.
              </p>
              {hero.heroIllustrationUrl || hero.heroIllustrationDataUrl ? (
                <p className={styles.dragHint}>An image is set — choose a file to replace, or remove.</p>
              ) : null}
              <div className={styles.fileRow}>
                <input ref={illRef} type="file" accept="image/*" className={styles.fileInput} />
                {(hero.heroIllustrationUrl || hero.heroIllustrationDataUrl) && (
                  <button type="button" className={styles.btnSm} onClick={clearHeroIllustration}>
                    Remove image
                  </button>
                )}
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>CV button label</span>
              <input
                className={styles.input}
                placeholder="Download CV"
                value={hero.heroCvButtonLabel}
                onChange={(e) => setHero({ ...hero, heroCvButtonLabel: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>CV file</span>
              {hero.cvUrl ? <p className={styles.dragHint}>Cloud file set — upload to replace.</p> : null}
              <input ref={cvRef} type="file" accept=".pdf,.doc,.docx,application/pdf" />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>CV download filename</span>
              <input className={styles.input} value={hero.cvFileName} onChange={(e) => setHero({ ...hero, cvFileName: e.target.value })} />
            </div>
            <div className={styles.row}>
              <button type="button" className={styles.btn} onClick={saveHero}>
                Apply
              </button>
              <button type="button" className={styles.btnGhost} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {section === 'about' ? (
          <div>
            <div className={styles.field}>
              <span className={styles.label}>Portrait photo · About section (optional)</span>
              <p className={styles.dragHint}>Square-ish photos work best. Shown next to your bio.</p>
              <input ref={aboutImgRef} type="file" accept="image/*" />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Paragraphs (blank line between)</span>
              <textarea className={styles.textarea} rows={10} value={aboutParas} onChange={(e) => setAboutParas(e.target.value)} />
            </div>
            <p className={styles.label}>Highlights</p>
            {hl.map((row, i) => (
              <div key={row.id || i} className={styles.miniCard}>
                <div className={styles.field}>
                  <span className={styles.label}>Label</span>
                  <input className={styles.input} value={row.label} onChange={(e) => {
                    const n = [...hl];
                    n[i] = { ...n[i], label: e.target.value };
                    setHl(n);
                  }} />
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Value</span>
                  <input className={styles.input} value={row.value} onChange={(e) => {
                    const n = [...hl];
                    n[i] = { ...n[i], value: e.target.value };
                    setHl(n);
                  }} />
                </div>
                <button type="button" className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => setHl(hl.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className={styles.btnSm} onClick={() => setHl([...hl, { id: crypto.randomUUID(), label: '', value: '' }])}>
              Add highlight
            </button>
            <div className={styles.row}>
              <button type="button" className={styles.btn} onClick={saveAbout}>
                Apply
              </button>
              <button type="button" className={styles.btnGhost} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {section === 'education' ? (
          <JsonEditor jsonText={jsonText} setJsonText={setJsonText} hint="Array of { id, title, org, period, description: string[] }" onSave={() => saveJson('education')} onClose={onClose} />
        ) : null}
        {section === 'experience' ? (
          <JsonEditor jsonText={jsonText} setJsonText={setJsonText} hint="Array of { id, title, org, period, description: string[] }" onSave={() => saveJson('experience')} onClose={onClose} />
        ) : null}
        {section === 'skills' ? (
          <JsonEditor jsonText={jsonText} setJsonText={setJsonText} hint="Array of skill groups { id, title, icon, items: string[] }" onSave={() => saveJson('skillGroups')} onClose={onClose} />
        ) : null}
        {section === 'courses' ? (
          <JsonEditor jsonText={jsonText} setJsonText={setJsonText} hint="Array of { id, title, provider, date, points: string[] }" onSave={() => saveJson('courses')} onClose={onClose} />
        ) : null}
        {section === 'achievements' ? (
          <JsonEditor jsonText={jsonText} setJsonText={setJsonText} hint="Array of { id, title, org, date, detail }" onSave={() => saveJson('achievements')} onClose={onClose} />
        ) : null}

        {section === 'projects' ? (
          <ProjectsEditor projects={projects} setProjects={setProjects} onSave={saveProjects} onClose={onClose} setErr={setErr} />
        ) : null}

        {section === 'certificates' ? (
          <CertificatesEditor certs={certs} setCerts={setCerts} onSave={saveCertificates} onClose={onClose} setErr={setErr} />
        ) : null}

        {section === 'contact' && contact ? (
          <div>
            <div className={styles.field}>
              <span className={styles.label}>Email</span>
              <input className={styles.input} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Phone</span>
              <input className={styles.input} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>LinkedIn</span>
              <input className={styles.input} value={contact.linkedin} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Location</span>
              <input className={styles.input} value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Lead paragraph</span>
              <textarea className={styles.textarea} rows={3} value={contact.contactLead} onChange={(e) => setContact({ ...contact, contactLead: e.target.value })} />
            </div>
            <div className={styles.field}>
              <span className={styles.label}>QR image</span>
              <input ref={qrRef} type="file" accept="image/*" />
            </div>
            <div className={styles.row}>
              <button type="button" className={styles.btn} onClick={saveContact}>
                Apply
              </button>
              <button type="button" className={styles.btnGhost} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(portal, document.body);
}

function JsonEditor({ jsonText, setJsonText, hint, onSave, onClose }) {
  return (
    <div>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{hint}</p>
      <textarea className={styles.textarea} rows={16} value={jsonText} onChange={(e) => setJsonText(e.target.value)} spellCheck={false} />
      <div className={styles.row}>
        <button type="button" className={styles.btn} onClick={onSave}>
          Apply
        </button>
        <button type="button" className={styles.btnGhost} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function reorderArray(list, fromIndex, toIndex) {
  if (fromIndex === toIndex) return list;
  const n = [...list];
  const [item] = n.splice(fromIndex, 1);
  n.splice(toIndex, 0, item);
  return n;
}

function ProjectsEditor({ projects, setProjects, onSave, onClose, setErr }) {
  const [dragI, setDragI] = useState(null);

  const move = (from, to) => {
    if (to < 0 || to >= projects.length) return;
    setProjects(reorderArray(projects, from, to));
  };

  const addCover = async (i, file) => {
    if (!file) return;
    try {
      const url = await fileToDataUrl(file);
      const n = [...projects];
      n[i] = { ...n[i], coverImageDataUrl: url, coverImageUrl: null, coverImageId: null };
      setProjects(n);
    } catch {
      setErr('Cover upload failed.');
    }
  };

  const addFile = async (i, file) => {
    if (!file) return;
    try {
      const url = await fileToDataUrl(file);
      const n = [...projects];
      const files = [...(n[i].files || [])];
      files.push({ name: file.name, mime: file.type || 'application/octet-stream', dataUrl: url, url: null, fileId: null });
      n[i] = { ...n[i], files };
      setProjects(n);
    } catch {
      setErr('File upload failed.');
    }
  };

  return (
    <div>
      <p className={styles.dragHint}>Reorder with arrows or drag cards. Use the top bar Save to publish to cloud / disk.</p>
      {projects.map((p, pi) => (
        <div
          key={p.id}
          className={`${styles.miniCard} ${dragI === pi ? styles.miniCardDragging : ''}`}
          draggable
          onDragStart={() => setDragI(pi)}
          onDragEnd={() => setDragI(null)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragI === null || dragI === pi) return;
            setProjects(reorderArray(projects, dragI, pi));
            setDragI(null);
          }}
        >
          <div className={styles.reorderRow}>
            <button type="button" className={styles.btnSm} onClick={() => move(pi, pi - 1)} disabled={pi === 0}>
              ↑
            </button>
            <button type="button" className={styles.btnSm} onClick={() => move(pi, pi + 1)} disabled={pi === projects.length - 1}>
              ↓
            </button>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Title</span>
            <input className={styles.input} value={p.title} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], title: e.target.value };
              setProjects(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Description</span>
            <textarea className={styles.textarea} rows={2} value={p.description} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], description: e.target.value };
              setProjects(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Type</span>
            <select className={styles.select} value={p.projectType || 'Website'} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], projectType: e.target.value };
              setProjects(n);
            }}>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Fallback image path</span>
            <input className={styles.input} value={p.image || ''} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], image: e.target.value };
              setProjects(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Badge</span>
            <input className={styles.input} value={p.badge || ''} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], badge: e.target.value || null };
              setProjects(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Tech (comma)</span>
            <input className={styles.input} value={(p.tech || []).join(', ')} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], tech: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
              setProjects(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Demo URL</span>
            <input className={styles.input} value={p.demoUrl || ''} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], demoUrl: e.target.value || null };
              setProjects(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Code URL</span>
            <input className={styles.input} value={p.codeUrl || ''} onChange={(e) => {
              const n = [...projects];
              n[pi] = { ...n[pi], codeUrl: e.target.value || null };
              setProjects(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Cover image file</span>
            <input type="file" accept="image/*" onChange={(e) => addCover(pi, e.target.files?.[0])} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Attach file (PDF, PPTX, images, ZIP)</span>
            <input type="file" onChange={(e) => addFile(pi, e.target.files?.[0])} />
          </div>
          {(p.files || []).length ? (
            <ul>
              {(p.files || []).map((f, fi) => (
                <li key={`${p.id}-f-${fi}`}>
                  {f.name}{' '}
                  <button type="button" className={styles.btnSm} onClick={() => {
                    const n = [...projects];
                    n[pi] = { ...n[pi], files: n[pi].files.filter((_, j) => j !== fi) };
                    setProjects(n);
                  }}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button type="button" className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => setProjects(projects.filter((_, j) => j !== pi))}>
            Delete project
          </button>
        </div>
      ))}
      <button type="button" className={styles.btnSm} onClick={() => setProjects([
        ...projects,
        {
          id: crypto.randomUUID(),
          title: 'New project',
          description: '',
          projectType: 'Website',
          image: '/project-dotnet.svg',
          coverImageId: null,
          coverImageUrl: null,
          coverImageDataUrl: null,
          tech: [],
          demoUrl: null,
          codeUrl: null,
          badge: null,
          files: [],
        },
      ])}>
        Add project
      </button>
      <div className={styles.row}>
        <button type="button" className={styles.btn} onClick={onSave}>
          Apply
        </button>
        <button type="button" className={styles.btnGhost} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function CertificatesEditor({ certs, setCerts, onSave, onClose, setErr }) {
  const [dragI, setDragI] = useState(null);

  const move = (from, to) => {
    if (to < 0 || to >= certs.length) return;
    setCerts(reorderArray(certs, from, to));
  };

  const attach = async (ci, file) => {
    if (!file) return;
    try {
      const url = await fileToDataUrl(file);
      const n = [...certs];
      n[ci] = { ...n[ci], imageDataUrl: url, imageUrl: null, imageId: null };
      setCerts(n);
    } catch {
      setErr('Image read failed.');
    }
  };

  return (
    <div>
      <p className={styles.dragHint}>Reorder with arrows or drag cards. Use the top bar Save to publish.</p>
      {certs.map((c, ci) => (
        <div
          key={c.id}
          className={`${styles.miniCard} ${dragI === ci ? styles.miniCardDragging : ''}`}
          draggable
          onDragStart={() => setDragI(ci)}
          onDragEnd={() => setDragI(null)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (dragI === null || dragI === ci) return;
            setCerts(reorderArray(certs, dragI, ci));
            setDragI(null);
          }}
        >
          <div className={styles.reorderRow}>
            <button type="button" className={styles.btnSm} onClick={() => move(ci, ci - 1)} disabled={ci === 0}>
              ↑
            </button>
            <button type="button" className={styles.btnSm} onClick={() => move(ci, ci + 1)} disabled={ci === certs.length - 1}>
              ↓
            </button>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Title</span>
            <input className={styles.input} value={c.title} onChange={(e) => {
              const n = [...certs];
              n[ci] = { ...n[ci], title: e.target.value };
              setCerts(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Organization</span>
            <input className={styles.input} value={c.provider} onChange={(e) => {
              const n = [...certs];
              n[ci] = { ...n[ci], provider: e.target.value };
              setCerts(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Date</span>
            <input className={styles.input} value={c.date} onChange={(e) => {
              const n = [...certs];
              n[ci] = { ...n[ci], date: e.target.value };
              setCerts(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Note</span>
            <input className={styles.input} value={c.note || ''} onChange={(e) => {
              const n = [...certs];
              n[ci] = { ...n[ci], note: e.target.value };
              setCerts(n);
            }} />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Certificate image</span>
            <input type="file" accept="image/*" onChange={(e) => attach(ci, e.target.files?.[0])} />
          </div>
          <button type="button" className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => setCerts(certs.filter((_, j) => j !== ci))}>
            Delete
          </button>
        </div>
      ))}
      <button type="button" className={styles.btnSm} onClick={() => setCerts([...certs, { id: crypto.randomUUID(), title: '', provider: '', date: '', note: '', imageId: null, imageUrl: null, imageDataUrl: null }])}>
        Add certificate
      </button>
      <div className={styles.row}>
        <button type="button" className={styles.btn} onClick={onSave}>
          Apply
        </button>
        <button type="button" className={styles.btnGhost} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
