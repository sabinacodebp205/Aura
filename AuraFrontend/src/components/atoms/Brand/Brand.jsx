import { Link } from 'react-router-dom';
import styles from './Brand.module.css';

export default function Brand() {
  return (
    <Link className={styles.brand} to="/" aria-label="AURA AI Fashion Customization">
      <span className={styles['brand-emblem']}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles['logo-svg']}>
          <path d="M12 2L3 21H7.5L12 11L16.5 21H21L12 2Z" fill="currentColor" />
          <path d="M8.5 15H15.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <div className={styles['brand-text-group']}>
        <span className={styles['brand-title']}>AURA</span>
        <span className={styles['brand-sub']}>AI FASHION</span>
      </div>
    </Link>
  );
}
