import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getOrderItems } from "@services/orderService";

export default function OrderItemsModal({ orderId, show, onClose }) {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    // ---------------------------
    // Load Items
    // ---------------------------
    const loadItems = async () => {
        if (!orderId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getOrderItems(orderId);
            setItems(data);

            toast.success("آیتم‌های سفارش بارگذاری شد");
        } catch (err) {
            toast.error("خطا در دریافت آیتم‌ها");

            setError(
                err.response
                    ? `${err.response.status} - ${JSON.stringify(err.response.data)}`
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    };

      // لود آیتم‌ها هنگام باز شدن مودال
    useEffect(() => {
        if (show) {
            loadItems();
        }
    }, [show, orderId]);

    if (!show) return null;

    return (
        <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">

                    <div className="modal-header bg-dark text-white">
                        <button className="btn-close" onClick={onClose}></button>
                        <h5 className="mx-auto">آیتم‌های سفارش #{orderId}</h5>
                    </div>

                    <div className="modal-body position-relative">

                        {loading && (
                            <div
                                className="position-absolute w-100 h-100 top-0 start-0
                                           bg-white bg-opacity-75 d-flex justify-content-center 
                                           align-items-center"
                            >
                                <div className="spinner-border"></div>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {!loading && items.length === 0 && !error && (
                            <div className="alert alert-warning">
                                هیچ آیتمی یافت نشد
                            </div>
                        )}

                        {!loading && items.length > 0 && (
                            <div className="data-table-wrapper">
                                <table className="data-table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>تخفیف</th>
                                            <th>قیمت</th>
                                            <th>تعداد</th>
                                            <th>نام محصول</th>
                                            <th>شماره آیتم</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((it) => (
                                            <tr key={it.itemId}>
                                                <td>{it.discount}</td>
                                                <td>{Number(it.price).toLocaleString()}</td>
                                                <td>{it.quantity}</td>
                                                <td>{it.productName}</td>
                                                <td>{it.itemId}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            بستن
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
