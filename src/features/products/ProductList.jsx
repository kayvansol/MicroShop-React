import React from "react";
import toast from "react-hot-toast";
import ProductInsertModal from "./ProductInsertModal";
import "@shared/assets/css/basket-anim.css";
import loadingimg from "@shared/assets/img/b.gif";
import { useTitle } from "@hooks/useTitle";
import { getAllProducts, deleteProductById } from "@services/productService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProductList() {
  useTitle("محصولات");

  const queryClient = useQueryClient();

  // --------------------
  // Products Query
  // --------------------
  const {
    data: products = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    onError: () => {
      toast.error("خطا در دریافت لیست کالاها");
    },
  });

  // --------------------
  // Delete Mutation
  // --------------------
  const deleteMutation = useMutation({
    mutationFn: deleteProductById,
    onSuccess: () => {
      toast.success("کالا حذف شد");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: () => {
      toast.error("حذف کالا انجام نشد");
    },
  });

  const deleteProduct = (id) => {
    if (!window.confirm("آیا از حذف کالا مطمئن هستید؟")) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">لیست کالاها</div>

        <ProductInsertModal />

        <div className="card-body">
          {isLoading && (
            <div className="alert alert-info mt-3 text-center">
              <img src={loadingimg} width={150} alt="loading..." />
            </div>
          )}

          {!isLoading && isFetching && (
            <div className="alert alert-warning">
              <img src={loadingimg} width={120} />
              <span className="ms-2">در حال بروزرسانی...</span>
            </div>
          )}
          
          {!isLoading && (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>عملیات</th>
                    <th>موجودی</th>
                    <th>قیمت</th>
                    <th>گروه</th>
                    <th>نام کالا</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.productId}>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteProduct(p.id)}
                          disabled={deleteMutation.isPending}
                        >
                          حذف
                        </button>
                      </td>
                      <td>{p.inventory}</td>
                      <td>{p.price?.toLocaleString()}</td>
                      <td>{p.categoryName}</td>
                      <td>{p.productName}</td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        هیچ کالایی ثبت نشده است
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
