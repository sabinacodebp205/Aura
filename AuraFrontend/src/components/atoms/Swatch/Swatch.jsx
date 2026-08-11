import styles from './Swatch.module.css';

export default function Swatch({ color, isActive, onClick, ariaLabel }) {
  const classes = [
    styles.swatch,
    styles[color],
    isActive ? styles.active : ''
  ].filter(Boolean).join(' ');

  return (
    <button 
      type="button" 
      className={classes} 
      onClick={onClick} 
      aria-label={ariaLabel}
    />
  );
}
