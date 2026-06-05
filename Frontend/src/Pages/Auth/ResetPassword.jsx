import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import authIllustration from "../../assets/hero.png";
import { resetPasswordAPI } from "../../api/auth.api";

export default function ResetPassword() {
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const email = location?.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("User Email Not Reached");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const [otpData, setOtpData] = useState(["", "", "", "", "", ""]);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const getPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
      return {
        text: "Weak",
        color: "bg-red-400",
        width: "w-1/3",
        textColor: "text-red-500",
      };

    if (score <= 3)
      return {
        text: "Medium",
        color: "bg-amber-400",
        width: "w-2/3",
        textColor: "text-amber-500",
      };

    return {
      text: "Strong",
      color: "bg-emerald-400",
      width: "w-full",
      textColor: "text-emerald-500",
    };
  };

  const strength = getPasswordStrength(formData.newPassword);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otpData];
    updatedOtp[index] = value;

    setOtpData(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (strength.text !== "Strong") {
      toast.error("Password must be strong");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await resetPasswordAPI({
        email,
        otp,
        newPassword: formData.newPassword,
      });

      toast.success("Password reset successfully, please login");
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Password Reset Failed";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
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
            alt="Reset Password"
            className="w-full h-56 object-cover rounded-2xl"
          />
        </div>

        <div className="hidden lg:flex w-[55%] relative items-center justify-center bg-gradient-to-br from-[#c8f0ff] via-[#9edfff] to-[#7fcfff]">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          <img
            src={authIllustration}
            alt="Reset Password"
            className="relative z-10 w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12 bg-white/20 backdrop-blur-md">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Reset Password 🔒
            </h1>

            <p className="text-slate-600 mb-8">
              Enter the OTP and create a new password.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                OTP Verification
              </label>

              <div className="flex justify-between gap-2 mb-6">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    value={otpData[index]}
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-12 h-12 rounded-xl text-center text-lg font-semibold bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                ))}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full h-12 pl-11 pr-12 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {formData.newPassword && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-500">
                          Password Strength
                        </span>

                        <span
                          className={`text-xs font-semibold ${strength.textColor}`}
                        >
                          {strength.text}
                        </span>
                      </div>

                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full h-12 pl-11 pr-12 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-8 rounded-xl font-semibold text-white bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#6366f1] shadow-lg shadow-blue-400/30 hover:scale-[1.02] hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>

              <p className="text-center mt-6">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  ← Back to Forgot Password
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}