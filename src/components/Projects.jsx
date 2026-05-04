import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Projects.module.css';

function dedupePreserveOrder(urls) {
  const seen = new Set();
  return urls.filter((u) => {
    if (!u || seen.has(u)) return false;
    seen.add(u);
    return true;
  });
}

function normalizeExternalUrl(url) {
  const u = String(url || '').trim();
  if (!u) return '';
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function projectSlides(p, getFileUrl) {
  const cover =
    p.coverImageUrl || p.coverImageDataUrl || getFileUrl(p.coverImageId) || p.image || null;
  const shotUrls = (p.screenshots || []).map((s) => s.imageUrl || s.imageDataUrl).filter(Boolean);
  return dedupePreserveOrder([...(cover ? [cover] : []), ...shotUrls]);
}

function projectWebsite(p) {
  return p.websiteUrl || p.projectWebsiteUrl || p.demoUrl || null;
}

function visitWebsiteText(p) {
  const raw = (p.visitWebsiteLabel ?? p.visitWebsite)?.trim();
  return raw || 'Visit Website';
}

/** Reduces casual Save-image / drag-copy; cannot stop OS screenshots or devtools (web platform limit). */
function ProtectedProjectImage({ className, src, alt = '', loading }) {
  const block = (e) => {
    e.preventDefault();
  };
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      draggable={false}
      decoding="async"
      onContextMenu={block}
      onDragStart={block}
      onCopy={block}
      onCut={block}
    />
  );
}

/**
 * @param {{
 *   slides: string[];
 *   projectKey: string;
 *   variant?: 'card' | 'modal';
 *   onOpenGallery?: (slideIndex: number) => void;
 *   initialSlideIndex?: number;
 *   onActiveSlideChange?: (slideIndex: number) => void;
 * }} props
 */
function clampSlideIndex(len, slideIndex = 0) {
  const i = slideIndex | 0;
  if (len <= 0) return 0;
  return Math.min(Math.max(0, i), len - 1);
}

function ProjectMediaGallery({
  slides,
  projectKey,
  variant = 'card',
  onOpenGallery,
  initialSlideIndex = 0,
  onActiveSlideChange,
}) {
  const isModal = variant === 'modal';
  const list = useMemo(() => dedupePreserveOrder(slides.filter(Boolean)), [slides]);
  const [idx, setIdx] = useState(() => clampSlideIndex(list.length, initialSlideIndex));

  useEffect(() => {
    if (isModal) return;
    setIdx(0);
    onActiveSlideChange?.(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- card carousel resets when project/slides identity changes
  }, [projectKey, list.join('|'), isModal]);

  const bumpSlide = useCallback((next) => {
    setIdx((j) => {
      const updated = typeof next === 'function' ? next(j) : next;
      onActiveSlideChange?.(updated);
      return updated;
    });
  }, [onActiveSlideChange]);

  const imgClass = `${isModal ? styles.modalGalleryImage : styles.image} ${styles.protectedMedia}`;
  const shellClass = `${styles.galleryShell}${isModal ? ` ${styles.galleryShellModal}` : ''}`;
  const phClass = isModal ? styles.modalMediaPlaceholder : styles.mediaPlaceholder;
  const trackClass =
    `${styles.galleryTrack}${!isModal && list.length > 0 && onOpenGallery ? ` ${styles.galleryTrackClick}` : ''}`;

  const openFromTrack = () => {
    if (list.length === 0) return;
    onOpenGallery?.(idx);
  };

  const wrapTrackInteraction = list.length > 0 && Boolean(onOpenGallery) && !isModal;

  if (list.length === 0) {
    return <div className={phClass} aria-hidden />;
  }

  if (list.length === 1) {
    return (
      <div className={shellClass}>
        <div
          className={trackClass}
          role={wrapTrackInteraction ? 'button' : undefined}
          tabIndex={wrapTrackInteraction ? 0 : undefined}
          aria-label={wrapTrackInteraction ? 'Open project screenshots' : undefined}
          onClick={wrapTrackInteraction ? openFromTrack : undefined}
          onKeyDown={
            wrapTrackInteraction
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openFromTrack();
                  }
                }
              : undefined
          }
        >
          <ProtectedProjectImage className={imgClass} src={list[0]} loading="eager" />
        </div>
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    bumpSlide((j) => (j === 0 ? list.length - 1 : j - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    bumpSlide((j) => (j >= list.length - 1 ? 0 : j + 1));
  };
  const barClass = `${styles.galleryBar}${isModal ? ` ${styles.galleryBarModal}` : ''}`;
  const arrowClass = `${styles.galleryArrow}${isModal ? ` ${styles.galleryArrowModal}` : ''}`;

  const trackAttrs = wrapTrackInteraction
    ? ({
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Open enlarged screenshots',
        onClick: openFromTrack,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFromTrack();
          }
        },
      })
    : ({});

  return (
    <div className={shellClass}>
      <div className={trackClass} {...trackAttrs}>
        <ProtectedProjectImage
          className={imgClass}
          src={list[idx]}
          loading={idx === 0 ? 'eager' : 'lazy'}
        />
      </div>
      <div className={barClass} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={arrowClass} aria-label="Previous image" onClick={prev}>
          ‹
        </button>
        <div className={styles.galleryDots} role="tablist" aria-label="Project images">
          {list.map((_, j) => (
            <button
              key={j}
              type="button"
              role="tab"
              aria-selected={j === idx}
              aria-label={`Image ${j + 1} of ${list.length}`}
              className={j === idx ? styles.galleryDotActive : styles.galleryDot}
              onClick={(ev) => {
                ev.stopPropagation();
                bumpSlide(j);
              }}
            />
          ))}
        </div>
        <button type="button" className={arrowClass} aria-label="Next image" onClick={next}>
          ›
        </button>
      </div>
    </div>
  );
}

