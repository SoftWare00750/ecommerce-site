// src/components/cart/CartPanel.jsx
import Panel, { PanelBody } from "../shared/Panel";
import styles from "./CartPanel.module.css";
import { formatPrice } from "../../utils/format";
import products from "../../data/products";

/**
 * Slide-in cart panel.
 * Props: cart, onClose, onChangeQty, onRemove, onCheckout
 */
export default function CartPanel({ cart, onClose, onChangeQty, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function getEmoji(id) {
    return products.find((p) => p.id === id)?.emoji || "📦";
  }

  return (
    <Panel title="Your Cart 🛒" onClose={onClose}>
      {cart.length === 0 ? (
        <PanelBody>
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛒</div>
            <p>Your cart is empty.<br />Add something nice!</p>
          </div>
        </PanelBody>
      ) : (
        <>
          <PanelBody>
            {cart.map((item) => (
              <div className={styles.row} key={item.id}>
                <div className={styles.emoji}>{getEmoji(item.id)}</div>

                <div className={styles.info}>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.unitPrice}>{formatPrice(item.price)} each</p>

                  <div className={styles.qty}>
                    <button onClick={() => onChangeQty(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onChangeQty(item.id, +1)}>+</button>
                  </div>
                </div>

                <div className={styles.right}>
                  <p className={styles.subtotal}>{formatPrice(item.price * item.quantity)}</p>
                  <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>🗑</button>
                </div>
              </div>
            ))}
          </PanelBody>

          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className={styles.checkoutBtn} onClick={onCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </Panel>
  );
}