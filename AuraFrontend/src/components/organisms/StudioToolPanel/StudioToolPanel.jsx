import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import SmartNote from '../../molecules/SmartNote/SmartNote';
import styles from './StudioToolPanel.module.css';

export default function StudioToolPanel({ design }) {
  return (
    <aside className={`tool-panel ${styles.root}`}>
      <div className="panel-header">
        <Eyebrow>Design Studio</Eyebrow>
        <h1>Customize Hoodie</h1>
      </div>
      <div className="tool-tabs" role="tablist">
        <button className={design.mode === 'print' ? 'active' : ''} type="button" onClick={() => design.setMode('print')}>
          Print +$5
        </button>
        <button className={design.mode === 'embroidery' ? 'active' : ''} type="button" onClick={() => design.setMode('embroidery')}>
          Embroidery +$10
        </button>
      </div>

      <label className="field">
        <span>AI prompt</span>
        <textarea rows="4" defaultValue="Minimal luxury embroidery with a silver moon and architectural lines" />
      </label>
      <Button fullWidth onClick={design.generateConcept}>Generate Design</Button>

      <div className="studio-controls">
        <label className="field">
          <span>Add text</span>
          <input type="text" value={design.text} onChange={(event) => design.setText(event.target.value)} />
        </label>
        <label className="field">
          <span>Thread / print color</span>
          <input type="color" value={design.color} onChange={(event) => design.setColor(event.target.value)} />
        </label>
        <label className="field">
          <span>Scale</span>
          <input type="range" min="70" max="150" value={design.scale} onChange={(event) => design.setScale(event.target.value)} />
        </label>
        <label className="field">
          <span>Rotation</span>
          <input type="range" min="-25" max="25" value={design.rotation} onChange={(event) => design.setRotation(event.target.value)} />
        </label>
      </div>

      <div className="tool-actions">
        <button className="icon-tool" type="button" title="Undo">↶</button>
        <button className="icon-tool" type="button" title="Redo">↷</button>
        <button className="icon-tool" type="button" title="Zoom">⌕</button>
        <button className="icon-tool" type="button" title="Remove background">▧</button>
        <button className="icon-tool" type="button" title="Smart alignment">+</button>
      </div>

      <SmartNote title="AI suggestion" description={design.suggestion} />
    </aside>
  );
}
