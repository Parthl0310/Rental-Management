import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";

const Userschema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    phone:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    deliveryAddress:{
        type:String,
    },
    invoiceAddress:{
        type:String,
    },
    refreshtoken:{
        type:String
    }
},{timestamps:true})

Userschema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

Userschema.methods.ispasswordcorrect = async function (password){
   return await bcrypt.compare(password,this.password)
}

export const User=mongoose.model("User",Userschema);