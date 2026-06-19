import {RentalOrder} from "../Models/RentalOrder.model.js";
import {Transfer} from "../Models/Transfer.model.js";


const generateOrderId= async ()=>{
    const latestOrder=await RentalOrder.findOne().sort({createdAt:-1});

    if(!latestOrder){
        return "R0001";
    }

    const currentNumber=parseInt(latestOrder.orderId.replace("R",""),10);
    const nextNumber=currentNumber+1;
    const paddedNumber = String(nextNumber).padStart(4, "0");
    return `R${paddedNumber}`;
}

const generateTransferId=async (type)=>{
    const prefix= (type === "pickup") ? "PICKUP/OUT/" : "RETURN/IN/";

    const latestTransfer=await Transfer.findOne({type}).sort({createdAt:-1});

    if(!latestTransfer){
        return `${prefix}0001`;
    }

    const parts=latestTransfer.transferId.split('/');
    const currentNumber=parseInt(parts[parts.length-1],10);
    const nextNumber=currentNumber+1;
    const paddedNumber=String(nextNumber).padStart(4,"0");
    return `${prefix}${paddedNumber}`;
}

export {generateOrderId,generateTransferId};