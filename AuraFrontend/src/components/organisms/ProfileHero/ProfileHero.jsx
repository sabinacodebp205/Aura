import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './ProfileHero.module.css';

export default function ProfileHero({ profile }) {
  return (
    <section className={`profile-hero ${styles.root}`}>
      <img src={profile.avatar} alt="Profile portrait" />
      <div>
        <Eyebrow>AURA member</Eyebrow>
        <h1>{profile.name}</h1>
        <p>{profile.email}</p>
      </div>
      <Button>Edit Profile</Button>
    </section>
  );
}
