const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const productsPath = path.join(__dirname, "data/products.json");
const usersPath = path.join(__dirname, "data/users.json");

// Ensure data/users.json exists and is valid on startup
function ensureUsersFile() {
  const dir = path.join(__dirname, "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, "[]");
  } else {
    try {
      JSON.parse(fs.readFileSync(usersPath, "utf8"));
    } catch {
      // File exists but is corrupted — reset it
      fs.writeFileSync(usersPath, "[]");
    }
  }
}

ensureUsersFile();

/* ===============================
   PRODUCTS ROUTES
================================ */

app.get("/api/products", (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to load products." });
  }
});

/* ===============================
   AUTH ROUTES
================================ */

app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required." });

  if (username.length < 3)
    return res.status(400).json({ message: "Username must be at least 3 characters." });

  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters." });

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
  } catch {
    users = [];
  }

  const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists)
    return res.status(409).json({ message: "Username already taken." });

  users.push({ username, password });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "Account created successfully!" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password are required." });

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
  } catch {
    return res.status(500).json({ message: "Server error. Please try again." });
  }

  const user = users.find(
    u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user)
    return res.status(401).json({ message: "Incorrect username or password." });

  res.json({ message: "Login successful", username: user.username });
});

/* ===============================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`✅ ShopIt server running at http://localhost:${PORT}`);
});