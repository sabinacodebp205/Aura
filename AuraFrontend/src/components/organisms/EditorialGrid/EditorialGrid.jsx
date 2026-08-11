import { Link } from 'react-router-dom';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './EditorialGrid.module.css';

export default function EditorialGrid() {
  return (
    <section className={`editorial-grid section-pad ${styles.root}`}>
      <article className="story-card story-main">
        <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85" alt="Editorial model in a white custom dress" />
        <div>
          <Eyebrow>New collection</Eyebrow>
          <h2>The Architectural Edit</h2>
          <p>Clean lines, sharp tailoring, and AI-generated garment artwork.</p>
          <Link className="text-link" to="/product/studio-oversized-hoodie">Shop the drop</Link>
        </div>
      </article>
      <article className="story-card">
        <img src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=900&q=85" alt="Close-up of embroidery work on clothing" />
        <div>
          <Eyebrow>Custom lab</Eyebrow>
          <h3>Gold thread studio</h3>
          <p>Embroidery concepts with realistic stitch previews.</p>
        </div>
      </article>
      <article className="story-card dark-story">
        <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85" alt="Model wearing black streetwear" />
        <div>
          <Eyebrow>Limited offer</Eyebrow>
          <h3>20% off oversized essentials</h3>
          <p>Design-ready tees, hoodies, jackets, and canvas totes.</p>
        </div>
      </article>
    </section>
  );
}
