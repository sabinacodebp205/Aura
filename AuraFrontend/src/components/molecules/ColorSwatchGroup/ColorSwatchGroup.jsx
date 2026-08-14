import Swatch from '../../atoms/Swatch/Swatch';
import styles from './ColorSwatchGroup.module.css';

export default function ColorSwatchGroup({ colors }) {
  if (!colors || !Array.isArray(colors)) return null;

  return (
    <div className={styles.swatches} aria-label="Available colors">
      {colors.map((color, index) => {
        const colorName = typeof color === 'object' ? (color.name || color.color || 'default') : color;
        const key = typeof color === 'object' ? (color.id || `${colorName}-${index}`) : `${colorName}-${index}`;
        return (
          <Swatch key={key} color={colorName} isActive={index === 0} ariaLabel={colorName} />
        );
      })}
    </div>
  );
}
