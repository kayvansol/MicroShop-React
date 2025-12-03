import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import "./assets/themes.css";

import BasketForm from "./pages/!BasketForm";
import AddToBasket from "./pages/AddToBasket";
import CheckoutBasket from "./pages/CheckoutBasket";
import OrderPayment from "./pages/OrderPayment";
import ProductInsert from "./pages/ProductList";

import PageFade from "./components/PageFade";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <PageFade>
            <BasketForm />
          </PageFade>
        }
      />
      <Route
        path="/product"
        element={
          <PageFade>
            <ProductInsert />
          </PageFade>
        }
      />
      <Route
        path="/add"
        element={
          <PageFade>
            <AddToBasket />
          </PageFade>
        }
      />
      <Route
        path="/Checkout"
        element={
          <PageFade>
            <CheckoutBasket />
          </PageFade>
        }
      />
      <Route
        path="/Payment"
        element={
          <PageFade>
            <OrderPayment />
          </PageFade>
        }
      />
    </Routes>
  );
}

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("site-theme") || "theme-neon"
  );

  // Trigger animation every time theme changes
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
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-dark  navbar-glass">
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
                    Test
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/product">
                    Product
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/add">
                    Add
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

        {/* content wrapper */}
        <div className="container glass-box mt-4 p-4 rounded-4 shadow-lg">
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
