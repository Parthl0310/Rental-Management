import api from "./axios";

export const getActivePricelistsAPI=async()=>{
    const response=await api.get("/active");
    return response.data
}

