import styles from './Avatar.module.css';

export default function Avatar({ className = '' }) {
  return <span className={`${styles['avatar-mini']} ${className}`.trim()} />;
}
