import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import FavoriteButton from '../../molecules/FavoriteButton/FavoriteButton';
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl';
import ColorSwatchGroup from '../../molecules/ColorSwatchGroup/ColorSwatchGroup';
import SmartNote from '../../molecules/SmartNote/SmartNote';
import { useCart } from '../../../context/CartContext';
import styles from './ProductInfoPanel.module.css';

export default function ProductInfoPanel({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
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
      detail: `${product.color || 'Default'} - Size ${product.size || 'M'} - AI customization`,
      quantity: 1,
      unitPrice: product.price,
      fees: [{ label: 'Design fee', amount: 5 }],
      image: product.imageUrls?.[0] || product.image,
      alt: product.name,
    });
    setIsAdded(true);
  };

  const handleCustomizeDesign = () => {
    navigate(`/studio?productId=${product.id}`, { state: { productId: product.id } });
  };

  const ratingVal = product.averageRating || product.rating || 0;
  const reviewCnt = product.reviewCount ?? product.reviews ?? 0;

  return (
    <div className={`product-info ${styles.root}`}>
      <FavoriteButton productId={product.id} className={styles.favorite} />
      <Eyebrow>{product.categoryName || 'AURA Custom'}</Eyebrow>
      <h1>{product.name}</h1>
      <div className="price-line">
        <strong>${product.price ? product.price.toFixed(2) : '0.00'}</strong>
        <span style={{ color: 'var(--star, #f59e0b)' }}>
          {reviewCnt > 0 ? (
            <>★★★★★ {ratingVal.toFixed(1)} ({reviewCnt} verified review{reviewCnt > 1 ? 's' : ''})</>
          ) : (
            <span style={{ color: 'var(--muted)' }}>No reviews yet</span>
          )}
        </span>
      </div>
      <p>{product.description}</p>

      {product.size && (
        <div className="option-group">
          <div className="option-title">Size</div>
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
          <div className="option-title">Color: <strong>{product.color}</strong></div>
          <ColorSwatchGroup colors={[product.color.toLowerCase(), 'black', 'white', 'grey']} />
        </div>
      )}

      {product.isCustomizable && (
        <SmartNote
          title="AI Fashion Customization Enabled"
          description="You can customize colors, graphics, patterns, and embroidery using AURA AI Studio."
        />
      )}

      <div className="button-row">
        <Button onClick={handleAddToCart}>{isAdded ? 'Added to Cart' : 'Add to Cart'}</Button>
        {product.isCustomizable && (
          <Button onClick={handleCustomizeDesign} variant="light">Customize with AI</Button>
        )}
      </div>
    </div>
  );
}
