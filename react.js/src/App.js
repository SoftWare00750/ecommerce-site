// src/App.js
import "./styles/global.css";
import StorePage from "./pages/StorePage";

/**
 * Root of the app.
 * If you add routing later (e.g. react-router-dom), this is where
 * you'd wrap with <BrowserRouter> and define <Routes>.
 */
export default function App() {
  return <StorePage />;
}