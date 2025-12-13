import client from "@lib/axios/axiosClient";

/**
 * دریافت لیست گروه‌های کالا
 */
export const getAllCategories = async (signal) => {
    const response = await client.post(
        "/Category/GetAllCategories",
        {
            statrtPage: 0,
            pageSize: 10,
        },
        { signal }
    );

    return response.data?.data || [];
};
