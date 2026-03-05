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
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
        Add to Cart
      </button>
    `;

    container.appendChild(card);
  });
}

fetchProducts();
updateCartCount();