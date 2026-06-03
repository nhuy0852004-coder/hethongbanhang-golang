import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/giaodien.css";
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);

// Ẩn loading screen sau khi React mount xong
requestAnimationFrame(() => {
  const el = document.getElementById("app-loading-screen");
  if (el) {
    el.classList.add("an-di");
    el.addEventListener("transitionend", () => el.remove(), { once: true });
  }
});