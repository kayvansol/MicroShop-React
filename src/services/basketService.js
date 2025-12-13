import client from "@lib/axios/axiosClient";

/**
 * ارسال سبد خرید
 */
export const submitBasket = async (basketState, signal) => {
    const payload = {
        ...basketState,
        items: basketState.items.map((i) => ({
            ...i,
            productId: String(i.productId),
        })),
    };

    const response = await client.post("/basket", payload, { signal });
    return response.data;
};

// **************************************************

/**
 * Checkout سبد خرید
 */
export const checkoutBasket = async (customerId) => {
    const payload = {
        customerId: Number(customerId),
    };

    const response = await client.post("/basket/Checkout", payload);
    return response.data;
};
