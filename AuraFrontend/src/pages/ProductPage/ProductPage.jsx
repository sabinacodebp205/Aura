import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../../components/molecules/SectionHeading/SectionHeading';
import ProductGallery from '../../components/organisms/ProductGallery/ProductGallery';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import ProductInfoPanel from '../../components/organisms/ProductInfoPanel/ProductInfoPanel';
import ReviewsGrid from '../../components/organisms/ReviewsGrid/ReviewsGrid';
import RecentlyViewedSection from '../../components/organisms/RecentlyViewedSection/RecentlyViewedSection';
import { getProductById, getAllProducts } from '../../api/productService';
import { addRecentlyViewed } from '../../utils/recentlyViewed';
import styles from './ProductPage.module.css';

export default function ProductPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          if (data) {
            addRecentlyViewed(data);
          }
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
    <main className={`page-shell product-page ${styles.root}`}>
      <section className="product-detail">
        <ProductGallery product={product} />
        <ProductInfoPanel product={product} />
      </section>
      <section className="section-pad product-richness">
        <article>
          <p className="eyebrow">{t('product.modelViewEyebrow')}</p>
          <h2>{t('product.modelViewTitle')}</h2>
          <p>{t('product.modelViewDesc')}</p>
        </article>
        <article>
          <p className="eyebrow">{t('product.fabricEyebrow')}</p>
          <h2>{t('product.fabricTitle')}</h2>
          <p>{t('product.fabricDesc')}</p>
        </article>
        <article>
          <p className="eyebrow">{t('product.fbtEyebrow')}</p>
          <h2>{t('product.fbtTitle')}</h2>
          <p>{t('product.fbtDesc')}</p>
        </article>
      </section>
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
    </main>
  );
}
