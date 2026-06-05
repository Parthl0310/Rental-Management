
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authIllustration from "../../assets/hero.png";
import { verifyOTPAPI, resendOTPAPI } from "../../api/auth.api";
import { useAuth } from "../../Context/Auth.context";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const inputRefs = useRef([]);

  const [isLoading, setIsLoading] = useState(false);
  const [otpData, setOtpData] = useState(["", "", "", "", "", ""]);
  const [second, setSecond] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  const email = location?.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("User Email Not Given");
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (canResend) return;

    const counter = setInterval(() => {
      setSecond((prev) => {
        if (prev <= 1) {
          clearInterval(counter);
          setCanResend(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(counter);
  }, [canResend]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otpData];
    updatedOtp[index] = value;
    setOtpData(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otpData];

      if (updatedOtp[index]) {
        updatedOtp[index] = "";
        setOtpData(updatedOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const otp = otpData.join("");

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("OTP Length Should Be 6");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOTPAPI({
        email,
        otp,
      });

      const userData =
        response?.data?.user ||
        response?.data ||
        response?.user;

      setUser(userData);

      toast.success("Your Account Is Verified");
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "OTP Verification Failed";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTPAPI({ email });

      toast.success("OTP Sent Successfully");

      setSecond(60);
      setCanResend(false);

      setOtpData(["", "", "", "", "", ""]);

      inputRefs.current[0]?.focus();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed To Resend OTP";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden relative bg-gradient-to-l from-[#b9e9ff] via-[#eaf8ff] to-[#f8fcff]">
      <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-sky-300/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-200/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-4xl rounded-[32px] overflow-hidden bg-white/50 backdrop-blur-2xl border border-white/30 shadow-[0_20px_80px_rgba(31,38,135,0.15)] flex flex-col lg:flex-row">
        <div className="lg:hidden p-4">
          <img
            src={authIllustration}
            alt="Verify OTP"
            className="w-full h-56 object-cover rounded-2xl"
          />
        </div>

        <div className="hidden lg:flex w-[55%] relative items-center justify-center bg-gradient-to-br from-[#c8f0ff] via-[#9edfff] to-[#7fcfff]">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          <img
            src={authIllustration}
            alt="Verify OTP"
            className="relative z-10 w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12 bg-white/20 backdrop-blur-md">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Verify OTP 🔐
            </h1>

            <p className="text-slate-600 mb-2">
              Enter the 6-digit code sent to
            </p>

            <p className="font-semibold text-slate-900 mb-8">
              {email}
            </p>

            <div className="flex justify-between gap-2 mb-4">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  value={otpData[index]}
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 rounded-xl text-center text-lg font-semibold bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">
                {error}
              </p>
            )}

            <div className="text-center mb-6">
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-slate-500">
                  Resend code in{" "}
                  <span className="font-semibold text-blue-600">
                    {second}s
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={handleOtpSubmit}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#6366f1] shadow-lg shadow-blue-400/30 hover:scale-[1.02] hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
