import styles from './QuantityControl.module.css';

export default function QuantityControl({ value, onChange }) {
  return (
    <div className={styles['quantity-control']}>
      <button type="button" onClick={() => onChange(value - 1)}>-</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
