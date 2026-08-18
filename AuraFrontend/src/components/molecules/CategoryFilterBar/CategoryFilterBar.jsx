import { useTranslation } from 'react-i18next';
import styles from './CategoryFilterBar.module.css';

export default function CategoryFilterBar({ categories = [], activeCategory = 'all', onSelectCategory, className = '' }) {
  const { t } = useTranslation();
  const allOption = { id: 'all', name: 'all', label: t('common.all') };
  const items = [allOption, ...categories.map((c) => ({ ...c, label: c.name }))];

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
            {cat.id === 'all' ? t('common.all') : cat.label}
          </button>
        );
      })}
    </div>
  );
}
