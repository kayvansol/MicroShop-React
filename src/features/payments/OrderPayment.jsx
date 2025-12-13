import "@shared/assets/css/order-payment.css";
import React, { useState } from "react";
import loadingimg from "@shared/assets/img/b.gif";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTitle } from "@hooks/useTitle";
import { getWaitingPaymentOrders } from "@services/orderService";
import { sendOrderPayment } from "@services/orderPaymentService";

const OrderPaymentLauncher = () => {

    useTitle("پرداخت");

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

    // -----------------------------------
    // Load Orders Waiting for Payment
    // -----------------------------------
    const loadOrders = async () => {
        setTableLoading(true);
        toast.loading("در حال بارگذاری سفارش‌ها...");

        try {
            const data = await getWaitingPaymentOrders();
            setOrders(data);

            toast.dismiss();
            toast.success("سفارش‌ها با موفقیت بارگذاری شدند");
        } catch {
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
        setCreated(new Date(o.created).toISOString());

        toast.success(`سفارش ${o.orderID} انتخاب شد`);
        setOpenModal(false);
    };

    // -----------------------------------
    // Payment
    // -----------------------------------
    const buildPayload = () => ({
        correlationId,
        creationDate: creationDate || new Date().toISOString(),
        orderId: Number(orderId) || 0,
        customerId: Number(customerId) || 0,
        created: created || new Date().toISOString(),
    });

    const submitPayment = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        toast.loading("در حال ارسال پرداخت ...");

        try {
            const data = await sendOrderPayment(buildPayload());
            setResponse(data);

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

            <button
                className="btn btn-success mb-4 px-4"
                onClick={() => navigate("/Order")}
            >
                لیست سفارش‌ها
            </button>
            &nbsp;&nbsp;
            <button
                className="btn btn-primary mb-4 px-4"
                onClick={openOrdersModal}
            >
                سفارش‌های منتظر پرداخت
            </button>

      {/* ---------------- Modal ---------------- */}
            {openModal && (
                <div className="order-modal-backdrop">
                    <div className="order-modal">

                        <div className="order-modal-header">
                            <h5>سفارش‌های منتظر پرداخت</h5>
                            <button
                                className="btn-close"
                                onClick={() => setOpenModal(false)}
                            />
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
                                        <div key={i} className="skeleton-line" />
                                    ))}
                                </div>
                            ) : (
                                <table className="styled-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>تاریخ ایجاد</th>
                                            <th>شماره مشتری</th>
                                            <th>شماره سفارش</th>
                                            <th>شماره رهگیری</th>
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
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => selectOrder(o)}
                                                    >
                                                        انتخاب
                                                    </button>
                                                </td>
                                                <td>{o.created}</td>
                                                <td>{o.customerID}</td>
                                                <td>{o.orderID}</td>
                                                <td>{o.correlationID}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        <div className="order-modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setOpenModal(false)}
                            >
                                بستن
                            </button>
                        </div>
                    </div>
                </div>
            )}

      {/* ------------------ فرم اصلی ------------------ */}
            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white">
          <h5>
            💳 پرداخت سفارش
          </h5>
                </div>

                <div className="card-body">

                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">شماره رهگیری</label>
                            <input
                                className="form-control"
                                value={correlationId}
                                onChange={(e) => setCorrelationId(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">شماره سفارش</label>
                            <input
                                className="form-control"
                                type="number"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">شماره مشتری</label>
                            <input
                                className="form-control"
                                type="number"
                                value={customerId}
                                onChange={(e) => setCustomerId(e.target.value)}
                            />
                        </div>
                    </div>

                    <br />

                    {loading ? (
                        <img src={loadingimg} width={100} />
                    ) : (
                        <button
                            className="btn btn-success px-4"
                            onClick={submitPayment}
                        >
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
