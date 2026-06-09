const calculateRentalPrice = (product, startDate, endDate, quantity) => {
  if (!startDate || !endDate || !quantity) {
    throw new ApiError(400, "Start Date, End Date and Quantity are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const hours = (end - start) / (1000 * 60 * 60);

  if (hours <= 0) {
    throw new ApiError(400, "End Date must be greater than Start Date");
  }

  if (Number(quantity) <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  let baseAmount = 0;
  let durationType = "";
  let durationValue = 0;

  if (hours < 24) {
    durationType = "hour";
    durationValue = hours;

    baseAmount = product.pricing.perHour * durationValue;
  } else if (hours < 168) {
    durationType = "day";
    durationValue = hours / 24;

    baseAmount = product.pricing.perDay * durationValue;
  } else if (hours < 720) {
    durationType = "week";
    durationValue = hours / 168;

    baseAmount = product.pricing.perWeek * durationValue;
  } else {
    durationType = "month";
    durationValue = hours / 720;

    baseAmount = product.pricing.perMonth * durationValue;
  }

  baseAmount = baseAmount * Number(quantity);

  const taxAmount = baseAmount * (product.taxPercent / 100);

  const totalAmount = baseAmount + taxAmount;

  return {
    baseAmount,
    taxAmount,
    depositAmount: product.depositAmount,
    totalAmount,
    durationType,
    durationValue,
    pricePerUnit: baseAmount / Number(quantity),
  };
};

export {calculateRentalPrice};
