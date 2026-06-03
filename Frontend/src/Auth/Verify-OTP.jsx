import React, { useRef } from "react";
import { Link } from "react-router-dom";

import authIllustration from "../assets/hero.png";

export default function VerifyOTP() {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !e.target.value &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
      {/* Blur Effects */}
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
        max-w-4xl

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
            alt="Verify OTP"
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
          w-[55%]
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
            alt="Verify OTP"
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

          px-6
          py-8

          sm:px-10
          lg:px-12

          bg-white/20
          backdrop-blur-md
        "
        >
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Verify OTP 🔐
            </h1>

            <p className="text-slate-600 mb-2">
              Enter the 6-digit code sent to
            </p>

            <p className="font-semibold text-slate-900 mb-8">
              you@example.com
            </p>

            {/* OTP BOXES */}
            <div className="flex justify-between gap-2 mb-6">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  maxLength={1}
                  ref={(el) =>
                    (inputRefs.current[index] = el)
                  }
                  onChange={(e) =>
                    handleChange(e, index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  className="
                  w-12
                  h-12

                  rounded-xl

                  text-center
                  text-lg
                  font-semibold

                  bg-white
                  border
                  border-slate-200

                  shadow-sm

                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  focus:border-blue-400
                "
                />
              ))}
            </div>

            {/* TIMER */}
            <p
              className="
              text-center
              text-sm
              text-slate-500
              mb-6
            "
            >
              Resend code in{" "}
              <span className="font-semibold text-blue-600">
                58s
              </span>
            </p>

            {/* BUTTON */}
            <button
              className="
              w-full
              h-12

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
              Verify & Continue
            </button>

            {/* BACK */}
            <p className="text-center mt-6">
              <Link
                to="/forgot-password"
                className="
                text-blue-600
                font-semibold
                hover:text-blue-700
              "
              >
                ← Back to Forgot Password
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}