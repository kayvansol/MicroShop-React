import '@shared/assets/css/order-payment.css';
import React, { useEffect, useState } from "react";
import client from "@lib/axios/axiosClient";
import loadingimg from "@shared/assets/img/b.gif";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OrderPaymentLauncher = () => {
  const [orders, setOrders] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const [correlationId, setCorrelationId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [created, setCreated] = useState("");

  const navigate = useNavigate();

  // -------------------
  // Load Waiting Payment
  // -------------------
  const loadOrders = async () => {
    setTableLoading(true);
    toast.loading("در حال بارگذاری سفارش‌ها...");

    try {
      const res = await client.post("/Orders/WaitingPayments", {});
      setOrders(res.data.data);

      toast.dismiss();
      toast.success("سفارش‌ها با موفقیت بارگذاری شدند");
    } catch (err) {
      toast.dismiss();
      toast.error("خطا در دریافت سفارش‌ها");
    } finally {
      setTableLoading(false);
    }
  };

  const openOrdersModal = () => {
    loadOrders();
    setOpenModal(true);
  };

  const selectOrder = (o) => {
    setCorrelationId(o.correlationID);
    setOrderId(o.orderID);
    setCustomerId(o.customerID);
    setCreated(o.created);

    toast.success(`سفارش ${o.orderID} انتخاب شد`);
    setOpenModal(false);
  };

  // -------------------
  // Send Payment
  // -------------------
  const buildPayload = () => ({
    correlationId,
    creationDate: creationDate || new Date().toISOString(),
    orderId: Number(orderId) || 0,
    customerId: Number(customerId) || 0,
    created: created || new Date().toISOString(),
  });

  const sendOrderPayment = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const payload = buildPayload();

    toast.loading("در حال ارسال پرداخت ...");

    try {
      const res = await client.post("/orderpayment", payload);

      setResponse(res.data);

      toast.dismiss();
      toast.success("پرداخت با موفقیت ارسال شد");
    } catch (err) {
      toast.dismiss();

      if (err.response) {
        setError(err.response.data);
        toast.error("خطای سرور در ارسال پرداخت");
      } else {
        setError({ message: err.message });
        toast.error("خطا در ارتباط با سرور");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) =>
    JSON.stringify(o).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">

      <Toaster position="top-right" />

      <button className="btn btn-success mb-4 px-4" onClick={() => navigate("/Order")}>
        لیست سفارش‌ها
      </button>
      &nbsp;&nbsp;
      <button className="btn btn-primary mb-4 px-4" onClick={openOrdersModal}>
        سفارش‌های منتظر پرداخت
      </button>

      {/* ---------------- Modal ---------------- */}
      {openModal && (
        <div className="order-modal-backdrop">
          <div className="order-modal">

            <div className="order-modal-header">
              <h5>سفارش‌های منتظر پرداخت</h5>
              <button className="btn-close" onClick={() => setOpenModal(false)} />
            </div>

            <div className="order-modal-body">
              <input
                type="text"
                className="form-control search-box"
                placeholder="جستجو..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {tableLoading ? (
                <div className="skeleton-list">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="skeleton-line"></div>
                  ))}
                </div>
              ) : (
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>CorrelationID</th>
                      <th>OrderID</th>
                      <th>CustomerID</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          نتیجه‌ای یافت نشد
                        </td>
                      </tr>
                    )}

                    {filteredOrders.map((o, index) => (
                      <tr key={index} className={index % 2 ? "alt" : ""}>
                        <td>{o.correlationID}</td>
                        <td>{o.orderID}</td>
                        <td>{o.customerID}</td>
                        <td>{o.created}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => selectOrder(o)}
                          >
                            انتخاب
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="order-modal-footer">
              <button className="btn btn-secondary" onClick={() => setOpenModal(false)}>
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ فرم اصلی ------------------ */}
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">پرداخت سفارش</div>

        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-4">
              <label className="form-label">Correlation ID</label>
              <input
                className="form-control"
                value={correlationId}
                onChange={(e) => setCorrelationId(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Order ID</label>
              <input
                className="form-control"
                type="number"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Customer ID</label>
              <input
                className="form-control"
                type="number"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Creation Date</label>
              <input
                className="form-control"
                type="datetime-local"
                onChange={(e) =>
                  setCreationDate(
                    e.target.value ? new Date(e.target.value).toISOString() : ""
                  )
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Created</label>
              <input
                className="form-control"
                type="datetime-local"
                onChange={(e) =>
                  setCreated(
                    e.target.value ? new Date(e.target.value).toISOString() : ""
                  )
                }
              />
            </div>
          </div>

          <br />

          {loading ? (
            <img src={loadingimg} width={100} />
          ) : (
            <button className="btn btn-success px-4" onClick={sendOrderPayment}>
              ارسال پرداخت
            </button>
          )}

          {response && (
            <div className="alert alert-success mt-4">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-4">
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentLauncher;
