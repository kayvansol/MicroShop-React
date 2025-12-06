import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "@shared/assets/css/themes.css";

function MainLayout() {
  const [theme, setTheme] = useState(
    localStorage.getItem("site-theme") || "theme-neon"
  );

  useEffect(() => {
    localStorage.setItem("site-theme", theme);

    const root = document.querySelector(".app-bg");
    root.classList.add("theme-animating");

    const timer = setTimeout(() => {
      root.classList.remove("theme-animating");
    }, 600);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div className={`app-bg ${theme}`}>
      {/* Navbar */}
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
                <NavLink className="nav-link" to="/Checkout">
                  Checkout
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Payment">
                  Payment
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/Order">
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

      {/* Content */}
      <div className="container glass-box mt-4 p-4 rounded-4 shadow-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
