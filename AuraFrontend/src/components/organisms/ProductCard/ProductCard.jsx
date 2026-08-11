import { Link } from 'react-router-dom';
import FavoriteButton from '../../molecules/FavoriteButton/FavoriteButton';
import Rating from '../../atoms/Rating/Rating';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  return (
    <article className={styles['product-card']}>
      <FavoriteButton productId={product.id} />
      <Link to={`/product/${product.id}`}>
        <img src={product.images?.[0] || product.image} alt={product.alt} />
        <div className={styles['product-copy']}>
          <span>{product.category}</span>
          <h3>{product.name}</h3>
          <p>${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <Rating score={product.rating} />
    </article>
  );
}
