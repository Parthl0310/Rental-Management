import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
});

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16KB"}))
app.use(express.urlencoded({extended:true,limit:"16KB"}))
app.use(express.static("Public"))
app.use(cookieParser())

import authRouter from "./Routes/auth.routes.js"
import userRoute from "./Routes/User.routes.js"
app.use('/api/auth',authRouter)
app.use('/api/user',userRoute)
export {app}