import styles from './SegmentedControl.module.css';

export default function SegmentedControl({ options, selected, onChange, className = '' }) {
  return (
    <div className={`${styles.segmented} ${className}`.trim()}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={selected === option.value ? styles.active : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
