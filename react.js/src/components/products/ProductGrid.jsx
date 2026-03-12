// src/components/products/ProductGrid.jsx
import { useState } from "react";
import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";
import products from "../../data/products";

const CATEGORIES = ["All", "Tech", "Fashion"];

/**
 * Product listing with category filter.
 * Props: cart, onAdd, onChangeQty
 */
export default function ProductGrid({ cart, onAdd, onChangeQty }) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? products : products.filter((p) => p.category === filter);

  function getQty(id) {
    return cart.find((i) => i.id === id)?.quantity || 0;
  }

  return (
    <>
      <div className={styles.filterBar}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${filter === cat ? styles.chipActive : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            qty={getQty(product.id)}
            onAdd={onAdd}
            onChangeQty={onChangeQty}
          />
        ))}
      </div>
    </>
  );
}