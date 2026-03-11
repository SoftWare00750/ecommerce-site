// src/store/cartStore.js
// Simple module-level store with subscriber pattern (no external libs needed)

import { useState, useEffect } from "react";

const CART_KEY = "shopit_cart";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Shared state across all consumers
let _cart = loadCart();
let _listeners = [];

function notify() {
  _listeners.forEach(fn => fn([..._cart]));
}

export const cartStore = {
  getCart: () => _cart,

  addItem(product) {
    const existing = _cart.find(i => i.id === product.id);
    if (existing) {
      _cart = _cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      _cart = [..._cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    }
    saveCart(_cart);
    notify();
  },

  changeQuantity(id, delta) {
    _cart = _cart
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0);
    saveCart(_cart);
    notify();
  },

  removeItem(id) {
    _cart = _cart.filter(i => i.id !== id);
    saveCart(_cart);
    notify();
  },

  clearCart() {
    _cart = [];
    saveCart(_cart);
    notify();
  },

  subscribe(fn) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  },
};

// Custom hook for components
export function useCart() {
  const [cart, setCart] = useState(cartStore.getCart());

  useEffect(() => {
    const unsub = cartStore.subscribe(setCart);
    return unsub;
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return {
    cart,
    cartCount,
    cartTotal,
    addItem:        (p) => cartStore.addItem(p),
    changeQuantity: (id, delta) => cartStore.changeQuantity(id, delta),
    removeItem:     (id) => cartStore.removeItem(id),
    clearCart:      () => cartStore.clearCart(),
  };
}