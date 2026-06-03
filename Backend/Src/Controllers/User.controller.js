import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { AsyncHandler } from "../Utils/AsyncHandler.js"

const getCurrentUser=AsyncHandler((req,res)=>{
    const user=req.user
    if(!user){
        throw new ApiError(404,"User Not Found");

    }
    res.status(200).json(new ApiResponse(200,user,"User Is Found"));
})

export {getCurrentUser}