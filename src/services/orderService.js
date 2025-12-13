import client from "@lib/axios/axiosClient";

/**
 * دریافت سفارش‌های منتظر پرداخت
 */
export const getWaitingPaymentOrders = async () => {
    const response = await client.post("/Orders/WaitingPayments", {});
    return response.data?.data || [];
};

// **************************************************

/**
 * دریافت همه سفارش‌ها
 */
export const getAllOrders = async () => {
    const response = await client.post("/orders/GetAllOrders", {});
    return response.data?.data || [];
};

// **************************************************

/**
 * دریافت آیتم‌های یک سفارش
 */
export const getOrderItems = async (orderId) => {
    const response = await client.post("/orders/GetOrderItems", {
        orderId: Number(orderId),
    });

    return response.data?.data || [];
};