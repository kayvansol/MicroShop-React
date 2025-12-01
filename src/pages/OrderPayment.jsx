import React, { useState } from "react";
import client from '../api/axiosClient';
import loadingimg from "../assets/b.gif";

const OrderPaymentLauncher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // ورودی کاربر
  const [correlationId, setCorrelationId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [customerId, setCustomerId] = useState("");

  // تاریخ‌ها (اختیاری)
  const [creationDate, setCreationDate] = useState("");
  const [created, setCreated] = useState("");

  // ارسال payload با مقادیر کاربر
  const buildPayload = () => ({
    correlationId: correlationId || "",
    creationDate: creationDate || new Date().toISOString(),
    orderId: orderId ? Number(orderId) : 0,
    customerId: customerId ? Number(customerId) : 0,
    created: created || new Date().toISOString(),
  });

  const sendOrderPayment = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload = buildPayload();
      console.log("Payload:", payload);

      const res = await client.post("/orderpayment", payload);
      setResponse(res.data);
    } catch (err) {
      if (err.response) {
        setError({ status: err.response.status, data: err.response.data });
      } else if (err.request) {
        setError({ message: "No response from server", details: err.message });
      } else {
        setError({ message: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">پرداخت سفارش</div>
        <div className="card-body">
          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Correlation ID</label>
                  <input
                    className="form-control"
                    type="text"
                    value={correlationId}
                    onChange={(e) => setCorrelationId(e.target.value)}
                    placeholder="correlationId"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Order ID</label>
                  <input
                    className="form-control"
                    type="number"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="orderId"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Customer ID</label>
                  <input
                    className="form-control"
                    type="number"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="customerId"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Creation Date (اختیاری)</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    onChange={(e) =>
                      setCreationDate(
                        e.target.value
                          ? new Date(e.target.value).toISOString()
                          : ""
                      )
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Created (اختیاری)</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    onChange={(e) =>
                      setCreated(
                        e.target.value
                          ? new Date(e.target.value).toISOString()
                          : ""
                      )
                    }
                  />
                </div>
              </div>
              <br></br>
              {loading ? (
                <img
                  style={{ marginBottom: "300px" }}
                  src={loadingimg}
                  alt="loading ..."
                  width={200}
                  height={200}
                />
              ) : (
                <button
                  className="btn btn-info"
                  onClick={sendOrderPayment}
                  disabled={loading}
                >
                  {loading ? "در حال ارسال..." : "ارسال پرداخت"}
                </button>
              )}

              {response && (
                <div className="mt-4 card alert alert-success">
                  <div className="card-body">
                    <h5 className="card-title mb-2">پاسخ سرور</h5>
                    <pre className="mb-0">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 alert alert-danger" role="alert">
                  <h5 className="alert-heading">خطا</h5>
                  <pre className="mb-0">{JSON.stringify(error, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPaymentLauncher;
