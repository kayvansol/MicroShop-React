import React, { useEffect, useState } from "react";
import loadingimg from "../assets/b.gif";
import { nullsToZero } from "../assets/Utils";
import client from "../api/axiosClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function BasketGrid({ onAdd, onRemove }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [animateId, setAnimateId] = useState(null);
  const [refresh, setRefresh] = useState("");

  const navigate = useNavigate();

  const productClick = () => {
    navigate("/product");
  }

  useEffect(() => {

    const controller = new AbortController(); // برای لغو درخواست
    const signal = controller.signal;

    const load = async () => {

      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const res = await client.post(
          "/api/products/GetAllProducts",
          "{}",
          { signal }
        );

        setProducts(nullsToZero(res.data.data));
      } catch (err) {
        if (err.name === "CanceledError" || err.message === "canceled") return;

        setError(
          err.response
            ? `${err.response.status} - ${JSON.stringify(err.response.data)}`
            : err.message
        );
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      controller.abort();      // جلوگیری از memory leak
    };

  }, [refresh]);


  if (loading)
    return (
      <div className="alert alert-info mt-3">
        <img src={loadingimg} width={150} alt="loading..." />
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger mt-3">
        خطا در دریافت کالاها: <br />
        {error}
      </div>
    );

  if (products.length === 0)
    return (
      <div className="alert alert-warning mt-3">
        هیچ کالایی در سیستم ثبت نشده است.
      </div>
    );

  // -----------------------------------
  // FILTER + HIGHLIGHT
  // -----------------------------------
  const highlight = (name) => {
    if (!search) return name;
    const regex = new RegExp(`(${search})`, "gi");
    return name.replace(regex, "<mark>$1</mark>");
  };

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => {
            setRefresh(Date.now().toString());
            setLoading(true);
          }}
          className="btn btn-success me-4"
        >
          رفرش
        </button>&nbsp;&nbsp;
        <button className="btn btn-primary me-4" onClick={productClick}>
          افزودن کالا
        </button>
      </div>
      {/* Search Box */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="جستجوی کالا..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="row mt-3">
        {filtered.map((p, index) => (
          <div
            key={p.productId}
            className="col-3"
            onClick={() => {
              toast.success(`${p.productName} به سبد افزوده شد 😊`);

              onAdd(p); // اضافه کردن کالا
              setAnimateId(p.productId); // انیمیشن
              setTimeout(() => setAnimateId(null), 350);
            }}
            style={{
              cursor: "pointer",
              padding: 12,
              border: "1px solid #44fe00ff",
              borderRadius: 50,
              marginBottom: 10,
              marginRight: 10,
              transition: "0.3s",
              transform: animateId === p.productId ? "scale(1.07)" : "scale(1)",
              boxShadow:
                animateId === p.productId
                  ? "0 0 20px rgba(255, 85, 0, 0.6)"
                  : "none",
              backgroundColor:
                index % 2 === 0 ? "lightgoldenrodyellow" : "honeydew",
            }}
          >
            <h6
              className="fw-bold"
              dangerouslySetInnerHTML={{ __html: highlight(p.productName) }}
            />

            <div>Price: {Number(p.price).toLocaleString()}</div>

            {p.quantity && (
              <div className="text-secondary small">
                Available: {p.quantity}
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(p.productId);
              }}
              className="btn btn-xs btn-danger mt-2"
              style={{ padding: "2px 6px", fontSize: "12px" }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
