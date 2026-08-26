import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import styles from './AddressFormModal.module.css';

export default function AddressFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    street: '',
    zipCode: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          country: initialData.country || '',
          city: initialData.city || '',
          street: initialData.street || '',
          zipCode: initialData.zipCode || ''
        });
      } else {
        setFormData({
          country: '',
          city: '',
          street: '',
          zipCode: ''
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData, initialData?.id);
      onClose();
    } catch (error) {
      console.error(error);
      alert(t('addressForm.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{initialData ? t('addressForm.editTitle') : t('addressForm.addTitle')}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>{t('addressForm.country')}</label>
            <input 
              type="text" 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>{t('addressForm.city')}</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>{t('addressForm.street')}</label>
            <input 
              type="text" 
              name="street" 
              value={formData.street} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>{t('addressForm.zipCode')}</label>
            <input 
              type="text" 
              name="zipCode" 
              value={formData.zipCode} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('addressForm.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
