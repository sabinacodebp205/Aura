import { Link } from 'react-router-dom';
import Avatar from '../../atoms/Avatar/Avatar';
import styles from './ProfileChip.module.css';

export default function ProfileChip({ name = "Arda", isActive }) {
  return (
    <Link to="/profile" className={`${styles['profile-chip']} ${isActive ? styles.active : ''}`.trim()}>
      <Avatar />
      <span>{name}</span>
    </Link>
  );
}
