import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProductList from "../Components/Product/ProductList";
import ProductDetail from "../Components/Product/ProductDetail";

const CustomerDashboard = () => {
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
        element={<ProductList />}
      />

      <Route
        path="products/:productId"
        element={<ProductDetail />}
      />

    </Routes>
  );
};

export default CustomerDashboard;