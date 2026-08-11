import SearchBar from '../../components/molecules/SearchBar/SearchBar';
import MasonryGrid from '../../components/organisms/MasonryGrid/MasonryGrid';
import { inspoItems } from '../../data/inspoItems';
import styles from './InspirationPage.module.css';

export default function InspirationPage() {
  return (
    <main className={`page-shell ${styles.root}`}>
      <section className="inspiration-hero">
        <div>
          <p className="eyebrow">Pinterest for clothing ideas</p>
          <h1>Inspiration Gallery</h1>
          <p>Save any idea, edit it with AI, or apply it directly to a product.</p>
        </div>
        <SearchBar className="compact-search" placeholder="Search cyberpunk, floral, streetwear..." />
      </section>
      <MasonryGrid items={inspoItems} />
    </main>
  );
}
