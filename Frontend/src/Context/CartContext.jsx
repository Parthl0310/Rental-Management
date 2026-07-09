import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./Auth.context";
import {
  getCartAPI,
  addToCartAPI,
  removeCartItemAPI,
  updateCartItemAPI,
} from "../Api/Cart.api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    // Only call getCartAPI if user is logged in and role is customer
    if (!user || user.role !== "customer") {
      setCart(null);
      setCartCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getCartAPI();
      if (response && response.success) {
        setCart(response.data);
        const count = response.data.items?.reduce(
          (sum, item) => sum + (item.quantity || 0),
          0
        ) || 0;
        setCartCount(count);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (data) => {
    try {
      setIsLoading(true);
      const response = await addToCartAPI(data);
      await fetchCart();
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setIsLoading(true);
      const response = await removeCartItemAPI(productId);
      await fetchCart();
      return response;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (productId, data) => {
    try {
      setIsLoading(true);
      const response = await updateCartItemAPI(productId, data);
      await fetchCart();
      return response;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCartContext = () => {
    setCart(null);
    setCartCount(0);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const value = {
    cart,
    setCart,
    cartCount,
    isLoading,
    fetchCart,
    addItem,
    removeItem,
    updateItem,
    clearCartContext,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
