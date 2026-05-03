import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Journey.module.css';

export function Education() {
  const { data } = useSiteData();
  const education = data.education || [];

  return (
    <section id="education" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Academic" title="Education" />
        </ScrollReveal>

        <ul className={styles.timeline}>
          {education.map((item, i) => (
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
