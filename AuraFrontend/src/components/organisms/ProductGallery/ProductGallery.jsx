import styles from './ProductGallery.module.css';

export default function ProductGallery({ product }) {
  return (
    <div className={`gallery ${styles.root}`}>
      <img className="gallery-main" src={product.images[0]} alt={product.alt} />
      <div className="thumb-row">
        {product.images.map((image, index) => (
          <img key={image} src={image} alt={`${product.name} view ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}
