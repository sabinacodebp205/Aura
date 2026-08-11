import styles from './CategoryFilterBar.module.css';

export default function CategoryFilterBar({ categories = [], activeCategory = 'all', onSelectCategory, className = '' }) {
  const allOption = { id: 'all', name: 'All' };
  const items = [allOption, ...categories];

  return (
    <div className={`${styles['filter-bar']} ${className}`.trim()} role="tablist" aria-label="Product categories">
      {items.map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.name.toLowerCase() || (activeCategory === 'all' && cat.id === 'all');
        return (
          <button
            key={cat.id || cat.name}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles['filter-btn']} ${isActive ? styles.active : ''}`}
            onClick={() => onSelectCategory && onSelectCategory(cat.name)}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
