import jwt from "jsonwebtoken"
import { ApiError } from "../Utils/ApiError.js"
import { AsyncHandler } from "../Utils/AsyncHandler.js"
import { User } from "../Models/User.models.js"

const verifyJWT = AsyncHandler(async (req,res,next)=>{
    try {
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401,"Unauthorized");
        }

        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user=await User.findById(decodedToken?._id).select("-password -refreshtoken")
        
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
        if(user.isBlocked){
            throw new ApiError(403,"User Is Blocked")
        }

        req.user=user;
        next()

    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access Token")
    }
})

export default verifyJWT