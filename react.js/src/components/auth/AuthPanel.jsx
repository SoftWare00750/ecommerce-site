// src/components/auth/AuthPanel.jsx
import { useState } from "react";
import Panel, { PanelBody } from "../shared/Panel";
import { FormField, Input } from "../shared/FormField";
import styles from "./AuthPanel.module.css";
import { useAuth } from "../../store/authStore";

/**
 * Slide-in auth panel with Login / Sign Up tabs.
 * Props: onClose
 */
export default function AuthPanel({ onClose }) {
  const { login, signup } = useAuth();
  const [tab,      setTab]      = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg,      setMsg]      = useState(null); // { type: "ok"|"err", text }

  function switchTab(t) {
    setTab(t);
    setMsg(null);
  }

  function handleSubmit() {
    setMsg(null);
    const creds = { username: username.trim(), password };

    if (tab === "signup") {
      const result = signup(creds);
      if (!result.ok) { setMsg({ type: "err", text: result.message }); return; }
      setMsg({ type: "ok", text: result.message });
      switchTab("login");
    } else {
      const result = login(creds);
      if (!result.ok) { setMsg({ type: "err", text: result.message }); return; }
      onClose();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <Panel title="Welcome to ShopIt" onClose={onClose}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "login" ? styles.tabActive : ""}`}
          onClick={() => switchTab("login")}
        >
          Login
        </button>
        <button
          className={`${styles.tab} ${tab === "signup" ? styles.tabActive : ""}`}
          onClick={() => switchTab("signup")}
        >
          Sign Up
        </button>
      </div>

      <PanelBody>
        <FormField label="Username">
          <Input
            placeholder="e.g. johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="username"
          />
        </FormField>

        <FormField label="Password">
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete={tab === "login" ? "current-password" : "new-password"}
          />
        </FormField>

        {msg && (
          <div className={`${styles.msg} ${msg.type === "ok" ? styles.msgOk : styles.msgErr}`}>
            {msg.text}
          </div>
        )}

        <button className={styles.submitBtn} onClick={handleSubmit}>
          {tab === "login" ? "Log In" : "Create Account"}
        </button>
      </PanelBody>
    </Panel>
  );
}