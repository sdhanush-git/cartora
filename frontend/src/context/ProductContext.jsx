import { useContext, createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const ProductContext = createContext();

export const ProductContextProvider = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  // =========================
  // GET PRODUCTS
  // =========================
  const getProducts = async () => {
    try {
      const products = await api.get("/products");
      setProducts(products.data);
    } catch (error) {
      console.log("Error while fetching products", error);
    }
  };

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      setCartLoading(true);
      const res = await api.get("/cart");
      
      if (res.data.modifiedMessage) {
        toast.info(res.data.modifiedMessage);
      }
      
      const formattedItems = (res.data.items || []).map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      setCartItems(formattedItems);
      setCartError(null);
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setCartLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // =========================
  // ADD TO CART
  // =========================
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.error("Please log in.");
      return;
    }
    try {
      setCartLoading(true);
      const res = await api.post("/cart", { productId: product._id, quantity });
      const formattedItems = res.data.items.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      setCartItems(formattedItems);
      setCartError(null);
      toast.success("Added to cart.");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong.";
      setCartError(msg);
      toast.error(msg);
    } finally {
      setCartLoading(false);
    }
  };

  // =========================
  // INCREASE / DECREASE QUANTITY
  // =========================
  const updateQuantity = async (productId, newQuantity) => {
    try {
      const res = await api.put(`/cart/${productId}`, { quantity: newQuantity });
      const formattedItems = res.data.items.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      setCartItems(formattedItems);
      setCartError(null);
      toast.success("Cart updated.");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong.";
      setCartError(msg);
      toast.error(msg);
    }
  };

  const increaseQuantity = (id) => {
    const item = cartItems.find(i => i._id === id);
    if (item && item.quantity < item.stock) {
      updateQuantity(id, item.quantity + 1);
    } else if (item) {
      toast.error(`Only ${item.stock} items are available.`);
    }
  };

  const decreaseQuantity = (id) => {
    const item = cartItems.find(i => i._id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  // =========================
  // DELETE FROM CART
  // =========================
  const removeItem = async (id) => {
    try {
      const res = await api.delete(`/cart/${id}`);
      const formattedItems = res.data.items.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      setCartItems(formattedItems);
      setCartError(null);
      toast.success("Removed from cart.");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong.";
      setCartError(msg);
      toast.error(msg);
    }
  };

  // =========================
  // TOTAL ITEMS
  // =========================
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // =========================
  // CLEAR CART
  // =========================
  const clearCart = async () => {
    if (!user) return;
    try {
      await api.delete("/cart");
      setCartItems([]);
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  // =========================
  // CONTEXT VALUE
  // =========================
  const value = {
    products,
    getProducts,

    cartItems,
    cartLoading,
    cartError,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    totalItems,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => {
  return useContext(ProductContext);
};
