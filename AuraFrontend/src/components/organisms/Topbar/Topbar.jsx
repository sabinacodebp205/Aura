import { NavLink } from 'react-router-dom';
import Brand from '../../atoms/Brand/Brand';
import IconButton from '../../atoms/IconButton/IconButton';
import ProfileChip from '../../molecules/ProfileChip/ProfileChip';
import { primaryNavLinks } from '../../../data/navLinks';
import styles from './Topbar.module.css';

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <Brand />
      <nav className={styles['desktop-nav']} aria-label="Primary navigation">
        {primaryNavLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? styles.active : '')}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles['header-actions']}>
        <IconButton to="/favorites" ariaLabel="Favorites">♡</IconButton>
        <IconButton to="/cart" ariaLabel="Shopping cart">⌁</IconButton>
        <ProfileChip />
      </div>
    </header>
  );
}
