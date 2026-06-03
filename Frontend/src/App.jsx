import { useState } from 'react'
import './App.css'
import {Toaster} from "react-hot-toast";
import Login from './Auth/Login.jsx'
import { Route,Routes } from 'react-router-dom';
import { Home } from 'lucide-react';
import Register from './Auth/Register.jsx';
import ForgotPassword from './Auth/Forgot-Password.jsx';
import VerifyOTP from './Auth/Verify-OTP.jsx';

function App() {
  return (
    <>
     <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          style: {
            background: "#fff",
            color: "#0f172a",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          },

          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route path='/' ></Route>
        <Route path='/auth/*' >
          <Route path='login' element={<Login/>}></Route>
          <Route path='register' element={<Register/>}></Route>
          <Route path='forgot-password' element={<ForgotPassword/>}></Route>
          <Route path='verify-otp' element={<VerifyOTP/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
