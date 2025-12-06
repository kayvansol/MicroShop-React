import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const ProductInsertModal = () => {
  const [show, setShow] = useState(false);

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  // ------------------------
  // Loading Overlay
  // ------------------------
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------------------------
  // Categories
  // ------------------------
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  // ------------------------
  // Form State
  // ------------------------
  const [form, setForm] = useState({
    productName: "",
    categoryId: "",
    price: "",
    inventory: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // ------------------------
  // Load Categories
  // ------------------------
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCats(true);
      try {
        const res = await axios.post(
          "http://localhost:5180/api/Category/GetAllCategories",
          { statrtPage: 0, pageSize: 0 }
        );
        setCategories(res.data?.data ?? []);
      } catch (err) {
        toast.error("خطا در دریافت گروه کالاها");
      } finally {
        setLoadingCats(false);
      }
    };
    loadCategories();
  }, []);

  // ------------------------
  // Validation
  // ------------------------
  const validateForm = () => {
    const errors = {};

    if (!form.productName.trim()) errors.productName = "نام کالا الزامی است";
    if (!form.categoryId) errors.categoryId = "گروه کالا الزامی است";

    if (!form.price || form.price <= 0)
      errors.price = "قیمت باید بزرگتر از ۰ باشد";

    if (!form.inventory || form.inventory < 0)
      errors.inventory = "موجودی نمی‌تواند منفی باشد";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ------------------------
  // Submit Product
  // ------------------------
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("لطفاً خطاهای فرم را اصلاح کنید");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        addDto: {
          productName: form.productName,
          categoryId: Number(form.categoryId),
          price: Number(form.price),
          inventory: Number(form.inventory),
        },
      };

      const res = await axios.post(
        "http://localhost:5180/api/Products/InsertProduct",
        payload
      );

      toast.success("کالا با موفقیت ثبت شد 🎉");
      clearForm();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در ثبت کالا");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------------
  // Clear Form
  // ------------------------
  const clearForm = () => {
    setForm({
      productName: "",
      categoryId: "",
      price: "",
      inventory: "",
    });
    setFormErrors({});
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

      {/* Button to open modal */}
      <button className="btn btn-primary mt-3" onClick={openModal}>
        افزودن کالا جدید
      </button>

      {/* Modal */}
      {show && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">درج کالای جدید</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body position-relative">
                {/* Loading Overlay */}
                {isSubmitting && (
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 100 }}
                  >
                    <div className="spinner-border" role="status"></div>
                  </div>
                )}

                {/* Product Name */}
                <div className="mb-3">
                  <label className="form-label">نام کالا</label>
                  <input
                    className={`form-control ${
                      formErrors.productName ? "is-invalid" : ""
                    }`}
                    value={form.productName}
                    onChange={(e) =>
                      setForm({ ...form, productName: e.target.value })
                    }
                  />
                  <div className="invalid-feedback">
                    {formErrors.productName}
                  </div>
                </div>

                {/* Category */}
                <div className="mb-3">
                  <label className="form-label">گروه کالا</label>

                  {loadingCats ? (
                    <div>در حال بارگذاری...</div>
                  ) : (
                    <select
                      className={`form-select ${
                        formErrors.categoryId ? "is-invalid" : ""
                      }`}
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm({ ...form, categoryId: e.target.value })
                      }
                    >
                      <option value="">انتخاب...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="invalid-feedback">
                    {formErrors.categoryId}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="form-label">قیمت</label>
                  <input
                    type="number"
                    className={`form-control ${
                      formErrors.price ? "is-invalid" : ""
                    }`}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                  <div className="invalid-feedback">{formErrors.price}</div>
                </div>

                {/* Inventory */}
                <div className="mb-3">
                  <label className="form-label">موجودی</label>
                  <input
                    type="number"
                    className={`form-control ${
                      formErrors.inventory ? "is-invalid" : ""
                    }`}
                    value={form.inventory}
                    onChange={(e) =>
                      setForm({ ...form, inventory: e.target.value })
                    }
                  />
                  <div className="invalid-feedback">{formErrors.inventory}</div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={clearForm}>
                  پاک‌سازی
                </button>
                <button className="btn btn-success" onClick={handleSubmit}>
                  ثبت کالا
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInsertModal;
