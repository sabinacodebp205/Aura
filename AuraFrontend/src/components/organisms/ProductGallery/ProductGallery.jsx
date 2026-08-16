import { useState } from 'react';
import { getImageUrl, handleImageError } from '../../../utils/imageUrl';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ product }) {
  const rawImages = product?.images && product.images.length > 0 ? product.images : [];
  const images = rawImages.map(getImageUrl).filter(Boolean);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = images[selectedIndex] || images[0] || null;

  return (
    <div className={`gallery ${styles.root}`}>
      <div className={styles['main-wrapper']}>
        {activeImage ? (
          <img
            className={styles['gallery-main']}
            src={activeImage}
            alt={product?.alt || product?.name || 'Product'}
            onError={handleImageError}
          />
        ) : (
          <div className={styles['gallery-placeholder']} aria-label="No image available" />
        )}
      </div>
      {images.length > 1 && (
        <div className={styles['thumb-row']}>
          {images.map((image, index) => (
            <button
              key={`${image.substring(0, 30)}-${index}`}
              type="button"
              className={`${styles['thumb-btn']} ${index === selectedIndex ? styles.active : ''}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${product?.name || 'Product'} thumbnail ${index + 1}`}
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
