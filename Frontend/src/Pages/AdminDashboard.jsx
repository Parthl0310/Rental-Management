import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminProducts from "../Components/Admin/AdminProducts";
import AdminAddProduct from "../Components/Admin/AdminAddProduct";
import AdminEditProduct from "../Components/Admin/AdminEditProduct";
import AdminPricelists from "../Components/Admin/AdminPricelists";

function AdminDashboard() {
  return (
    <Routes>

      <Route
        path=""
        element={
          <Navigate
            to="products"
            replace
          />
        }
      />

      <Route
        path="products"
        element={<AdminProducts />}
      />

      <Route
        path="products/create"
        element={<AdminAddProduct />}
      />

      <Route
        path="products/edit/:id"
        element={<AdminEditProduct />}
      />

      <Route
        path="pricelists"
        element={<AdminPricelists />}
      />
    </Routes>
  );
}

export default AdminDashboard;