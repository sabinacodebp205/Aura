import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { inspoCategories, inspoItems } from '../../data/inspoItems';
import styles from './InspirationPage.module.css';

export default function InspirationPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All Ideas');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredItems = inspoItems.filter((item) => {
    const matchesCategory = activeCategory === 'All Ideas' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExploreProduct = (item) => {
    navigate(`/?search=${encodeURIComponent(item.title)}`);
  };

  const getCategoryLabel = (cat) => {
    if (cat === 'All Ideas') return t('inspiration.allIdeas');
    return cat;
  };

  return (
    <main className={`page-shell ${styles.root}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles['hero-badge']}>{t('inspiration.badge')}</div>
        <h1>{t('inspiration.title')}</h1>
        <p>{t('inspiration.subtitle')}</p>

        {/* Search Bar */}
        <div className={styles['search-wrapper']}>
          <span className={styles['search-icon']}>⌕</span>
          <input
            type="search"
            placeholder={t('inspiration.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Category Pills */}
      <nav className={styles.categories} aria-label="Inspiration categories">
        {inspoCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles['category-pill']} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </nav>

      {/* Inspiration Cards Grid */}
      <section className={styles.grid}>
        {filteredItems.length === 0 ? (
          <div className={styles['empty-state']}>
            <p>{t('inspiration.emptyState')} "{searchQuery}".</p>
            <button type="button" onClick={() => { setActiveCategory('All Ideas'); setSearchQuery(''); }}>
              {t('inspiration.clearFilters')}
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles['image-box']}>
                <img src={item.image} alt={item.alt} />
                <span className={styles.tag}>{item.category}</span>
              </div>
              <div className={styles.content}>
                <h3>{item.title}</h3>
                <p className={styles.prompt}>"{item.prompt}"</p>
                <button
                  type="button"
                  className={styles['action-btn']}
                  onClick={() => handleExploreProduct(item)}
                >
                  {t('inspiration.shopThisStyle')}
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
