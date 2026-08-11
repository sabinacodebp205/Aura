import styles from './ReviewCard.module.css';

export default function ReviewCard({ image, alt, title, body }) {
  return (
    <article className={`review-card ${styles.root}`}>
      <img src={image} alt={alt} />
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}
