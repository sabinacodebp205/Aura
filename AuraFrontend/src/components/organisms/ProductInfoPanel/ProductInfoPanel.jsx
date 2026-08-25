import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import FavoriteButton from '../../molecules/FavoriteButton/FavoriteButton';
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl';
import styles from './ProductInfoPanel.module.css';

export function ProductBasicInfo({ product }) {
  const { t } = useTranslation();
  
  const ratingVal = product.averageRating || product.rating || 0;
  const reviewCnt = product.reviewCount ?? product.reviews ?? 0;
  const originalPrice = product.originalPrice || product.price || 0;
  const hasDiscount = product.hasDiscount || false;
  const discountPercent = product.discountPercent || 0;
  const discountedPrice = product.price || 0;

  return (
    <div className={styles.basicInfo}>
      <Eyebrow>{product.categoryName || t('product.collection')}</Eyebrow>
      <h1 className={styles.title}>{product.name}</h1>
      
      <div className={styles.priceRow}>
        <strong>${discountedPrice.toFixed(2)}</strong>
        {hasDiscount && <del className={styles.originalPrice}>${originalPrice.toFixed(2)}</del>}
      </div>

      <div className={styles.ratingRow}>
        <span className={styles.stars}>★★★★★</span>
        <span className={styles.ratingVal}>{ratingVal.toFixed(1)}</span>
        <span className={styles.reviewCnt}>({reviewCnt} {t('product.verifiedReviews')})</span>
      </div>

      <div className={styles.stockStatus}>
        <span className={styles.stockDot}></span> Stokda var
      </div>

      <p className={styles.shortDesc}>{product.description}</p>

      <div className={styles.specsList}>
        <div className={styles.specItem}>
          <span className={styles.specIcon}>🎨</span>
          <span className={styles.specLabel}>{t('productInfo.color')}</span>
          <span className={styles.specValue}>{product.color || 'Standart'}</span>
        </div>
        <div className={styles.specItem}>
          <span className={styles.specIcon}>📏</span>
          <span className={styles.specLabel}>{t('productInfo.size')}</span>
          <span className={styles.specValue}>{t('productInfo.select')}</span>
        </div>
        <div className={styles.specItem}>
          <span className={styles.specIcon}>🏷️</span>
          <span className={styles.specLabel}>{t('productInfo.category')}</span>
          <span className={styles.specValue}>{product.categoryName || 'T-shirt'}</span>
        </div>
      </div>
    </div>
  );
}

export function ProductSizeSelector({ availableSizes, selectedSize, onSelectSize, sizeError }) {
  const { t } = useTranslation();
  
  if (availableSizes.length === 0) return null;

  return (
    <div className={`${styles.sizeCard} ${sizeError ? styles.sizeError : ''}`}>
      <div className={styles.sizeHeader}>
        <h3>{t('productInfo.chooseSize')}</h3>
        <button className={styles.sizeGuideBtn}>{t('productInfo.sizeGuide')}</button>
      </div>
      <SegmentedControl
        options={availableSizes.map((size) => ({ label: size, value: size }))}
        selected={selectedSize}
        onChange={onSelectSize}
      />
      {sizeError && (
        <p className={styles.sizeErrorText}>
          ⚠️ {t('product.selectSizeWarning')}
        </p>
      )}
    </div>
  );
}

export function ProductDetailsGrid({ product }) {
  return (
    <div className={styles.detailsGrid}>
      <div className={styles.aboutCol}>
        <h3>{t('productInfo.about')}</h3>
        <p>{product.description}</p>
      </div>
      <div className={styles.featuresCol}>
        <h3>{t('productInfo.features')}</h3>
        <ul className={styles.featuresList}>
          <li><span className={styles.check}>✔</span> Yumşaq və rahat parça</li>
          <li><span className={styles.check}>✔</span> Gündəlik istifadə üçün ideal</li>
          <li><span className={styles.check}>✔</span> Minimal və modern dizayn</li>
          <li><span className={styles.check}>✔</span> Başqa rənglərdə mövcuddur</li>
        </ul>
      </div>
    </div>
  );
}

export function ProductCartBar({ product, isAdded, onAddToCart }) {
  const { t } = useTranslation();
  const discountedPrice = product.price || 0;

  return (
    <div className={styles.fixedCartBar}>
      <div className={styles.cartPrice}>${discountedPrice.toFixed(2)}</div>
      <Button onClick={onAddToCart} className={styles.cartBtn}>
        {isAdded ? t('product.addedToCart') : 'Səbətə əlavə et'}
      </Button>
    </div>
  );
}

// Keep the default export so other parts of the app don't break until we update ProductPage.jsx
export default function ProductInfoPanel({ product }) {
  return null;
}
