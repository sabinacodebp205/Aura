import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../../components/molecules/SectionHeading/SectionHeading';
import ProductGallery from '../../components/organisms/ProductGallery/ProductGallery';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import { ProductBasicInfo, ProductSizeSelector, ProductDetailsGrid, ProductCartBar } from '../../components/organisms/ProductInfoPanel/ProductInfoPanel';
import ReviewsGrid from '../../components/organisms/ReviewsGrid/ReviewsGrid';
import RecentlyViewedSection from '../../components/organisms/RecentlyViewedSection/RecentlyViewedSection';
import { getProductById, getAllProducts } from '../../api/productService';
import { addRecentlyViewed } from '../../utils/recentlyViewed';
import { useCart } from '../../context/CartContext';
import styles from './ProductPage.module.css';

export default function ProductPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lifted state from ProductInfoPanel
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const availableSizes = useMemo(() => {
    if (!product) return [];
    const raw = product.availableSizes || product.sizes || product.size;
    if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
    if (typeof raw === 'string' && raw.trim()) {
      return raw.split(/[,/]/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [product]);

  const [selectedSize, setSelectedSize] = useState(() => (
    availableSizes.length === 1 ? availableSizes[0] : ''
  ));

  useEffect(() => {
    if (availableSizes.length === 1) setSelectedSize(availableSizes[0]);
    else setSelectedSize('');
    setSizeError(false);
  }, [availableSizes]);

  useEffect(() => {
    if (!isAdded) return;
    const timer = window.setTimeout(() => setIsAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [isAdded]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (sizeError) setSizeError(false);
  };

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    const finalSize = selectedSize || product.size || 'Standard';
    const finalColor = product.color || 'Standard';
    const unitPrice = product.price || 0;

    addItem({
      productId: product.id,
      name: product.name,
      size: finalSize,
      color: finalColor,
      detail: `${finalColor} • Size: ${finalSize}`,
      quantity: 1,
      unitPrice: unitPrice,
      originalPrice: product.originalPrice || product.price,
      image: product.imageUrls?.[0] || product.image,
      alt: product.name,
    });
    setIsAdded(true);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          if (data) addRecentlyViewed(data);
        }
      })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    getAllProducts()
      .then((all) => {
        if (!cancelled) setRelated(all.filter((p) => p.id !== id).slice(0, 2));
      })
      .catch(() => { });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <main className={`page-shell product-page ${styles.root}`}><p className="loading-text">{t('product.loading')}</p></main>;
  if (error) return <main className={`page-shell product-page ${styles.root}`}><p className="error-text">{t('product.error')}</p></main>;
  if (!product) return <main className={`page-shell product-page ${styles.root}`}><p>{t('product.notFound')}</p></main>;

  return (
    <main className={`product-page-root ${styles.root}`}>
      <section className={styles.productLayout}>
        <div className={styles.galleryArea}>
          <ProductGallery product={product} />
        </div>
        
        <div className={styles.infoArea}>
          <ProductBasicInfo product={product} />
        </div>

        <div className={styles.sizeArea}>
          <ProductSizeSelector 
            availableSizes={availableSizes}
            selectedSize={selectedSize}
            onSelectSize={handleSizeSelect}
            sizeError={sizeError}
          />
        </div>

        <div className={styles.detailsArea}>
          <ProductDetailsGrid product={product} />
        </div>

        <div className={styles.cartArea}>
          <ProductCartBar 
            product={product} 
            isAdded={isAdded} 
            onAddToCart={handleAddToCart} 
          />
        </div>
      </section>

      <div className="page-shell" style={{paddingTop: 0}}>
        <ReviewsGrid
          productId={product.id}
          onReviewAdded={() => {
            getProductById(id).then(setProduct).catch(() => {});
          }}
        />
        <section className="section-pad">
          <SectionHeading eyebrow={t('product.relatedEyebrow')} title={t('product.relatedTitle')} />
          <ProductGrid products={related} />
        </section>
        <RecentlyViewedSection currentProductId={product.id} />
      </div>
    </main>
  );
}
