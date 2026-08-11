import { useState } from 'react';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './AIPromptPanel.module.css';

export default function AIPromptPanel() {
  const [reveal, setReveal] = useState(54);

  return (
    <section className={`section-pad split-section ${styles.root}`}>
      <div className="ai-panel">
        <Eyebrow>AI designed collection</Eyebrow>
        <h2>Prompt your next piece into existence.</h2>
        <p>
          Generate several design directions, preview them on real garments, and receive smart
          color, placement, and embroidery guidance.
        </p>
        <div className="prompt-card">
          <span>"Minimal luxury embroidery for a black hoodie"</span>
          <Button to="/studio">Generate</Button>
        </div>
      </div>
      <div className="before-after before-after-slider" style={{ '--reveal': `${reveal}%` }}>
        <img src="https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=800&q=85" alt="Plain black hoodie" />
        <div className="after-reveal">
          <img src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=85" alt="Customized black fashion hoodie" />
        </div>
        <span className="before-label">Original</span>
        <span className="after-label">Customized</span>
        <input
          type="range"
          min="18"
          max="82"
          value={reveal}
          aria-label="Compare original and customized clothing"
          onChange={(event) => setReveal(event.target.value)}
        />
      </div>
    </section>
  );
}
