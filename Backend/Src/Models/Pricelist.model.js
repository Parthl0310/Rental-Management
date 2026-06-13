import mongoose, { Schema } from "mongoose";

const priceListschema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        default:null,
    },
    category:{
        type:String,
        default:null
    },
    rentalPeriod:{
        type:String,
        enum:["hourly","daily","weekly","monthly"]
    },
    price:{
        type:Number,
    },
    discountType:{
        type:String,
        enum:["percent","fixed"]
    },
    discountValue:{
        type:Number,
        default:0
    },
    customerGroup:{
        type:String,
        enum:["all","corporate","vip"],
        default:"all"
    },
    validFrom:{
        type:Date,
    },
    validTo:{
        type:Date
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export const PriceList=mongoose.model("PriceList",priceListschema);