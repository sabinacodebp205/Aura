import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={`hero home-slider ${styles.root}`}>
      <div className="hero-media">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85"
          alt="Fashion model wearing a premium streetwear outfit"
        />
      </div>
      <div className="hero-content">
        <Eyebrow>AURA AI FASHION CUSTOMIZATION</Eyebrow>
        <h1>Design it. Make it yours.</h1>
        <p>
          Shop premium apparel, or customize any piece with live AI graphics, 
          embroidery, and personal fashion styling.
        </p>
        <div className="hero-actions">
          <Button to="/studio">Customize with AI</Button>
          <Button to="/inspiration" variant="light">Fashion Inspiration</Button>
        </div>
      </div>
    </section>
  );
}
