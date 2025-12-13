import client from "@lib/axios/axiosClient";

/**
 * دریافت لیست محصولات
 */
export const getAllProducts = async () => {
    const response = await client.post("/Products/GetAllProducts", {});
    return response.data?.data || [];
};

// **************************************************

/**
 * حذف محصول
 */
export const deleteProductById = async (id) => {
    return await client.delete(`/api/Products/DeleteProduct?id=${id}`);
};

// **************************************************

/**
 * درج محصول جدید
 */
export const insertProduct = async (data) => {
    const payload = {
        addDto: {
            ...data,
            categoryId: Number(data.categoryId),
            price: Number(data.price),
            inventory: Number(data.inventory),
        },
    };

    return await client.post("/Products/InsertProduct", payload);
};

// **************************************************

/**
 * دریافت لیست محصولات (برای Basket)
 */
export const getAllProductsForBasket = async (signal) => {
    const response = await client.post(
        "/products/GetAllProducts",
        "{}",
        { signal }
    );

    return response.data?.data || [];
};
