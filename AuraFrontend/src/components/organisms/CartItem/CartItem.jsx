import { useTranslation } from 'react-i18next';
import QuantityControl from '../../molecules/QuantityControl/QuantityControl';
import { getImageUrl, handleImageError } from '../../../utils/imageUrl';
import styles from './CartItem.module.css';

export default function CartItem({ item, onRemove, onQtyChange, total }) {
  const { t } = useTranslation();
  if (!item) return null;

  const imageSrc = getImageUrl(item.image || item.imageUrl);

  return (
    <article className={`cart-item ${styles.root}`}>
      {imageSrc ? (
        <img src={imageSrc} alt={item.alt || item.name || 'Cart item'} onError={handleImageError} />
      ) : (
        <div className={styles['cart-image-placeholder']} aria-label="No image" />
      )}
      <div>
        <h2>{item.name}</h2>
        <p>{item.detail}</p>
        {item.fees && item.fees.length > 0 && (
          <div className="cart-tags">
            {item.fees.map((fee, index) => (
              <span key={`${fee.label}-${index}`}>{fee.label} +${fee.amount}</span>
            ))}
          </div>
        )}
      </div>
      <QuantityControl value={item.quantity} onChange={(quantity) => onQtyChange(item.id, quantity)} />
      <strong>${(total || 0).toFixed(2)}</strong>
      <button className="remove-button" type="button" onClick={() => onRemove(item.id)}>
        {t('cart.remove')}
      </button>
    </article>
  );
}
