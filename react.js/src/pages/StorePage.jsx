// src/pages/StorePage.jsx
import { useState } from "react";
import Navbar        from "../components/layout/Navbar";
import Hero          from "../components/layout/Hero";
import ProductGrid   from "../components/products/ProductGrid";
import CartPanel     from "../components/cart/CartPanel";
import AuthPanel     from "../components/auth/AuthPanel";
import CheckoutPanel from "../components/checkout/CheckoutPanel";
import { useCart }   from "../store/cartStore";
import { useAuth }   from "../store/authStore";

// Which panel (if any) is currently open
const PANELS = { NONE: null, CART: "cart", AUTH: "auth", CHECKOUT: "checkout" };

export default function StorePage() {
  const { cart, cartCount, addItem, changeQuantity, removeItem, clearCart } = useCart();
  const { user, logout } = useAuth();
  const [panel, setPanel] = useState(PANELS.NONE);

  function close()            { setPanel(PANELS.NONE); }
  function openCart()         { setPanel(PANELS.CART); }
  function openAuth()         { setPanel(PANELS.AUTH); }
  function openCheckout()     { setPanel(PANELS.CHECKOUT); }
  function handleOrderDone()  { clearCart(); }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        onCartOpen={openCart}
        user={user}
        onAuthOpen={openAuth}
        onLogout={logout}
      />

      <Hero />

      <ProductGrid
        cart={cart}
        onAdd={addItem}
        onChangeQty={changeQuantity}
      />

      {/* Panels — only one open at a time */}
      {panel === PANELS.CART && (
        <CartPanel
          cart={cart}
          onClose={close}
          onChangeQty={changeQuantity}
          onRemove={removeItem}
          onCheckout={openCheckout}
        />
      )}

      {panel === PANELS.AUTH && (
        <AuthPanel onClose={close} />
      )}

      {panel === PANELS.CHECKOUT && (
        <CheckoutPanel
          cart={cart}
          onClose={close}
          onSuccess={handleOrderDone}
        />
      )}
    </>
  );
}