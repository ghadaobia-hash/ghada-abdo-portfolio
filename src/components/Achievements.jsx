import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Achievements.module.css';

export function Achievements() {
  const { data } = useSiteData();
  const list = data.achievements || [];

  return (
    <section id="achievements" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Recognition" title="Achievements & Awards" />
        </ScrollReveal>
        {!list.length ? (
          <p className={styles.empty}>No achievements listed.</p>
        ) : (
          <div className={styles.grid}>
            {list.map((a, i) => (
              <ScrollReveal key={a.id} delay={0.04 * (i % 6)}>
                <article className={styles.card}>
                  <p className={styles.date}>{a.date}</p>
                  <h3 className={styles.title}>{a.title}</h3>
                  <p className={styles.org}>{a.org}</p>
                  {a.detail ? <p className={styles.detail}>{a.detail}</p> : null}
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
