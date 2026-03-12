// src/components/layout/Navbar.jsx
import styles from "./Navbar.module.css";

/**
 * Top navigation bar.
 * Props: cartCount, onCartOpen, user, onAuthOpen, onLogout
 */
export default function Navbar({ cartCount, onCartOpen, user, onAuthOpen, onLogout }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        Shop<span className={styles.accent}>It</span>
      </div>

      <div className={styles.right}>
        {user ? (
          <>
            <span className={styles.userBadge}>👤 {user}</span>
            <button className={styles.btn} onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className={`${styles.btn} ${styles.btnAccent}`} onClick={onAuthOpen}>
            Login / Sign Up
          </button>
        )}

        <button className={styles.cartPill} onClick={onCartOpen}>
          🛒 Cart
          <span className={styles.badge}>{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}