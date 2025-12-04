import React, { useEffect, useState } from "react";
import client from "../api/axiosClient";
import toast from "react-hot-toast";
import { nullsToZero } from "../assets/Utils";
import { useNavigate } from "react-router-dom";
import "../assets/basket-grid.css";

export default function BasketGrid({ onAdd, onRemove }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [animateId, setAnimateId] = useState(null);
  const [refresh, setRefresh] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal;

    const load = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const res = await client.post("/products/GetAllProducts", "{}", {
          signal,
        });

        setProducts(nullsToZero(res.data.data));
      } catch (err) {
        if (err.name === "CanceledError") return;
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
    return () => controller.abort();
  }, [refresh]);

  const highlight = (name) => {
    if (!search) return name;
    const regex = new RegExp(`(${search})`, "gi");
    return name.replace(regex, `<mark>$1</mark>`);
  };

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="row mt-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="col-6 col-md-4 col-lg-3 mb-4">
            <div className="dk-skeleton"></div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger mt-3">
        ❌ خطا در دریافت کالاها <br /> {error}
      </div>
    );

  return (
    <>
      {/* Top Buttons */}
      <div className="gap-3 mb-3">
        <button className="btn btn-primary" onClick={() => navigate("/product")}>
          افزودن کالا
        </button>
        &nbsp;&nbsp;
        <button
          onClick={() => {
            setRefresh(Date.now().toString());
            setLoading(true);
          }}
          className="btn btn-success"
        >
          رفرش
        </button>
      </div>

      {/* Search Bar */}
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="جستجوی کالا..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* PRODUCT GRID */}
      <div className="row">
        {filtered.map((p) => (
          <div
            key={p.productId}
            className="col-6 col-md-4 col-lg-3 mb-4 dk-card-wrapper"
            onClick={() => {
              toast.success(`${p.productName} به سبد افزوده شد 🎉`);
              onAdd(p);
              setAnimateId(p.productId);
              setTimeout(() => setAnimateId(null), 300);
            }}
          >
            <div
              className={`dk-card ${animateId === p.productId ? "dk-bounce" : ""
                }`}
            >
              {/* Title */}
              <div
                className="dk-title"
                dangerouslySetInnerHTML={{
                  __html: highlight(p.productName),
                }}
              />

              {/* Price */}
              <div className="dk-price mt-2">
                {Number(p.price).toLocaleString()} تومان
              </div>

              {p.quantity && (
                <div className="dk-badge mt-2">موجودی: {p.quantity}</div>
              )}

              {/* Remove button */}
              <button
                className="dk-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(p.productId);
                }}
              >
                حذف کالا
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
