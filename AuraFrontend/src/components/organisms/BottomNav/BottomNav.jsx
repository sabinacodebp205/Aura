import { NavLink } from 'react-router-dom';
import { bottomNavLinks } from '../../../data/navLinks';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  return (
    <nav className={styles['bottom-nav']} aria-label="Mobile navigation">
      {bottomNavLinks.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? styles.active : '')}>
          <span>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
