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

const sendQuotationEmail = async (email, order, customerName) => {
  try {
    const itemsHtml = order.items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px; border:1px solid #e5e7eb;">
              ${item.product.name}
            </td>
            <td style="padding:10px; border:1px solid #e5e7eb;">
              ${item.quantity}
            </td>
            <td style="padding:10px; border:1px solid #e5e7eb;">
              ₹${item.unitPrice}
            </td>
            <td style="padding:10px; border:1px solid #e5e7eb;">
              ₹${item.subTotal}
            </td>
          </tr>
        `
      )
      .join("");

    await sendEmail({
      to: email,
      subject: `Rental Quotation - ${order.orderId}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width:700px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">

          <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
              <h1>Rental Quotation</h1>
          </div>

          <div style="padding:30px;">
              <h2>Hello ${customerName},</h2>

              <p>
                  Thank you for choosing our rental service.
                  Your quotation has been prepared and is ready for review.
              </p>

              <div style="background:#f3f4f6; padding:20px; border-radius:8px; margin:25px 0;">
                  <p><strong>Quotation No:</strong> ${order.orderId}</p>
                  <p><strong>Rental Start:</strong> ${new Date(
                    order.startDate
                  ).toLocaleDateString()}</p>
                  <p><strong>Rental End:</strong> ${new Date(
                    order.endDate
                  ).toLocaleDateString()}</p>
                  <p><strong>Delivery Method:</strong> ${
                    order.deliveryMethod
                  }</p>
              </div>

              <h3>Quotation Details</h3>

              <table style="width:100%; border-collapse:collapse;">
                  <thead>
                      <tr style="background:#f9fafb;">
                          <th style="padding:10px; border:1px solid #e5e7eb;">Product</th>
                          <th style="padding:10px; border:1px solid #e5e7eb;">Qty</th>
                          <th style="padding:10px; border:1px solid #e5e7eb;">Unit Price</th>
                          <th style="padding:10px; border:1px solid #e5e7eb;">Subtotal</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${itemsHtml}
                  </tbody>
              </table>

              <div style="background:#f3f4f6; padding:20px; border-radius:8px; margin-top:25px;">
                  <p><strong>Subtotal:</strong> ₹${order.subTotal}</p>
                  <p><strong>Tax:</strong> ₹${order.taxAmount}</p>
                  <p><strong>Delivery Charge:</strong> ₹${order.deliveryCharge}</p>
                  <hr style="border:none; border-top:1px solid #d1d5db;">
                  <h3>Total Amount: ₹${order.totalAmount}</h3>
              </div>

              <p style="margin-top:25px;">
                  If you wish to proceed with this rental, please contact us
                  or confirm the quotation through the platform.
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
  } catch (err) {
    switch (err.code) {
      case "ECONNECTION":
      case "ETIMEDOUT":
        throw new ApiError(
          400,
          `Network error - retry later: ${err.message}`
        );

      case "EAUTH":
        throw new ApiError(
          400,
          `Authentication failed: ${err.message}`
        );

      case "EENVELOPE":
        throw new ApiError(
          400,
          `Invalid recipients: ${err.message}`
        );

      default:
        throw new ApiError(
          400,
          `Send failed: ${err.message}`
        );
    }
  }
};

export { createTransporter, sendEmail, sendOTPEmail ,sendQuotationEmail};
