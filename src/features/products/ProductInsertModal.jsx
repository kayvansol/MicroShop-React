import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories } from "@services/categoryService";
import { insertProduct } from "@services/productService";

// ----------------------
// Validation Schema
// ----------------------
const schema = yup.object({
  productName: yup.string().required("نام کالا الزامی است"),
  categoryId: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("انتخاب گروه کالا الزامی است"),
  price: yup
    .number()
    .typeError("قیمت باید عدد باشد")
    .positive("قیمت باید بزرگتر از صفر باشد"),
  inventory: yup
    .number()
    .typeError("موجودی باید عدد باشد")
    .min(0, "موجودی نمی‌تواند منفی باشد"),
});

export default function ProductInsertModal() {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  const open = () => setShow(true);
  const close = () => setShow(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // --------------------
  // Categories Query
  // --------------------
  const { data: categories = [], isLoading: loadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: ({ signal }) => getAllCategories(signal),
    staleTime: 5 * 60 * 1000,
    onError: () => {
      toast.error("خطا در دریافت گروه کالاها");
    },
  });

  // --------------------
  // Insert Mutation
  // --------------------
  const insertMutation = useMutation({
    mutationFn: insertProduct,
    onSuccess: () => {
      toast.success("کالا با موفقیت ثبت شد 🎉");
      reset();
      close();
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: () => {
      toast.error("ثبت کالا انجام نشد");
    },
  });

  const submitForm = (data) => {
    insertMutation.mutate(data);
  };

  return (
    <>
      <Toaster
        toastOptions={{
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

      {/* Refresh Button */}
      <div className="mt-3">
        <button
          className="btn btn-primary me-4"
          style={{ marginTop: "10px", width: "130px" }}
          onClick={open}
        >
          ➕ افزودن کالا
        </button>
        <button
          className="btn btn-success"
          style={{ marginTop: "10px", width: "130px" }}
          onClick={() =>
            queryClient.invalidateQueries({
              queryKey: ["products"],
            })
          }
        >
          🔄️ رفرش
        </button>
      </div>
      {show && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content position-relative">
              <div className="modal-header bg-dark text-white">
                <button className="btn-close" onClick={close}></button>
                <h5 className="ms-auto">افزودن کالا</h5>
              </div>

              <form onSubmit={handleSubmit(submitForm)}>
                <div className="modal-body position-relative">
                  {insertMutation.isPending && (
                    <div className="position-absolute w-100 h-100 top-0 start-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center">
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
                      disabled={loadingCats}
                    >
                      <option value="">... انتخاب</option>
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
                    onClick={close}
                  >
                    انصراف
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => reset()}
                  >
                    پاک‌سازی
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={insertMutation.isPending}
                  >
                    ثبت کالا
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
