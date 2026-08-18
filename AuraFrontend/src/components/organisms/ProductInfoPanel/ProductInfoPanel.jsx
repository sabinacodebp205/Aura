import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import FavoriteButton from '../../molecules/FavoriteButton/FavoriteButton';
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl';
import ColorSwatchGroup from '../../molecules/ColorSwatchGroup/ColorSwatchGroup';
import { useCart } from '../../../context/CartContext';
import styles from './ProductInfoPanel.module.css';

export default function ProductInfoPanel({ product }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) return undefined;
    const timer = window.setTimeout(() => setIsAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [isAdded]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      detail: `${product.color || 'Standard'} - Size ${product.size || 'M'}`,
      quantity: 1,
      unitPrice: product.price,
      image: product.imageUrls?.[0] || product.image,
      alt: product.name,
    });
    setIsAdded(true);
  };

  const ratingVal = product.averageRating || product.rating || 0;
  const reviewCnt = product.reviewCount ?? product.reviews ?? 0;

  return (
    <div className={`product-info ${styles.root}`}>
      <FavoriteButton productId={product.id} className={styles.favorite} />
      <Eyebrow>{product.categoryName || t('product.collection')}</Eyebrow>
      <h1>{product.name}</h1>
      <div className="price-line">
        <strong>${product.price ? product.price.toFixed(2) : '0.00'}</strong>
        <span style={{ color: 'var(--star, #f59e0b)' }}>
          {reviewCnt > 0 ? (
            <>★★★★★ {ratingVal.toFixed(1)} ({reviewCnt} {t('product.verifiedReviews')})</>
          ) : (
            <span style={{ color: 'var(--muted)' }}>{t('product.noReviewsYet')}</span>
          )}
        </span>
      </div>
      <p>{product.description}</p>

      {product.size && (
        <div className="option-group">
          <div className="option-title">{t('product.size')}</div>
          <SegmentedControl
            options={[product.size, 'XS', 'S', 'M', 'L', 'XL']
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((size) => ({ label: size, value: size }))}
            selected={product.size}
            onChange={() => {}}
          />
        </div>
      )}

      {product.color && (
        <div className="option-group">
          <div className="option-title">{t('product.color')} <strong>{product.color}</strong></div>
          <ColorSwatchGroup colors={[product.color.toLowerCase(), 'black', 'white', 'grey']} />
        </div>
      )}

      <div className="button-row">
        <Button onClick={handleAddToCart}>
          {isAdded ? t('product.addedToCart') : t('product.addToCart')}
        </Button>
      </div>
    </div>
  );
}
