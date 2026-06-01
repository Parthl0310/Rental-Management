import mongoose from "mongoose";

const connectDB= async()=>{
    try {
        const connectInsatnce=await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`DataBase Is Now Running On ${process.env.MONGODB_URL}`)
    } catch (e) {
        
        console.log(`DataBase Is Not Connected `,e);
        process.exit(1)
    }
}

export default connectDB