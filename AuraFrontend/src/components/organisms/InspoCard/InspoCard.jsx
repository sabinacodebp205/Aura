import styles from './InspoCard.module.css';

export default function InspoCard({ item }) {
  const className = ['inspo-card', item.size, styles.root].filter(Boolean).join(' ');

  return (
    <article className={className}>
      <img src={item.image} alt={item.alt} />
      <div>
        <h2>{item.title}</h2>
        <p>{item.action}</p>
      </div>
    </article>
  );
}
