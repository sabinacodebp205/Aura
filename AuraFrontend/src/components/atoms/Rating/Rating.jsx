import styles from './Rating.module.css';

export default function Rating({ score, reviews }) {
  if (score == null || typeof score !== 'number') {
    return <div className={styles.rating}><span>No ratings yet</span></div>;
  }

  const fullStars = Math.round(score);
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  
  return (
    <div className={styles.rating}>
      {stars} <span>{score.toFixed(1)}{reviews ? ` · ${reviews} verified reviews` : ''}</span>
    </div>
  );
}
