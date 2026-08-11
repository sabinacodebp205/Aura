import { Link } from 'react-router-dom';
import styles from './TextLink.module.css';

export default function TextLink({ to, children, className = '' }) {
  if (to.startsWith('http') || to.startsWith('#')) {
    return (
      <a href={to} className={`${styles['text-link']} ${className}`.trim()}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={`${styles['text-link']} ${className}`.trim()}>
      {children}
    </Link>
  );
}
