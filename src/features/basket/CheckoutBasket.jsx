import React, { useState } from "react";
import loadingimg from "@shared/assets/img/b.gif";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { initialBasket } from "@shared/assets/js/basketReducer";
import { useTitle } from "@hooks/useTitle";
import { useBasketStorage } from "@hooks/useBasketStorage";
import { getAllCustomers } from "@services/customerService";
import { checkoutBasket } from "@services/basketService";
import { useQuery, useMutation } from "@tanstack/react-query";

const CheckoutBasket = () => {
  useTitle("تسویه");

  const { dispatch: basketDispatch } = useBasketStorage();

  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [customerId, setCustomerId] = useState("");

  // -----------------------------
  // Load Customer List (React Query)
  // -----------------------------
  const {
    data: customers = [],
    isLoading: loadingCustomers,
    isError: isCustomerError,
    error: customerError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
    onError: () => {
      toast.error("خطا در دریافت مشتریان");
    },
  });

  // --------------------------------------------
  // Checkout (React Query Mutation)
  // --------------------------------------------
  const checkoutMutation = useMutation({
    mutationFn: checkoutBasket,
    onMutate: () => {
      setError(null);
      setResponse(null);
      toast.loading("در حال ارسال به لیست منتظر پرداخت...");
    },
    onSuccess: (data) => {
      setResponse(data);

      // ریست سبد با استفاده از هوک جدید
      basketDispatch({
        type: "LOAD_FROM_JSON",
        payload: initialBasket,
      });

      toast.dismiss();
      toast.success("سفارش با موفقیت به لیست منتظر پرداخت اضافه شد");
    },
    onError: (err) => {
      toast.dismiss();

      if (err?.response) {
        setError(err.response.data);
        toast.error("خطای سرور در تسویه حساب");
      } else {
        setError({ message: err?.message });
        toast.error("خطا در ارتباط با سرور");
      }
    },
  });

  const submitCheckout = () => {
    if (!customerId) {
      toast.error("لطفاً یک مشتری انتخاب کنید");
      return;
    }

    checkoutMutation.mutate(customerId);
  };

  const navigate = useNavigate();

  return (
    <>
      <Toaster position="top-right" />

      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            تسویه حساب
          </div>

          <div className="card-body">
            {/* CUSTOMER LOAD ERROR */}
            {isCustomerError && (
              <div className="alert alert-danger">
                خطا در دریافت لیست مشتریان:
                <br />
                {customerError?.response
                  ? `${customerError.response.status} - ${JSON.stringify(
                      customerError.response.data
                    )}`
                  : customerError?.message}
              </div>
            )}

            {/* SELECT CUSTOMER */}
            <div className="mb-3">
              <label className="form-label">انتخاب مشتری</label>

              {loadingCustomers ? (
                <div className="alert alert-info d-flex flex-column align-items-center">
                  <img
                    src={loadingimg}
                    width={80}
                    alt="loading"
                  />
                  <div>در حال بارگذاری مشتریان...</div>
                </div>
              ) : (
                <select
                  className="form-control"
                  value={customerId}
                  onChange={(e) => {
                    setCustomerId(e.target.value);
                    if (e.target.value) {
                      toast.success(`مشتری ${e.target.value} انتخاب شد`);
                    }
                  }}
                >
                  <option value="">-- انتخاب مشتری --</option>

                  {customers.map((c) => (
                    <option
                      key={c.customerId}
                      value={c.customerId}
                    >
                      {c.firstName} {c.lastName} (ID: {c.customerId})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* CHECKOUT BUTTON */}
            <div className="mt-4">
              {checkoutMutation.isPending ? (
                <img
                  src={loadingimg}
                  alt="loading ..."
                  width={140}
                />
              ) : (
                <div>
                  <button
                    className="btn btn-warning px-4"
                    onClick={() => navigate("/Payment")}
                  >
                    فرم پرداخت سفارش
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-success px-4"
                    onClick={submitCheckout}
                    disabled={
                      loadingCustomers ||
                      !customerId ||
                      checkoutMutation.isPending
                    }
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