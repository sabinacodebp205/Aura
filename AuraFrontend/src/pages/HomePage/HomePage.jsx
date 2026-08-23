import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Brand from '../../components/atoms/Brand/Brand';
import SearchBar from '../../components/molecules/SearchBar/SearchBar';
import CategoryFilterBar from '../../components/molecules/CategoryFilterBar/CategoryFilterBar';
import SectionHeading from '../../components/molecules/SectionHeading/SectionHeading';
import HeroBanner from '../../components/organisms/HeroBanner/HeroBanner';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import RecentlyViewedSection from '../../components/organisms/RecentlyViewedSection/RecentlyViewedSection';
import { getAllProducts } from '../../api/productService';
import { getAllCategories } from '../../api/categoryService';
import { newArrivals } from '../../data/products';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    let cancelled = false;

    Promise.all([getAllProducts(), getAllCategories()])
      .then(([productsData, categoriesData]) => {
        if (!cancelled) {
          setProducts(productsData || []);
          setCategories(categoriesData || []);
        }
      })
      .catch((err) => console.error('Failed to load initial data:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (val) {
      nextParams.set('search', val);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory.toLowerCase() === 'all' ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (product.categoryName && product.categoryName.toLowerCase() === selectedCategory.toLowerCase());

    const trimmedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !trimmedQuery ||
      product.name?.toLowerCase().includes(trimmedQuery) ||
      product.description?.toLowerCase().includes(trimmedQuery) ||
      (product.category && product.category.toLowerCase().includes(trimmedQuery));

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className={`home-command ${styles.command}`} aria-label={t('common.brand')}>
        <div className="home-brandline">
          <Brand />
          <div>
            <p className="eyebrow">{t('home.searchEyebrow')}</p>
            <h1>{t('common.brand')}</h1>
          </div>
        </div>
        <SearchBar
          placeholder={t('home.searchPlaceholder')}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </section>
      <HeroBanner />
      <section className={`section-pad ${styles['tight-section']}`}>
        <SectionHeading
          eyebrow={t('home.trendingEyebrow')}
          title={t('home.trendingTitle')}
          linkText={t('home.viewInspiration')}
          linkTo="/inspiration"
        />
        <CategoryFilterBar
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {loading ? (
          <p className="loading-text">{t('home.loadingProducts')}</p>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className={styles['empty-state']}>
            <h3>{t('home.noProductsFound')}</h3>
            <p>{t('home.noProductsDesc')}</p>
          </div>
        )}
      </section>

      <RecentlyViewedSection />
    </>
  );
}
