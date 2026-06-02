import mongoose,{Schema} from "mongoose";

const otpschema=new Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true
    },
    type:{
        type:String,
        enum:["signup","reset"],
        default:"signup"
    }
},{timestamps:true});

export const OTP=mongoose.model("OTP",otpschema);