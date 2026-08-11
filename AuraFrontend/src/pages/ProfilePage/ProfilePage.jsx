import ProfileHero from '../../components/organisms/ProfileHero/ProfileHero';
import ProfileGrid from '../../components/organisms/ProfileGrid/ProfileGrid';
import { profile } from '../../data/profile';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  return (
    <main className={`page-shell ${styles.root}`}>
      <ProfileHero profile={profile} />
      <ProfileGrid cards={profile.cards} />
    </main>
  );
}
