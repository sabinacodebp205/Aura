import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import Brand from '../../components/atoms/Brand/Brand';
import SearchBar from '../../components/molecules/SearchBar/SearchBar';
import CategoryFilterBar from '../../components/molecules/CategoryFilterBar/CategoryFilterBar';
import SectionHeading from '../../components/molecules/SectionHeading/SectionHeading';
import HeroBanner from '../../components/organisms/HeroBanner/HeroBanner';
import ProductGrid from '../../components/organisms/ProductGrid/ProductGrid';
import AIPromptPanel from '../../components/organisms/AIPromptPanel/AIPromptPanel';
import { getAllProducts } from '../../api/productService';
import { getAllCategories } from '../../api/categoryService';
import { newArrivals } from '../../data/products';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    let cancelled = false;

    Promise.all([getAllProducts(), getAllCategories()])
      .then(([productsData, categoriesData]) => {
        if (!cancelled) {
          setProducts(productsData || []);
          setCategories(categoriesData || []);
        }
      })
      .catch((err) => console.error('Failed to load initial data:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (val) {
      nextParams.set('search', val);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory.toLowerCase() === 'all' ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (product.categoryName && product.categoryName.toLowerCase() === selectedCategory.toLowerCase());

    const trimmedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !trimmedQuery ||
      product.name?.toLowerCase().includes(trimmedQuery) ||
      product.description?.toLowerCase().includes(trimmedQuery) ||
      (product.category && product.category.toLowerCase().includes(trimmedQuery));

    return matchesCategory && matchesSearch;
  });

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
        <SearchBar
          placeholder="Search hoodies, dresses, embroidery ideas..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </section>
      <HeroBanner />
      <section className={`section-pad ${styles['tight-section']}`}>
        <SectionHeading eyebrow="Trending this week" title="Fashion first, customization ready" linkText="View inspiration" linkTo="/inspiration" />
        <CategoryFilterBar
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {loading ? (
          <p className="loading-text">Loading products…</p>
        ) : filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className={styles['empty-state']}>
            <h3>No products found</h3>
            <p>Try adjusting your search terms or selecting a different category.</p>
          </div>
        )}
      </section>
      <AIPromptPanel />
      <section className="section-pad">
        <SectionHeading eyebrow="Customize blank silhouettes" title="BASIC, YOUR WAY" linkText="Open AI Studio" linkTo="/ai-studio" />
        <div className="collection-grid">
          <article className="collection-card tall">
            <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85" alt="Woman wearing a jacket" />
            <div>
              <h3>AI Customization Platform</h3>
              <p>Turn any blank canvas piece into an architectural statement design.</p>
            </div>
          </article>
          {newArrivals.map((item) => {
            const garmentType = item.name.toLowerCase().includes('hoodie') ? 'hoodie' : 'tshirt';
            return (
              <article className="mini-product" key={item.id}>
                <img src={item.image} alt={item.alt} />
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
                <Link
                  to={`/ai-studio?mode=generator&garmentType=${garmentType}&color=black`}
                  style={{
                    display: 'inline-block',
                    marginTop: 8,
                    padding: '6px 14px',
                    background: '#111111',
                    color: '#ffffff',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  DESIGN THIS →
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

