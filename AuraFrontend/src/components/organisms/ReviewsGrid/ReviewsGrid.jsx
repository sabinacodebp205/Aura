import SectionHeading from '../../molecules/SectionHeading/SectionHeading';
import ReviewCard from '../ReviewCard/ReviewCard';
import styles from './ReviewsGrid.module.css';

const reviews = [
  {
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=85',
    alt: 'Customer wearing customized outfit',
    title: '"The embroidery looks boutique-level."',
    body: 'AI suggested gold thread on black, and it was exactly right.',
  },
  {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=85',
    alt: 'Customer in streetwear outfit',
    title: '"Feels like designing in Canva."',
    body: 'I placed my artwork, removed the background, and previewed the back in minutes.',
  },
];

export default function ReviewsGrid() {
  return (
    <section className={`section-pad reviews-grid ${styles.root}`}>
      <SectionHeading eyebrow="Customer photos" title="Verified reviews" />
      {reviews.map((review) => (
        <ReviewCard key={review.title} {...review} />
      ))}
    </section>
  );
}
