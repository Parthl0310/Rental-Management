import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

import authIllustration from "../../assets/hero.png";
import { useAuth } from "../../Context/Auth.context";
import toast from "react-hot-toast";
import { loginAPI, registerAPI } from "../../Api/Auth.api";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Confirmpassword, setConfirmpassword] = useState("");

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

  const [formData,setFormData]=useState({
    name:"",
    email:"",
    password:"",
    phone:"",
    role:""
  })
  const strength = getPasswordStrength(formData.password);

  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState();
  const [termCheck,setTermCheck]=useState(false);
  const nevigate=useNavigate();
  const {setUser}=useAuth();
  
  const handleChange=(e)=>{
    setFormData(
      {
        ...formData,[e.target.name]:e.target.value,
      });
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setError("");
    if(!formData.name || !formData.email || !formData.password || !formData.phone || !formData.role){
      toast.error("All Fields Are Requried Fill All The Fields");
      return;
    }
    
    if(formData.phone.length!=10){
      toast.error("Phone Number Should Be 10 Digit");
      return;
    }
    if(strength.text !== "Strong"){
      toast.error("Password Must Be Strong");
      return;
    }
    
    if(formData.password !== Confirmpassword){
      toast.error("Password And Confirm Password Must Be Same");
      return;
    }
    
    if(!termCheck){
      toast.error("Please Accept The Terms And Conditions");
      return;
    }

    try {
      setIsLoading(true);
      const response=await registerAPI(formData);

      const userData=response.data || response.user;
      setUser(userData);
      toast.success("Please Verify The Account First With The OTP");
      nevigate("/verify-otp",{
        state:{ 
          email:formData.email
        }
      })

    } catch (error) {
      const message=error?.response?.data?.message || "Register Unsuccesfull";
      setError(message);
      toast.error(message);      
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden relative bg-gradient-to-l from-[#b9e9ff] via-[#eaf8ff] to-[#f8fcff]">
      {/* Background Blur Effects */}
      <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-sky-300/30 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-200/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-indigo-200/20 rounded-full blur-[120px]" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl rounded-[32px] overflow-hidden bg-white/50 backdrop-blur-2xl border border-white/30 shadow-[0_20px_80px_rgba(31,38,135,0.15)] flex flex-col lg:flex-row">
        
        {/* Mobile Image */}
        <div className="lg:hidden p-4">
          <img
            src={authIllustration}
            alt="Rental Management"
            className="w-full h-56 object-cover rounded-2xl"
          />
        </div>

        {/* Left Side */}
        <div className="hidden lg:flex w-[50%] relative items-center justify-center bg-gradient-to-br from-[#c8f0ff] via-[#9edfff] to-[#7fcfff]">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

          <img
            src={authIllustration}
            alt="Rental Management"
            className="relative z-10 w-full h-full object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center px-4 py-5 sm:px-10 lg:px-12 bg-white/20 backdrop-blur-md">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-slate-900 mb-1.5">
              Create Account 🚀
            </h1>

            <p className="text-slate-600 mb-6">
              Join RentFlow and start managing rentals.
            </p>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}
            <form  onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="John Doe"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-10 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="w-full h-10 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-10 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Register As
                </label>

                <div className="w-full h-10 p-1 rounded-xl bg-white border border-slate-200 shadow-sm flex">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="customer"
                      onChange={handleChange}
                      className="hidden peer"
                    />

                    <div className="h-full flex items-center justify-center rounded-lg text-slate-600 font-medium transition-all duration-200 peer-checked:bg-blue-100 peer-checked:text-blue-700 peer-checked:border peer-checked:border-blue-200">
                      Customer
                    </div>
                  </label>

                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      onChange={handleChange}
                      className="hidden peer"
                    />

                    <div className="h-full flex items-center justify-center rounded-lg text-slate-600 font-medium transition-all duration-200 peer-checked:bg-blue-100 peer-checked:text-blue-700 peer-checked:border peer-checked:border-blue-200">
                      Admin
                    </div>
                  </label>
                </div>
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={
                      handleChange
                    }
                    placeholder="Minimum 8 characters"
                    className="w-full h-10 pl-11 pr-12 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-500">
                      Password Strength
                    </span>

                    <span className={`text-xs font-semibold ${strength.textColor}`}>
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
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={Confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full h-10 pl-11 pr-12 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
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

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  value={termCheck}
                  onChange={(e)=>{setTermCheck(e.target.value)}}
                  id="terms"
                  className="mt-1 accent-blue-600"
                />

                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 font-medium"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full h-10 rounded-xl font-semibold text-white bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#6366f1] shadow-lg shadow-blue-400/30 hover:scale-[1.02] hover:shadow-blue-500/40 transition-all duration-300"
              >
                Create Account
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login" 
                  className="text-blue-600 font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}