import { useAuth } from '../../context/AuthContext';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const fullName = [user.name, user.surname].filter(Boolean).join(' ') || 'AURA Member';
  const initial = (fullName || user.email || 'A')[0].toUpperCase();

  return (
    <main className={`page-shell ${styles.container}`}>
      <div className={styles['profile-card']}>
        {user.profileImageUrl ? (
          <img src={user.profileImageUrl} alt={fullName} className={styles['avatar-image']} />
        ) : (
          <div className={styles['avatar-circle']}>{initial}</div>
        )}
        <h2>{fullName}</h2>
        <p className={styles['user-email']}>{user.email}</p>
        {user.userName && <span className={styles['user-badge']}>@{user.userName}</span>}
        <button type="button" className={styles['logout-btn']} onClick={logout}>
          Sign Out
        </button>
      </div>
    </main>
  );
}
