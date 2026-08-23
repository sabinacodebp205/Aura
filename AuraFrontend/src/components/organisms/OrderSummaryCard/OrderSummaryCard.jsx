import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import SummaryRow from '../../molecules/SummaryRow/SummaryRow';
import { useCart } from '../../../context/CartContext';
import styles from './OrderSummaryCard.module.css';

export default function OrderSummaryCard({ totals }) {
  const { t } = useTranslation();
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const money = (amount) => (amount === 0 ? t('summary.free') : `$${amount.toFixed(2)}`);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplying(true);
    setCouponError(null);
    setCouponSuccess(null);

    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponSuccess(t('coupon.applied'));
      setCouponInput('');
    } else {
      setCouponError(t('coupon.invalid'));
    }
    setIsApplying(false);
  };

  const handleRemove = () => {
    removeCoupon();
    setCouponSuccess(null);
    setCouponError(null);
  };

  return (
    <aside className={`summary-card ${styles.root}`}>
        <Eyebrow>{t('summary.title')}</Eyebrow>
        
        <SummaryRow label={t('summary.products')} value={money(totals.products)} />
        
        {totals.discountAmount > 0 && (
          <div className={styles.discountRow}>
            <span>
              {t('coupon.discount', { percent: totals.discountPercent })}
              {totals.couponCode && <strong> ({totals.couponCode})</strong>}
            </span>
            <span className={styles.discountValue}>-${totals.discountAmount.toFixed(2)}</span>
          </div>
        )}

        <SummaryRow label={t('summary.shipping')} value={money(totals.shipping)} />
        <SummaryRow label={t('summary.total')} value={money(totals.total)} total />

        {/* Coupon Application Form */}
        <div className={styles.couponSection}>
          {appliedCoupon ? (
            <div className={styles.appliedBadge}>
              <div>
                <span className={styles.appliedCode}>🏷️ {appliedCoupon.code}</span>
                <span className={styles.appliedPercent}>(-{appliedCoupon.discountPercent}%)</span>
              </div>
              <button
                type="button"
                className={styles.removeCouponBtn}
                onClick={handleRemove}
                title={t('coupon.remove')}
              >
                ✕
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
              <input
                type="text"
                placeholder={t('coupon.placeholder')}
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  if (couponError) setCouponError(null);
                }}
                className={styles.couponInput}
              />
              <button
                type="submit"
                className={styles.applyBtn}
                disabled={!couponInput.trim() || isApplying}
              >
                {isApplying ? '...' : t('coupon.apply')}
              </button>
            </form>
          )}
          {couponError && <p className={styles.couponErrorMsg}>{couponError}</p>}
          {couponSuccess && <p className={styles.couponSuccessMsg}>{couponSuccess}</p>}
        </div>

        <Button fullWidth to="/checkout">{t('summary.secureCheckout')}</Button>
        <p className="microcopy">{t('summary.microcopy')}</p>
      </aside>
  );
}
