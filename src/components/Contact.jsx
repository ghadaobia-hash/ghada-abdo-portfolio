import { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { useSiteData } from '../context/SiteDataContext';
import styles from './Contact.module.css';

export function Contact() {
  const { data, getFileUrl } = useSiteData();
  const { personal } = data;
  const [sent, setSent] = useState(false);
  const qrUrl = personal.qrCodeUrl || personal.qrCodeDataUrl || getFileUrl(personal.qrCodeId);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = fd.get('name')?.toString().trim() || '';
    const email = fd.get('email')?.toString().trim() || '';
    const message = fd.get('message')?.toString().trim() || '';
    const subject = encodeURIComponent(`Portfolio · Message from ${name || 'visitor'}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.inner}>
        <ScrollReveal>
          <SectionTitle subtitle="Collaborate" title="Contact Me" light align="left" />
        </ScrollReveal>

        <div className={styles.grid}>
          <ScrollReveal delay={0.06}>
            <div className={styles.info}>
              <p className={styles.lead}>{personal.contactLead}</p>
              {qrUrl ? (
                <div className={styles.qrWrap}>
                  <img className={styles.qr} src={qrUrl} alt="Contact QR code" width={160} height={160} />
                </div>
              ) : null}
              <ul className={styles.details}>
                <li>
                  <span className={styles.label}>Email</span>
                  <a href={`mailto:${personal.email}`}>{personal.email}</a>
                </li>
                <li>
                  <span className={styles.label}>Phone</span>
                  <a href={`tel:${String(personal.phone).replace(/\s/g, '')}`}>{personal.phone}</a>
                </li>
                <li>
                  <span className={styles.label}>Location</span>
                  <span>{personal.location}</span>
                </li>
                <li>
                  <span className={styles.label}>LinkedIn</span>
                  <a href={personal.linkedin} target="_blank" rel="noreferrer">
                    {personal.linkedin.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '')}
                  </a>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input className={styles.input} name="name" type="text" autoComplete="name" required />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input className={styles.input} name="email" type="email" autoComplete="email" required />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Message</span>
                <textarea className={styles.textarea} name="message" rows={4} required />
              </label>
              <button type="submit" className={styles.submit}>
                Send Message
              </button>
              {sent ? <p className={styles.hint}>Your mail client should open — if it does not, email me directly.</p> : null}
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
