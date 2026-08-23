import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../ProductCard/ProductCard';
import SectionHeading from '../../molecules/SectionHeading/SectionHeading';
import { getRecentlyViewed, clearRecentlyViewed } from '../../../utils/recentlyViewed';
import styles from './RecentlyViewedSection.module.css';

export default function RecentlyViewedSection({ currentProductId = null, showEmpty = false }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const list = getRecentlyViewed();
    // Exclude current product if viewing on ProductPage
    const filtered = currentProductId
      ? list.filter((p) => p && p.id !== currentProductId)
      : list;
    setItems(filtered);
  }, [currentProductId]);

  const handleClear = () => {
    clearRecentlyViewed();
    setItems([]);
  };

  if (items.length === 0 && !showEmpty) {
    return null;
  }

  return (
    <section className={`section-pad ${styles.root}`}>
      <div className={styles.headerRow}>
        <SectionHeading
          eyebrow={t('recentlyViewed.eyebrow')}
          title={t('recentlyViewed.title')}
        />
        {items.length > 0 && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            title={t('recentlyViewed.clear')}
          >
            {t('recentlyViewed.clear')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <p>{t('recentlyViewed.empty')}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </section>
  );
}
