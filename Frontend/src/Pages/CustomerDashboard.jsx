import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProductList from "../Components/Product/ProductList";
import ProductDetail from "../Components/Product/ProductDetail";
import Cart from "./Customer/Cart";
import Wishlist from "./Customer/Wishlist";

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

      <Route
        path="cart"
        element={<Cart />}
      />

      <Route
        path="wishlist"
        element={<Wishlist />}
      />

    </Routes>
  );
};

export default CustomerDashboard;