function ProjectDetailModal({ project, slides, getFileUrl, onClose, initialSlideIndex = 0, modalGalleryKey = 0 }) {
  const href = projectWebsite(project) ? normalizeExternalUrl(projectWebsite(project)) : '';
  const label = visitWebsiteText(project);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const modalId = `project-detail-${project.id}`;

  return createPortal(
    <div
      className={styles.detailBackdrop}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.detailPanel} role="dialog" aria-modal="true" aria-labelledby={modalId}>
        <button type="button" className={styles.detailClose} onClick={onClose}>
          Close
        </button>
        <div className={styles.detailGallery}>
          <ProjectMediaGallery
            key={modalGalleryKey}
            slides={slides}
            projectKey={`modal-${project.id}`}
            variant="modal"
            initialSlideIndex={initialSlideIndex}
          />
        </div>
        <div className={styles.detailBody}>
          <h2 id={modalId} className={styles.detailTitle}>
            {project.title}
          </h2>
          {project.projectType ? <span className={styles.detailType}>{project.projectType}</span> : null}
          <p className={styles.detailDesc}>{project.description}</p>
          <ul className={styles.detailTech}>
            {(project.tech || []).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {href ? (
            <div className={styles.detailActions}>
              <a className={styles.btnPrimary} href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            </div>
          ) : null}
          {(project.files || []).length ? (
            <div className={styles.detailFiles}>
              <p className={styles.filesLabel}>Downloads</p>
              <ul className={styles.fileList}>
                {(project.files || []).map((f, fi) => {
                  const fhref = f.url || f.dataUrl || getFileUrl(f.fileId);
                  if (!fhref) return null;
                  return (
                    <li key={fi}>
                      <a className={styles.fileLink} href={fhref} download={f.name || 'download'}>
                        {f.name || 'File'}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

function ProjectCard({ p, getFileUrl }) {
  const slides = projectSlides(p, getFileUrl);
  const web = projectWebsite(p);
  const href = web ? normalizeExternalUrl(web) : '';
  const visitLabel = visitWebsiteText(p);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailStartSlide, setDetailStartSlide] = useState(0);
  const [detailGalleryMountKey, setDetailGalleryMountKey] = useState(0);
  const latestCarouselSlideRef = useRef(0);
  const rememberSlide = useCallback((i) => {
    latestCarouselSlideRef.current = i;
  }, []);

  const openDetailAtSlide = useCallback((slideIndex) => {
    latestCarouselSlideRef.current = slideIndex;
    setDetailStartSlide(slideIndex);
    setDetailGalleryMountKey((k) => k + 1);
    setDetailOpen(true);
  }, []);

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <ProjectMediaGallery
          slides={slides}
          projectKey={p.id}
          variant="card"
          onOpenGallery={slides.length ? openDetailAtSlide : undefined}
          onActiveSlideChange={rememberSlide}
        />
        {p.projectType ? <span className={styles.typeTag}>{p.projectType}</span> : null}
        {p.badge ? <span className={styles.badge}>{p.badge}</span> : null}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{p.title}</h3>
        <p className={styles.desc}>{p.description}</p>
        <button
          type="button"
          className={styles.btnDetails}
          onClick={() => openDetailAtSlide(latestCarouselSlideRef.current)}
        >
          Screenshots &amp; details
        </button>
        <ul className={styles.tech}>
          {(p.tech || []).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {href ? (
          <div className={styles.actions}>
            <a className={styles.btnPrimary} href={href} target="_blank" rel="noreferrer">
              {visitLabel}
            </a>
          </div>
        ) : null}
        {(p.files || []).length ? (
          <div className={styles.files}>
            <p className={styles.filesLabel}>Downloads</p>
            <ul className={styles.fileList}>
              {(p.files || []).map((f, fi) => {
                const fhref = f.url || f.dataUrl || getFileUrl(f.fileId);
                if (!fhref) return null;
                return (
                  <li key={fi}>
                    <a className={styles.fileLink} href={fhref} download={f.name || 'download'}>
                      {f.name || 'File'}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      {detailOpen ? (
        <ProjectDetailModal
          project={p}
          slides={slides}
          getFileUrl={getFileUrl}
          initialSlideIndex={detailStartSlide}
          modalGalleryKey={detailGalleryMountKey}
          onClose={() => setDetailOpen(false)}
        />
      ) : null}
    </article>
  );
}

export function Projects() {
  const { data, getFileUrl } = useSiteData();
  const projects = data.projects || [];

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Selected work" title="Projects" />
        </ScrollReveal>
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <ScrollReveal key={p.id} delay={0.06 * i}>
              <ProjectCard p={p} getFileUrl={getFileUrl} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
