import jwt from "jsonwebtoken";
import { ApiError } from "./ApiError.js";
import { User } from "../Models/User.models.js";

const GenerateAccessToken =(userId)=>{
        return jwt.sign(
            {
            _id:userId
            },process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        )
}

const GenerateRefreshToken =(userId)=>{
        return jwt.sign(
            {
            _id:userId
            },process.env.REFRESH_TOKEN_SECRET,{
                expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN
            }
        )
}

const refreshAccessTokenGenerate=async (userid)=>{
  try {
    const user=await User.findById(userid);
    const accesstoken=GenerateAccessToken(userid)
    const refreshtoken=GenerateRefreshToken(userid) 
    user.refreshtoken=refreshtoken
    await user.save({validateBeforeSave : false})
    return {accesstoken,refreshtoken}

  } catch (error) {
    throw new ApiError(500,"Something Went wrong While generating refresh and access token")
  }
}

export {GenerateAccessToken,GenerateRefreshToken,refreshAccessTokenGenerate}