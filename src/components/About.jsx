import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './About.module.css';

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
                    <img
                      className={styles.profilePhoto}
                      src={sectionImg}
                      alt={personal.name}
                      width={400}
                      height={400}
                    />
                  ) : (
                    <div className={styles.photoPlaceholder}>
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
