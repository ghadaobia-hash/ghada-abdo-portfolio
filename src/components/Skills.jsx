import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Skills.module.css';

function SkillIcon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' };
  switch (name) {
    case 'plane':
      return (
        <svg {...common} strokeWidth="1.5" aria-hidden>
          <path d="M21 8L3 12l7 2 2 7 4-10 10-3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'map':
      return (
        <svg {...common} strokeWidth="1.5" aria-hidden>
          <path d="M9 20l-5-2V4l5 2m0 14l6 2 5-2V4l-5 2m-6 14V4m6 16V4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'code':
      return (
        <svg {...common} strokeWidth="1.5" aria-hidden>
          <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common} strokeWidth="1.5" aria-hidden>
          <path d="M4 20V10M10 20V4M16 20v-6M22 20V14" strokeLinecap="round" />
        </svg>
      );
    case 'tools':
      return (
        <svg {...common} strokeWidth="1.5" aria-hidden>
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'palette':
      return (
        <svg {...common} strokeWidth="1.5" aria-hidden>
          <path
            d="M12 21a9 9 0 0 1-1.8-17.86A9 9 0 0 1 21 12h-4a3 3 0 0 0-6 0H7a2 2 0 1 1-2 2v2a2 2 0 0 0 2 2h1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="9" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg {...common} strokeWidth="1.5" aria-hidden>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" strokeLinecap="round" />
        </svg>
      );
  }
}

export function Skills() {
  const { data } = useSiteData();
  const skillGroups = data.skillGroups || [];

  return (
    <section id="skills" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Capabilities" title="Skills & Tools" />
        </ScrollReveal>
        <div className={styles.grid}>
          {skillGroups.map((g, i) => (
            <ScrollReveal key={g.id} delay={0.05 * i}>
              <article className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.icon}>
                    <SkillIcon name={g.icon} />
                  </span>
                  <h3 className={styles.cardTitle}>{g.title}</h3>
                </div>
                <ul className={styles.badges}>
                  {g.items.map((item) => (
                    <li key={item} className={styles.badge}>
                      {item}
                    </li>
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
