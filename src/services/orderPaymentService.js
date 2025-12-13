import client from "@lib/axios/axiosClient";

/**
 * ارسال پرداخت سفارش
 */
export const sendOrderPayment = async (payload) => {
    const response = await client.post("/orderpayment", payload);
    return response.data;
};
