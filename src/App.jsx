import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import BasketForm from './pages/BasketForm';
import BasketGrid from './pages/BasketGrid';
import AddToBasket from './pages/AddToBasket';
import CheckoutBasket from './pages/CheckoutBasket';
import OrderPayment from './pages/OrderPayment';

function App() {
  
  return (
    <>
      <BrowserRouter>
      <div className="container mt-4">
        
        <nav className="mt-3">
          <Link className="btn btn-success me-3" to="/">Test</Link>
          <Link className="btn btn-secondary me-3" to="/grid">Basket Grid</Link>
          <Link className="btn btn-primary me-3" to="/add">Add to Basket</Link>
          <Link className="btn btn-success me-3" to="/Checkout">Checkout</Link>
          <Link className="btn btn-danger" to="/Payment">Payment</Link>
        </nav>

        <Routes>
          <Route path="/" element={<BasketForm />} />
          <Route path="/grid" element={<BasketGrid />} />
          <Route path="/add" element={<AddToBasket />} />
          <Route path="/Checkout" element={<CheckoutBasket />} />
          <Route path="/Payment" element={<OrderPayment />} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
