import styles from './SummaryRow.module.css';

export default function SummaryRow({ label, value, total }) {
  return (
    <div className={total ? styles['summary-total'] : styles['summary-row']}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
