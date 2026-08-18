import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import { useFavorites } from '../../context/FavoritesContext';
import { getAllProducts } from '../../api/productService';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { favoriteIds, favorites, loading: favLoading } = useFavorites();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllProducts()
      .then((data) => {
        if (!cancelled) setAllProducts(data);
      })
      .catch((err) => console.error('FavoritesPage: Failed to load products:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const favoritedProducts = allProducts.filter((product) => favoriteIds.includes(product.id));

  const missingFavs = favorites
    .filter((fav) => !allProducts.some((p) => p.id === fav.productId))
    .map((fav) => ({
      id: fav.productId,
      name: fav.productName || 'Aura Piece',
      price: fav.price || 0,
      images: fav.imageUrl ? [fav.imageUrl] : [],
      image: fav.imageUrl || '',
      alt: fav.productName || 'Aura Piece',
      category: 'Saved',
    }));

  const displayProducts = [...favoritedProducts, ...missingFavs];

  return (
    <main className={`page-shell ${styles.root}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('favorites.eyebrow')}</p>
          <h1>{t('favorites.title')}</h1>
        </div>
        <Link className="text-link" to="/">{t('favorites.continueShopping')}</Link>
      </div>
      {loading || favLoading ? (
        <p className="loading-text">{t('favorites.loading')}</p>
      ) : displayProducts.length > 0 ? (
        <ProductGrid products={displayProducts} />
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p className="empty-text">{t('favorites.empty')}</p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '10px 24px',
              background: '#ffffff',
              color: '#000000',
              fontWeight: 700,
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            {t('favorites.exploreClothing')}
          </Link>
        </div>
      )}
    </main>
  );
}
