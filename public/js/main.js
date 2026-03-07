const API_URL = "/api/products";
const container = document.getElementById("product-container");

async function fetchProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" />
      <h3>${product.name}</h3>
      <p>₦${product.price.toLocaleString()}</p>
      <div id="card-control-${product.id}">
        ${getCardControl(product.id, product.name, product.price)}
      </div>
    `;

    container.appendChild(card);
  });
}

function getCardControl(id, name, price) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);

  if (!item || item.quantity === 0) {
    return `
      <button onclick="cardAdd(${id}, '${name}', ${price})">
        Add to Cart
      </button>
    `;
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
  addToCart(id, name, price);
  refreshCardControl(id, name, price);
  renderStickyCart();
}

function cardChange(id, name, price, delta) {
  changeQuantity(id, delta);
  refreshCardControl(id, name, price);
  renderStickyCart();
}

/* =============================================
   STICKY CART BAR
============================================= */

// Product image map — matches data/products.json
const productImages = {
  1: "images/appleiphone14.jpg",
  2: "images/nikeairjordan5retro.png",
  3: "images/nikedunklow.png",
  4: "images/nikepegasusplus.png",
  5: "images/hppavilion15-cs2177nia.png",
  6: "images/genericsmartwatch2.jpg"
};

function createStickyCart() {
  const bar = document.createElement("div");
  bar.id = "sticky-cart-bar";
  bar.innerHTML = `
    <div id="sticky-cart-inner">
      <div id="sticky-cart-items"></div>
      <div id="sticky-cart-footer">
        <div id="sticky-cart-totals"></div>
        <button id="checkout-btn" onclick="window.location.href='checkout.html'">
          Proceed to Checkout &rarr;
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(bar);
}

function renderStickyCart() {
  const cart = getCart();
  const bar = document.getElementById("sticky-cart-bar");
  if (!bar) return;

  if (cart.length === 0) {
    bar.classList.remove("visible");
    return;
  }

  bar.classList.add("visible");

  const itemsEl = document.getElementById("sticky-cart-items");
  const totalsEl = document.getElementById("sticky-cart-totals");

  itemsEl.innerHTML = cart.map(item => `
    <div class="sticky-item" id="sticky-item-${item.id}">
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

  const totalsHTML = cart.map(item => `
    <div class="sticky-total-row">
      <span class="sticky-total-name">${item.name.split(' ').slice(0, 2).join(' ')} ×${item.quantity}</span>
      <span class="sticky-total-amount">₦${(item.price * item.quantity).toLocaleString()}</span>
    </div>
  `).join("") + (() => {
    const grand = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    return `<div class="sticky-grand-total">Grand Total: <strong>₦${grand.toLocaleString()}</strong></div>`;
  })();

  totalsEl.innerHTML = totalsHTML;
}

function stickyRemove(id) {
  removeFromCart(id);
  // also refresh the product card button
  const cart = getCart();
  renderStickyCart();
  // Refresh all card controls (we don't know the name/price easily here, re-fetch not needed — just re-render page cards)
  document.querySelectorAll("[id^='card-control-']").forEach(el => {
    const pid = parseInt(el.id.replace("card-control-", ""));
    const cartItem = getCart().find(i => i.id === pid);
    // Find original product data from DOM
    const card = el.closest(".product-card");
    if (!card) return;
    const name = card.querySelector("h3").textContent;
    const priceText = card.querySelector("p").textContent.replace("₦", "").replace(/,/g, "");
    const price = parseInt(priceText);
    el.innerHTML = getCardControl(pid, name, price);
  });
}

function stickyChange(id, name, price, delta) {
  changeQuantity(id, delta);
  refreshCardControl(id, name, price);
  renderStickyCart();
}

// Init
createStickyCart();
fetchProducts();
updateCartCount();
renderStickyCart();