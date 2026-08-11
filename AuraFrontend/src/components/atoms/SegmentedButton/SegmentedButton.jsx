import styles from './SegmentedButton.module.css';

export default function SegmentedButton({ active, children, ...props }) {
  return (
    <button className={active ? styles.active : undefined} type="button" {...props}>
      {children}
    </button>
  );
}
