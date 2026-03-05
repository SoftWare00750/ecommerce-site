const API_URL = "/api/products";

// Load products when page loads
document.addEventListener("DOMContentLoaded", fetchProducts);

// Fetch all products
async function fetchProducts() {
    const response = await fetch(API_URL);
    const products = await response.json();
    displayProducts(products);
}

// Display products in UI
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("product-card");

        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">
                Delete
            </button>
        `;

        productList.appendChild(div);
    });
}

// Add new product
async function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    if (!name || !price) {
        alert("Please enter name and price");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price: Number(price) })
    });

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";

    fetchProducts();
}

// Delete product
async function deleteProduct(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    fetchProducts();
}