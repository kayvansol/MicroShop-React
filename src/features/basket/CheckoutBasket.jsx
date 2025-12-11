import React, { useState, useEffect } from "react";
import client from "@lib/axios/axiosClient";
import loadingimg from "@shared/assets/img/b.gif";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {initialBasket } from "@shared/assets/js/basketReducer";  
import {useTitle} from "@hooks/useTitle";
import { useBasketStorage } from "@hooks/useBasketStorage";

const CheckoutBasket = () => {
  
  useTitle("تسویه");

  const { state: basketState, dispatch: basketDispatch } = useBasketStorage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customerError, setCustomerError] = useState(null);

  const [customerId, setCustomerId] = useState("");

  // -----------------------------
  // Load Customer List
  // -----------------------------
  useEffect(() => {
    const loadCustomers = async () => {
      setLoadingCustomers(true);
      toast.loading("در حال بارگذاری لیست مشتریان...");

      try {
        const res = await client.post("/Customer/GetAllCustomers", {});
        setCustomers(res.data.data || []);

        toast.dismiss();
        toast.success("لیست مشتریان با موفقیت بارگذاری شد");
      } catch (err) {
        toast.dismiss();
        toast.error("خطا در دریافت مشتریان");

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
  // Checkout
  // -----------------------------
  const checkoutBasket = async () => {
    if (!customerId) {
      toast.error("لطفاً یک مشتری انتخاب کنید");
      return;
    }

    const payload = {
      customerId: Number(customerId),
    };

    setLoading(true);
    setError(null);
    setResponse(null);

    toast.loading("در حال ارسال به لیست منتظر پرداخت...");

    try {

      const res = await client.post("/basket/Checkout", payload);
      setResponse(res.data);

      toast.dismiss();

      // ریست سبد با استفاده از هوک جدید
      basketDispatch({ type: "LOAD_FROM_JSON", payload: initialBasket });

      toast.success("سفارش با موفقیت به لیست منتظر پرداخت اضافه شد");
    } catch (err) {
      toast.dismiss();

      if (err.response) {
        setError(err.response.data);
        toast.error("خطای سرور در تسویه حساب");
      } else {
        setError({ message: err.message });
        toast.error("خطا در ارتباط با سرور");
      }
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const paymentClick = () => {
    navigate("/Payment");
  };

  return (
    <>

      <Toaster position="top-right" />

      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">تسویه حساب</div>

          <div className="card-body">

            {/* CUSTOMER LOAD ERROR */}
            {customerError && (
              <div className="alert alert-danger">
                خطا در دریافت لیست مشتریان:<br />
                {customerError}
              </div>
            )}

            {/* SELECT CUSTOMER */}
            <div className="mb-3">
              <label className="form-label">انتخاب مشتری</label>

              {loadingCustomers ? (
                <div className="alert alert-info d-flex flex-column align-items-center">
                  <img src={loadingimg} width={80} alt="loading" />
                  <div>در حال بارگذاری مشتریان...</div>
                </div>
              ) : (
                <select
                  className="form-control"
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    toast.success(`مشتری ${e.target.value} انتخاب شد`);
                  }}
                >
                  <option value="">-- انتخاب مشتری --</option>

                  {customers.map((c) => (
                    <option key={c.customerId} value={c.customerId}>
                      {c.firstName} {c.lastName} (ID: {c.customerId})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* CHECKOUT BUTTON */}
            <div className="mt-4">
              {loading ? (
                <img src={loadingimg} alt="loading ..." width={140} />
              ) : (
                <div>
                  <button
                    className="btn btn-warning px-4"
                    onClick={paymentClick}                    
                  >
                    فرم پرداخت سفارش
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-success px-4"
                    onClick={checkoutBasket}
                    disabled={loadingCustomers || !customerId}
                  >
                    افزودن به لیست منتظر پرداخت
                  </button>
                </div>
              )}
            </div>

            {/* RESPONSE */}
            {response && (
              <div className="alert alert-success mt-4">
                <h5>پاسخ سرور</h5>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="alert alert-danger mt-4">
                <h5>خطا</h5>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutBasket;
