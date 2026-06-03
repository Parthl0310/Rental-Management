import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import authIllustration from "../assets/hero.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
      py-8
      overflow-hidden
      relative

      bg-gradient-to-l
      from-[#b9e9ff]
      via-[#eaf8ff]
      to-[#f8fcff]
    "
    >
      {/* Background Blur Effects */}
      <div
        className="
        absolute
        top-20
        right-0
        w-[450px]
        h-[450px]
        bg-sky-300/30
        rounded-full
        blur-[140px]
      "
      />

      <div
        className="
        absolute
        bottom-0
        left-0
        w-[350px]
        h-[350px]
        bg-cyan-200/20
        rounded-full
        blur-[120px]
      "
      />

      <div
        className="
        absolute
        top-1/2
        right-1/3
        w-[300px]
        h-[300px]
        bg-indigo-200/20
        rounded-full
        blur-[120px]
      "
      />

      {/* Main Card */}
      <div
        className="
        relative
        z-10

        w-full
        max-w-5xl

        rounded-[32px]
        overflow-hidden

        bg-white/50
        backdrop-blur-2xl

        border
        border-white/30

        shadow-[0_20px_80px_rgba(31,38,135,0.15)]

        flex
        flex-col
        lg:flex-row
      "
      >
        {/* MOBILE IMAGE */}
        <div className="lg:hidden p-4">
          <img
            src={authIllustration}
            alt="Rental Management"
            className="
              w-full
              h-56
              object-cover
              rounded-2xl
            "
          />
        </div>

        {/* LEFT SIDE */}
        <div
          className="
          hidden
          lg:flex
          w-[50%]
          relative
          items-center
          justify-center

          bg-gradient-to-br
          from-[#c8f0ff]
          via-[#9edfff]
          to-[#7fcfff]
        "
        >
          <div
            className="
            absolute
            inset-0
            bg-white/10
            backdrop-blur-sm
          "
          />

          <img
            src={authIllustration}
            alt="Rental Management"
            className="
            relative
            z-10
            w-full
            h-full
            object-cover
          "
          />
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
          flex-1
          flex
          items-center
          justify-center

          px-4
          py-5  

          sm:px-10
          lg:px-12

          bg-white/20
          backdrop-blur-md
        "
        >
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-slate-900 mb-1.5">
              Create Account 🚀
            </h1>

            <p className="text-slate-600 mb-6">
              Join RentFlow and start managing rentals.
            </p>

            <form className="space-y-4">
              {/* FULL NAME */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  />

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="
                    w-full
                    h-10

                    pl-11
                    pr-4

                    rounded-xl

                    bg-white
                    border
                    border-slate-200

                    text-slate-900
                    placeholder:text-slate-500

                    shadow-sm

                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-400
                    focus:border-blue-400
                  "
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  />

                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="
                    w-full
                    h-10

                    pl-11
                    pr-4

                    rounded-xl

                    bg-white
                    border
                    border-slate-200

                    text-slate-900
                    placeholder:text-slate-500

                    shadow-sm

                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-400
                    focus:border-blue-400
                  "
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  />

                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    className="
                    w-full
                    h-10

                    pl-11
                    pr-4

                    rounded-xl

                    bg-white
                    border
                    border-slate-200

                    text-slate-900
                    placeholder:text-slate-500

                    shadow-sm

                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-400
                    focus:border-blue-400
                  "
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Minimum 8 characters"
                    className="
                    w-full
                    h-10

                    pl-11
                    pr-12

                    rounded-xl

                    bg-white
                    border
                    border-slate-200

                    text-slate-900
                    placeholder:text-slate-500

                    shadow-sm

                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-400
                    focus:border-blue-400
                  "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Re-enter password"
                    className="
                    w-full
                    h-10

                    pl-11
                    pr-12

                    rounded-xl

                    bg-white
                    border
                    border-slate-200

                    text-slate-900
                    placeholder:text-slate-500

                    shadow-sm

                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-400
                    focus:border-blue-400
                  "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                  "
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="
                  mt-1
                  accent-blue-600
                "
                />

                <label
                  htmlFor="terms"
                  className="
                  text-sm
                  text-slate-600
                "
                >
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

              {/* BUTTON */}
              <button
                type="submit"
                className="
                w-full
                h-10

                rounded-xl

                font-semibold
                text-white

                bg-gradient-to-r
                from-[#2563eb]
                via-[#4f46e5]
                to-[#6366f1]

                shadow-lg
                shadow-blue-400/30

                hover:scale-[1.02]
                hover:shadow-blue-500/40

                transition-all
                duration-300
                "
              >
                Create Account
              </button>

              {/* LOGIN */}
              <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="
                  text-blue-600
                  font-semibold
                "
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