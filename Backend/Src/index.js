import dotenv from "dotenv"
import { app } from "./app.js";

dotenv.config({
    path:"./.env"
});

import connectDB from "./Config/db.js";

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server Is Running On The Port ${process.env.PORT || 8000}`)
    })
}).catch((e)=>{
    console.log("MONGO db connection failed",err);
})