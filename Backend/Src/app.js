import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16KB"}))
app.use(express.urlencoded({extended:true,limit:"16KB"}))
app.use(express.static("Public"))
app.use(cookieParser())
app.use((req, res, next) => {
    console.log(req.method, req.url);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    next();
});

import authRouter from "./Routes/auth.routes.js"
app.use('/api/auth',authRouter)

export {app}