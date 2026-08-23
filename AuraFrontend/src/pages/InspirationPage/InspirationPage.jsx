import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import { getAllProducts } from '../../api/productService';
import styles from './InspirationPage.module.css';

export default function InspirationPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        const discounted = (data || []).filter(p => p.hasDiscount);
        setProducts(discounted);
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className={`page-shell ${styles.root}`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles['hero-badge']}>{t('inspiration.discountBadge', 'XÜSUSİ TƏKLİFLƏR')}</div>
        <h1>{t('inspiration.discountTitle', 'Endirimli Məhsullar')}</h1>
        <p>{t('inspiration.discountSubtitle', 'Seçilmiş Aura modellərində xüsusi endirimlərdən yararlanın.')}</p>
      </section>

      {/* Discounted Products Grid */}
      <section className="section-pad">
        {loading ? (
          <p className="loading-text">{t('common.loading', 'Yüklənir...')}</p>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className={styles['empty-state']}>
            <p>{t('home.noProductsFound', 'Heç bir məhsul tapılmadı')}</p>
          </div>
        )}
      </section>
    </main>
  );
}
