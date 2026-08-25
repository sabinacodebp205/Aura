import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import styles from './CheckoutModal.module.css';
import { useCart } from '../../../context/CartContext';

export default function CheckoutModal({ isOpen, onClose, total }) {
  const { t } = useTranslation();
  const { clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setStep(2);
      clearCart();
    }, 1000);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
          &times;
        </button>

        {step === 1 ? (
          <>
            <h2>{t('checkoutModal.title')}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>{t('checkout.fullName')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('checkout.fullNamePlaceholder')}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t('checkoutModal.phone')}</label>
                <input
                  type="tel"
                  required
                  placeholder="+994 50 123 45 67"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t('checkoutModal.address')}</label>
                <input
                  type="text"
                  required
                  placeholder="Şəhər, Küçə, Bina, Mənzil"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className={styles.totalRow}>
                <span>{t('summary.total')}:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button type="submit" fullWidth>{t('checkout.confirmOrder')}</Button>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <h2>{t('checkout.successTitle')}</h2>
            <p>{t('checkoutModal.success')}</p>
            <Button onClick={handleClose} fullWidth>{t('checkout.returnHome')}</Button>
          </div>
        )}
      </div>
    </div>
  );
}
