import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Journey.module.css';

export function Experience() {
  const { data } = useSiteData();
  const experience = data.experience || [];

  return (
    <section id="experience" className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Professional" title="Experience" />
        </ScrollReveal>

        <ul className={styles.timeline}>
          {experience.map((item, i) => (
            <li key={item.id} className={styles.item}>
              <ScrollReveal delay={0.06 * i} className={styles.itemMotion}>
                <span className={styles.node} aria-hidden />
                <div className={styles.content}>
                  <p className={styles.period}>{item.period}</p>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.org}>{item.org}</p>
                  <ul className={styles.bullets}>
                    {item.description.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
