import React from "react";
import { Link } from "react-router-dom";

import "@shared/assets/css/footer.css";

export default function Footer() {
  return (
    <footer className="app-footer mt-5">
      <div className="container py-4">
        <div className="row gy-4">
          {/* ABOUT */}
          <div className="col-md-4 text-center text-md-end">
            <h5 className="footer-title">فروشگاه آنلاین</h5>
            <p className="footer-text">
              تجربه‌ای سریع، امن و حرفه‌ای برای مدیریت سفارش‌ها و پرداخت‌ها
            </p>
          </div>

          {/* LINKS */}
          <div className="col-md-4 text-center">
            <h5 className="footer-title">دسترسی سریع</h5>
            <ul className="footer-links">
              <li>
                <Link to="/">صفحه اصلی</Link>
              </li>
              <li>
                <Link to="/product">محصولات</Link>
              </li>
              <li>
                <Link to="/basket">سبد خرید</Link>
              </li>
              <li>
                <Link to="/checkout">تسویه حساب</Link>
              </li>
              <li>
                <Link to="/payment">پرداخت</Link>
              </li>
              <li>
                <Link to="/order">سفارش‌ها</Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-md-4 text-center text-md-start">
            <h5 className="footer-title">ارتباط با ما</h5>
            <p className="footer-text mb-1">📞 0914-888-3420</p>
            <p className="footer-text mb-1">✉ kayvan.sol2@gmail.com</p>
            <div className="footer-social">
              <span>🌐</span>
              <span>📷</span>
              <span>💬</span>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="text-center small footer-copy">
          © {new Date().getFullYear()} All rights reserved | Designed with ❤️
        </div>
      </div>
    </footer>
  );
}
