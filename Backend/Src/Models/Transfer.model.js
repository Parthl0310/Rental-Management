import mongoose, { Schema } from "mongoose";

const transferSchema = new Schema({
    transferId: {
        type: String,
        unique: true,
        required: true
    },
    rentalOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RentalOrder",
        required:true
    },
    type: {
        type: String,
        enum: ["pickup", "return"],
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    deliveryAddress: {
        type: String
    },
    sourceLocation: {
        type: String
    },
    responsiblePerson: {
        type: String
    },
    scheduleDate: {
        type: Date
    },
    transferType: {
        type: String,
        enum: ["outgoing", "incoming"]
    },
    items: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    min: 1,
                    required: true
                },
                unitPrice: {
                    type: Number,
                    required: true
                },
                subTotal: {
                    type: Number,
                    required: true
                },
                tax: {
                    type: Number,
                    default: 0
                }
            }
        ],
        validate: {
            validator: (value) => value.length > 0,
            message: "Transfer must contain at least one item."
        }
    },
    untaxedTotal:{
        type:Number
    },
    taxTotal:{
        type:Number
    },
    grandTotal:{
        type:Number
    },
    status:{
        type:String,
        enum:["draft","waiting","ready","done"],
        default: "draft"
    },
    notes:{
        type:String
    }
},{timestamps:true})


export const Transfer=mongoose.model("Transfer",transferSchema);