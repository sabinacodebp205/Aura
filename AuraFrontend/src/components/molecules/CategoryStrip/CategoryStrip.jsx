import styles from './CategoryStrip.module.css';

export default function CategoryStrip({ categories, activeCategory, onSelect, className = '' }) {
  return (
    <div className={`${styles['category-strip']} ${className}`.trim()} role="list">
      {categories.map((cat) => (
        <a
          key={cat.id}
          href={`#${cat.id}`}
          role="listitem"
          className={activeCategory === cat.id ? styles.active : ''}
          onClick={(e) => {
            e.preventDefault();
            if (onSelect) onSelect(cat.id);
          }}
        >
          {cat.label}
        </a>
      ))}
    </div>
  );
}
