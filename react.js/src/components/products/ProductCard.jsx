// src/components/products/ProductCard.jsx
import styles from "./ProductCard.module.css";
import { formatPrice } from "../../utils/format";

/**
 * Individual product card.
 * Props: product, qty (current cart qty), onAdd, onChangeQty
 */
export default function ProductCard({ product, qty, onAdd, onChangeQty }) {
  return (
    <div className={styles.card}>
      <div className={styles.imgArea}>
        <span className={styles.emoji}>{product.emoji}</span>
        <span className={styles.category}>{product.category}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.desc}>{product.description}</p>
        <p className={styles.price}>{formatPrice(product.price)}</p>

        <div className={styles.footer}>
          {qty === 0 ? (
            <button className={styles.addBtn} onClick={() => onAdd(product)}>
              Add to Cart
            </button>
          ) : (
            <div className={styles.qtyCtrl}>
              <button onClick={() => onChangeQty(product.id, -1)}>−</button>
              <span>{qty}</span>
              <button onClick={() => onChangeQty(product.id, +1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}