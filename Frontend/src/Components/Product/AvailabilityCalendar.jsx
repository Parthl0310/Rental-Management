import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import DatePicker from "react-datepicker";
import {
  CalendarDays,
  RotateCcw,
} from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";

import {
  getProductAvailabilityAPI,
} from "../../api/product.api";

export default function AvailabilityCalendar({
  productId,
  onDateSelect,
}) {
  const [selectedDates, setSelectedDates] =
    useState({
      startDate: null,
      endDate: null,
    });

  const [bookedRanges, setBookedRanges] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  useEffect(() => {
    if (productId) {
      fetchAvailability();
    }
  }, [productId]);

  const fetchAvailability = async () => {
    try {
      setIsLoading(true);

      const res =
        await getProductAvailabilityAPI(
          productId
        );
        console.log(productId);

      setBookedRanges(
        res?.data || []
      );
    } catch (error) {
      console.error(
        "Availability Error:",
        error
      );

      setBookedRanges([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isDateBooked = (date) => {
    return bookedRanges.some((range) => {
      const start = new Date(
        range.startDate
      );

      const end = new Date(
        range.endDate
      );

      return (
        date >= start &&
        date <= end
      );
    });
  };

  const filterDate = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return (
      date >= today &&
      !isDateBooked(date)
    );
  };

  const handleStartDateChange = (
    date
  ) => {
    setSelectedDates((prev) => ({
      ...prev,
      startDate: date,

      endDate:
        prev.endDate &&
        prev.endDate < date
          ? null
          : prev.endDate,
    }));
  };

  const handleEndDateChange = (
    date
  ) => {
    setSelectedDates((prev) => ({
      ...prev,
      endDate: date,
    }));
  };

  const clearDates = () => {
    setSelectedDates({
      startDate: null,
      endDate: null,
    });
  };

  const duration = useMemo(() => {
    if (
      !selectedDates.startDate ||
      !selectedDates.endDate
    ) {
      return 0;
    }

    return Math.ceil(
      (selectedDates.endDate -
        selectedDates.startDate) /
        (1000 * 60 * 60 * 24)
    );
  }, [selectedDates]);

  useEffect(() => {
    onDateSelect?.(selectedDates);
  }, [
    selectedDates,
    onDateSelect,
  ]);
    return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-2">
          <CalendarDays
            size={20}
            className="text-sky-500"
          />

          <h2 className="text-lg font-semibold">
            Rental Period
          </h2>
        </div>

        {(selectedDates.startDate ||
          selectedDates.endDate) && (
          <button
            onClick={clearDates}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
          >
            <RotateCcw size={16} />
            Clear
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">
          Loading availability...
        </p>
      ) : (
        <>
          {/* Date Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Start Date */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Start Date
              </label>

              <DatePicker
                selected={selectedDates.startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={selectedDates.startDate}
                endDate={selectedDates.endDate}
                filterDate={filterDate}
                placeholderText="Select start date"
                className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                End Date
              </label>

              <DatePicker
                selected={selectedDates.endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={selectedDates.startDate}
                endDate={selectedDates.endDate}
                minDate={selectedDates.startDate}
                filterDate={filterDate}
                placeholderText="Select end date"
                className="w-full h-12 rounded-xl border border-slate-200 px-4 outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-5 mt-6 text-sm">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              Available
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              Booked
            </div>

          </div>

          {/* Duration */}
          <div className="mt-6 rounded-2xl bg-sky-50 p-4 border border-sky-100">

            <p className="text-sm text-slate-500">
              Selected Duration
            </p>

            <p className="mt-1 text-xl font-bold text-sky-600">
                            {duration > 0
                ? `${duration} ${
                    duration === 1
                      ? "Day"
                      : "Days"
                  }`
                : "--"}
            </p>

            {selectedDates.startDate &&
              selectedDates.endDate && (
                <p className="mt-2 text-sm text-slate-500">
                  Rental period selected
                </p>
              )}
          </div>
        </>
      )}
    </div>
  );
}