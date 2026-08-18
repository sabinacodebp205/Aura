import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bottomNavLinks } from '../../../data/navLinks';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const { t } = useTranslation();

  const getLabel = (to, defaultLabel) => {
    if (to === '/') return t('nav.home');
    if (to === '/inspiration') return t('nav.inspiration');
    if (to === '/favorites') return t('nav.favorites');
    if (to === '/profile') return t('nav.profile');
    if (to === '/cart') return t('nav.cart');
    return defaultLabel;
  };

  return (
    <nav className={styles['bottom-nav']} aria-label="Mobile navigation">
      {bottomNavLinks.map((link) => (
        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? styles.active : '')}>
          <span>{link.icon}</span>
          {getLabel(link.to, link.label)}
        </NavLink>
      ))}
    </nav>
  );
}
