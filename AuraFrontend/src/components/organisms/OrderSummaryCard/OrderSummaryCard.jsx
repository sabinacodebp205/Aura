import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import SummaryRow from '../../molecules/SummaryRow/SummaryRow';
import styles from './OrderSummaryCard.module.css';

export default function OrderSummaryCard({ totals }) {
  const { t } = useTranslation();

  const money = (amount) => (amount === 0 ? t('summary.free') : `$${amount.toFixed(2)}`);

  return (
    <aside className={`summary-card ${styles.root}`}>
      <Eyebrow>{t('summary.title')}</Eyebrow>
      <SummaryRow label={t('summary.products')} value={money(totals.products)} />
      {totals.designFees > 0 && (
        <SummaryRow label={t('summary.designFees')} value={money(totals.designFees)} />
      )}
      {totals.embroidery > 0 && (
        <SummaryRow label={t('summary.embroidery')} value={money(totals.embroidery)} />
      )}
      <SummaryRow label={t('summary.shipping')} value={money(totals.shipping)} />
      <SummaryRow label={t('summary.total')} value={money(totals.total)} total />
      <Button fullWidth>{t('summary.secureCheckout')}</Button>
      <p className="microcopy">{t('summary.microcopy')}</p>
    </aside>
  );
}
