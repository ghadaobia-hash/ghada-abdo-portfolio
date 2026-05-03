import styles from './SectionTitle.module.css';

export function SectionTitle({ subtitle, title, align = 'center', light = false }) {
  return (
    <div
      className={`${styles.wrap} ${align === 'left' ? styles.left : ''} ${light ? styles.light : ''}`}
    >
      {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.lines} aria-hidden>
        <span className={styles.line} />
        <span className={styles.diamond} />
        <span className={styles.line} />
      </div>
    </div>
  );
}
