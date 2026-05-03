import { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { CertificateLightbox } from './CertificateLightbox';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Certificates.module.css';

export function Certificates() {
  const { data, getFileUrl } = useSiteData();
  const certificates = data.certificates || [];
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="certificates" className={styles.certificatesSection}>
      <div className={styles.container}>
        <ScrollReveal>
          <SectionTitle subtitle="Credentials" title="Certificates" />
        </ScrollReveal>
        <div className={styles.grid}>
          {certificates.map((c, i) => {
            const imgUrl = c.imageUrl || c.imageDataUrl || getFileUrl(c.imageId);
            return (
              <ScrollReveal key={c.id} delay={0.03 * (i % 6)}>
                <article className={styles.card}>
                  <button
                    type="button"
                    className={styles.thumbBtn}
                    onClick={() => imgUrl && setLightbox({ src: imgUrl, title: c.title })}
                    disabled={!imgUrl}
                    aria-label={imgUrl ? `Preview ${c.title}` : 'No certificate image'}
                  >
                    {imgUrl ? (
                      <img className={styles.thumbImg} src={imgUrl} alt="" />
                    ) : (
                      <div className={styles.thumb} aria-hidden>
                        <div className={styles.thumbInner}>
                          <span className={styles.seal} />
                          <span className={styles.lines} />
                        </div>
                      </div>
                    )}
                  </button>
                  <h3 className={styles.title}>{c.title}</h3>
                  <p className={styles.provider}>{c.provider}</p>
                  <p className={styles.date}>{c.date}</p>
                  {c.note ? <p className={styles.note}>{c.note}</p> : null}
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
      {lightbox ? (
        <CertificateLightbox src={lightbox.src} title={lightbox.title} onClose={() => setLightbox(null)} />
      ) : null}
    </section>
  );
}
