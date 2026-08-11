import styles from './SmartNote.module.css';

export default function SmartNote({ title, description, className = '' }) {
  return (
    <div className={`${styles['smart-note']} ${className}`.trim()}>
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  );
}
