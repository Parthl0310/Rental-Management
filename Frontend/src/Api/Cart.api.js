import api from "./Axios";

export const getCartAPI = async () => {
    const response = await api.get("/cart");
    return response.data;
};

export const addToCartAPI = async (data) => {
    const response = await api.post("/cart/add", data);
    return response.data;
};

export const updateCartItemAPI = async (productId, data) => {
    const response = await api.put(`/cart/item/${productId}`, data);
    return response.data;
};

export const removeCartItemAPI = async (productId) => {
    const response = await api.delete(`/cart/item/${productId}`);
    return response.data;
};

export const clearCartAPI = async () => {
    const response = await api.delete("/cart/clear");
    return response.data;
};

export const applyCouponAPI = async (data) => {
    const response = await api.post("/cart/apply-coupon", data);
    return response.data;
};

export const removeCouponAPI = async () => {
    const response = await api.delete("/cart/remove-coupon");
    return response.data;
};
