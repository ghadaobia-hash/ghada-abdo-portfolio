import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import styles from './AdminPasswordModal.module.css';

export function AdminPasswordModal({ open, onClose }) {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (login(password)) {
      setError('');
      setPassword('');
      onClose();
    } else {
      setError('Incorrect password.');
    }
  };

  return createPortal(
    <div className={styles.overlay} role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-labelledby="pwd-title">
        <h2 id="pwd-title" className={styles.title}>
          Admin
        </h2>
        <p className={styles.hint}>Enter the site password to enable editing on this page.</p>
        <form onSubmit={submit}>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.row}>
            <button type="submit" className={styles.btn}>
              Unlock editing
            </button>
            <button type="button" className={styles.btnGhost} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
