import mongoose,{Schema} from "mongoose"

const cartSchema=new Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true
    },
    items:{
        type:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product"
                },
                quantity:{
                    type:Number,
                    default:1,
                    min:1
                },
                startDate:{
                    type:Date,
                    required:true
                },
                endDate:{
                    type:Date,
                    required:true
                },
                unitPrice:{
                    type:Number
                },
                durationType:{
                    type:String
                },
                subTotal:{
                    type:Number
                }
            }
        ],
        default:[],
    },
    couponCode:{
        type:String
    },
    couponDiscount:{
        type:Number,
        default:0
    },
    deliveryCharge:{
        type:Number,
        default:0
    }
},{timestamps:true});

export const Cart=mongoose.model("Cart",cartSchema);