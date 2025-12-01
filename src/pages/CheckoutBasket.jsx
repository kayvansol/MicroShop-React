import React, { useState } from "react";
import client from '../api/axiosClient';
import loadingimg from "../assets/b.gif";

const CheckoutBasket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [customerId, setCustomerId] = useState(4);

  // بدنه درخواست Checkout از فایل Postman
  const payload = {
    customerId: customerId,
  };

  const checkoutBasket = async () => {
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
        <div className="card-header">تسویه حساب</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Customer ID</label>
            <input
              className="form-control"
              placeholder="CustomerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              type="number"
            />
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
              onClick={checkoutBasket}
              disabled={loading}
            >
              {loading ? "در حال ارسال..." : "تسویه"}
            </button>
          )}

          {response && (
            <div className="mt-4 card alert alert-success">
              <div className="card-body">
                <h5 className="card-title mb-2">پاسخ سرور</h5>
                <pre className="mb-0">{JSON.stringify(response, null, 2)}</pre>
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
  );
};

export default CheckoutBasket;
