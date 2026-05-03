import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './CertificateLightbox.module.css';

export function CertificateLightbox({ src, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!src) return null;

  return createPortal(
    <div className={styles.backdrop} role="dialog" aria-modal aria-label={title || 'Certificate'}>
      <button type="button" className={styles.close} onClick={onClose}>
        Close
      </button>
      <figure className={styles.figure}>
        <img className={styles.img} src={src} alt={title || ''} />
      </figure>
    </div>,
    document.body
  );
}
