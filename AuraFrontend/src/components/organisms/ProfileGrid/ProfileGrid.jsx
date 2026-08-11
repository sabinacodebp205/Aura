import ProfileCard from '../ProfileCard/ProfileCard';
import styles from './ProfileGrid.module.css';

export default function ProfileGrid({ cards }) {
  return (
    <section className={`profile-grid ${styles.root}`}>
      {cards.map(([number, title, body]) => (
        <ProfileCard key={number} number={number} title={title} body={body} dark={title === 'Logout'} />
      ))}
    </section>
  );
}
