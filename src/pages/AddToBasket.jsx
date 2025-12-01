import React, { useReducer, useState, useEffect } from "react";
import { basketReducer, initialBasket } from "../assets/basketReducer";
import BasketGrid from "./BasketGrid";
import loadingimg from "../assets/b.gif";
import client from "../api/axiosClient";
import { Toaster } from "react-hot-toast";
import "../assets/basket-anim.css";
import { prettyJson } from "../assets/prettyJson";

const BasketLauncher = () => {
  const [state, dispatch] = useReducer(basketReducer, initialBasket, (init) => {
    const saved = localStorage.getItem("basket");
    return saved ? JSON.parse(saved) : init;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const [payloadText, setPayloadText] = useState(
    JSON.stringify(
      initialBasket,
      function (key, value) {
        return value === null ? 0 : value;
      },
      2
    )
  );

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(state));
    setPayloadText(
      JSON.stringify(
        state,
        function (key, value) {
          return value === null ? 0 : value;
        },
        2
      )
    );
  }, [state]);

  const sendBasket = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    function normalizeBasket(state) {
      return {
        ...state,
        items: state.items.map((i) => ({
          ...i,
          productId: String(i.productId),
        })),
      };
    }

    try {
      // ایجاد وقفه مصنوعی 5 ثانیه
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const res = await client.post("/basket", normalizeBasket(state));
      setResponse(res.data);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (product) =>
    dispatch({ type: "ADD_ITEM", payload: product });

  const handleRemoveItem = (productId) =>
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });

  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <Toaster />

      <div className="card">
        <div className="card-header">لیست کالاها</div>

        <div className="card-body">
          <BasketGrid onAdd={handleAddItem} onRemove={handleRemoveItem} />
          <hr></hr>
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
                      <tr key={item.productId} className="row-add-anim">
                        <td className="table-actions">
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

                        <td>{(item.price * item.quantity).toLocaleString()}</td>
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
            مجموع کل: <strong>{totalPrice.toLocaleString()} تومان</strong>
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

          {loading ? (
            <img src={loadingimg} width={150} alt="loading..." />
          ) : (
            <button className="btn btn-info mt-3" onClick={sendBasket}>
              افزودن به سبد
            </button>
          )}

          {response && (
            <div className="alert alert-success mt-3">
              <pre
                className="pretty-json"
                dangerouslySetInnerHTML={{ __html: prettyJson(response) }}
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
