import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import styles from './SocialRow.module.css';

export default function SocialRow({ likes, comments }) {
  const { t } = useTranslation();

  return (
    <div className={styles['social-row']}>
      <button type="button">♡ {likes}</button>
      <button type="button">{t('social.save')}</button>
      <button type="button">Comments {comments}</button>
      <Button to="/product/studio-oversized-hoodie">{t('social.buyDesign')}</Button>
    </div>
  );
}
