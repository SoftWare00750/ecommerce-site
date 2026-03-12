// src/components/layout/Hero.jsx
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.tag}>✦ New Arrivals</div>
      <h1 className={styles.heading}>
        Premium Tech <br />&amp; <em className={styles.em}>Fashion</em>
      </h1>
      <p className={styles.sub}>
        Quality products, fast delivery, and prices that make sense.
        Shop the best of tech and style.
      </p>
    </section>
  );
}