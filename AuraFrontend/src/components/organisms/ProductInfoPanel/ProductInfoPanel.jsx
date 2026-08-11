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
      detail: 'Black - Size M - AI customization',
      quantity: 1,
      unitPrice: product.price,
      fees: [{ label: 'Design fee', amount: 5 }],
      image: product.images?.[0] || product.image,
      alt: product.alt,
    });
    setIsAdded(true);
  };

  const handleCustomizeDesign = () => {
    navigate(`/studio?productId=${product.id}`, { state: { productId: product.id } });
  };

  return (
    <div className={`product-info ${styles.root}`}>
      <FavoriteButton productId={product.id} className={styles.favorite} />
      <Eyebrow>360 preview ready</Eyebrow>
      <h1>{product.name}</h1>
      <div className="price-line">
        <strong>${product.price.toFixed(2)}</strong>
        <span>★★★★★ {product.rating} - {product.reviews} verified reviews</span>
      </div>
      <p>{product.description}</p>

      <div className="option-group">
        <div className="option-title">Size</div>
        <SegmentedControl
          options={['XS', 'S', 'M', 'L', 'XL'].map((size) => ({ label: size, value: size }))}
          selected="M"
          onChange={() => {}}
        />
      </div>

      <div className="option-group">
        <div className="option-title">Color</div>
        <ColorSwatchGroup colors={['black', 'white', 'grey', 'blush']} />
      </div>

      <SmartNote
        title="AI size recommendation"
        description="Based on your profile, M gives a relaxed streetwear fit."
      />

      <div className="button-row">
        <Button onClick={handleAddToCart}>{isAdded ? 'Added' : 'Add to Cart'}</Button>
        <Button onClick={handleCustomizeDesign} variant="light">Customize Design (+$5)</Button>
      </div>
    </div>
  );
}
