import { Link } from 'react-router-dom';
import FavoriteButton from '../../molecules/FavoriteButton/FavoriteButton';
import Rating from '../../atoms/Rating/Rating';
import { getImageUrl, handleImageError } from '../../../utils/imageUrl';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  if (!product) return null;

  const rawSrc = product.images?.[0] || product.imageUrl || product.image;
  const imageSrc = getImageUrl(rawSrc);

  return (
    <article className={styles['product-card']}>
      <FavoriteButton productId={product.id} />
      <Link to={`/product/${product.id}`}>
        <img
          src={imageSrc}
          alt={product.alt || product.name || 'Product'}
          onError={handleImageError}
        />
        <div className={styles['product-copy']}>
          <span>{product.category || product.categoryName || 'Garment'}</span>
          <h3>{product.name}</h3>
          <p>${(product.price || 0).toFixed(2)}</p>
        </div>
      </Link>
      <Rating score={product.rating} />
    </article>
  );
}
