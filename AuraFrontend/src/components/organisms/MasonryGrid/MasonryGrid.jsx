import InspoCard from '../InspoCard/InspoCard';
import styles from './MasonryGrid.module.css';

export default function MasonryGrid({ items }) {
  return (
    <section className={`masonry-grid ${styles.root}`}>
      {items.map((item) => (
        <InspoCard key={item.id} item={item} />
      ))}
    </section>
  );
}
