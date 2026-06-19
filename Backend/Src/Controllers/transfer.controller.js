import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { RentalOrder } from "../Models/RentalOrder.model.js";
import { Transfer } from "../Models/Transfer.model.js";
import { Product } from "../Models/Product.model.js";

const getAllTransfers = AsyncHandler(async (req, res) => {
  const {
    type,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (type) {
    query.type = type;
  }

  const currentPage = Number(page);
  const pageLimit = Number(limit);
  const skip = (currentPage - 1) * pageLimit;

  const transfers = await Transfer.find(query)
    .sort({ scheduleDate: 1 })
    .skip(skip)
    .limit(pageLimit)
    .populate("rentalOrder")
    .populate("customer");

  const totalTransfers = await Transfer.countDocuments(query);

  const totalPages = Math.ceil(
    totalTransfers / pageLimit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transfers,
        totalTransfers,
        currentPage,
        totalPages,
      },
      "Transfers fetched successfully"
    )
  );
});

const getSingleTransfer = AsyncHandler(async (req, res) => {
  const { transferId } = req.params;

  const transfer = await Transfer.findById(transferId)
    .populate("rentalOrder")
    .populate("customer");

  if (!transfer) {
    throw new ApiError(404, "Transfer Not Found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      transfer,
      "Transfer fetched successfully"
    )
  );
});

const updateTransferStatus = AsyncHandler(async (req, res) => {
  const { transferId, newStatus } = req.body;

  const transfer = await Transfer.findById(transferId);

  if (!transfer) {
    throw new ApiError(404, "Transfer Not Found");
  }

  let isValidTransition = false;
  console.log({
  transferType: transfer.type,
  currentStatus: transfer.status,
  requestedStatus: newStatus,
  isValidTransition,
});

  if (transfer.type === "pickup") {
    isValidTransition =
      (transfer.status === "draft" && newStatus === "ready") ||
      (transfer.status === "ready" && newStatus === "done");
  }

  if (transfer.type === "return") {
    isValidTransition =
      (transfer.status === "draft" && newStatus === "waiting") ||
      (transfer.status === "waiting" && newStatus === "ready") ||
      (transfer.status === "ready" && newStatus === "done");
  }

  if (!isValidTransition && !(transfer.status === "done" && newStatus === "done")) {
    throw new ApiError(400, "Invalid status transition");
  }

  transfer.status = newStatus;
  await transfer.save();

  if (newStatus === "done") {
    const order = await RentalOrder.findById(
      transfer.rentalOrder
    );

    if (!order) {
      throw new ApiError(404, "Rental Order Not Found");
    }

    if (transfer.type === "pickup") {
      order.rentalStatus = "pickedup";
    }

    if (transfer.type === "return") {
      order.rentalStatus = "returned";

      const actualReturnDate = new Date();
      order.actualReturnDate = actualReturnDate;

      if (order.rentalStatus === "returned") {
      throw new ApiError(
        400,
        "Order already returned"
        );
      }

      for (const item of order.items) {
        console.log(item.product);
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
  }

  const updatedTransfer = await Transfer.findById(
    transfer._id
  )
    .populate("rentalOrder")
    .populate("customer");

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedTransfer,
      "Transfer status updated successfully"
    )
  );
});

const getTransfersByOrder = AsyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const transfers = await Transfer.find({
    rentalOrder: orderId,
  })
    .populate("rentalOrder")
    .populate("customer")
    .sort({ scheduleDate: 1 });

  if (!transfers || transfers.length === 0) {
    throw new ApiError(
      404,
      "No transfers found for this order"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      transfers,
      "Transfers fetched successfully"
    )
  );
});

export {getAllTransfers,getSingleTransfer,updateTransferStatus,getTransfersByOrder};