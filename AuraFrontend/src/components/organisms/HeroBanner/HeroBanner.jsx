import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className={`hero home-slider ${styles.root}`}>
      <div className="hero-media">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
          alt="Fashion model wearing a premium streetwear outfit"
        />
      </div>
      <div className="hero-content">
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.subtitle')}</p>
        <div className="hero-actions">
          <Button to="/product/studio-oversized-hoodie">{t('hero.exploreCollection')}</Button>
          <Button to="/inspiration" variant="light">{t('hero.fashionInspiration')}</Button>
        </div>
      </div>
    </section>
  );
}
