import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import { useFavorites } from '../../context/FavoritesContext';
import { getAllProducts } from '../../api/productService';
import styles from './FavoritesPage.module.css';

export default function FavoritesPage() {
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
      name: fav.productName || 'Favorite Product',
      price: fav.price || 0,
      images: fav.imageUrl ? [fav.imageUrl] : [],
      image: fav.imageUrl || '',
      alt: fav.productName || 'Favorite Product',
      category: 'Saved',
    }));

  const displayProducts = [...favoritedProducts, ...missingFavs];

  return (
    <main className={`page-shell ${styles.root}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Saved products</p>
          <h1>Your Favorites</h1>
        </div>
        <Link className="text-link" to="/">Continue shopping</Link>
      </div>
      {loading || favLoading ? (
        <p className="loading-text">Loading favorites…</p>
      ) : displayProducts.length > 0 ? (
        <ProductGrid products={displayProducts} />
      ) : (
        <p className="empty-text">You have no saved favorites yet.</p>
      )}
    </main>
  );
}
