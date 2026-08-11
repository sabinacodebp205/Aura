import { Link } from 'react-router-dom';
import Avatar from '../../atoms/Avatar/Avatar';
import { useAuth } from '../../../context/AuthContext';
import styles from './ProfileChip.module.css';

export default function ProfileChip({ isActive }) {
  const { user, isAuthenticated } = useAuth();

  const displayName = isAuthenticated && user
    ? (user.name || user.userName || 'Profile')
    : 'Sign In';

  const targetPath = isAuthenticated ? '/profile' : '/login';

  return (
    <Link to={targetPath} className={`${styles['profile-chip']} ${isActive ? styles.active : ''}`.trim()}>
      <Avatar />
      <span>{displayName}</span>
    </Link>
  );
}
