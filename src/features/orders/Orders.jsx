import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import OrderItemsModal from "./OrderItemsModal";
import Badge from "./StatusBadge";
import { useTitle } from "@hooks/useTitle";
import { getAllOrders } from "@services/orderService";

export default function OrderListPage() {

    useTitle("سفارشات");

    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [idFilter, setIdFilter] = useState("");
    const [page, setPage] = useState(1);

    const pageSize = 5;

    const [showItemsModal, setShowItemsModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [loading, setLoading] = useState(false);

    // -----------------------------
    // Load Orders
    // -----------------------------
    const loadOrders = async () => {
        setLoading(true);
        toast.loading("در حال بارگذاری سفارش‌ها...");

        try {
            const data = await getAllOrders();
            setOrders(data);

            toast.dismiss();
            toast.success("سفارش‌ها بارگذاری شدند");
        } catch {
            toast.dismiss();
            toast.error("خطا در دریافت سفارش‌ها");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // -----------------------------
    // Filtering + Pagination (Memoized)
    // -----------------------------
    const filteredOrders = useMemo(() => {
        return orders
            .filter(o =>
                o.customerName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            )
            .filter(o =>
                statusFilter === ""
                    ? true
                    : o.orderStatus === Number(statusFilter)
            )
            .filter(o =>
                idFilter === ""
                    ? true
                    : o.orderId === Number(idFilter)
            );
    }, [orders, search, statusFilter, idFilter]);

    const totalPages = Math.ceil(filteredOrders.length / pageSize);

    const paginatedOrders = useMemo(() => {
        return filteredOrders.slice(
            (page - 1) * pageSize,
            page * pageSize
        );
    }, [filteredOrders, page]);

    // -----------------------------
    // Modal
    // -----------------------------
    const openItems = (orderId) => {
        setSelectedOrderId(orderId);
        setShowItemsModal(true);
    };

    return (
        <>
            <Toaster />

            <div className="container mt-4">
                <div className="card shadow">
                    <div className="card-header bg-black text-white">
            <h5>📦 لیست سفارش‌ها</h5>
                    </div>

                    <div className="card-body">

                        {/* Filters */}
                        <div className="row mb-3">
                            <div className="col-md-4 mb-2">
                                <input
                                    className="form-control"
                                    placeholder="جستجو بر اساس نام مشتری..."
                                    value={search}
                                    onChange={(e) => {
                                        setPage(1);
                                        setSearch(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="col-md-4 mb-2">
                                <input
                                    className="form-control"
                                    placeholder="جستجو بر اساس شماره سفارش..."
                                    value={idFilter}
                                    onChange={(e) => {
                                        setPage(1);
                                        setIdFilter(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="col-md-4 mb-2">
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setPage(1);
                                        setStatusFilter(e.target.value);
                                    }}
                                >
                                    <option value="">همه وضعیت‌ها</option>
                                    <option value="0">در انتظار پرداخت</option>
                                    <option value="1">عدم موجودی</option>
                                    <option value="2">پرداخت شده</option>
                                    <option value="3">پرداخت ناموفق</option>
                                    <option value="4">در حال پردازش</option>
                                    <option value="5">آماده ارسال</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        {loading ? (
                            <div className="text-center p-4">
                                <div className="spinner-border" />
                            </div>
                        ) : (
                            <div className="data-table-wrapper">
                                <table className="data-table">
                                    <thead className="table-dark2">
                                        <tr>
                                            <th>آیتم‌ها</th>
                                            <th>تاریخ حمل</th>
                                            <th>تاریخ نیاز</th>
                                            <th>تاریخ ثبت</th>
                                            <th>وضعیت</th>
                                            <th>مشتری</th>
                                            <th>شماره سفارش</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedOrders.map((o) => (
                                            <tr key={o.orderId}>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => openItems(o.orderId)}
                                                    >
                                                        نمایش
                                                    </button>
                                                </td>
                                                <td>{new Date(o.shippedDate).toLocaleDateString("fa-IR")}</td>
                                                <td>{new Date(o.requiredDate).toLocaleDateString("fa-IR")}</td>
                                                <td>{new Date(o.orderDate).toLocaleDateString("fa-IR")}</td>
                                                <td>
                                                    <Badge
                                                        status={o.orderStatus}
                                                        statusname={o.orderStatusName}
                                                    />
                                                </td>
                                                <td>{o.customerName}</td>
                                                <td>{o.orderId}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="d-flex justify-content-center gap-2 mt-3">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`btn ${
                                        page === i + 1
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

            {/* Items Modal */}
            <OrderItemsModal
                orderId={selectedOrderId}
                show={showItemsModal}
                onClose={() => setShowItemsModal(false)}
            />
        </>
    );
}
