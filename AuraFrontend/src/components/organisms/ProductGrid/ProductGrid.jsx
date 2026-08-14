import ProductCard from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products }) {
  if (!products || !Array.isArray(products)) return null;

  return (
    <div className={styles['product-grid']}>
      {products.map((product, index) => (
        <ProductCard key={product.id || `product-${index}`} product={product} />
      ))}
    </div>
  );
}
