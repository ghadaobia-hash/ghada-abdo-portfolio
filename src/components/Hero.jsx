import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Hero.module.css';

function ParticleField() {
  return (
    <div className={styles.particles} aria-hidden>
      <div className={styles.grid} />
      <div className={styles.glow} />
    </div>
  );
}

function LinkedInGlyph() {
  return (
    <svg className={styles.linkedinGlyph} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}

export function Hero() {
  const { data, getFileUrl } = useSiteData();
  const { personal } = data;

  const heroChips = useMemo(() => {
    const groups = data.skillGroups;
    if (!Array.isArray(groups) || groups.length === 0) return [];
    return groups
      .map((g) => (g && typeof g.title === 'string' ? g.title.trim() : ''))
      .filter(Boolean)
      .slice(0, 6);
  }, [data.skillGroups]);

  const cvUrl = personal.cvUrl || personal.cvDataUrl || getFileUrl(personal.cvFileId);
  const cvName = personal.cvFileName || 'CV.pdf';

  return (
    <section id="home" className={styles.hero}>
      <ParticleField />
      <div className={styles.gradientShift} aria-hidden />

      <div className={`${styles.inner} ${styles.innerSolo} ${styles.innerHero}`}>
        <div className={styles.heroMain}>
          <motion.div
            className={`${styles.copy} ${styles.copyHero}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.eyebrow}>
              {personal.heroEyebrow?.trim() || 'Portfolio · Aviation × Technology'}
            </p>

            <div className={styles.heroSocialRow}>
              {personal.linkedin ? (
                <a
                  className={styles.linkedinPill}
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedInGlyph />
                  <span>LinkedIn</span>
                </a>
              ) : null}
              {personal.email ? (
                <a className={styles.emailPill} href={`mailto:${personal.email}`}>
                  {personal.email}
                </a>
              ) : null}
            </div>

            <h1 className={styles.name}>{personal.name}</h1>
            <p className={styles.title}>{personal.title}</p>
            {personal.tagline?.trim() ? <p className={styles.intro}>{personal.tagline}</p> : null}

            {heroChips.length > 0 ? (
              <ul className={styles.heroChips} aria-label="Skill areas">
                {heroChips.map((label) => (
                  <li key={label} className={styles.heroChip}>
                    {label}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className={styles.ctaRow}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {personal.heroCtaPrimary?.trim() || 'View My Work'}
              </button>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {personal.heroCtaSecondary?.trim() || 'Contact Me'}
              </button>
              {cvUrl ? (
                <a className={styles.btnCv} href={cvUrl} download={cvName}>
                  {personal.heroCvButtonLabel?.trim() || 'Download CV'}
                </a>
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
