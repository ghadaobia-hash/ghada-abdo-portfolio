import { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { SectionEditModal } from './SectionEditModal';
import styles from './EditableSection.module.css';

export function EditableSection({ section, children }) {
  const { isAdmin } = useAdminAuth();
  const [open, setOpen] = useState(false);

  if (!isAdmin) {
    return children;
  }

  return (
    <div className={styles.host} data-section={section}>
      {children}
      <button type="button" className={styles.editBtn} onClick={() => setOpen(true)}>
        {section === 'hero' ? 'Edit hero' : 'Edit'}
      </button>
      <SectionEditModal section={section} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
