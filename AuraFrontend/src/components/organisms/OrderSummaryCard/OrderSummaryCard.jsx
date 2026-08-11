import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import SummaryRow from '../../molecules/SummaryRow/SummaryRow';
import styles from './OrderSummaryCard.module.css';

const money = (amount) => (amount === 0 ? 'Free' : `$${amount.toFixed(2)}`);

export default function OrderSummaryCard({ totals }) {
  return (
    <aside className={`summary-card ${styles.root}`}>
      <Eyebrow>Order summary</Eyebrow>
      <SummaryRow label="Products" value={money(totals.products)} />
      <SummaryRow label="Design fees" value={money(totals.designFees)} />
      <SummaryRow label="Embroidery" value={money(totals.embroidery)} />
      <SummaryRow label="Shipping" value={money(totals.shipping)} />
      <SummaryRow label="Total" value={money(totals.total)} total />
      <Button fullWidth>Secure Checkout</Button>
      <p className="microcopy">Premium packaging, tracked shipping, and design proof included.</p>
    </aside>
  );
}
