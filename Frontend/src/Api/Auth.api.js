import api from "./axios";

// Register User
export const registerAPI = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Verify OTP
export const verifyOTPAPI = async (data) => {
  const response = await api.post("/auth/verify-otp", data);
  return response.data;
};

// Resend OTP
export const resendOTPAPI = async (data) => {
  const response = await api.post("/auth/resend-otp", data);
  return response.data;
};

// Login
export const loginAPI = async (data) => {
  const response = await api.post("/auth/login", data);
  console.log(response)
  return response.data;
};

// Logout
export const logoutAPI = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Forgot Password
export const forgotPasswordAPI = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

// Reset Password
export const resetPasswordAPI = async (data) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

// Get Current Logged In User
export const getCurrentUserAPI = async () => {
  const response = await api.get("/user/me");
  console.log(response.data)
  return response.data;
};