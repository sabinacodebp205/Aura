import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FavoriteButton from '../../molecules/FavoriteButton/FavoriteButton';
import Rating from '../../atoms/Rating/Rating';
import { getImageUrl, handleImageError } from '../../../utils/imageUrl';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  if (!product) return null;

  const rawSrc = product.images?.[0] || product.imageUrl || product.image;
  const imageSrc = getImageUrl(rawSrc);

  const finalDiscount = product.discountPercent || 0;
  const hasDiscount = product.hasDiscount || false;
  const originalPrice = product.originalPrice || product.price || 0;
  const discountedPrice = product.price || 0;

  return (
    <article className={styles['product-card']}>
      {hasDiscount && (
        <span className={styles.discountBadge}>
          {t('coupon.badge', { percent: finalDiscount })}
        </span>
      )}
      <FavoriteButton productId={product.id} />
      <Link to={`/product/${product.id}`}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.alt || product.name || 'Product'}
            onError={handleImageError}
          />
        ) : (
          <div className={styles['image-placeholder']} aria-label="No image available" />
        )}
        <div className={styles['product-copy']}>
          <span>{product.category || product.categoryName || 'Garment'}</span>
          <h3>{product.name}</h3>
          <div className={styles.priceRow}>
            <p className={styles.currentPrice}>${discountedPrice.toFixed(2)}</p>
            {hasDiscount && (
              <del className={styles.originalPrice}>${originalPrice.toFixed(2)}</del>
            )}
          </div>
        </div>
      </Link>
      <Rating score={product.rating} />
    </article>
  );
}
