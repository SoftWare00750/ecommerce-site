const API_URL = "/api/products";
const container = document.getElementById("product-container");

// --- SAFETY HELPERS (In case cart.js isn't loaded yet) ---
const _getCart = () => {
  try {
    return (typeof getCart === 'function') ? getCart() : JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) { return []; }
};

async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();

    if (!container) return;
    container.innerHTML = ""; // Clear loader if any

    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₦${product.price.toLocaleString()}</p>
        <div id="card-control-${product.id}">
          ${getCardControl(product.id, product.name, product.price)}
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

function getCardControl(id, name, price) {
  const cart = _getCart();
  const item = cart.find(i => i.id === id);

  if (!item || item.quantity === 0) {
    return `<button onclick="cardAdd(${id}, '${name}', ${price})">Add to Cart</button>`;
  }

  return `
    <div class="quantity-control">
      <button class="qty-btn" onclick="cardChange(${id}, '${name}', ${price}, -1)">−</button>
      <span class="qty-number">${item.quantity}</span>
      <button class="qty-btn" onclick="cardChange(${id}, '${name}', ${price}, +1)">+</button>
    </div>
  `;
}

function refreshCardControl(id, name, price) {
  const wrapper = document.getElementById(`card-control-${id}`);
  if (wrapper) wrapper.innerHTML = getCardControl(id, name, price);
}

function cardAdd(id, name, price) {
  if (typeof addToCart === 'function') addToCart(id, name, price);
  refreshCardControl(id, name, price);
  renderStickyCart();
  showStickyCart();
}

function cardChange(id, name, price, delta) {
  if (typeof changeQuantity === 'function') changeQuantity(id, delta);
  refreshCardControl(id, name, price);
  renderStickyCart();
}

/* =============================================
   AUTH NAV
============================================= */
function updateAuthNav() {
  const authBtn = document.getElementById("auth-btn");
  if (!authBtn) return;
  const user = sessionStorage.getItem("loggedInUser");
  if (user) {
    authBtn.textContent = `👤 ${user}`;
    authBtn.onclick = logout;
  } else {
    authBtn.textContent = "Login";
    authBtn.onclick = goToAuth;
  }
}

function goToAuth() { window.location.href = "auth.html"; }
function logout() {
  sessionStorage.removeItem("loggedInUser");
  sessionStorage.removeItem("loggedIn");
  updateAuthNav();
}

/* =============================================
   STICKY CART BAR
============================================= */
const productImages = {
  1: "images/appleiphone14.jpg",
  2: "images/nikeairjordan5retro.png",
  3: "images/nikedunklow.png",
  4: "images/nikepegasusplus.png",
  5: "images/hppavilion15-cs2177nia.png",
  6: "images/genericsmartwatch2.jpg"
};

let cartVisible = false;

function createStickyCart() {
  // Use safety helper to get count without crashing
  const cart = _getCart();
  const initialCount = cart.reduce((s, i) => s + i.quantity, 0);

  const bubble = document.createElement("div");
  bubble.id = "cart-bubble";
  bubble.classList.add("has-items"); // Always visible
  bubble.title = "View cart";
  bubble.innerHTML = `
    <span class="cart-bubble-icon">🛒</span>
    <span id="cart-bubble-count" class="cart-bubble-badge">${initialCount}</span>
  `;
  bubble.addEventListener("click", toggleStickyCart);
  document.body.appendChild(bubble);

  const bar = document.createElement("div");
  bar.id = "sticky-cart-bar";
  bar.innerHTML = `
    <div id="sticky-cart-inner">
      <div id="sticky-cart-header">
        <span id="sticky-cart-title">🛒 Your Cart</span>
        <button id="sticky-close-btn" title="Hide cart" onclick="hideStickyCart()">✕</button>
      </div>
      <div id="sticky-cart-items"></div>
      <div id="sticky-cart-footer">
        <div id="sticky-cart-totals"></div>
        <button id="checkout-btn" onclick="window.location.href='checkout.html'">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(bar);
}

function showStickyCart() {
  const cart = _getCart();
  if (cart.length === 0) return;
  cartVisible = true;
  document.getElementById("sticky-cart-bar").classList.add("visible");
  document.getElementById("cart-bubble").classList.add("cart-open");
}

function hideStickyCart() {
  cartVisible = false;
  document.getElementById("sticky-cart-bar")?.classList.remove("visible");
  document.getElementById("cart-bubble")?.classList.remove("cart-open");
}

function toggleStickyCart() {
  cartVisible ? hideStickyCart() : showStickyCart();
}

function renderStickyCart() {
  const cart = _getCart();
  const bar = document.getElementById("sticky-cart-bar");
  const bubble = document.getElementById("cart-bubble");
  const bubbleCount = document.getElementById("cart-bubble-count");
  if (!bar || !bubble) return;

  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);
  if (bubbleCount) bubbleCount.textContent = totalCount;

  if (cart.length === 0) {
    hideStickyCart();
    bubble.classList.add("has-items");
    return;
  }

  const itemsEl = document.getElementById("sticky-cart-items");
  const totalsEl = document.getElementById("sticky-cart-totals");

  itemsEl.innerHTML = cart.map(item => `
    <div class="sticky-item">
      <div class="sticky-item-img-wrap">
        <img src="${productImages[item.id] || ''}" alt="${item.name}" class="sticky-item-img" />
        <button class="sticky-remove-btn" onclick="stickyRemove(${item.id})" title="Remove">✕</button>
        <div class="sticky-qty-overlay">
          <button class="sticky-qty-btn" onclick="stickyChange(${item.id}, '${item.name}', ${item.price}, -1)">−</button>
          <span class="sticky-qty-num">${item.quantity}</span>
          <button class="sticky-qty-btn" onclick="stickyChange(${item.id}, '${item.name}', ${item.price}, +1)">+</button>
        </div>
      </div>
      <div class="sticky-item-label">${item.name.split(' ').slice(0, 2).join(' ')}</div>
    </div>
  `).join("");

  const grand = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  totalsEl.innerHTML = `<div class="sticky-grand-total">Total: <strong>₦${grand.toLocaleString()}</strong></div>`;

  if (typeof updateCartCount === 'function') updateCartCount();
}

function stickyRemove(id) {
  if (typeof removeFromCart === 'function') removeFromCart(id);
  renderStickyCart();
}

function stickyChange(id, name, price, delta) {
  if (typeof changeQuantity === 'function') changeQuantity(id, delta);
  refreshCardControl(id, name, price);
  renderStickyCart();
}

/* =============================================
   INIT
============================================= */
// We call fetchProducts first so content starts loading 
fetchProducts();
createStickyCart();
updateAuthNav();
renderStickyCart();