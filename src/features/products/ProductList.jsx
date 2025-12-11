import React, { useEffect, useState } from "react";
import client from "@lib/axios/axiosClient";
import toast from "react-hot-toast";
import ProductInsertModal from "./ProductInsertModal";
import "@shared/assets/css/basket-anim.css";
import loadingimg from "@shared/assets/img/b.gif";  
import {useTitle} from "@hooks/useTitle";

export default function ProductList() {

    useTitle("محصولات");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadProducts = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const res = await client.post("/Products/GetAllProducts", {});
            setProducts(res.data?.data || []);
            console.log(res.data?.data);
        } catch {
            toast.error("خطا در دریافت لیست کالاها");
        } finally {
            setLoading(false);
        }
    };

    // load on mount
    useEffect(() => {

        loadProducts();

    }, []);

    const deleteProduct = async (id) => {
        if (!window.confirm("آیا از حذف کالا مطمئن هستید؟")) return;

        try {
            await client.delete(`/api/Products/DeleteProduct?id=${id}`);
            toast.success("کالا حذف شد");
            loadProducts(); // reload list
        } catch {
            toast.error("حذف کالا انجام نشد");
        }
    };

    return (
        <div className="container mt-4">

            <div className="card">

                <div className="card-header">لیست کالاها</div>

                {/* Insert Modal */}
                <ProductInsertModal onInserted={loadProducts} onLoading={loading} />

                <div className="card-body">

                    {loading && <div className="alert alert-info mt-3">
                        <img src={loadingimg} width={150} alt="loading..." />
                    </div>}

                    {!loading &&
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
                    }
                </div>
            </div>
        </div>
    );
}
