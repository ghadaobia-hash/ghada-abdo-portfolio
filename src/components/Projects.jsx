import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Projects.module.css';

export function Projects() {
  const { data, getFileUrl } = useSiteData();
  const projects = data.projects || [];

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Selected work" title="Projects" />
        </ScrollReveal>
        <div className={styles.grid}>
          {projects.map((p, i) => {
            const cover = p.coverImageUrl || p.coverImageDataUrl || getFileUrl(p.coverImageId) || p.image;
            return (
              <ScrollReveal key={p.id} delay={0.06 * i}>
                <article className={styles.card}>
                  <div className={styles.imageWrap}>
                    <img className={styles.image} src={cover} alt="" width={640} height={400} />
                    {p.projectType ? <span className={styles.typeTag}>{p.projectType}</span> : null}
                    {p.badge ? <span className={styles.badge}>{p.badge}</span> : null}
                  </div>
                  <div className={styles.body}>
                    <h3 className={styles.title}>{p.title}</h3>
                    <p className={styles.desc}>{p.description}</p>
                    <ul className={styles.tech}>
                      {(p.tech || []).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <div className={styles.actions}>
                      {p.demoUrl ? (
                        <a className={styles.btnPrimary} href={p.demoUrl} target="_blank" rel="noreferrer">
                          Live Demo
                        </a>
                      ) : (
                        <span className={styles.btnDisabled}>Demo</span>
                      )}
                      {p.codeUrl ? (
                        <a className={styles.btnGhost} href={p.codeUrl} target="_blank" rel="noreferrer">
                          Source Code
                        </a>
                      ) : (
                        <span className={styles.btnDisabled}>Code</span>
                      )}
                    </div>
                    {(p.files || []).length ? (
                      <div className={styles.files}>
                        <p className={styles.filesLabel}>Downloads</p>
                        <ul className={styles.fileList}>
                          {p.files.map((f) => {
                            const href = f.url || f.dataUrl || getFileUrl(f.fileId);
                            if (!href) return null;
                            return (
                              <li key={f.fileId}>
                                <a className={styles.fileLink} href={href} download={f.name || 'download'}>
                                  {f.name || 'File'}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
