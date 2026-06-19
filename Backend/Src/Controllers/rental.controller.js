import { AsyncHandler } from "../Utils/AsyncHandler.js";
import {ApiError} from "../Utils/ApiError.js";
import {ApiResponse} from "../Utils/ApiResponse.js";
import {RentalOrder} from "../Models/RentalOrder.model.js"
import {Product} from "../Models/Product.model.js"
import { calculateRentalPrice } from "../Services.js/pricing.service.js";
import {generateOrderId, generateTransferId} from "../Utils/generateOrderId.js"
import { Transfer } from "../Models/Transfer.model.js";
import { sendQuotationEmail } from "../Services.js/Email.service.js";
import { User } from "../Models/User.models.js";

const createRentalOrder = AsyncHandler(async (req, res) => {
  const customer = req.user;

  const {
    items,
    startDate,
    endDate,
    deliveryAddress,
    invoiceAddress,
    deliveryMethod,
    couponCode,
    couponDiscount = 0,
    depositAmount = 0,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "There are no items selected");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (start >= end) {
    throw new ApiError(
      400,
      "Start date must be before end date"
    );
  }

  if (start < today) {
    throw new ApiError(
      400,
      "Start date cannot be in the past"
    );
  }

  let subtotal = 0;
let taxAmount = 0;
let totalDeposit = 0;

for (const item of items) {
  const product = await Product.findById(item.product);

  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  if (product.availableStock < item.quantity) {
    throw new ApiError(
      400,
      `Insufficient stock for ${product.name}`
    );
  }

  const pricing = calculateRentalPrice(
    product,
    startDate,
    endDate,
    item.quantity
  );

  subtotal += pricing.baseAmount;
  taxAmount += pricing.taxAmount;
  totalDeposit += pricing.depositAmount;
}

const totalAmount =
  subtotal +
  taxAmount +
  totalDeposit -
  Number(couponDiscount || 0);


  const orderId = await generateOrderId();
  // console.log(subtotal, couponDiscount, totalAmount);
  const order = await RentalOrder.create({
    orderId,

    customer: customer._id,

    items,

    startDate,
    endDate,

    deliveryAddress,
    invoiceAddress,
    deliveryMethod,

    couponCode,
    couponDiscount,

    depositAmount,

    subTotal: subtotal,
taxAmount,
depositAmount: totalDeposit,
totalAmount,

    rentalStatus: "quotation",
    invoiceStatus: "nothing_to_invoice",
    paymentStatus: "pending",
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      order,
      "Rental order created successfully"
    )
  );
});


