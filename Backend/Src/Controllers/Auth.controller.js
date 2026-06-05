import nodemailer from "nodemailer";
import { User } from "../Models/User.models.js";
import { OTP } from "../Models/OTP.models.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import { generateRamdomOtp,saveOTP } from "../Services.js/Otp.service.js";
import { sendEmail,sendOTPEmail } from "../Services.js/Email.service.js";
import { GenerateAccessToken, GenerateRefreshToken ,refreshAccessTokenGenerate} from "../Utils/GenerateToken.js";
import jwt from "jsonwebtoken"

const registerUser = AsyncHandler(async (req, res) => {
  console.log("Body:", req.body);
  const { name, email, password, phone, role } = req.body;
  if (
    [name, email, password, phone, role].some((filed) => {
      return filed?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existsUser = await User.findOne({
    email,
  });

  if (existsUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
    isVerified: false,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshtoken");

  if (!createdUser) {
    throw new ApiError(500, "Somthing went Wrong While registering the user");
  }

  const otp = generateRamdomOtp();
  const otpType="signup";
  saveOTP(email,otp,otpType);
  sendOTPEmail(email,otp,otpType);
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        name: createdUser.name,
        email: createdUser.email,
      },
      "OTP sent to email"
    )
  );
});

const verifyOTP = AsyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const findotp = await OTP.findOne({ email });
  if (!findotp) {
    throw new ApiError(400, "invalid OTP");
  }
  if (findotp.type !== "signup") {
    await OTP.deleteOne({ _id: findotp._id });
    throw new ApiError(400, "invalid OTP");
  }

  const newdate = Date.now();
  if (findotp.expiresAt < newdate) {
    await OTP.deleteOne({ _id: findotp._id });
    throw new ApiError(400, "OTP expired");
  }

  if (otp !== findotp.otp) {
    throw new ApiError(400, "Wrong OTP");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User Not Found");
  }
  user.isVerified = true;
  await user.save();
  await OTP.deleteOne({ _id: findotp._id });

  const {accesstoken,refreshtoken} = refreshAccessTokenGenerate(user._id);
  const options = {
    httpOnly: true,
    secure: true,
    maxAge:  7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  };
  const options1 = {
    httpOnly: true,
    secure: true,
    maxAge:  30 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  };

  const verifiedUser = await User.findById(user._id).select("-password -refreshtoken");

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options1)
    .json(
      new ApiResponse(
        200,
        {
          "user":verifiedUser,
        },
        "user Created SuccesFully"
      )
    );
});

const resendOTP = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  const otp = generateRamdomOtp();
  const otpType="signup";
  saveOTP(email,otp,otpType);
  sendOTPEmail(email,otp,otpType);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        success:true
      },
      "OTP sent to email"
    )
  );
});

const loginUser=AsyncHandler(async (req,res)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email});
    
    if (!user) {
    throw new ApiError(404, "User Not Found");
    }

    if(!user.isVerified){
        throw new ApiError(403,"Please verify your email first")
    }
    if(user.isBlocked){
        throw new ApiError(403,"Account blocked")
    }

    const correctpassword=await user.ispasswordcorrect(password)

    if(!correctpassword){
        throw new ApiError(401,"Invalid credentials");
    }

    const {accesstoken,refreshtoken} =await refreshAccessTokenGenerate(user._id);
    const options = {
    httpOnly: true,
    secure: true,
    maxAge:  7 * 24 * 60 * 60 * 1000,  
    sameSite: "strict",
  };
    const options1 = {
    httpOnly: true,
    secure: true,
    maxAge:  30 * 24 * 60 * 60 * 1000,  
    sameSite: "strict",
  };

  const newUser = await User.findById(user._id).select("-password -refreshtoken");

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options1)
    .json(
      new ApiResponse(
        200,
        {
          "user":newUser,accesstoken,refreshtoken
        },
        "user logged in successfully"
      )
    );
})

const logoutUser=AsyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset:{
                refreshtoken:1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    };
    const options1 = {
        httpOnly: true,
        secure: true,
        maxAge:  30 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    };

    return res.status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options1)
    .json(new ApiResponse(200,{},"User Logout SuccesFully"))
})

const forgotPassword=AsyncHandler(async(req,res)=>{
    const {email}=req.body;

    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User Not Found");
    }

    const otp=generateRamdomOtp();
    const type="reset"
    saveOTP(email,otp,type)  
    sendOTPEmail(email,otp,type);

    return res.status(200).json(new ApiResponse(200,{
        success:true
    },"forgotPassword OTP sent successfully"))
})

const resetPassword=AsyncHandler(async(req,res)=>{
    const {email, otp, newPassword }=req.body;
    
    const user=await User.findOne({email});
    const savedOtp=await OTP.findOne({email,type:"reset"});

    if(!user){
        throw new ApiError(404,"User Not Found");

    }

    if(!savedOtp){
        throw new ApiError(400,"Reset Password is not found in DB");
    }

    const time=Date.now();
    if(savedOtp.expiresAt<time){
        throw new ApiError(400,"The Reset OTP is expirerd");

    }
    
    if(savedOtp.otp !== otp){
        throw new ApiError(400,"The Reset OTP is incorrect");
    }

    user.password=newPassword;
    await user.save();
    await OTP.findByIdAndDelete(savedOtp._id);

    return res.status(200).json(new ApiResponse( 200,{success:true}, "Password reset successful"))
})

const refreshAccessToken = AsyncHandler(async (req, res) => {

    const refreshToken = req.cookies.refreshtoken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token not found");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    if (user.refreshtoken !== refreshToken) {
        throw new ApiError(
            401,
            "Refresh token is expired or used"
        );
    }

    if (user.isBlocked) {
        throw new ApiError(403, "User is blocked");
    }

    const accessToken = GenerateAccessToken(user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Access token refreshed successfully"
            )
        );
});

export {registerUser,verifyOTP,resendOTP,loginUser,logoutUser,forgotPassword,resetPassword,refreshAccessToken} 