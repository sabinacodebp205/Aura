import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CartItem from '../../components/organisms/CartItem/CartItem';
import OrderSummaryCard from '../../components/organisms/OrderSummaryCard/OrderSummaryCard';
import { useCart } from '../../context/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, itemTotal, removeItem, updateQty, totals } = useCart();

  return (
    <main className={`page-shell ${styles.root}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t('cart.eyebrow')}</p>
          <h1>{t('cart.title')}</h1>
        </div>
        <Link className="text-link" to="/">{t('cart.continueShopping')}</Link>
      </div>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>{t('cart.emptyTitle')}</h2>
          <p style={{ color: 'var(--muted)', margin: '12px 0 24px' }}>{t('cart.emptyDesc')}</p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: '#ffffff',
              color: '#000000',
              fontWeight: 700,
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            {t('cart.browseCatalog')}
          </Link>
        </div>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                total={itemTotal(item)}
                onRemove={removeItem}
                onQtyChange={updateQty}
              />
            ))}
          </div>
          <OrderSummaryCard totals={totals} />
        </section>
      )}
    </main>
  );
}
