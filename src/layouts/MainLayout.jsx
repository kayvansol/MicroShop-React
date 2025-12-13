import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "@shared/assets/css/themes.css";
import { useLocalStorage } from "@hooks/useLocalStorage";
import Footer from "@layouts/Footer";

function MainLayout() {
  const [theme, setTheme] = useLocalStorage("site-theme", "theme-neon");

  useEffect(() => {
    const root = document.querySelector(".app-bg");
    root.classList.add("theme-animating");

    const timer = setTimeout(() => {
      root.classList.remove("theme-animating");
    }, 600);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div className={`app-bg ${theme} d-flex flex-column min-vh-100`}>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-glass">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">
            🛒 My Shop Panel
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/product">
                  Product
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/basket">
                  Basket
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/checkout">
                  Checkout
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/payment">
                  Payment
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/order">
                  Orders
                </NavLink>
              </li>
            </ul>

            <select
              className="form-select theme-select w-auto"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="theme-dark">Dark</option>
              <option value="theme-neon">Neon</option>
              <option value="theme-glass">Glass</option>
              <option value="theme-cyber">Cyber</option>
            </select>
          </div>
        </div>
      </nav>
      {/* MAIN CONTENT */}
      <main className="flex-grow-1">
        <div className="container glass-box mt-4 p-4 rounded-4 shadow-lg">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
