import Swatch from '../../atoms/Swatch/Swatch';
import styles from './ColorSwatchGroup.module.css';

export default function ColorSwatchGroup({ colors }) {
  return (
    <div className={styles.swatches} aria-label="Available colors">
      {colors.map((color) => (
        <Swatch key={color} color={color} isActive={color === 'black'} ariaLabel={color} />
      ))}
    </div>
  );
}
