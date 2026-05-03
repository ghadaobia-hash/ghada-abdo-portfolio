import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Certificates.module.css';

export function Courses() {
  const { data } = useSiteData();
  const courses = data.courses || [];

  return (
    <section id="courses" className={styles.coursesSection}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Training" title="Courses" />
        </ScrollReveal>
        <div className={styles.courseGrid}>
          {courses.map((c, i) => (
            <ScrollReveal key={c.id} delay={0.03 * (i % 5)}>
              <article className={styles.courseCard}>
                <p className={styles.courseMeta}>
                  <span className={styles.courseProvider}>{c.provider}</span>
                  <span className={styles.courseDate}>{c.date}</span>
                </p>
                <h3 className={styles.courseTitle}>{c.title}</h3>
                <ul className={styles.courseList}>
                  {c.points.map((pt, j) => (
                    <li key={j}>{pt}</li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
