import { Link } from 'react-router-dom';
import styles from './Brand.module.css';

export default function Brand() {
  return (
    <Link className={styles.brand} to="/" aria-label="AURA home">
      <span className={styles['brand-mark']}>A</span>
      <span>AURA</span>
    </Link>
  );
}
