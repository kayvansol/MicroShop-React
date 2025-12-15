import React, { useState, useEffect, useCallback } from "react";
import BasketGrid from "@features/basket/BasketGrid";
import loadingimg from "@shared/assets/img/b.gif";
import toast, { Toaster } from "react-hot-toast";
import "@shared/assets/css/basket-anim.css";
import { prettyJson } from "@shared/assets/js/prettyJson";
import { useNavigate } from "react-router-dom";
import { useTitle } from "@hooks/useTitle";
import { useBasketStorage } from "@hooks/useBasketStorage";
import { submitBasket } from "@services/basketService";
import { useMutation } from "@tanstack/react-query";

const BasketLauncher = () => {
  useTitle("افزودن به سبد خرید");

  const { state, dispatch } = useBasketStorage();

  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(state, (k, v) => (v === null ? 0 : v), 2)
  );

  useEffect(() => {
    setPayloadText(
      JSON.stringify(state, (k, v) => (v === null ? 0 : v), 2)
    );
  }, [state]);

  const basketMutation = useMutation({
    mutationFn: ({ basket }) => submitBasket(basket), // no signal needed
    onMutate: () => {
      setError(null);
      setResponse(null);
    },
    onSuccess: (data) => {
      toast.success("افزودن به سبد کالا انجام شد 🎉");
      setResponse(data);
    },
    onError: (err) => {
      toast.error("افزودن به سبد کالا انجام نشد");
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;
      setError(err?.response ? err.response.data : err?.message);
    },
  });

  const sendBasket = () => {
    basketMutation.mutate({ basket: state });
  };

  const handleAddItem = useCallback(
    (product) => dispatch({ type: "ADD_ITEM", payload: product }),
    [dispatch]
  );

  const handleRemoveItem = useCallback(
    (productId) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
    [dispatch]
  );

  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(20,20,20,0.85)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
          },
        }}
      />

      <div className="card">
        <div className="card-header">لیست کالاها</div>

        <div className="card-body">
          <BasketGrid onAdd={handleAddItem} onRemove={handleRemoveItem} />

          <hr />

          <div className="mt-4">
            <h5>کالاهای انتخابی</h5>

            {state.items.length === 0 ? (
              <div className="alert alert-warning">سبد خالی است.</div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>عملیات</th>
                      <th>جمع</th>
                      <th>قیمت</th>
                      <th>تعداد</th>
                      <th>نام کالا</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.items.map((item) => (
                      <tr
                        key={item.productId}
                        className="row-add-anim"
                      >
                        <td>
                          <button
                            className="btn btn-danger btn-sm mx-1"
                            onClick={() =>
                              dispatch({
                                type: "REMOVE_ITEM",
                                payload: { productId: item.productId },
                              })
                            }
                          >
                            حذف
                          </button>

                          <button
                            className="btn btn-warning btn-sm mx-1"
                            onClick={() =>
                              dispatch({
                                type: "DECREASE_QTY",
                                payload: { productId: item.productId },
                              })
                            }
                          >
                            -
                          </button>

                          <button
                            className="btn btn-success btn-sm mx-1"
                            onClick={() =>
                              dispatch({
                                type: "INCREASE_QTY",
                                payload: { productId: item.productId },
                              })
                            }
                          >
                            +
                          </button>
                        </td>

                        <td>
                          {(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td>{item.price.toLocaleString()}</td>
                        <td>{item.quantity}</td>
                        <td>{item.productName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ⭐ نمایش جمع کل سبد */}
          <div className="mt-3 alert alert-info text-center fs-5">
            مجموع کل:{" "}
            <strong>{totalPrice.toLocaleString()} تومان</strong>
          </div>

          <textarea
            rows={12}
            className="form-control mono mt-3"
            value={payloadText}
            onChange={(e) => {
              setPayloadText(e.target.value);
              try {
                dispatch({
                  type: "LOAD_FROM_JSON",
                  payload: JSON.parse(e.target.value),
                });
              } catch {}
            }}
            style={{ fontFamily: "monospace" }}
          />

          {basketMutation.isPending ? (
            <img src={loadingimg} width={150} alt="loading..." />
          ) : (
            <div>
              <button
                className="btn btn-success mt-3"
                onClick={() => navigate("/checkout")}
              >
                تسویه حساب
              </button>
              &nbsp;&nbsp;
              <button
                className="btn btn-info mt-3"
                onClick={sendBasket}
                disabled={basketMutation.isPending}
              >
                افزودن به سبد
              </button>
            </div>
          )}

          {response && (
            <div className="alert alert-success mt-3">
              <pre
                className="pretty-json"
                dangerouslySetInnerHTML={{
                  __html: prettyJson(response),
                }}
              />
            </div>
          )}

          {error && (
            <div className="alert alert-danger mt-3">
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasketLauncher;