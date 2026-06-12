import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  Package,
  IndianRupee,
  ShieldCheck,
  Percent,
  Wallet,
  Loader2,
} from "lucide-react";

import {
  calculatePriceAPI,
} from "../../api/product.api";

export default function PriceCalculator({
  productId,
  selectedDates,
  quantity,
}) {
  const [loading, setLoading] =
    useState(false);

  const [priceData, setPriceData] =
    useState(null);

  const debounceRef = useRef();

  useEffect(() => {
    if (
      !selectedDates?.startDate ||
      !selectedDates?.endDate ||
      quantity <= 0
    ) {
      setPriceData(null);
      return;
    }

    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(
      async () => {
        try {
          setLoading(true);

          const res =
            await calculatePriceAPI({
              id: productId,
              startDate:
                selectedDates.startDate,
              endDate:
                selectedDates.endDate,
              quantity,
            });

          setPriceData(
            res.data || null
          );
        } catch (error) {
          console.error(
            "Price Calculation Error:",
            error
          );

          setPriceData(null);
        } finally {
          setLoading(false);
        }
      },
      300
    );

    return () =>
      clearTimeout(
        debounceRef.current
      );
  }, [
    productId,
    selectedDates,
    quantity,
  ]);

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between px-5 py-4 border-b">

        <h2 className="text-lg md:text-xl font-bold text-slate-800">
          Price Summary
        </h2>

        {loading && (
          <div className="flex items-center gap-2 text-sky-600 text-sm">
            <Loader2
              className="animate-spin"
              size={18}
            />

            Calculating...
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">

        {/* Unit Price */}

        <Row
          icon={
            <IndianRupee size={20} />
          }
          title="Unit Price"
          subtitle="Rental Price"
          value={
            priceData
              ? `₹${Number(
                  priceData.pricePerUnit
                ).toFixed(2)}`
              : "--"
          }
        />

        {/* Duration */}

        <Row
          icon={
            <CalendarDays size={20} />
          }
          title="Duration"
          value={
            priceData
              ? `${Number(
                  priceData.durationValue
                ).toFixed(2)} ${
                  priceData.durationType
                }${
                  Number(
                    priceData.durationValue
                  ) > 1
                    ? "s"
                    : ""
                }`
              : "--"
          }
        />

        {/* Quantity */}

        <Row
          icon={<Package size={20} />}
          title="Quantity"
          value={quantity || "--"}
        />

        <hr />
                {/* Base Amount */}

        <Row
          icon={<Wallet size={20} />}
          title="Base Amount"
          value={
            priceData
              ? `₹${Number(
                  priceData.baseAmount
                ).toFixed(2)}`
              : "--"
          }
        />

        {/* Tax */}

        <Row
          icon={<Percent size={20} />}
          title="Tax"
          value={
            priceData
              ? `₹${Number(
                  priceData.taxAmount
                ).toFixed(2)}`
              : "--"
          }
        />

        {/* Deposit */}

        <Row
          icon={<ShieldCheck size={20} />}
          title="Deposit Amount"
          value={
            priceData
              ? `₹${Number(
                  priceData.depositAmount
                ).toFixed(2)}`
              : "--"
          }
        />

        {/* Total Amount */}

        <div className="mt-5 rounded-2xl bg-sky-50 border border-sky-100 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

          <div>
            <h3 className="font-semibold text-slate-800">
              Total Amount
            </h3>

            <p className="text-sm text-slate-500">
              Base + Tax
            </p>
          </div>

          <div className="text-2xl md:text-3xl font-bold text-sky-600">
            {priceData
              ? `₹${Number(
                  priceData.totalAmount
                ).toFixed(2)}`
              : "--"}
          </div>

        </div>

      </div>
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="flex items-center gap-3 min-w-0">

        <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
          {icon}
        </div>

        <div className="min-w-0">

          <p className="font-medium text-slate-800 truncate">
            {title}
          </p>

          {subtitle && (
            <p className="text-xs text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

      </div>

      <span className="font-semibold text-slate-900 text-right break-all">
        {value}
      </span>

    </div>
  );
}