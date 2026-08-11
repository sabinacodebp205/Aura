import styles from './SearchBar.module.css';

export default function SearchBar({ placeholder = "Search...", className = '', ...props }) {
  return (
    <label className={`${styles['search-shell']} ${className}`.trim()}>
      <span>⌕</span>
      <input type="search" placeholder={placeholder} {...props} />
    </label>
  );
}
