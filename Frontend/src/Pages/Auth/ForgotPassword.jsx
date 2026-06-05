import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { forgotPasswordAPI } from "../../api/auth.api";

import authIllustration from "../../assets/hero.png";
import toast from "react-hot-toast";

export default function ForgotPassword() {

  const [error,setError]=useState("");
  const [email,setEmail]=useState("");
  const [isLoading,setIsLoading]=useState(false);
  const navigate=useNavigate();

  const handleChange=(e)=>{
    setEmail(e.target.value);
  }
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if(!email){
        toast.error("Please Enter the Email");
        return;
      }
      const response=await forgotPasswordAPI({email});
      toast.success("OTP sent to your email");
      navigate('/reset-password',{
        state:{
          email:email
        }
      })
    } catch (error) {
      const message=error?.response?.data?.message || "Failed To Generate The Forgot Password OTP";
      setError(message);
      toast.error(message);
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden relative bg-gradient-to-l from-[#b9e9ff] via-[#eaf8ff] to-[#f8fcff]">
      
      {/* Background Blur Effects */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-sky-300/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-200/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[120px]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-4xl rounded-[32px] overflow-hidden bg-white/50 backdrop-blur-2xl border border-white/30 shadow-[0_20px_80px_rgba(31,38,135,0.15)] flex flex-col lg:flex-row">

        {/* Mobile Image */}
        <div className="lg:hidden p-4">
          <img
            src={authIllustration}
            alt="Forgot Password"
            className="w-full h-56 object-cover rounded-2xl"
          />
        </div>

        {/* Left Side */}
        <div className="hidden lg:flex w-[55%] relative items-center justify-center bg-gradient-to-br from-[#c8f0ff] via-[#9edfff] to-[#7fcfff]">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          <img
            src={authIllustration}
            alt="Forgot Password"
            className="relative z-10 w-full h-full object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12 bg-white/20 backdrop-blur-md">
          <div className="w-full max-w-md">
            
            {/* Heading */}
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Forgot Password? 🔐
            </h1>

            <p className="text-slate-600 mb-8">
              Enter your email address and we'll send you a password reset link.
            </p>
             {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={handleChange}
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl font-semibold text-white bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#6366f1] shadow-lg shadow-blue-400/30 hover:scale-[1.02] hover:shadow-blue-500/40 transition-all duration-300"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
                
              </button>

              {/* Back to Login */}
              <p className="text-center text-sm text-slate-600">
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                  ← Back to Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}