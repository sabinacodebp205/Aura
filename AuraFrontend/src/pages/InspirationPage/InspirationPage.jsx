import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inspoCategories, inspoItems } from '../../data/inspoItems';
import styles from './InspirationPage.module.css';

export default function InspirationPage() {
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

  const handleApplyDesign = (promptText) => {
    navigate(`/studio?prompt=${encodeURIComponent(promptText)}`);
  };

  return (
    <main className={`page-shell ${styles.root}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles['hero-badge']}>AURA AI FASHION LAB</div>
        <h1>AI Fashion & Design Inspiration</h1>
        <p>Explore custom clothing ideas, streetwear graphics, and embroidery prompts created with AURA AI Studio.</p>

        {/* Search Bar */}
        <div className={styles['search-wrapper']}>
          <span className={styles['search-icon']}>⌕</span>
          <input
            type="search"
            placeholder="Search hoodies, jackets, streetwear, embroidery, Y2K..."
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
            {cat}
          </button>
        ))}
      </nav>

      {/* Inspiration Cards Grid */}
      <section className={styles.grid}>
        {filteredItems.length === 0 ? (
          <div className={styles['empty-state']}>
            <p>No fashion inspiration found matching "{searchQuery}".</p>
            <button type="button" onClick={() => { setActiveCategory('All Ideas'); setSearchQuery(''); }}>
              Clear Search Filters
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
                  onClick={() => handleApplyDesign(item.prompt)}
                >
                  Create in AI Studio →
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
