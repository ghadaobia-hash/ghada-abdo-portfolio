import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './About.module.css';

function AviationBadgeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M21 16v-2l-8-5V6a2 2 0 0 0-4 0v3l-8 5v2l8-3 4 1.5V21h4v-6.5l4-1.5 8 3z"
      />
    </svg>
  );
}

function PlaneBadge() {
  return (
    <span className={styles.photoBadge} aria-hidden>
      <AviationBadgeIcon className={styles.photoBadgeIcon} />
    </span>
  );
}

export function About() {
  const { data } = useSiteData();
  const { about, personal } = data;
  const highlights = about.highlights || [];
  const sectionImg = about.sectionImageUrl || about.sectionImageDataUrl;

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Profile" title="About Me" />
        </ScrollReveal>

        {highlights.length ? (
          <ScrollReveal delay={0.04}>
            <ul className={styles.highlights}>
              {highlights.map((h) => (
                <li key={h.id} className={styles.highlight}>
                  <span className={styles.hlLabel}>{h.label}</span>
                  <span className={styles.hlValue}>{h.value}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        ) : null}

        <ScrollReveal delay={0.06}>
          <div className={styles.aboutLayout}>
            <aside className={styles.profileColumn}>
              <div className={styles.profileCard}>
                <div className={styles.photoFrame}>
                  {sectionImg ? (
                    <>
                      <img
                        className={styles.profilePhoto}
                        src={sectionImg}
                        alt={personal.name}
                        width={400}
                        height={400}
                      />
                      <PlaneBadge />
                    </>
                  ) : (
                    <div className={styles.photoPlaceholder}>
                      <span className={styles.photoPlaceholderIcon} aria-hidden>
                        <AviationBadgeIcon className={styles.photoPlaceholderSvg} />
                      </span>
                      <p className={styles.photoPlaceholderText}>Add your portrait</p>
                      <p className={styles.photoPlaceholderHint}>Admin · Edit About · upload image</p>
                    </div>
                  )}
                </div>

                <div className={styles.profileMeta}>
                  <h3 className={styles.profileName}>{personal.name}</h3>
                </div>
              </div>
            </aside>

            <div className={styles.bioColumn}>
              {about.paragraphs.map((p, idx) => (
                <p key={idx} className={styles.bioText}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
