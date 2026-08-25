import styles from './Rating.module.css';

export default function Rating({ score, reviews }) {
  const validScore = typeof score === 'number' ? score : parseFloat(score) || 0;

  const fullStars = Math.round(validScore);
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  
  return (
    <div className={styles.rating}>
      {stars} <span>{validScore.toFixed(1)}{reviews ? ` · ${reviews} verified reviews` : ''}</span>
    </div>
  );
}
