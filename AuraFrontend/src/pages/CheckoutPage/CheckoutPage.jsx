import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getAllAddresses, createAddress } from '../../api/addressService';
import { createOrder } from '../../api/orderService';
import Button from '../../components/atoms/Button/Button';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totals, clearCart, itemTotal } = useCart();
  const { user } = useAuth();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_checkout_form');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { name: '', email: '', newAddress: '' };
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura_checkout_form', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (user && !formData.name && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        name: [user.name, user.surname].filter(Boolean).join(' '),
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    // Load addresses from profile backend
    getAllAddresses()
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          setAddresses(res);
          // Prefer default/last added address if available. Currently we just pick the first one which is standard if sorting puts newest first
          const defaultAddress = res.find(a => a.isDefault) || res[0];
          setSelectedAddressId(defaultAddress.id);
        }
      })
      .catch(err => console.warn('Could not load addresses', err));
  }, []);

  if (items.length === 0 && !isSuccess) {
    return (
      <main className={`page-shell ${styles.root}`}>
        <div className={styles.emptyState}>
          <h2>Səbətiniz boşdur</h2>
          <Button onClick={() => navigate('/')}>Alış-verişə qayıt</Button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalAddressId = selectedAddressId;
      if (!finalAddressId) {
        alert("Please provide a valid address.");
        return;
      }

      const payload = {
        addressId: finalAddressId,
        orderItems: items.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity
        }))
      };
      
      console.log("SENDING PAYLOAD TO API:", payload);

      // Create order
      await createOrder(payload);

      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
        localStorage.removeItem('aura_checkout_form');
      }, 500);
    } catch (err) {
      console.error("Error creating order:", err);
      const backendMsg = err.response?.data?.message;
      if (backendMsg) {
        alert(backendMsg);
      } else {
        alert("Xəta baş verdi. Sifarişi tamamlamaq mümkün olmadı.");
      }
    }
  };

  if (isSuccess) {
    return (
      <main className={`page-shell ${styles.root}`}>
        <div className={styles.successState}>
          <div className={styles.checkIcon}>✓</div>
          <h2>Təşəkkürlər! 🎉</h2>
          <p>Sifarişiniz uğurla qeydə alındı. Təsdiq üçün sizinlə əlaqə saxlayacağıq.</p>
          <div className={styles.buttonGroup} style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
            <Button onClick={() => navigate('/profile', { state: { tab: 'orders' } })}>Sifarişlərimə bax</Button>
            <Button variant="outline" onClick={() => navigate('/')}>Ana Səhifəyə Qayıt</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`page-shell ${styles.root}`}>
      <div className={styles.checkoutLayout}>
        <div className={styles.mainContent}>
          
          <div className={styles.section}>
            <h2>Çatdırılma Məlumatları</h2>
            <form id="checkout-form" onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Ad və Soyad</label>
                <input
                  type="text"
                  required
                  placeholder="Adınız və Soyadınız"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email adresi</label>
                <input
                  type="email"
                  required
                  placeholder="nümunə@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <h3>Ünvan seçin</h3>
              {addresses.length > 0 ? (
                <div className={styles.addressList}>
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.selected : ''}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <strong>{addr.street}</strong>
                      <p>{addr.city}, {addr.country} {addr.zipCode}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Profilinizdə heç bir ünvan yoxdur. Zəhmət olmasa profil bölməsindən yeni ünvan əlavə edin.</p>
              )}
            </form>
          </div>

          <div className={styles.section}>
            <h2>Ödəniş Üsulu</h2>
            <div className={styles.paymentMethod}>
              <input type="radio" checked readOnly />
              <label>Kart (Kredit və ya Debet kartı)</label>
            </div>
          </div>

        </div>

        <div className={styles.sidebar}>
          <div className={styles.section}>
            <h2>Sifariş Özəti</h2>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <div className={styles.imagePlaceholder}>
                      {item.images?.[0] ? <img src={item.images[0]} alt={item.name} /> : <div className={styles.noImage}>Məhsul</div>}
                    </div>
                    <div>
                      <h4>{item.name}</h4>
                      <p className={styles.itemDetails}>Say: {item.quantity}</p>
                    </div>
                  </div>
                  <div className={styles.itemPrice}>
                    ${itemTotal(item).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span>Məhsullar:</span>
                <span>${totals.products.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Çatdırılma:</span>
                <span>{totals.shipping === 0 ? 'Pulsuz' : `$${totals.shipping.toFixed(2)}`}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className={`${styles.totalRow} ${styles.discount}`}>
                  <span>Endirim:</span>
                  <span>-${totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                <span>Yekun Məbləğ:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            {user && (!user.name || !user.surname || !user.phoneNumber) && (
              <div className={styles.validationWarning}>
                <p>Sifariş vermək üçün <a href="#" onClick={(e) => { e.preventDefault(); navigate('/profile', { state: { tab: 'settings' } }); }}>profilinizi tamamlayın</a> (Ad, Soyad, Telefon).</p>
              </div>
            )}

            {(!selectedAddressId || !addresses.find(a => a.id === selectedAddressId)?.street || !addresses.find(a => a.id === selectedAddressId)?.city || !addresses.find(a => a.id === selectedAddressId)?.country) && (
              <div className={styles.validationWarning}>
                <p>Zəhmət olmasa <a href="#" onClick={(e) => { e.preventDefault(); navigate('/profile', { state: { tab: 'addresses' } }); }}>ünvan əlavə edin və ya tamamlayın</a> (Küçə, Şəhər, Ölkə).</p>
              </div>
            )}

            <Button 
              type="submit" 
              form="checkout-form" 
              fullWidth 
              style={{ marginTop: '24px' }}
              disabled={(user && (!user.name || !user.surname || !user.phoneNumber)) || (!selectedAddressId || !addresses.find(a => a.id === selectedAddressId)?.street || !addresses.find(a => a.id === selectedAddressId)?.city || !addresses.find(a => a.id === selectedAddressId)?.country)}
            >
              Sifarişi Təsdiqlə
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}
