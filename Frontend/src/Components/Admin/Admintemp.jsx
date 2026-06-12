import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";

export default function AdminProducts() {
  const [viewMode, setViewMode] = useState("card");

  return (
    <div className="min-h-screen bg-sky-50">
      {/* ================= NAVBAR ================= */}
      <Sidebar />

      {/* ================= TOOLBAR ================= */}

      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">

          {/* Left */}

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600 transition">
              <Plus size={18} />
              Create
            </button>

            <h1 className="text-xl font-semibold text-slate-800">
              Rental Orders
            </h1>
          </div>

          {/* Search */}

          <div className="relative w-[500px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-sky-400"
            />
          </div>

          {/* Right */}

          <div className="flex items-center gap-3">

            <span className="text-sm font-medium text-slate-600">
              1-4/80
            </span>

            <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ChevronLeft size={18} />
            </button>

            <button className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <ChevronRight size={18} />
            </button>

            <div className="flex rounded-xl overflow-hidden border border-slate-200">

              <button
                onClick={() => setViewMode("card")}
                className={`px-4 py-2 flex items-center gap-2 transition ${
                  viewMode === "card"
                    ? "bg-sky-500 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <LayoutGrid size={16} />
                Card
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 flex items-center gap-2 transition ${
                  viewMode === "list"
                    ? "bg-sky-500 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <List size={16} />
                List
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* ================= BODY START ================= */}

      <div className="flex">
                {/* ================= LEFT FILTER PANEL ================= */}

        <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-145px)]">

          {/* Collapse Button */}

          <div className="flex justify-end p-3 border-b border-slate-100">
            <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-sky-50 transition">
              &lt;&lt;
            </button>
          </div>

          {/* Filters */}

          <div className="p-4">

            {/* RENTAL STATUS */}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Rental Status
              </h3>

              <div className="space-y-1">

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>ALL</span>
                  <span>16</span>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>Quotation</span>
                  <span>3</span>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>Reserved</span>
                  <span>8</span>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>Pickedup</span>
                  <span>4</span>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>Returned</span>
                  <span>1</span>
                </button>

              </div>
            </div>

            {/* Divider */}

            <div className="my-6 border-t border-slate-200"></div>

            {/* INVOICE STATUS */}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                Invoice Status
              </h3>

              <div className="space-y-1">

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>Fully Invoiced</span>
                  <span>5</span>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>Nothing to invoice</span>
                  <span>5</span>
                </button>

                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 transition text-slate-700">
                  <span>To invoice</span>
                  <span>5</span>
                </button>

              </div>
            </div>

          </div>

        </aside>

        {/* ================= RIGHT CONTENT ================= */}

        <main className="flex-1 p-6">

          {viewMode === "card" ? (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                            {/* CARD 1 */}

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-800">
                    Customer1
                  </h3>

                  <span className="font-semibold text-sky-600">
                    ₹2000
                  </span>
                </div>

                <div className="mt-10">
                  <p className="text-sm text-slate-500">
                    R0001
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <span className="px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-medium">
                    Quotation
                  </span>
                </div>
              </div>

              {/* CARD 2 */}

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-800">
                    Customer2
                  </h3>

                  <span className="font-semibold text-sky-600">
                    ₹1000
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-sm text-slate-500">
                    R0002
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Pickup:
                  </p>

                  <p className="text-xs text-slate-600">
                    08/03/2025 00:30:36
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <span className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-medium">
                    Pickedup
                  </span>
                </div>
              </div>

              {/* CARD 3 */}

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-800">
                    Customer3
                  </h3>

                  <span className="font-semibold text-sky-600">
                    ₹3000
                  </span>
                </div>

                <div className="mt-8">
                  <p className="text-sm text-slate-500">
                    R0003
                  </p>

                  <p className="text-xs text-red-500 mt-2">
                    Late Pickup:
                  </p>

                  <p className="text-xs text-red-500">
                    08/03/2025 00:30:36
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <span className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-medium">
                    Reserved
                  </span>
                </div>
              </div>

              {/* CARD 4 */}

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-800">
                    Customer4
                  </h3>

                  <span className="font-semibold text-sky-600">
                    ₹2000
                  </span>
                </div>

                <div className="mt-10">
                  <p className="text-sm text-slate-500">
                    R0004
                  </p>
                </div>

                <div className="mt-5 flex justify-end">
                  <span className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-medium">
                    Returned
                  </span>
                </div>
              </div>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <table className="w-full">

                <thead>
                  <tr className="bg-sky-50 border-b border-slate-200">

                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" />
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Order Reference
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Created By User
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Rental Status
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Tax
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                      Total
                    </th>

                  </tr>
                </thead>

                <tbody>

                  <tr className="border-b border-slate-100 hover:bg-sky-50">

                    <td className="px-4 py-4">
                      <input type="checkbox" />
                    </td>

                    <td className="px-4 py-4">R0001</td>

                    <td className="px-4 py-4">
                      Customer1
                    </td>

                    <td className="px-4 py-4">
                      👤 Adam
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-lg bg-blue-500 text-white text-xs">
                        Quotation
                      </span>
                    </td>

                    <td className="px-4 py-4">-</td>

                    <td className="px-4 py-4 font-medium text-sky-600">
                      ₹2000
                    </td>

                  </tr>

                  <tr className="border-b border-slate-100 hover:bg-sky-50">

                    <td className="px-4 py-4">
                      <input type="checkbox" />
                    </td>

                    <td className="px-4 py-4">R0002</td>

                    <td className="px-4 py-4">
                      Customer2
                    </td>

                    <td className="px-4 py-4">
                      👤 Adam
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs">
                        Pickedup
                      </span>
                    </td>

                    <td className="px-4 py-4">-</td>

                    <td className="px-4 py-4 font-medium text-sky-600">
                      ₹1000
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

            