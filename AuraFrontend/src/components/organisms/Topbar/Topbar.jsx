import { useState, useEffect } from 'react';
import { NavLink, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import Brand from '../../atoms/Brand/Brand';
import IconButton from '../../atoms/IconButton/IconButton';
import ProfileChip from '../../molecules/ProfileChip/ProfileChip';
import { primaryNavLinks } from '../../../data/navLinks';
import styles from './Topbar.module.css';

export default function Topbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const paramSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(paramSearch);

  useEffect(() => {
    setSearchTerm(paramSearch);
  }, [paramSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== paramSearch) {
        if (location.pathname !== '/' && searchTerm.trim()) {
          navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
        } else if (location.pathname === '/') {
          const nextParams = new URLSearchParams(searchParams);
          if (searchTerm.trim()) {
            nextParams.set('search', searchTerm.trim());
          } else {
            nextParams.delete('search');
          }
          setSearchParams(nextParams, { replace: true });
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, paramSearch, location.pathname, navigate, searchParams, setSearchParams]);

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
      <div className={styles['header-search']}>
        <span className={styles['search-icon']}>⌕</span>
        <input
          type="search"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />
        {searchTerm && (
          <button
            type="button"
            className={styles['clear-btn']}
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <div className={styles['header-actions']}>
        <IconButton to="/favorites" ariaLabel="Favorites">♡</IconButton>
        <IconButton to="/cart" ariaLabel="Shopping cart">⌁</IconButton>
        <ProfileChip />
      </div>
    </header>
  );
}
