import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import { studioConcepts } from '../../../data/studioConcepts';
import styles from './ConceptIdeasPanel.module.css';

export default function ConceptIdeasPanel({ design }) {
  return (
    <aside className={`ideas-panel ${styles.root}`}>
      <Eyebrow>Generated concepts</Eyebrow>
      <div className="concept-list">
        {studioConcepts.map((concept) => (
          <button
            key={concept.id}
            className={`concept-card ${design.activeConceptId === concept.id ? 'active' : ''}`.trim()}
            type="button"
            onClick={() => design.applyConcept(concept)}
          >
            <span className={`concept-art ${concept.theme}`}></span>
            <strong>{concept.title}</strong>
          </button>
        ))}
      </div>
      <div className="upload-box">
        <span>+</span>
        <strong>Upload artwork</strong>
        <p>Drop PNG, JPG, or vector artwork for live preview.</p>
      </div>
    </aside>
  );
}
