function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, name, price) {
  let cart = getCart();
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  // alert removed
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = count;
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItems) return; // not on cart page

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name}</span>
      <span>₦${item.price.toLocaleString()} × ${item.quantity}</span>
      <span>= ₦${(item.price * item.quantity).toLocaleString()}</span>
      <button onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `Total: ₦${total.toLocaleString()}`;
}

function removeFromCart(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

// Run on cart page load
renderCart();
updateCartCount();