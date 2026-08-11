import styles from './ProfileCard.module.css';

export default function ProfileCard({ number, title, body, dark }) {
  return (
    <article className={`profile-card ${dark ? 'logout-card' : ''} ${styles.root}`}>
      <span>{number}</span>
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}
