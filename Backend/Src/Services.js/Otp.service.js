import { OTP } from "../Models/OTP.models.js";
import { User } from "../Models/User.models.js";

const generateRamdomOtp=()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const saveOTP= async (email,otp,type)=>{
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    await OTP.deleteMany({ email });
    if (user.isVerified && type !== "reset") {
        throw new ApiError(400, "User is already verified");
    }
    
    let expiresAt = Date.now() + 10 * 60 * 1000;
    if(type === "reset"){
        expiresAt = Date.now() + 15 * 60 * 1000;
    }
    const createdOtp = await OTP.create({
    email,
    otp,
    expiresAt,
    type
  });

  if (!createdOtp) {
    throw new ApiError(500, "Somthing went Wrong While Creating the OTP");
  }
}
export {generateRamdomOtp,saveOTP};