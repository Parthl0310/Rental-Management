import jwt from "jsonwebtoken";

const GenerateAccessToken =(userId)=>{
        return jwt.sign(
            {
            _id:userId
            },process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        )
    }
export {GenerateAccessToken}