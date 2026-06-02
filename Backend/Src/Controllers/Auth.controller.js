import nodemailer from "nodemailer";
import { User } from "../Models/User.models.js";
import { OTP } from "../Models/OTP.models.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import { generateRamdomOtp } from "../Services.js/Otp.service.js";
import { sendEmail } from "../Services.js/Email.service.js";
import { GenerateAccessToken } from "../Utils/GenerateToken.js";

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

  const createdUser = await User.findById(user._id).select("-password ");

  if (!createdUser) {
    throw new ApiError(500, "Somthing went Wrong While registering the user");
  }

  const otp = generateRamdomOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const createdOtp = await OTP.create({
    email,
    otp,
    expiresAt,
  });

  if (!createdOtp) {
    throw new ApiError(500, "Somthing went Wrong While Creating the OTP");
  }

  await sendEmail({
    to: email,
    subject: "Verify Your Account - OTP",
    html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
            
            <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
                <h1>Account Verification</h1>
            </div>

            <div style="padding:30px;">
                <h2>Hello ${name},</h2>

                <p>Thank you for registering with us.</p>

                <p>Please use the following OTP to verify your account:</p>

                <div style="background:#f3f4f6; padding:20px; text-align:center; border-radius:8px; margin:25px 0;">
                    <h1 style="margin:0; color:#2563eb; letter-spacing:8px;">
                        ${otp}
                    </h1>
                </div>

                <p>
                    This OTP will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create this account, you can safely ignore this email.
                </p>

                <br>

                <p>
                    Regards,<br>
                    <strong>Rental Management Team</strong>
                </p>
            </div>

            <div style="background:#f9fafb; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                This is an automated email. Please do not reply.
            </div>
        </div>
    `,
  });

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

  const token = GenerateAccessToken(user._id);
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 604800000,
    sameSite: "strict",
  };

  const verifiedUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accesstoken", token, options)
    .json(
      new ApiResponse(
        200,
        {
          verifiedUser,
        },
        "user Created SuccesFully"
      )
    );
});

const resendOTP = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User Not Found");
    }

    if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }
    await OTP.deleteMany({ email });


  const otp = generateRamdomOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const createdOtp = await OTP.create({
    email,
    otp,
    expiresAt,
  });

  if (!createdOtp) {
    throw new ApiError(500, "Somthing went Wrong While Creating the OTP");
  }

  await sendEmail({
    to: email,
    subject: "Verify Your Account With  ReSend OTP",
    html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
            
            <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
                <h1>Account Verification</h1>
            </div>

            <div style="padding:30px;">
                <h2>Hello ${user.name},</h2>

                <p>Thank you for registering with us.</p>

                <p>Please use the following OTP to verify your account:</p>

                <div style="background:#f3f4f6; padding:20px; text-align:center; border-radius:8px; margin:25px 0;">
                    <h1 style="margin:0; color:#2563eb; letter-spacing:8px;">
                        ${otp}
                    </h1>
                </div>

                <p>
                    This OTP will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not create this account, you can safely ignore this email.
                </p>

                <br>

                <p>
                    Regards,<br>
                    <strong>Rental Management Team</strong>
                </p>
            </div>

            <div style="background:#f9fafb; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                This is an automated email. Please do not reply.
            </div>
        </div>
    `,
  });

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

    const token=GenerateAccessToken(user._id);
    const options = {
    httpOnly: true,
    secure: true,
    maxAge: 604800000,
    sameSite: "strict",
  };

  const newUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accesstoken", token, options)
    .json(
      new ApiResponse(
        200,
        {
          "user":newUser
        },
        "user logged in successfully"
      )
    );
})

const logoutUser=AsyncHandler(async(req,res)=>{
    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 604800000,
        sameSite: "strict",
    };

    return res.status(200).clearCookie("accesstoken",options).json(new ApiResponse(200,{},"User Logout SuccesFully"))
})

const forgotPassword=AsyncHandler(async(req,res)=>{
    const {email}=req.body;

    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404,"User Not Found");
    }

    await OTP.deleteMany({email});
    const otp=generateRamdomOtp();
    const expiresAt=Date.now()+(15*60*1000);
    const resetopt=await OTP.create({
        email,
        otp,
        expiresAt,
        type:"reset"
    })

    await sendEmail({to:email,subject:"To Forgot the Password OTP",
        html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
            
            <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
                <h1>Account Verification</h1>
            </div>

            <div style="padding:30px;">
                <h2>Hello ${user.name},</h2>

                <p>Thank you for registering with us.</p>

                <p>Please use the following OTP to verify your account:</p>

                <div style="background:#f3f4f6; padding:20px; text-align:center; border-radius:8px; margin:25px 0;">
                    <h1 style="margin:0; color:#2563eb; letter-spacing:8px;">
                        ${otp}
                    </h1>
                </div>

                <p>
                    This OTP will expire in
                    <strong>15 minutes</strong>.
                </p>

                <p>
                    If you did not create this account, you can safely ignore this email.
                </p>

                <br>

                <p>
                    Regards,<br>
                    <strong>Rental Management Team</strong>
                </p>
            </div>

            <div style="background:#f9fafb; padding:15px; text-align:center; color:#6b7280; font-size:12px;">
                This is an automated email. Please do not reply.
            </div>
        </div>
    `
    })
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

export {registerUser,verifyOTP,resendOTP,loginUser,logoutUser,forgotPassword,resetPassword} 