import { useEffect, useState } from 'react';
import Brand from '../../components/atoms/Brand/Brand';
import SearchBar from '../../components/molecules/SearchBar/SearchBar';
import CategoryStrip from '../../components/molecules/CategoryStrip/CategoryStrip';
import SectionHeading from '../../components/molecules/SectionHeading/SectionHeading';
import HeroBanner from '../../components/organisms/HeroBanner/HeroBanner';
import EditorialGrid from '../../components/organisms/EditorialGrid/EditorialGrid';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import AIPromptPanel from '../../components/organisms/AIPromptPanel/AIPromptPanel';
import { getAllProducts } from '../../api/productService';
import { newArrivals } from '../../data/products';
import styles from './HomePage.module.css';

const categories = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'tees', label: 'T-Shirts' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'skirts', label: 'Skirts' },
  { id: 'pants', label: 'Pants' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'accessories', label: 'Accessories' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllProducts()
      .then((data) => { if (!cancelled) setProducts(data); })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className={`home-command ${styles.command}`} aria-label="AURA shopping search">
        <div className="home-brandline">
          <Brand />
          <div>
            <p className="eyebrow">AI fashion customization</p>
            <h1>AURA</h1>
          </div>
        </div>
        <SearchBar placeholder="Search hoodies, dresses, embroidery ideas..." />
        <CategoryStrip categories={categories} activeCategory="women" />
      </section>
      <HeroBanner />
      <EditorialGrid />
      <section className="section-pad">
        <SectionHeading eyebrow="Trending this week" title="Fashion first, customization ready" linkText="View inspiration" linkTo="/inspiration" />
        {loading ? <p className="loading-text">Loading products…</p> : <ProductGrid products={products} />}
      </section>
      <AIPromptPanel />
      <section className="section-pad">
        <SectionHeading eyebrow="Women first assortment" title="New arrivals" linkText="Open product page" linkTo={products[0] ? `/product/${products[0].id}` : '/product'} />
        <div className="collection-grid">
          <article className="collection-card tall">
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85" alt="Woman wearing a jacket" />
            <div>
              <h3>Outfit inspiration</h3>
              <p>Layered city looks ready for custom patches.</p>
            </div>
          </article>
          {newArrivals.map((item) => (
            <article className="mini-product" key={item.id}>
              <img src={item.image} alt={item.alt} />
              <h3>{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
