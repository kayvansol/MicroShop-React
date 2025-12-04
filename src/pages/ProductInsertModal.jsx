import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import client from "../api/axiosClient";

// ----------------------
// Validation Schema
// ----------------------
const schema = yup.object({
  productName: yup.string().required("نام کالا الزامی است"),
  categoryId: yup.number().required("انتخاب گروه کالا الزامی است"),
  price: yup
    .number()
    .typeError("قیمت باید عدد باشد")
    .positive("قیمت باید بزرگتر از صفر باشد"),
  inventory: yup
    .number()
    .typeError("موجودی باید عدد باشد")
    .min(0, "موجودی نمی‌تواند منفی باشد"),
});

export default function ProductInsertModal({ onInserted, onLoading }) {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const open = () => setShow(true);
  const close = () => setShow(false);

  // --------------------------------------------
  // React Hook Form
  // --------------------------------------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // --------------------------------------------
  // Load Categories
  // --------------------------------------------
  useEffect(() => {
    let isMounted = true; // جلوگیری از setState روی کامپوننت Unmounted
    const controller = new AbortController();

    const loadCats = async () => {
      setLoadingCats(true);

      setError(null);

      try {
        const res = await client.post(
          "/Category/GetAllCategories",
          {
            statrtPage: 0,
            pageSize: 0,
          },
          { signal: controller.signal }
        );

        if (!isMounted) return;

        setCategories(res.data.data || []);
      } catch (err) {
        // اگر درخواست لغو شد → خطا نیست
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          console.log("⛔ درخواست لغو شد");
          return;
        }

        if (!isMounted) return;

        toast.error("خطا در دریافت گروه کالاها");

        setError(
          err.response
            ? `${err.response.status} - ${JSON.stringify(err.response.data)}`
            : err.message
        );
      } finally {
        if (isMounted) setLoadingCats(false);
      }
    };

    loadCats();

    return () => {
      isMounted = false;
      controller.abort(); // لغو درخواست
    };
  }, []);

  // --------------------------------------------
  // Submit Handler
  // --------------------------------------------
  const submitForm = async (data) => {
    setSubmitting(true);

    try {
      const payload = {
        addDto: {
          ...data,
          categoryId: Number(data.categoryId),
          price: Number(data.price),
          inventory: Number(data.inventory),
        },
      };

      await client.post("/Products/InsertProduct", payload);

      toast.success("کالا با موفقیت ثبت شد 🎉");

      reset();
      close();
      onInserted(); // refresh list
    } catch (err) {
      toast.error("ثبت کالا انجام نشد");

      setError(
        err.response
          ? `${err.response.status} - ${JSON.stringify(err.response.data)}`
          : err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          duration: 3000,
          style: {
            background: "rgba(20,20,20,0.85)",
            color: "#fff",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#4CAF50",
              secondary: "white",
            },
          },
        }}
      />
      <div>
        <button
          className="btn btn-primary me-4"
          style={{ marginTop: "10px", width: "130px" }}
          onFocus={() => {
            setError(null);
          }}
          onClick={open}
        >
          ➕ افزودن کالا
        </button>

        {!onLoading && (
          <button
            className="btn btn-success me-4"
            style={{ marginTop: "10px", width: "130px" }}
            onClick={() => {
              onInserted(); // refresh list
              setError(null);
            }}
          >
            🔄️ رفرش
          </button>
        )}
      </div>

      {show && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <div style={{ textAlign: "left" }}>
                  <button className="btn-close" onClick={close}></button>
                </div>
                <div style={{ textAlign: "right", width: "90%" }}>
                  <h5>افزودن کالا</h5>
                </div>
              </div>

              <form onSubmit={handleSubmit(submitForm)}>
                <div className="modal-body">
                  {/* Overlay Loader */}
                  {submitting && (
                    <div
                      className="position-absolute w-100 h-100 top-0 start-0 
                                                bg-white bg-opacity-75 d-flex justify-content-center 
                                                align-items-center"
                    >
                      <div className="spinner-border"></div>
                    </div>
                  )}

                  {/* Product Name */}
                  <div className="mb-3">
                    <label>نام کالا</label>
                    <input
                      className={`form-control ${
                        errors.productName ? "is-invalid" : ""
                      }`}
                      {...register("productName")}
                    />
                    <div className="invalid-feedback">
                      {errors.productName?.message}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-3">
                    <label>گروه محصول</label>
                    <select
                      className={`form-select ${
                        errors.categoryId ? "is-invalid" : ""
                      }`}
                      {...register("categoryId")}
                    >
                      <option value="" style={{ textAlign: "right" }}>
                        ... انتخاب
                      </option>

                      {categories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>

                    <div className="invalid-feedback">
                      {errors.categoryId?.message}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <label>قیمت</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.price ? "is-invalid" : ""
                      }`}
                      {...register("price")}
                    />
                    <div className="invalid-feedback">
                      {errors.price?.message}
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="mb-3">
                    <label>موجودی</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.inventory ? "is-invalid" : ""
                      }`}
                      {...register("inventory")}
                    />
                    <div className="invalid-feedback">
                      {errors.inventory?.message}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => close()}
                  >
                    انصراف
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => reset()}
                  >
                    پاک‌ سازی
                  </button>

                  <button type="submit" className="btn btn-success">
                    ثبت کالا
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3">
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
