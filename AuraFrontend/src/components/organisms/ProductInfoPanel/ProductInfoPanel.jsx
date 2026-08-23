import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import FavoriteButton from '../../molecules/FavoriteButton/FavoriteButton';
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl';
import ColorSwatchGroup from '../../molecules/ColorSwatchGroup/ColorSwatchGroup';
import { useCart } from '../../../context/CartContext';
import styles from './ProductInfoPanel.module.css';

export default function ProductInfoPanel({ product, discountPercent = 15 }) {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Extract only real, valid size options from the product data
  const availableSizes = useMemo(() => {
    if (!product) return [];
    const raw = product.availableSizes || product.sizes || product.size;
    if (Array.isArray(raw)) {
      return raw.filter(Boolean).map(String);
    }
    if (typeof raw === 'string' && raw.trim()) {
      return raw
        .split(/[,/]/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }, [product]);

  // Initial selected size: empty so user is required to choose unless there's only 1 option
  const [selectedSize, setSelectedSize] = useState(() => (
    availableSizes.length === 1 ? availableSizes[0] : ''
  ));

  useEffect(() => {
    if (availableSizes.length === 1) {
      setSelectedSize(availableSizes[0]);
    } else {
      setSelectedSize('');
    }
    setSizeError(false);
  }, [availableSizes]);

  useEffect(() => {
    if (!isAdded) return undefined;
    const timer = window.setTimeout(() => setIsAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [isAdded]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (sizeError) setSizeError(false);
  };

  const handleAddToCart = () => {
    // Enforce size selection if sizes are present
    if (availableSizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    const finalSize = selectedSize || product.size || 'Standard';
    const finalColor = product.color || 'Standard';
    const unitPrice = discountPercent > 0
      ? product.price * (1 - discountPercent / 100)
      : product.price;

    addItem({
      productId: product.id,
      name: product.name,
      size: finalSize,
      color: finalColor,
      detail: `${finalColor} • Size: ${finalSize}`,
      quantity: 1,
      unitPrice: unitPrice,
      originalPrice: product.price,
      image: product.imageUrls?.[0] || product.image,
      alt: product.name,
    });
    setIsAdded(true);
  };

  const ratingVal = product.averageRating || product.rating || 0;
  const reviewCnt = product.reviewCount ?? product.reviews ?? 0;

  const originalPrice = product.price || 0;
  const hasDiscount = discountPercent > 0;
  const discountedPrice = hasDiscount
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  return (
    <div className={`product-info ${styles.root}`}>
      <FavoriteButton productId={product.id} className={styles.favorite} />
      <Eyebrow>{product.categoryName || t('product.collection')}</Eyebrow>
      <h1>{product.name}</h1>
      
      <div className="price-line">
        <div className={styles.priceGroup}>
          <strong>${discountedPrice.toFixed(2)}</strong>
          {hasDiscount && (
            <del className={styles.originalPrice}>${originalPrice.toFixed(2)}</del>
          )}
          {hasDiscount && (
            <span className={styles.discountTag}>
              {t('coupon.badge', { percent: discountPercent })}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--star, #f59e0b)' }}>
          {reviewCnt > 0 ? (
            <>★★★★★ {ratingVal.toFixed(1)} ({reviewCnt} {t('product.verifiedReviews')})</>
          ) : (
            <span style={{ color: 'var(--muted)' }}>{t('product.noReviewsYet')}</span>
          )}
        </span>
      </div>
      
      <p>{product.description}</p>

      {/* Real product size options */}
      {availableSizes.length > 0 && (
        <div className={`option-group ${sizeError ? styles.sizeGroupError : ''}`}>
          <div className="option-title">
            {t('product.size')}: {selectedSize ? <strong>{selectedSize}</strong> : <span className={styles.unselectedText}>({t('product.selectSizePrompt')})</span>}
          </div>
          <SegmentedControl
            options={availableSizes.map((size) => ({ label: size, value: size }))}
            selected={selectedSize}
            onChange={handleSizeSelect}
          />
          {sizeError && (
            <p className={styles.sizeErrorText}>
              ⚠️ {t('product.selectSizeWarning')}
            </p>
          )}
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
