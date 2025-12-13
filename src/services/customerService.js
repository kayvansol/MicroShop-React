import client from "@lib/axios/axiosClient";

/**
 * دریافت لیست مشتریان
 */
export const getAllCustomers = async () => {
    const response = await client.post("/Customer/GetAllCustomers", {});
    return response.data?.data || [];
};
