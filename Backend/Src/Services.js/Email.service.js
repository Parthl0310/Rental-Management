import nodemailer from "nodemailer"
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";

const createTransporter = ()=>{
    return nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.GMAIL_USER,
            pass:process.env.GMAIL_APP_PASSWORD
        },
        tls:{
            rejectUnauthorized: false,
        }
    });
};

const sendEmail=AsyncHandler(async ({to,subject,html})=>{
    if(!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD){
        throw new ApiError(500,"Gmail User Not found");
    }

    const transporter=createTransporter();
    const result=await transporter.sendMail({
        from:process.env.GMAIL_USER,
        to,
        subject,
        html
    });

    if(!result){
        throw new ApiError(500,"Gmail is Not send");
    }

})

export {createTransporter,sendEmail};