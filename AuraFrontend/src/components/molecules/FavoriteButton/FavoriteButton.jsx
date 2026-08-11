import { useFavorite } from '../../../hooks/useFavorite';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ productId, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorite(productId);

  return (
    <button
      className={`${styles['favorite-button']} ${isFavorite ? styles['is-saved'] : ''} ${className}`.trim()}
      type="button"
      aria-label={isFavorite ? 'Remove favorite' : 'Save favorite'}
      onClick={toggleFavorite}
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  );
}
