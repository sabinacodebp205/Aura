import QuantityControl from '../../molecules/QuantityControl/QuantityControl';
import styles from './CartItem.module.css';

export default function CartItem({ item, onRemove, onQtyChange, total }) {
  return (
    <article className={`cart-item ${styles.root}`}>
      <img src={item.image} alt={item.alt} />
      <div>
        <h2>{item.name}</h2>
        <p>{item.detail}</p>
        <div className="cart-tags">
          {item.fees.map((fee) => (
            <span key={fee.label}>{fee.label} +${fee.amount}</span>
          ))}
        </div>
      </div>
      <QuantityControl value={item.quantity} onChange={(quantity) => onQtyChange(item.id, quantity)} />
      <strong>${total.toFixed(2)}</strong>
      <button className="remove-button" type="button" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </article>
  );
}
