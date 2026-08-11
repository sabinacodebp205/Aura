import { useState } from 'react';
import styles from './ProductGallery.module.css';

export default function ProductGallery({ product }) {
  const images = product?.images && product.images.length > 0 ? product.images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = images[selectedIndex] || images[0] || '';

  return (
    <div className={`gallery ${styles.root}`}>
      <div className={styles['main-wrapper']}>
        <img className={styles['gallery-main']} src={activeImage} alt={product.alt || product.name} />
      </div>
      {images.length > 1 && (
        <div className={styles['thumb-row']}>
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              className={`${styles['thumb-btn']} ${index === selectedIndex ? styles.active : ''}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
