import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './ProfileHero.module.css';

export default function ProfileHero({ profile }) {
  const { t } = useTranslation();
  return (
    <section className={`profile-hero ${styles.root}`}>
      <img src={profile.avatar} alt="Profile portrait" />
      <div>
        <Eyebrow>{t('profile.headerTitle', 'AURA Member')}</Eyebrow>
        <h1>{profile.name}</h1>
        <p>{profile.email}</p>
      </div>
      <Button>{t('profile.editProfile', 'Edit Profile')}</Button>
    </section>
  );
}
