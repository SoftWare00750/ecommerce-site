const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const productsPath = path.join(__dirname, "data/products.json");
const usersPath = path.join(__dirname, "data/users.json");

/* ===============================
   PRODUCTS ROUTES
================================ */

// Get all products
app.get("/api/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsPath));
  res.json(products);
});

/* ===============================
   AUTH ROUTES
================================ */

// Signup
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  const users = JSON.parse(fs.readFileSync(usersPath));

  const existingUser = users.find(u => u.username === username);
  if (existingUser)
    return res.status(409).json({ message: "User already exists" });

  users.push({ username, password });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "User created successfully" });
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersPath));
  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful" });
});

/* ===============================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});