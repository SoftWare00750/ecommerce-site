// src/store/authStore.js

import { useState, useEffect } from "react";

const USERS_KEY   = "shopit_users";
const SESSION_KEY = "shopit_session";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function loadSession() {
  return localStorage.getItem(SESSION_KEY) || null;
}
function saveSession(username) {
  if (username) localStorage.setItem(SESSION_KEY, username);
  else localStorage.removeItem(SESSION_KEY);
}

let _user = loadSession();
let _listeners = [];

function notify() {
  _listeners.forEach(fn => fn(_user));
}

export const authStore = {
  getUser: () => _user,

  signup({ username, password }) {
    if (!username || !password)     return { ok: false, message: "Please fill in all fields." };
    if (username.trim().length < 3) return { ok: false, message: "Username must be at least 3 characters." };
    if (password.length < 6)        return { ok: false, message: "Password must be at least 6 characters." };

    const users = loadUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
      return { ok: false, message: "Username already taken." };

    users.push({ username: username.trim(), password });
    saveUsers(users);
    return { ok: true, message: "Account created! You can now log in." };
  },

  login({ username, password }) {
    if (!username || !password) return { ok: false, message: "Please fill in all fields." };

    const users = loadUsers();
    const user  = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, message: "Incorrect username or password." };

    _user = user.username;
    saveSession(_user);
    notify();
    return { ok: true, message: "Login successful!" };
  },

  logout() {
    _user = null;
    saveSession(null);
    notify();
  },

  subscribe(fn) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  },
};

// Custom hook
export function useAuth() {
  const [user, setUser] = useState(authStore.getUser());

  useEffect(() => {
    const unsub = authStore.subscribe(setUser);
    return unsub;
  }, []);

  return {
    user,
    login:  (creds) => authStore.login(creds),
    signup: (creds) => authStore.signup(creds),
    logout: ()      => authStore.logout(),
  };
}