const confirmRentalOrder=AsyncHandler(async(req,res)=>{
    const {orderId}=req.params;
    
    const order=await RentalOrder.findById(orderId);
    if(!order){
      throw new ApiError(404,"Order Is not Found");
    }
    
    if(order.rentalStatus !== "quotation" && order.rentalStatus !== "quotation_sent"){
      throw new ApiError(400,"Order already confirmed");
    }

    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
      throw new ApiError(400, "There are no items selected");
    }

    for(const item of order.items){
      const product=await Product.findById(item.product);

      if (!product) {
        throw new ApiError(404, "Product Not Found");
      } 

      if (product.availableStock < item.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name}`
        );
      }
    }
    const pickupTransferId = await generateTransferId("pickup");
    const returnTransferId = await generateTransferId("return");

    const pickupTransfer=await Transfer.create({
      transferId:pickupTransferId,
      rentalOrder:order._id,
      customer:order.customer,
      deliveryAddress:order.deliveryAddress,
      type:"pickup",
      transferType:"outgoing",
      scheduleDate:order.startDate,
      status:"draft",
      items:order.items,
      untaxedTotal: order.subTotal,
      taxTotal: order.taxAmount,
      grandTotal: order.totalAmount,
    });

    const returnTransfer=await Transfer.create({
      transferId:returnTransferId,
      rentalOrder:order._id,
      customer:order.customer,
      deliveryAddress:order.deliveryAddress,
      type:"return",
      transferType:"incoming",
      scheduleDate:order.endDate,
      status:"draft",
      items:order.items,
      untaxedTotal: order.subTotal,
      taxTotal: order.taxAmount,
      grandTotal: order.totalAmount,
    });

    for(const item of order.items){
      await Product.findByIdAndUpdate(
        item.product,{
          $inc:{
            availableStock:-item.quantity,
          }
        }
      )
    }
    order.rentalStatus="reserved";
    order.invoiceStatus="to_invoice";
    order.pickupTransfer=pickupTransfer._id;
    order.returnTransfer=returnTransfer._id;
    await order.save();
    const updatedOrder=await RentalOrder.findById(orderId).populate("pickupTransfer").populate("returnTransfer");

    return res.status(200).json(
      new ApiResponse(200,updatedOrder,"Order confirmed successfully")
    )
})


const sendQuotation=AsyncHandler(async(req,res)=>{
    const {orderId}=req.params;
    const order=await RentalOrder.findById(orderId).populate("items.product");
    if(!order){
      throw new ApiError(404,"Order Not Found");
    }
    
    if(order.rentalStatus !== "quotation"){
      throw new ApiError(400,"Quotation already sent or processed");
    }    
    const customer=await User.findById(order.customer);
    if(!customer){
      throw new ApiError(404,"Customer Not Found");
    }

    await sendQuotationEmail(customer.email,order,customer.name);

    order.rentalStatus="quotation_sent";
    await order.save();

    return res.status(200).json(
      new ApiResponse(200,order,"Quotation sent successfully")
    )
})

const cancelOrder=AsyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await RentalOrder.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order Not Found");
  }

  if (
    req.user.role === "customer" &&
    order.customer.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  if (
    order.rentalStatus !== "quotation" &&
    order.rentalStatus !== "quotation_sent"
  ) {
    throw new ApiError(
      400,
      "Cannot cancel confirmed order — contact admin"
    );
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          availableStock: item.quantity,
        },
      }
    );
  }

  order.rentalStatus = "cancelled";

  await order.save();

  const updatedOrder = await RentalOrder.findById(orderId)
    .populate("customer")
    .populate("items.product");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedOrder,
      "Order cancelled successfully"
    )
  );
});

const getAllOrders = AsyncHandler(async (req, res) => {
  const {
    rentalStatus,
    invoiceStatus,
    paymentStatus,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (search) {
    const customers = await User.find({
      name: {
        $regex: search,
        $options: "i",
      },
    });

    query.customer = {
      $in: customers.map((customer) => customer._id),
    };
  }

  if (rentalStatus) {
    query.rentalStatus = rentalStatus;
  }

  if (invoiceStatus) {
    query.invoiceStatus = invoiceStatus;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  if (startDate || endDate) {
    query.createdAt = {};

    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const currentPage = Number(page);
  const pageLimit = Number(limit);
  const skip = (currentPage - 1) * pageLimit;

  const orders = await RentalOrder.find(query)
    .skip(skip)
    .limit(pageLimit)
    .populate("customer")
    .populate("items.product");

  const totalOrders = await RentalOrder.countDocuments(query);

  const totalPages = Math.ceil(totalOrders / pageLimit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        totalOrders,
        currentPage,
        totalPages,
      },
      "Orders fetched successfully"
    )
  );
});

const getSingleOrder = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await RentalOrder.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order Not Found");
  }

  if (
    req.user.role === "customer" &&
    order.customer.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  const orderUpdated = await RentalOrder.findById(orderId)
    .populate("customer")
    .populate("items.product")
    .populate("pickupTransfer")
    .populate("returnTransfer");

  return res.status(200).json(
    new ApiResponse(
      200,
      orderUpdated,
      "Order fetched successfully"
    )
  );
});

const getMyOrders = AsyncHandler(async (req, res) => {
  const {
    rentalStatus,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {
    customer: req.user._id,
  };

  if (rentalStatus) {
    query.rentalStatus = rentalStatus;
  }

  const currentPage = Number(page);
  const pageLimit = Number(limit);
  const skip = (currentPage - 1) * pageLimit;

  const orders = await RentalOrder.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageLimit)
    .populate({
      path: "items.product",
      select: "name images",
    });

  const totalOrders = await RentalOrder.countDocuments(query);

  const totalPages = Math.ceil(totalOrders / pageLimit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        totalOrders,
        currentPage,
        totalPages,
      },
      "My orders fetched successfully"
    )
  );
});

const updateOrderStatus = AsyncHandler(async (req, res) => {
  const { orderId, newStatus } = req.body;

  const order = await RentalOrder.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order Not Found");
  }

  const isValidTransition =
    (order.rentalStatus === "reserved" &&
      newStatus === "pickedup") ||
    (order.rentalStatus === "pickedup" &&
      newStatus === "returned");

  if (!isValidTransition) {
    throw new ApiError(400, "Invalid status transition");
  }

  if (newStatus === "pickedup") {
    const pickupTransfer = await Transfer.findById(
      order.pickupTransfer
    );

    if (!pickupTransfer) {
      throw new ApiError(404, "Pickup Transfer Not Found");
    }

    pickupTransfer.status = "done";
    await pickupTransfer.save();

    order.rentalStatus = "pickedup";
  }

  if (newStatus === "returned") {
    const returnTransfer = await Transfer.findById(
      order.returnTransfer
    );

    if (!returnTransfer) {
      throw new ApiError(404, "Return Transfer Not Found");
    }

    returnTransfer.status = "done";
    await returnTransfer.save();

    order.rentalStatus = "returned";

    const actualReturnDate = new Date();

    order.actualReturnDate = actualReturnDate;

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            availableStock: item.quantity,
          },
        }
      );
    }

    if (actualReturnDate > order.endDate) {
      order.isLatePickup = true;
    }
  }

  await order.save();

  const updatedOrder = await RentalOrder.findById(order._id)
    .populate("customer")
    .populate("items.product")
    .populate("pickupTransfer")
    .populate("returnTransfer");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedOrder,
      "Order status updated successfully"
    )
  );
});

const duplicateOrder = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const originalOrder = await RentalOrder.findById(orderId);

  if (!originalOrder) {
    throw new ApiError(404, "Order Not Found");
  }

  const orderData = originalOrder.toObject();

  delete orderData._id;
  delete orderData.__v;
  delete orderData.createdAt;
  delete orderData.updatedAt;

  orderData.orderId = await generateOrderId();

  orderData.rentalStatus = "quotation";
  orderData.invoiceStatus = "nothing_to_invoice";
  orderData.paymentStatus = "pending";

  orderData.pickupTransfer = undefined;
  orderData.returnTransfer = undefined;

  orderData.actualReturnDate = undefined;

  orderData.lateFeeAmount = 0;
  orderData.isLatePickup = false;

  const duplicatedOrder = await RentalOrder.create(orderData);

  return res.status(201).json(
    new ApiResponse(
      201,
      duplicatedOrder,
      "Order duplicated successfully"
    )
  );
});

export {createRentalOrder,confirmRentalOrder,sendQuotation,
  cancelOrder,getAllOrders,getSingleOrder,getMyOrders,updateOrderStatus,duplicateOrder} 