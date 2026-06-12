import api from "./axios";

export const getAllProductsAPI = async (params) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const  getSingleProductAPI=async(id)=>{
    const response=await api.get(`/products/${id}`);
    return response.data;
}

export const getProductAvailabilityAPI=async(id)=>{
    const response=await api.get(`/products/${id}/availability`);
    return response.data;
}

export const calculatePriceAPI=async(data)=>{
    const response=await api.post('/products/calculate-price',data);
    return response.data;
}

export const  createProductAPI=async(data)=>{
    const response=await api.post('/products/',data);
    return response.data;
}

export const  updateProductAPI=async(id,data)=>{
    const response=await api.put(`/products/${id}`,data);
    return response.data;
}

export const deleteProductAPI=async(id)=>{
    const response=await api.delete(`/products/${id}`);
    return response.data;
}

export const updateStockAPI=async(id,data)=>{
    const response=await api.post(`/products/${id}/update-stock`,data);
    return response.data;
}

