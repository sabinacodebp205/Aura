import { Link } from 'react-router-dom';
import CartItem from '../../components/organisms/CartItem/CartItem';
import OrderSummaryCard from '../../components/organisms/OrderSummaryCard/OrderSummaryCard';
import { useCart } from '../../context/CartContext';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, itemTotal, removeItem, updateQty, totals } = useCart();

  return (
    <main className={`page-shell ${styles.root}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Your Cart</h1>
        </div>
        <Link className="text-link" to="/studio">Customize another item</Link>
      </div>
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
    </main>
  );
}
