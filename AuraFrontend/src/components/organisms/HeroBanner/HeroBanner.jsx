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
        <Eyebrow>New collection</Eyebrow>
        <h1>Architectural Customwear</h1>
        <p>
          Shop premium silhouettes, then turn them into personal pieces with AI prints,
          embroidery, and live clothing previews.
        </p>
        <div className="hero-actions">
          <Button to="/studio">Start Designing</Button>
          <Button to="/inspiration" variant="light">Explore Ideas</Button>
        </div>
      </div>
    </section>
  );
}
