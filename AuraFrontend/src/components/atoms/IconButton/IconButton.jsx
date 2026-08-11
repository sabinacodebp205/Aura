import { Link } from 'react-router-dom';
import styles from './IconButton.module.css';

export default function IconButton({ to, children, ariaLabel, isActive, onClick, className = '' }) {
  const classes = `${styles['icon-button']} ${isActive ? styles.active : ''} ${className}`.trim();
  
  if (to) {
    return (
      <Link to={to} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  );
}
