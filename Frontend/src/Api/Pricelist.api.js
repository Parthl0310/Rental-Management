import api from "./axios";

export const getActivePricelistsAPI=async()=>{
    const response=await api.get("/pricelists/active");
    return response.data
}

export const createPricelistAPI=async(data)=>{
    const response=await api.post("/pricelists/",data);
    return response.data
}

export const getAllPricelistsAPI=async()=>{
    const response=await api.get("/pricelists/");
    return response.data
}

export const updatePricelistAPI=async(id,data)=>{
    const response=await api.put(`/pricelists/${id}`,data);
    return response.data
}

export const deletePricelistAPI=async(id)=>{
    const response=await api.delete(`/pricelists/${id}`);
    return response.data
}