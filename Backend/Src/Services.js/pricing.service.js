import { ApiError } from "../utils/ApiError.js";

const calculateRentalPrice = (
  product,
  startDate,
  endDate,
  quantity
) => {
  if (!startDate || !endDate || !quantity) {
    throw new ApiError(
      400,
      "Start Date, End Date and Quantity are required"
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  let totalHours = Math.ceil(
    (end - start) / (1000 * 60 * 60)
  );

  if (totalHours <= 0) {
    throw new ApiError(
      400,
      "End Date must be greater than Start Date"
    );
  }

  if (Number(quantity) <= 0) {
    throw new ApiError(
      400,
      "Quantity must be greater than 0"
    );
  }

  // Save original duration for response
  const originalHours = totalHours;

  let durationType = "";
  let durationValue = 0;

  if (originalHours >= 720) {
    durationType = "month";
    durationValue = Math.floor(originalHours / 720);
  } else if (originalHours >= 168) {
    durationType = "week";
    durationValue = Math.floor(originalHours / 168);
  } else if (originalHours >= 24) {
    durationType = "day";
    durationValue = Math.floor(originalHours / 24);
  } else {
    durationType = "hour";
    durationValue = originalHours;
  }

  let baseAmount = 0;

  // Months
  const months = Math.floor(totalHours / 720);
  totalHours %= 720;

  baseAmount += months * product.pricing.perMonth;

  // Weeks
  const weeks = Math.floor(totalHours / 168);
  totalHours %= 168;

  baseAmount += weeks * product.pricing.perWeek;

  // Days
  const days = Math.floor(totalHours / 24);
  totalHours %= 24;

  baseAmount += days * product.pricing.perDay;

  // Remaining Hours
  baseAmount += totalHours * product.pricing.perHour;

  // Quantity
  baseAmount *= Number(quantity);

  const taxAmount =
    baseAmount * (product.taxPercent / 100);

  const totalAmount =
    baseAmount +
    taxAmount +
    product.depositAmount;

  return {
    baseAmount,
    taxAmount,
    depositAmount: product.depositAmount,
    totalAmount,
    durationType,
    durationValue,
    quantity: Number(quantity),
    pricePerUnit:
      baseAmount / Number(quantity),
  };
};


const applyDiscount = (baseAmount, pricelist) => {
  
  if (!pricelist) {
    return {
      discountedAmount: baseAmount,
      discountAmount: 0,
    };
  }

  let discountAmount = 0;

  if (pricelist.discountType === "percent") {
    discountAmount =
      (baseAmount * pricelist.discountValue) / 100;
  } else if (pricelist.discountType === "fixed") {
    discountAmount = pricelist.discountValue;
  }

  const discountedAmount = Math.max(
    0,
    baseAmount - discountAmount
  );

  return {
    discountedAmount,
    discountAmount,
  };
};


export { calculateRentalPrice,applyDiscount };