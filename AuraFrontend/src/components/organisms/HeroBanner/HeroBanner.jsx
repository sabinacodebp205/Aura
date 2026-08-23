import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  const { t } = useTranslation();
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const slideWidth = container.clientWidth;
      container.scrollTo({ left: container.scrollLeft - slideWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const slideWidth = container.clientWidth;
      container.scrollTo({ left: container.scrollLeft + slideWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.sliderContainer} ref={sliderRef}>
        <section className={`hero home-slider ${styles.slide}`}>
          <div className="hero-media">
            <img
              src="/hero-bg.png"
              alt="Fashion model wearing a premium streetwear outfit"
            />
          </div>
          <div className="hero-content">
            <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
            <h1>{t('hero.title')}</h1>
            <p>{t('hero.subtitle')}</p>
            <div className="hero-actions">
              <Button to="/inspiration" variant="light">{t('hero.fashionInspiration')}</Button>
            </div>
          </div>
        </section>

        <section className={`hero home-slider ${styles.slide}`}>
          <div className="hero-media">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=85"
              alt="Discounts and special offers"
            />
          </div>
          <div className="hero-content">
            <Eyebrow>{t('hero.discountEyebrow', 'XÜSUSİ TƏKLİFLƏR')}</Eyebrow>
            <h1>{t('hero.discountTitle', 'Seçilmiş modellərdə endirimlər')}</h1>
            <p>{t('hero.discountSubtitle', 'Yalnız məhdud müddətə. Sevimli Aura parçalarınızı xüsusi qiymətə əldə edin.')}</p>
            <div className="hero-actions">
              <Button to="/inspiration" variant="light">{t('hero.viewDiscounts', 'Endirimləri kəşf et')}</Button>
            </div>
          </div>
        </section>
      </div>
      <button className={`${styles.navButton} ${styles.navLeft}`} onClick={scrollLeft} aria-label="Previous slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button className={`${styles.navButton} ${styles.navRight}`} onClick={scrollRight} aria-label="Next slide">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
