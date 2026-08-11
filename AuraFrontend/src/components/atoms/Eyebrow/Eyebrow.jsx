import styles from './Eyebrow.module.css';

export default function Eyebrow({ children, className = '' }) {
  return <p className={`${styles.eyebrow} ${className}`.trim()}>{children}</p>;
}
