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
}

function cardChange(id, name, price, delta) {
  changeQuantity(id, delta);
  refreshCardControl(id, name, price);
}

fetchProducts();
updateCartCount();