import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({ 
  children, 
  variant = 'dark', 
  fullWidth, 
  to, 
  onClick, 
  className = '', 
  type = 'button',
  ...props 
}) {
  const classes = [
    styles.button,
    variant === 'dark' ? styles['button-dark'] : styles['button-light'],
    fullWidth ? styles['full-width'] : '',
    className
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
