import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSiteData } from '../context/SiteDataContext';
import { AdminPasswordModal } from './AdminPasswordModal';
import { NavbarWaves } from './NavbarWaves';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAdmin, logout } = useAdminAuth();
  const { data, commitSiteSave, saving, persistenceMode } = useSiteData();
  const { navLinks, personal } = data;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [pwdOpen, setPwdOpen] = useState(false);

  useEffect(() => {
    const ids = navLinks.map((l) => l.id);
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [navLinks]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const onAdminClick = () => {
    if (isAdmin) return;
    setPwdOpen(true);
  };

  const onSaveAll = async () => {
    await commitSiteSave();
  };

  return (
    <header className={styles.header}>
      {isAdmin ? (
        <div className={styles.adminStrip}>
          <span className={styles.adminLabel}>Edit mode</span>
          <span className={styles.adminMeta}>
            {persistenceMode === 'firebase' ? 'Cloud (Firebase)' : 'Local only — set VITE_FIREBASE_* for shared hosting'}
          </span>
          <button type="button" className={styles.adminSave} disabled={saving} onClick={onSaveAll}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button type="button" className={styles.adminLogout} onClick={logout}>
            Exit editing
          </button>
        </div>
      ) : null}
      <div className={styles.waveBackdrop} aria-hidden>
        <NavbarWaves />
      </div>
      <div className={styles.inner}>
        {!isAdmin ? (
          <button type="button" className={styles.adminCorner} onClick={onAdminClick}>
            Admin
          </button>
        ) : null}
        <button type="button" className={styles.brand} onClick={() => scrollTo('home')}>
          <span className={styles.brandMark} aria-hidden />
          <span className={styles.brandText}>{personal.shortName}</span>
        </button>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.list}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  className={`${styles.link} ${active === link.id ? styles.active : ''}`}
                  onClick={() => scrollTo(link.id)}
                >
                  {link.label}
                  <span className={styles.underline} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          <span className={styles.srOnly}>Menu</span>
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className={styles.mobile}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ul className={styles.mobileList}>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    className={`${styles.mobileLink} ${active === link.id ? styles.mobileLinkActive : ''}`}
                    onClick={() => scrollTo(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AdminPasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />
    </header>
  );
}
