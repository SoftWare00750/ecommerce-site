async function signup() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msgEl = document.getElementById("auth-message");

  if (!username || !password) {
    showMessage("Please enter a username and password.", "error");
    return;
  }

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage("Account created! You can now log in.", "success");
    } else {
      showMessage(data.message || "Signup failed.", "error");
    }
  } catch (err) {
    showMessage("Network error. Is the server running?", "error");
  }
}

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showMessage("Please enter your username and password.", "error");
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      // Store session info
      sessionStorage.setItem("loggedIn", "true");
      sessionStorage.setItem("loggedInUser", username);
      showMessage("Login successful! Redirecting…", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 800);
    } else {
      showMessage(data.message || "Invalid credentials.", "error");
    }
  } catch (err) {
    showMessage("Network error. Is the server running?", "error");
  }
}

function showMessage(text, type) {
  const el = document.getElementById("auth-message");
  el.textContent = text;
  el.className = "auth-msg " + (type === "success" ? "auth-msg--success" : "auth-msg--error");
}

// Allow Enter key to trigger login
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });
  document.getElementById("username").addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });

  // If already logged in, redirect home
  if (sessionStorage.getItem("loggedIn") === "true") {
    window.location.href = "index.html";
  }
});