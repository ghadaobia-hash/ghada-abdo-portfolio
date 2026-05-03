import { useSiteData } from '../context/SiteDataContext';
import styles from './Footer.module.css';

export function Footer() {
  const { data } = useSiteData();
  const { personal } = data;
  const year = new Date().getFullYear();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden />
          <span className={styles.name}>{personal.shortName}</span>
        </div>
        <nav className={styles.links} aria-label="Footer">
          <button type="button" onClick={() => scrollTo('about')}>
            About
          </button>
          <button type="button" onClick={() => scrollTo('education')}>
            Education
          </button>
          <button type="button" onClick={() => scrollTo('experience')}>
            Experience
          </button>
          <button type="button" onClick={() => scrollTo('skills')}>
            Skills
          </button>
          <button type="button" onClick={() => scrollTo('projects')}>
            Projects
          </button>
          <button type="button" onClick={() => scrollTo('courses')}>
            Courses
          </button>
          <button type="button" onClick={() => scrollTo('certificates')}>
            Certificates
          </button>
          <button type="button" onClick={() => scrollTo('achievements')}>
            Achievements
          </button>
          <button type="button" onClick={() => scrollTo('contact')}>
            Contact
          </button>
        </nav>
        <p className={styles.copy}>© {year} {personal.name}. Crafted with React &amp; Vite.</p>
      </div>
    </footer>
  );
}
