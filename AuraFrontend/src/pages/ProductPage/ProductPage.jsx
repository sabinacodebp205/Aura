import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SectionHeading from '../../components/molecules/SectionHeading/SectionHeading';
import ProductGallery from '../../components/organisms/ProductGallery/ProductGallery';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import ProductInfoPanel from '../../components/organisms/ProductInfoPanel/ProductInfoPanel';
import ReviewsGrid from '../../components/organisms/ReviewsGrid/ReviewsGrid';
import { getProductById, getAllProducts } from '../../api/productService';
import styles from './ProductPage.module.css';

export default function ProductPage() {
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
      .then((data) => { if (!cancelled) setProduct(data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    getAllProducts()
      .then((all) => {
        if (!cancelled) setRelated(all.filter((p) => p.id !== id).slice(0, 2));
      })
      .catch(() => { });

    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <main className={`page-shell product-page ${styles.root}`}><p className="loading-text">Loading product…</p></main>;
  if (error) return <main className={`page-shell product-page ${styles.root}`}><p className="error-text">Failed to load product.</p></main>;
  if (!product) return <main className={`page-shell product-page ${styles.root}`}><p>Product not found.</p></main>;

  return (
    <main className={`page-shell product-page ${styles.root}`}>
      <section className="product-detail">
        <ProductGallery product={product} />
        <ProductInfoPanel product={product} />
      </section>
      <section className="section-pad product-richness">
        <article>
          <p className="eyebrow">Model view</p>
          <h2>Styled with cargo pants and matte sneakers</h2>
          <p>Switch between flat product, model view, and front/back previews in the studio.</p>
        </article>
        <article>
          <p className="eyebrow">Fabric close-up</p>
          <h2>Soft brushed fleece, 420 GSM</h2>
          <p>Dense enough for embroidery and crisp print edges without distortion.</p>
        </article>
        <article>
          <p className="eyebrow">Frequently bought together</p>
          <h2>Canvas tote + metallic thread pack</h2>
          <p>Add matching accessories before checkout for a complete custom set.</p>
        </article>
      </section>
      <ReviewsGrid />
      <section className="section-pad">
        <SectionHeading eyebrow="Related products" title="More design-ready pieces" />
        <ProductGrid products={related} />
      </section>
    </main>
  );
}

