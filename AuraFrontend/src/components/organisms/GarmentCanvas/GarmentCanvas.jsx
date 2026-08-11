import { useEffect, useState } from 'react';
import Button from '../../atoms/Button/Button';
import { garments } from '../../../data/garments';
import { useCart } from '../../../context/CartContext';
import styles from './GarmentCanvas.module.css';

export default function GarmentCanvas({ design }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) return undefined;
    const timer = window.setTimeout(() => setIsAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [isAdded]);

  const handleAddToCart = () => {
    addItem({
      productId: `studio-${design.garment}`,
      name: 'Custom Studio Garment',
      detail: `${design.previewText} - ${design.mode} - ${design.garment}`,
      quantity: 1,
      unitPrice: 124,
      fees: [
        { label: 'Design fee', amount: 5 },
        ...(design.mode === 'embroidery' ? [{ label: 'Embroidery fee', amount: 10 }] : []),
      ],
      image: 'https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=500&q=85',
      alt: 'Custom studio garment',
    });
    setIsAdded(true);
  };

  return (
    <section className={`canvas-area ${styles.root}`} aria-label="Clothing preview">
      <div className="studio-topline">
        <div className="segmented">
          {['Front', 'Back', 'Model', '3D'].map((view) => (
            <button key={view} className={view === 'Front' ? 'active' : ''} type="button">{view}</button>
          ))}
        </div>
        <div className="button-row compact">
          <Button variant="light">Save</Button>
          <Button onClick={handleAddToCart}>{isAdded ? 'Added' : 'Add to Cart'}</Button>
        </div>
      </div>

      <div className="garment-picker" aria-label="Virtual clothing preview">
        {garments.map((garment) => (
          <button
            key={garment.id}
            className={design.garment === garment.id ? 'active' : ''}
            type="button"
            onClick={() => design.setGarment(garment.id)}
          >
            {garment.label}
          </button>
        ))}
      </div>

      <div className="garment-stage">
        <div className="garment-preview" data-garment={design.garment}>
          <div className="hoodie-shape">
            <div className="hood"></div>
            <div className="sleeve sleeve-left"></div>
            <div className="sleeve sleeve-right"></div>
            <div className={`design-layer ${design.mode === 'print' ? 'is-print' : ''}`} style={{ color: design.color, transform: design.transform }}>
              <span className="design-icon">✦</span>
              <strong>{design.previewText}</strong>
              <small>{design.mode === 'print' ? 'print concept' : 'embroidered concept'}</small>
            </div>
            <div className="body-shape"></div>
          </div>
        </div>
        <div className="layers-panel">
          <p className="eyebrow">Layers</p>
          <button className="layer-row active" type="button"><span></span>Text layer</button>
          <button className="layer-row" type="button"><span></span>AI artwork</button>
          <button className="layer-row" type="button"><span></span>Garment base</button>
        </div>
      </div>
    </section>
  );
}
