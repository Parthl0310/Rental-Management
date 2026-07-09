import { ApiError } from "../Utils/ApiError.js"
import { AsyncHandler } from "../Utils/AsyncHandler.js"

const isAdmin=AsyncHandler(async(req,res,next)=>{

    if(req.user.role !== "admin"){
        throw new ApiError(403,"Admin access required")
    }
    next();
})

const isCustomer=AsyncHandler(async(req,res,next)=>{
    
    if(req.user.role !== "customer"){
        throw new ApiError(403, "Customer access required");    
    }
    next();
})

export {isAdmin,isCustomer}