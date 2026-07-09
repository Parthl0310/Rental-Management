import api from "./Axios";

export const toggleWishlistAPI = async (productId) => {
  const response = await api.post(`/wishlist/toggle/${productId}`);
  return response.data;
};

export const getWishlistAPI = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const checkWishlistAPI = async (productId) => {
  const response = await api.get(`/wishlist/check/${productId}`);
  return response.data;
};
