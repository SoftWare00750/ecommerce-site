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
}

function changeQuantity(id, delta) {
  let cart = getCart();
  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function removeFromCart(id) {
  let cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
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

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    if (cartTotal) cartTotal.textContent = "";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">₦${item.price.toLocaleString()}</span>

      <div class="quantity-control">
        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
        <span class="qty-number">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQuantity(${item.id}, +1)">+</button>
      </div>

      <span class="cart-item-subtotal">₦${(item.price * item.quantity).toLocaleString()}</span>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cartTotal) cartTotal.textContent = `Total: ₦${total.toLocaleString()}`;
}

renderCart();
updateCartCount();