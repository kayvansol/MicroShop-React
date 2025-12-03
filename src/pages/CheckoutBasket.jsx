import React, { useState, useEffect } from "react";
import client from "../api/axiosClient";
import loadingimg from "../assets/b.gif";

const CheckoutBasket = () => {
  const [loading, setLoading] = useState(false); // loading تسویه حساب
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customerError, setCustomerError] = useState(null);

  const [customerId, setCustomerId] = useState("");

  // -----------------------------
  // Load Customer List on mount
  // -----------------------------
  useEffect(() => {

    const loadCustomers = async () => {
      setLoadingCustomers(true);

      try {
        const res = await client.post(
          "/api/Customer/GetAllCustomers",{}
        );

        console.log("Customers:", res.data);

        setCustomers(res.data.data || []);
      } catch (err) {
        setCustomerError(
          err.response
            ? `${err.response.status} - ${JSON.stringify(err.response.data)}`
            : err.message
        );
      } finally {
        setLoadingCustomers(false);
      }
    };

    loadCustomers();
  }, []);

  // -----------------------------
  // Submit Checkout
  // -----------------------------
  const checkoutBasket = async () => {
    if (!customerId) {
      alert("لطفاً یک مشتری انتخاب کنید");
      return;
    }

    const payload = {
      customerId: Number(customerId),  // ارسال customerId
    };

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await client.post("/basket/Checkout", payload);
      setResponse(res.data);
    } catch (err) {
      if (err.response) {
        setError({
          status: err.response.status,
          data: err.response.data,
        });
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
        <div className="card-header">تسویه حساب</div>

        <div className="card-body">

          {/* LOAD CUSTOMERS ERROR */}
          {customerError && (
            <div className="alert alert-danger">
              خطا در دریافت لیست مشتریان:<br/>
              {customerError}
            </div>
          )}

          {/* CUSTOMER DROPDOWN */}
          <div className="mb-3">
            <label className="form-label">انتخاب مشتری</label>

            {loadingCustomers ? (
              <div className="alert alert-info">
                <img src={loadingimg} width={120} alt="loading..." />
                <div>در حال بارگذاری مشتریان...</div>
              </div>
            ) : (
              <select
                className="form-control"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">-- انتخاب مشتری --</option>

                {customers.map((c) => (
                  <option key={c.customerId} value={c.customerId}>
                    {c.firstName + " " + c.lastName} (شماره : {c.customerId})
                  </option>
                ))}
              </select>
            )}
          </div>

          <br />

          {/* CHECKOUT BUTTON */}
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
              onClick={checkoutBasket}
              disabled={loadingCustomers || !customerId}
            >
              تسویه
            </button>
          )}

          {/* RESPONSE */}
          {response && (
            <div className="mt-4 card alert alert-success">
              <div className="card-body">
                <h5 className="card-title mb-2">پاسخ سرور</h5>
                <pre className="mb-0">{JSON.stringify(response, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-4 alert alert-danger" role="alert">
              <h5 className="alert-heading">خطا</h5>
              <pre className="mb-0">{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CheckoutBasket;
