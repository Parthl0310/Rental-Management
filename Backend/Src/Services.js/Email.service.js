import nodemailer from "nodemailer";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/User.models.js";
import { OTP } from "../Models/OTP.models.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const sendEmail = AsyncHandler(async ({ to, subject, html }) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new ApiError(500, "Gmail User Not found");
  }

  const transporter = createTransporter();
  const result = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });

  if (!result) {
    throw new ApiError(500, "Gmail is Not send");
  }
});

const sendOTPEmail = async (email, otp, type) => {
  const user = await User.findOne({ email });
  let mess = "Verify Your Account";
  let time = 10;
  if (type === "reset") {
    mess = "Forgot Password";
    time = 15;
  }
  try {
    await sendEmail({
      to: email,
      subject: `${mess} - OTP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
            
            <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
                <h1>Account Verification</h1>
            </div>

            <div style="padding:30px;">
                <h2>Hello ${user.name},</h2>

                <p>Thank you for registering with us.</p>

                <p>Please use the following OTP to ${mess}:</p>

                <div style="background:#f3f4f6; padding:20px; text-align:center; border-radius:8px; margin:25px 0;">
                    <h1 style="margin:0; color:#2563eb; letter-spacing:8px;">
                        ${otp}
                    </h1>
                </div>

                <p>
                    This OTP will expire in
                    <strong>${time} minutes</strong>.
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
  } catch (error) {
    switch (err.code) {
    case "ECONNECTION":
    case "ETIMEDOUT":
        throw new ApiError(400,`Network error - retry later:${err.message}`)
        break;
        case "EAUTH":
            throw new ApiError(400,`Authentication failed: ${err.message}`)
            break;
        case "EENVELOPE":
                throw new ApiError(400,`Invalid recipients: ${err.message}`)
                break;
        default:
            throw new ApiError(400,`Send failed: ${err.message}`)
    }
  }
};

export { createTransporter, sendEmail, sendOTPEmail };
